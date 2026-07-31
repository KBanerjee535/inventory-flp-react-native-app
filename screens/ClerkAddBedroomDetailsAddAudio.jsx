import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Text,
  Animated,
  FlatList,
    PermissionsAndroid,
  Platform,
  ActivityIndicator, Keyboard
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import Tick from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs'; // File system for storage paths
import { useUserContext } from '../context/UserContext';
import {SectionUpdateAudioApi, sectionDetailsBySectionIdAPI, submitInventoryContentApi} from '../services/apiService';
import Voice from '@react-native-voice/voice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { punctuateTextWithAI, categorizeInspectionNotes, parsePropertyNoteToContent } from "../utils/punctuateTextModel";
import Toast from 'react-native-simple-toast';


const audioRecorderPlayer = new AudioRecorderPlayer();

const ClerkAddBedroomDetailsAddAudio = ({navigation}) => {
  const { setRecordingPath ,recordingPath, sectionDetails, setCategorizedNotes, SelectedSection, setsectionDetails } = useUserContext();
  const [screenLoading, setScreenLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
  const [appendedText, setAppendedText] = useState('');
  const isListeningRef = useRef(false);   // true = user wants continuous listening
  const isRestartingRef = useRef(false);  // prevents overlapping Voice.start() calls
  const committedTextRef = useRef('');    // text from all completed sessions
const restartTimeoutRef = useRef(null);
const [voiceError, setVoiceError] = useState('');

const loadSectionDetails = async () => {
      if (SelectedSection?.section_id && (!sectionDetails || (Array.isArray(sectionDetails) && sectionDetails.length === 0))) {
        try {
          setScreenLoading(true);
          const fd = new FormData();
          fd.append("section_id", SelectedSection?.section_id);
          const response = await sectionDetailsBySectionIdAPI(fd);
          if (response.data.status) {
            console.log('API Response data:', response.data.data);
            setsectionDetails(response.data.data);
          }
        } catch (error) {
          console.log('Error loading section details:', error);
        } finally {
          setScreenLoading(false);
        }
      }
    };
// Load section details when component mounts
  useEffect(() => {
    
    loadSectionDetails();
  }, []);

const cancelPendingRestart = () => {
  if (restartTimeoutRef.current) {
    clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = null;
  }
  isRestartingRef.current = false;
};

const getVoiceErrorMessage = (code) => {
  switch (String(code)) {
    case '1':
      return 'Network error. Please check your internet connection.';

    case '2':
      return 'Network timeout. Please try again after few minutes.';

    case '3':
      return 'Audio recording error. Please restart recording.';

    case '4':
      return 'Speech recognition service error.';

    case '5':
      return 'Speech recognition could not start. Please try again.';

    case '6':
      return 'No speech detected. Please speak louder.';

    case '7':
      return 'Could not understand what you said. Please try again after few seconds.';

    case '8':
      return 'Speech recognizer is busy. Please try again after few seconds';

    case '9':
      return 'Insufficient permissions for speech recognition.';

    case '10':
      return 'Too many requests. Please wait a few seconds.';

    case '11':
      return 'Speech service temporarily unavailable. Please try again after few minutes';

    default:
      return 'Speech recognition failed. Please try again after few seconds';
  }
};


  // 🔹 REQUEST MICROPHONE PERMISSION
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'We need access to your microphone for recording audio.',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  };

useEffect(() => {
  Voice.onSpeechResults = (event) => {
    if (event.value?.length) {
      setRecognizedText(event.value[0]);
    }
  };

  Voice.onSpeechPartialResults = (event) => {
    if (event.value?.length) {
      setRecognizedText(event.value[0]);
    }
  };

  Voice.onSpeechEnd = () => {
    recognitionRunningRef.current = false;
    setIsRecording(false);
  };

  Voice.onSpeechError = (e) => {
    recognitionRunningRef.current = false;
    console.log(e);
    setIsRecording(false);
    const code = e?.error?.code;
    const message = getVoiceErrorMessage(code);
    setVoiceError(message);
  };

  return () => {
  try {
    Voice.stop();
    Voice.cancel();
    Voice.destroy();
    Voice.removeAllListeners();
  } catch (e) {
    console.log(e);
  }
};
}, []);
  // UI Control Functions
  const recognitionRunningRef = useRef(false);
  const startRecording = async () => {
    await Voice.stop().catch(() => {});
    await Voice.cancel().catch(() => {});
    await Voice.destroy().catch(() => {});

    if (recognitionRunningRef.current) {
    return;
  }
    try {
    const granted = await requestMicrophonePermission();

    if (!granted) {
      alert('Microphone permission denied');
      return;
    }
    recognitionRunningRef.current = true;
    await Voice.start('en-US');
    setIsRecording(true);
  } catch (error) {
    console.error(error);
  }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

 const handleMicPress = async () => {
  if (!isRecording) {
    await startRecording();
  } else {
    await stopRecording();
  }
}; 

const handleTextAppend = async () => {
  if (!recognizedText.trim()) {
    return;
  }

  setIsAddingText(true);

  try {
// Ensure sectionDetails is an array before passing to categorizeSpeechText
    // sectionDetails might be an object with subsubSection array, or an array of sections
    let validSectionDetails = [];
    if (Array.isArray(sectionDetails)) {
      validSectionDetails = sectionDetails;
    } else if (sectionDetails && typeof sectionDetails === 'object' && sectionDetails.subsubSection) {
      // Single section object - wrap in array
      validSectionDetails = [sectionDetails];
    }
    
    if (validSectionDetails.length === 0) {
      Toast.show('No section details available. Please try again.');
      setIsAddingText(false);
      return;
    }

    console.log('Section Details:', sectionDetails);
    console.log('Valid Section Details:', validSectionDetails);
    console.log('SelectedSection:', SelectedSection);
    console.log('Recognized Text:', recognizedText);

    // Use categorizeInspectionNotes which now uses Gemini API
    const categorizedData = await categorizeInspectionNotes(
      recognizedText.trim(),
      validSectionDetails
    );

    console.log('Categorized Data Result:', categorizedData);

// Create a map of all category names (section titles and subsubsection titles) to their IDs
    const categoryToIdMap = {};
    validSectionDetails.forEach(section => {
      // Map main section title (handle both 'title' and 'name' properties)
      const sectionTitle = section.title || section.name;
      categoryToIdMap[sectionTitle] = {
        type: 'section',
        inventorySectionId: SelectedSection?.id,
        subSectionId: section.sub_section_id,
        subSubSectionId: null
      };
      
      // Map subsubsection titles if they exist
      if (section.subsubSection && Array.isArray(section.subsubSection) && section.subsubSection.length > 0) {
        section.subsubSection.forEach(sub => {
          const subTitle = sub.title || sub.name;
          categoryToIdMap[subTitle] = {
            type: 'subsubsection',
            inventorySectionId: SelectedSection?.id,
            subSectionId: section.sub_section_id,
            subSubSectionId: sub.subsub_section_id
          };
        });
      }
    });
    
    console.log('categoryToIdMap:', categoryToIdMap);

// Transform categorizedData into the API payload structure
    // API expects:
    // {
    //   "inventory_id": "...",
    //   "content": [
    //     {
    //       "inventory_section_id": <room section id>,
    //       "inventory_subsection_id": <room id (e.g., bathroom 1 id)>,
    //       "inventory_sub_subsection_id": <subsection id (e.g., window, furniture)>,
    //       "content": {
    //         "subsection_name": { "items": "detected_item", "condition": "condition description" }
    //       },
    //       "attached_image": null
    //     }
    //   ]
    // }
    const contentArray = [];
    
    if (categorizedData && typeof categorizedData === 'object' && Object.keys(categorizedData).length > 0) {
      Object.keys(categorizedData).forEach(sectionName => {
        try {
          const sectionCategories = categorizedData[sectionName];
          
            // Object format: { "Subsection": ["note1", "note2"] }
            // or { "__flat__": ["note1", "note2"], "Subsection": ["note2"] }
            // where __flat__ contains notes that didn't match any specific subsubsection
            if (typeof sectionCategories === 'object' && sectionCategories !== null && !Array.isArray(sectionCategories)) {
              Object.keys(sectionCategories).forEach(categoryName => {
                try {
                  const notes = sectionCategories[categoryName];
                  
                  // Handle the __flat__ key - notes that didn't match any specific subsubsection
                  // These should be placed under the subsection item (the section itself)
                  if (categoryName === '__flat__') {
                    const idMapping = categoryToIdMap[sectionName];
                    
                    if (!idMapping) {
                      console.log('No id mapping found for section:', sectionName);
                      return;
                    }
                    
                    if (Array.isArray(notes)) {
                      notes.forEach(note => {
                        if (typeof note === 'string' && note.trim()) {
                          const parsedContent = parsePropertyNoteToContent(note, sectionName);
                          const itemKeys = Object.keys(parsedContent);
                          let itemsValue = '';
                          let conditionValue = '';
                          
                          if (itemKeys.length > 0) {
                            const detectedItemKey = itemKeys[0];
                            const itemData = parsedContent[detectedItemKey];
                            itemsValue = detectedItemKey
                              .split('_')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
                            conditionValue = itemData.condition || '';
                          }
                          
                          contentArray.push({
                            inventory_section_id: idMapping.inventorySectionId,
                            inventory_subsection_id: idMapping.subSectionId || null,
                            inventory_sub_subsection_id: null, // No subsubsection available
                            content: {
                              [sectionName]: {
                                items: itemsValue || note.trim(),
                                condition: conditionValue || note.trim()
                              }
                            },
                            attached_image: null
                          });
                        }
                      });
                    }
                    return;
                  }
                  
                  const idMapping = categoryToIdMap[categoryName];
                  
                  if (!idMapping) {
                    console.log('No id mapping found for category:', categoryName);
                    return;
                  }
                  
                  // Ensure notes is an array and create one entry per note
                  if (Array.isArray(notes)) {
                    notes.forEach(note => {
                      // Parse the note into { itemKey: { items, condition } }
                      const parsedContent = parsePropertyNoteToContent(note, categoryName);
                      
                      // Extract the detected item key and data
                      const itemKeys = Object.keys(parsedContent);
                      let itemsValue = '';
                      let conditionValue = '';
                      
                      if (itemKeys.length > 0) {
                        const detectedItemKey = itemKeys[0]; // e.g., "window", "curtain", "floor"
                        const itemData = parsedContent[detectedItemKey];
                        
                        // items = the detected item name (capitalized)
                        itemsValue = detectedItemKey
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        
                        // condition = the condition part extracted from parsing
                        conditionValue = itemData.condition || '';
                      }
                      
                      contentArray.push({
                        inventory_section_id: idMapping.inventorySectionId,
                        inventory_subsection_id: idMapping.subSectionId || null,
                        inventory_sub_subsection_id: idMapping.subSubSectionId || null,
                        content: {
                          [categoryName]: {
                            items: itemsValue || note.trim(),
                            condition: conditionValue || note.trim()
                          }
                        },
                        attached_image: null
                      });
                    });
                  }
                } catch (e) {
                  console.log('Error processing category:', categoryName, e);
                }
              });
            } else if (Array.isArray(sectionCategories)) {
              // Flat array format: { "SectionName": ["note1", "note2"] }
              // Used when no subsubsection is available - place notes under subsection item
              // This handles the edge case where categorizeInspectionNotes returns flat array
              // (e.g., when sentences.length === 0, or input is already JSON)
              try {
                const idMapping = categoryToIdMap[sectionName];
                
                if (!idMapping) {
                  console.log('No id mapping found for section:', sectionName);
                  return;
                }
                
                sectionCategories.forEach(note => {
                  if (typeof note === 'string' && note.trim()) {
                    // Parse the note into { itemKey: { items, condition } }
                    const parsedContent = parsePropertyNoteToContent(note, sectionName);
                    
                    // Extract the detected item key and data
                    const itemKeys = Object.keys(parsedContent);
                    let itemsValue = '';
                    let conditionValue = '';
                    
                    if (itemKeys.length > 0) {
                      const detectedItemKey = itemKeys[0];
                      const itemData = parsedContent[detectedItemKey];
                      
                      // items = the detected item name (capitalized)
                      itemsValue = detectedItemKey
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                      
                      // condition = the condition part extracted from parsing
                      conditionValue = itemData.condition || '';
                    }
                    
                    contentArray.push({
                      inventory_section_id: idMapping.inventorySectionId,
                      inventory_subsection_id: idMapping.subSectionId || null,
                      inventory_sub_subsection_id: null, // No subsubsection available
                      content: {
                        [sectionName]: {
                          items: itemsValue || note.trim(),
                          condition: conditionValue || note.trim()
                        }
                      },
                      attached_image: null
                    });
                  }
                });
              } catch (e) {
                console.log('Error processing section (flat array):', sectionName, e);
              }
            }
        } catch (e) {
          console.log('Error processing section:', sectionName, e);
        }
      });
    }

    const formattedData = {
      inventory_id: SelectedSection?.inventory_id,
      section_id: SelectedSection?.section_id,
      content: contentArray
    };

    console.log(
      'Formatted Data:',
      JSON.stringify(formattedData, null, 2)
    );

    // Submit the formatted data to the API
    if (contentArray.length > 0) {
      try {
        setScreenLoading(true);
        const response = await submitInventoryContentApi(formattedData);
        console.log('Submit API Response:', response.data);
        
        if (response.data.status) {
          Toast.show('Data submitted successfully!', Toast.SHORT);
        } else {
          Toast.show(response.data.message || 'Failed to submit data.', Toast.SHORT);
        }
      } catch (apiError) {
        console.log('Submit API Error:', apiError.response?.data || apiError.message);
        Toast.show(
          apiError.response?.data?.message || 'Failed to submit data. Please try again.',
          Toast.SHORT
        );
      } finally {
        setScreenLoading(false);
      }
    } else {
      Toast.show('No content to submit.', Toast.SHORT);
    }

    // Store the categorized data for display
    if (Object.keys(categorizedData).length > 0) {
      setCategorizedNotes(prev => ({
        ...prev,
        ...categorizedData,
      }));
    }

    setRecognizedText('');

    navigation.navigate('ClerkAddBedroomDetails');
  } catch (error) {
    console.log('handleTextAppend Error:', error);

    Toast.show(error?.message || String(error));
  } finally {
    setIsAddingText(false);
  }
};

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />
      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={async () => {
             try {
    await Voice.stop();
    await Voice.cancel();
    await Voice.destroy();
  } catch (e) {
    console.log(e);
  }
            navigation.navigate('ClerkAddBedroomDetails');
          }}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Record Audio</Text>
        </View>

        <View style={{ paddingLeft: 20, paddingRight: 20 }} >
        <View style={{ alignItems: 'center', width: '100%', marginBottom: 18 }}>
          <TouchableOpacity 
            style={[styles.micButton, isRecording ? styles.micActive : styles.micInactive]} 
            onPress={handleMicPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isRecording ? "pause" : "mic"} 
              size={24} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>
        {/* Container for Editable TextArea & Controls */}
        <View style={styles.editorContainer}>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={10}
            placeholder="Type something here or tap the mic to speak..."
            placeholderTextColor="#999"
            value={recognizedText}
            onChangeText={(newText) => setRecognizedText(newText)}
            textAlignVertical="top"
          />
          
          {/* Toolbar below the textarea */}
        <View style={styles.toolbar}>
          {isRecording ? (
            <View style={styles.recordingStatus}>
              <ActivityIndicator size="small" color="#FF3B30" />
              <Text style={styles.recordingText}>Listening...</Text>
            </View>
          ) : (
            <View />
          )}
        
          {/* Button Container grouping Add and Mic buttons horizontally */}
        <View style={styles.actionButtonsContainer}>
          
          {/* Conditionally render the Add Button only if recognizedText has content */}
          {recognizedText.trim().length > 0 && (
            <TouchableOpacity 
              style={[
                styles.fullWidthAddButton,
                isAddingText && styles.fullWidthAddButtonDisabled
              ]} 
              onPress={handleTextAppend}
              activeOpacity={0.8}
              disabled={isAddingText}
            >
              {isAddingText ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.fullWidthAddButtonLabel}>Add Text to Sections</Text>
              )}
            </TouchableOpacity>
          )}
        
          
        </View>
        </View>
        </View>
        </View>
        {voiceError ? (
          <Text
            style={{
              color: '#FF3B30',
              marginTop: 10,
              textAlign: 'center',
              fontSize: 14,
            }}
          >
            {voiceError}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};


export default ClerkAddBedroomDetailsAddAudio;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  Body: {
    width: '100%',
    height: '100%',
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
  },
  Header: {
    backgroundColor: '#f1f2f6',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 40,
    paddingBottom: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  BackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 999,
  },

  backIcon: {
    marginRight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#E4E5E7',
    width: 70,
    height: 70,
    borderRadius: '100%',
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {opacity: 0.4},
  recordButtongrp: {
    backgroundColor: '#E4E5E7',
    width: 130,
    height: 130,
    borderRadius: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    backgroundColor: 'white',
    width: 90,
    height: 90,
    borderRadius: '100%',
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingText: {
    marginVertical: 10,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    position: 'absolute',
    margin: 'auto',

    left: 0,
    right: 0,
    bottom: -50,
  },
  NextBtn: {
    backgroundColor: '#393D47',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,

    borderRadius: 8,
  },
  NextBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
  Footer: {
    padding: 25,
  },
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  pagetitleTxt: {
    color: '#151313',
    fontSize: 19,
    fontFamily: 'BeVietnamPro-Medium',
    fontWeight: '500',
    textAlign: 'center',
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
  },
  editorContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  textArea: {
    width: '100%',
    height: 250,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  micInactive: {
    backgroundColor: '#007AFF', // Blue when idle
  },
  micActive: {
    backgroundColor: '#FF3B30', // Red when listening (acting as pause option)
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  fullWidthAddButton: {
    width: '100%',             // Direct full width structural stretching
    backgroundColor: '#007AFF', // Solid block color accent background
    paddingVertical: 14,       // Comfortable internal padding thickness
    borderRadius: 8,           // Smoothly matches text area radius cuts
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,             // Even distribution margins between components
    marginBottom: 4,
  },
  fullWidthAddButtonLabel: {
    color: '#FFFFFF',           // Crisp white label contrast over theme fill
    fontSize: 16,
    fontWeight: '600',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appendedNotesText: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
    paddingLeft: 32, // Indents the voice notes beautifully right underneath the item label row
  },
  fullWidthAddButton: {
  width: '100%',
  backgroundColor: '#007AFF',
  paddingVertical: 14,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 4,
},
fullWidthAddButtonDisabled: {
  backgroundColor: '#90C2FF', // lighter/dimmed blue while loading
},
});