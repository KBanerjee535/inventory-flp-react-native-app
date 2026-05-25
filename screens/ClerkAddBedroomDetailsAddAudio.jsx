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
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import Tick from 'react-native-vector-icons/FontAwesome';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs'; // File system for storage paths
import { useUserContext } from '../context/UserContext';
import {SectionUpdateAudioApi} from '../services/apiService';
const audioRecorderPlayer = new AudioRecorderPlayer();

const ClerkAddBedroomDetailsAddAudio = ({navigation}) => {
  const { setRecordingPath ,recordingPath, sectionDetails} = useUserContext();
  const [screenLoading, setScreenLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

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
      // Correct writable path for both Android & iOS
      const path = `${RNFS.DocumentDirectoryPath}/recorded_audio.mp3`;

      const uri = await audioRecorderPlayer.startRecorder(path);
      setRecordingPath(uri);
      setIsRecording(true);
      setButtonsEnabled(true);
      console.log('Recording started at:', uri);
    } catch (error) {
      console.log('Recording error:', error);
    }
  };

  // 🔹 STOP RECORDING FUNCTION
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      setRecordingPath(result);
    } catch (error) {
      console.log('Stop recording error:', error);
    }
  };

    // 🔹 Save RECORDING FUNCTION
  const saveRecording = async () => {
    try {
      setScreenLoading(true);
  const fileName = `recorded_audio_${Date.now()}.mp3`;
  const fd = new FormData();
       fd.append("section_id",sectionDetails?.id);
       fd.append('audio', {
     uri: Platform.OS === 'android' ? `${recordingPath}` : recordingPath,
    type: 'audio/mpeg',
    name: fileName, // 🔹 Add dynamic file name
  });

console.log(JSON.stringify(fd));
    let response = await SectionUpdateAudioApi(fd);
setScreenLoading(false);

navigation.navigate('ClerkAddBedroomDetails');
    } catch (error) {
            setScreenLoading(false);

    alert(JSON.stringify(error));
      console.log('Stop recording error:', error);
    }
  };



  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />
      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('ClerkAddBedroomDetails')}>
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
        </View>
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
});
