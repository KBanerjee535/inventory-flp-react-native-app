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
  PermissionsAndroid,  // Add this import
  Platform,            // Also add Platform if not already imported
  Alert,               // Add Alert if you're using it for error messages
  ActivityIndicator    // Add if you're using the ActivityIndicator
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import GalleryIcon from '../assets/images/GalleryIcon.svg';
import CameraIcon from '../assets/images/CameraIcon.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import Tick from 'react-native-vector-icons/FontAwesome';

import { useUserContext } from '../context/UserContext';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
const audioRecorderPlayer = new AudioRecorderPlayer();
import RNFS from 'react-native-fs';
import { AlarmAddImageApi, AlarmUpdateAudioApi } from '../services/apiService';

const ClerkAddAlarmAddAudio = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [buttonsEnabled, setButtonsEnabled] = useState(false);
    const { setRecordingPath ,recordingPath, alarmsData ,seletedJobId} = useUserContext() || {}; // Note the capitalization
   const [screenLoading, setScreenLoading] = useState(false);
   const [alarmImages, setAlarmImages] = useState([]);

   const handleCamera = () => {
       launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
         if (response.didCancel) return;
         if (response.errorCode) {
           Alert.alert('Camera Error', response.errorMessage);
           return;
         }
         const asset = response.assets[0];
         setAlarmImages(prev => [
           ...prev,
           {
             uri: asset.uri,
             fileName: asset.fileName,
             fileSize: asset.fileSize,
           },
         ]);
       });
     };
   
     const handleGallery = () => {
       launchImageLibrary({mediaType: 'photo', selectionLimit: 0}, response => {
         if (response.didCancel) return;
         if (response.errorCode) {
           Alert.alert('Gallery Error', response.errorMessage);
           return;
         }
         const selectedAssets = response.assets.map(asset => ({
           uri: asset.uri,
           fileName: asset.fileName,
           fileSize: asset.fileSize,
         }));
         setAlarmImages(prev => [...prev, ...selectedAssets]);
       });
     };
   
   
   
     const formatFileSize = (bytes) => {
       if (bytes < 1024) return bytes + ' B';
       else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
       else return (bytes / 1048576).toFixed(1) + ' MB';
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
   
     // 🔹 START RECORDING FUNCTION
     const startRecording = async () => {
     setRecordingPath('');
     
     const hasPermission = await requestMicrophonePermission();
     if (!hasPermission) {
       console.log('Microphone permission denied');
       return;
     }
   
     try {
       const path = `${RNFS.DocumentDirectoryPath}/recorded_audio.mp3`;
       const uri = await audioRecorderPlayer.startRecorder(path);
       audioRecorderPlayer.addRecordBackListener((e) => {
         console.log('Recording progress:', e.currentPosition);
         return;
       });
       
       setRecordingPath(uri);
       setIsRecording(true);
       setButtonsEnabled(true);
     } catch (error) {
       console.log('Recording error:', error);
     }
   };
   
   const stopRecording = async () => {
     try {
       const result = await audioRecorderPlayer.stopRecorder();
       audioRecorderPlayer.removeRecordBackListener();
       setIsRecording(false);
       setRecordingPath(result);
     } catch (error) {
       console.log('Stop recording error:', error);
     }
   };
   
   
   
   
     const uploadImages = async () => {
         try {
           const fd = new FormData();
           fd.append('inventory_id',seletedJobId);
           fd.append("alarm_id",alarmsData?.id);
     
           alarmImages.forEach((img, index) => {
             fd.append('image[]', {
               uri: img.uri,
               type: 'image/jpeg',
               name: img.fileName || `image_${index}.jpg`,
             });
           });
         let response = await AlarmAddImageApi(fd);
     
           console.log('Image upload response:', response.data);
         } catch (error) {
           console.error('Image upload error:', error);
         }
       };
   
       // 🔹 Save RECORDING FUNCTION
   const saveRecording = async () => {
     try {
       setScreenLoading(true);
       
       // Create a new FormData instance
       const formData = new FormData();
       
       // Append key_id as a string
       formData.append('alarm_id', String(alarmsData?.id));
       
       // Get the file extension from the URI
       const fileExt = recordingPath.split('.').pop();
       const fileName = `audio_${Date.now()}.${fileExt}`;
       
       // Create the file object with proper structure
       const file = {
         uri: recordingPath,
         type: `audio/${fileExt}`, // e.g. 'audio/mp3'
         name: fileName,
       };
       
       // Append the file to FormData
       formData.append('audio', file);
       
       // Debug the FormData structure
       console.log('FormData content:', formData);
       
       // Make the API call
       const response = await AlarmUpdateAudioApi(formData);
       console.log('Upload successful:', response.data);
       
       // Handle success
       await uploadImages();
       setScreenLoading(false);
       navigation.navigate('ClerkAddAlarm', { alarmData: alarmsData, mode: 'edit' });
     } catch (error) {
       setScreenLoading(false);
       console.error('Upload error:', {
         message: error.message,
         response: error.response?.data,
       });
       Alert.alert('Upload Failed', error.response?.data?.errors || error.message);
     }
   };
   

  const handleRecordPress = () => {
    setIsRecording(!isRecording);
    setButtonsEnabled(!isRecording);
  };
  return (
    <SafeAreaView style={styles.mainBody}>
                  <ScrollView>
        
              <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />
        
              <View style={styles.Body}>
                <View style={styles.Header}>
                  <TouchableOpacity
                    style={styles.BackBtn}
                    onPress={() => navigation.navigate('ClerkAddAlarm', {
                          alarmData: alarmsData,
                          mode: 'edit'
                        })}>
                    <PrevPageArrow style={styles.backIcon} />
                  </TouchableOpacity>
                       <Text style={styles.pagetitleTxt}>Record Audio</Text>
                </View>
        
                <View style={styles.container}>
                  <View style={styles.buttoninner}>
                    <View style={styles.buttonRow}>
        
                      {/* Stop Button */}
                      <TouchableOpacity
                        style={[styles.button, !isRecording && styles.disabledButton]}
                        onPress={stopRecording}
                        disabled={!isRecording}>
                        <Icon name="stop" size={24} color="black" />
                      </TouchableOpacity>
        
                      {/* Mic Button */}
                      <View style={styles.recordButtongrp}>
                        <TouchableOpacity
                          style={styles.recordButton}
                          onPress={isRecording ? stopRecording : startRecording}>
                          <Icon
                            name={isRecording ? 'pause' : 'mic'}
                            size={35}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
        
                      {/* Check Button */}
                      <TouchableOpacity
                        style={[styles.button, !buttonsEnabled && styles.disabledButton]}
                        disabled={!buttonsEnabled}  onPress={isRecording ? stopRecording : startRecording}>
                        <Tick name="check" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
        
                    {/* Recording Status */}
                    {isRecording && <Text style={styles.recordingText}>Recording...</Text>}
                  </View>
        {recordingPath && recordingPath !== ''&&
        <>
                  <Text style={styles.subtitel}>Supporting Photo(s)</Text>
                  <View style={styles.BtnGap}>
                    <TouchableOpacity
                      style={styles.StartBtn} onPress={handleCamera}
                      >
                      <CameraIcon width={50} height={50} />
                      <Text style={styles.StartBtnTxt}>Camera</Text>
                    </TouchableOpacity>
        
                    <TouchableOpacity
                      style={styles.StartBtn} onPress={handleGallery}
                      >
                      <GalleryIcon width={50} height={50} />
                      <Text style={styles.StartBtnTxt}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                  </>}
        
               {alarmImages.map((img, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image style={styles.imagePreview} source={{uri: img.uri}} />
                      <View style={styles.imageContainerRgt}>
                        <View style={styles.fileDetails}>
                          <Text style={styles.fileName}>{img.fileName}</Text>
                          <Text style={styles.fileSize}>{formatFileSize(img.fileSize)}</Text>
                        </View>
                        {/* <View style={styles.progressBar}>
                          <View style={styles.progress} />
                        </View> */}
                      </View>
                    </View>
                  ))}
        
        
         {screenLoading ? <ActivityIndicator size="large" color="#0000ff" />:
           recordingPath && recordingPath !== '' && !isRecording && (
          <View style={styles.Footer}>
            <TouchableOpacity
              style={styles.NextBtn}
              onPress={saveRecording}>
              <Text style={styles.NextBtnTxt}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
        
                </View>
        
        
        
        
              </View>
                    </ScrollView>
        
            </SafeAreaView>
  );
};

export default ClerkAddAlarmAddAudio;

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
  container: {
    width: '100%',
    height: '100%',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
  },
  titel: {
    color: '#151313',
    fontSize: 19,
    fontFamily: 'BeVietnamPro-Medium',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 25,
  },
  subtitel: {
    color: '#151313',
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',

    marginBottom: 15,
  },
  BtnGap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 25,
  },
  StartBtn: {
    width: '47%',
    backgroundColor: '#fff',
    height: 150,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00218F47',
  },
  StartBtnTxt: {
    color: '#151313',
    fontSize: 19,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
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
  searchInput: {
    fontSize: 14,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00218F47',
    marginBottom: 15,
    height: 140,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
  },
  searchFocused: {
    borderColor: '#FF8800', // Highlighted border when focused
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
  imageContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00218F47',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 0,
  },
  imageContainerRgt: {
    width: '77%',
  },

  fileName: {
    fontSize: 14,
    color: '#353535',
    fontFamily: 'BeVietnamPro-Regular',
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 12,
    color: '#8E8E8E',
    fontFamily: 'BeVietnamPro-Regular',
  },
  progressBar: {
    width: '100%',
    height: 7,
    backgroundColor: '#ddd',
    marginTop: 8,
    borderRadius: 5,
  },
  progress: {
    width: '50%',
    height: 7,
    backgroundColor: '#FF7F50',
    borderRadius: 5,
  },

  buttoninner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 35,
    marginBottom: 20,
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
    bottom: 0,
  },
});
