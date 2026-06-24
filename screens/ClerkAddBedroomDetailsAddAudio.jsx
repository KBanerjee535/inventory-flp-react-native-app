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
import {SectionUpdateAudioApi} from '../services/apiService';
import Voice from '@react-native-voice/voice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { punctuateTextWithAI } from "../utils/punctuateTextModel";


const audioRecorderPlayer = new AudioRecorderPlayer();

const ClerkAddBedroomDetailsAddAudio = ({navigation}) => {
  const { setRecordingPath ,recordingPath, sectionDetails, setVoiceNoteText, setCategorizedNotes } = useUserContext();
  const [screenLoading, setScreenLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
  const [appendedText, setAppendedText] = useState('');
  const isListeningRef = useRef(false);   // true = user wants continuous listening
  const isRestartingRef = useRef(false);  // prevents overlapping Voice.start() calls
  const committedTextRef = useRef('');    // text from all completed sessions
const restartTimeoutRef = useRef(null); // holds the pending setTimeout id, so it can be canceled
const sessionIdRef = useRef(0); 

const cancelPendingRestart = () => {
  if (restartTimeoutRef.current) {
    clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = null;
  }
  isRestartingRef.current = false;
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
    setIsRecording(false);
  };

  Voice.onSpeechError = (e) => {
    console.log(e);
    setIsRecording(false);
  };

  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
}, []);

  // UI Control Functions
  const startRecording = async () => {
    try {
    const granted = await requestMicrophonePermission();

    if (!granted) {
      alert('Microphone permission denied');
      return;
    }

    await Voice.start();
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
  if (!recognizedText.trim()) return;

  setIsAddingText(true);

  try {
    const cleanedText = await punctuateTextWithAI(
      recognizedText.trim()
    );

    setAppendedText(prev =>
      prev
        ? `${prev}\n${cleanedText}`
        : cleanedText
    );

    if (typeof setVoiceNoteText === 'function') {
      setVoiceNoteText(prev =>
        prev
          ? `${prev}\n${cleanedText}`
          : cleanedText
      );
    }

    setRecognizedText('');
  } catch (error) {
    console.log(error);
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
            onPress={() => {
            if (typeof setVoiceNoteText === 'function') {
              setVoiceNoteText(appendedText);
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
        {recognizedText && <Text style={styles.appendedNotesText}>{recognizedText}</Text>}
        </View>
        </View>
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
