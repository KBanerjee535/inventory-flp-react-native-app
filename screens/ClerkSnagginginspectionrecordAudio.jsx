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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import Tick from 'react-native-vector-icons/FontAwesome';

const ClerkSnagginginspectionrecordAudio = ({navigation}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

  const handleRecordPress = () => {
    setIsRecording(!isRecording);
    setButtonsEnabled(!isRecording);
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />
      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() =>
              navigation.navigate('ClerkSnagginginspectionrecord')
            }>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Record Audio</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.buttoninner}>
            {/* Buttons Row */}
            <View style={styles.buttonRow}>
              {/* Stop Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  !buttonsEnabled && styles.disabledButton,
                ]}
                disabled={!buttonsEnabled}>
                <Icon name="stop" size={24} color="black" />
              </TouchableOpacity>

              {/* Mic/Pause Button */}

              <View style={styles.recordButtongrp}>
                <TouchableOpacity
                  style={styles.recordButton}
                  onPress={handleRecordPress}>
                  <Icon
                    name={isRecording ? 'pause' : 'mic'}
                    size={35}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              {/* Check Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  !buttonsEnabled && styles.disabledButton,
                ]}
                disabled={!buttonsEnabled}>
                <Tick name="check" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Recording Status */}
            {isRecording && (
              <Text style={styles.recordingText}>Recording...</Text>
            )}
          </View>
        </View>
        <View style={styles.Footer}>
          <TouchableOpacity style={styles.NextBtn}>
            <Text style={styles.NextBtnTxt}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClerkSnagginginspectionrecordAudio;

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
