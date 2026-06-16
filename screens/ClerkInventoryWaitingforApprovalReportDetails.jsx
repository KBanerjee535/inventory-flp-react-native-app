import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import React, {useEffect, useRef, useState} from 'react';

import Icon from 'react-native-vector-icons/Entypo';
import Arrow from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import ItemIcon1 from '../assets/images/ItemIcon1.svg';
import ItemIcon2 from '../assets/images/ItemIcon2.svg';
import ItemIcon3 from '../assets/images/ItemIcon3.svg';
import ItemIcon4 from '../assets/images/ItemIcon4.svg';
import ItemIcon5 from '../assets/images/ItemIcon5.svg';
import ItemIcon6 from '../assets/images/ItemIcon6.svg';

import Voice from '@react-native-voice/voice';

const items = [
  {
    id: 1,
    icon: <ItemIcon1 width={24} height={24} />,
    text: 'Schedule of Conditions',
    screen: 'ClerkInventoryWaitingforapprovalReportSOC',
  },
  {
    id: 2,
    icon: <ItemIcon2 width={24} height={24} />,
    text: 'Cleaning Summary',
    screen: 'ClerkInventoryWaitingforapprovalReportCleaning',
  },
  {
    id: 3,
    icon: <ItemIcon3 width={24} height={24} />,
    text: 'Keys',
    screen: 'ClerkInventoryWaitingforApprovalReportkeys',
  },
  {
    id: 4,
    icon: <ItemIcon4 width={24} height={24} />,
    text: 'Alarms',
    screen: 'ClerkInventoryWaitingforApprovalReportAlarms',
  },
  {
    id: 5,
    icon: <ItemIcon5 width={24} height={24} />,
    text: 'Meters',
    screen: 'ClerkInventoryWaitingforApprovalReportMeters',
  },
  {
    id: 6,
    icon: <ItemIcon6 width={24} height={24} />,
    text: 'Bedroom',
    screen: 'ClerkInventoryWaitingforApprovalReportBedroom',
  },
];

const ClientWaitingforapprovalfeedbackReportDetails = ({
  navigation,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const [speechText, setSpeechText] = useState('');
  const [recognitionError, setRecognitionError] =
    useState('');

  const [isRecording, setIsRecording] =
    useState(false);

  const [selectedItemId, setSelectedItemId] =
    useState(null);

  const [expandedItemId, setExpandedItemId] =
    useState(null);

  const [sectionNotes, setSectionNotes] = useState({});

  const fadeAnims = useRef(
    items.map(() => new Animated.Value(0)),
  ).current;

  /*
  ==========================================
  SPEECH EVENTS
  ==========================================
  */

  const onSpeechStart = () => {
    console.log('Speech started');
    setIsRecording(true);
  };

  const onSpeechEnd = () => {
    console.log('Speech ended');

    setIsRecording(false);

    Voice.destroy()
      .then(Voice.removeAllListeners)
      .catch(() => {});
  };

  const onSpeechResults = e => {
    const text = e.value?.[0] || '';

    console.log('VOICE RESULT:', text);

    setSpeechText(prev => {
      const prevTrim = prev.trim();
      const normalizedText = text.trim();

      if (!prevTrim) {
        return normalizedText;
      }

      if (normalizedText.includes(prevTrim)) {
        return normalizedText;
      }

      if (prevTrim.includes(normalizedText)) {
        return prevTrim;
      }

      return `${prevTrim} ${normalizedText}`;
    });
  };

  const onSpeechPartialResults = e => {
    const partialText = e.value?.[0] || '';

    if (partialText) {
      setSpeechText(partialText);
    }
  };

  const onSpeechError = e => {
    console.log('Speech error:', e);

    setIsRecording(false);

    const errorCode = e.error?.code || e.code;

    switch (String(errorCode)) {
      case '2':
        setRecognitionError(
          'Network error. Please check internet connection.',
        );
        break;

      case '7':
        setRecognitionError(
          'No speech detected. Please speak clearly.',
        );
        break;

      case '11':
        setRecognitionError(
          "Didn't understand. Please try again.",
        );
        break;

      default:
        setRecognitionError(
          'Speech recognition failed.',
        );
    }

    setTimeout(() => {
      setRecognitionError('');
    }, 3000);
  };

  /*
  ==========================================
  START RECORDING
  ==========================================
  */

  const startRecording = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted =
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS
              .RECORD_AUDIO,
          );

        if (
          granted !==
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert(
            'Permission Required',
            'Microphone permission denied',
          );

          return;
        }
      }

      await Voice.destroy().catch(() => {});
      await Voice.removeAllListeners();

      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechPartialResults = onSpeechPartialResults;
      Voice.onSpeechError = onSpeechError;

      await Voice.start('en-US');

      setIsRecording(true);
    } catch (error) {
      console.log('START ERROR:', error);

      setIsRecording(false);
    }
  };

  /*
  ==========================================
  STOP RECORDING
  ==========================================
  */

  const stopRecording = async () => {
    try {
      await Voice.stop();
      await Voice.cancel();
      await Voice.destroy();

      setIsRecording(false);
    } catch (error) {
      console.log('STOP ERROR:', error);

      setIsRecording(false);
    }
  };

  /*
  ==========================================
  MIC BUTTON
  ==========================================
  */

  const handleMicPress = async () => {
    try {
      if (!selectedItemId) {
        Alert.alert(
          'Select Section',
          'Please select a section first.',
        );

        return;
      }

      // STOP
      if (isRecording) {
        console.log('Stopping recording...');

        setIsRecording(false);

        await stopRecording();

        return;
      }

      // START
      console.log('Starting recording...');

      setRecognitionError('');

      await startRecording();
    } catch (error) {
      console.log('MIC ERROR:', error);

      setIsRecording(false);
    }
  };

  /*
  ==========================================
  SAVE NOTE
  ==========================================
  */

  const handleSubmitSpeech = () => {
    if (!speechText.trim()) {
      Alert.alert(
        'Empty Note',
        'Please record or type a note.',
      );

      return;
    }

    if (!selectedItemId) {
      Alert.alert(
        'No Section Selected',
        'Please select a section first.',
      );

      return;
    }

    setSectionNotes(prev => ({
      ...prev,
      [selectedItemId]: speechText,
    }));

    setSpeechText('');

    Alert.alert(
      'Success',
      'Inspection note saved successfully.',
    );
  };

  /*
  ==========================================
  ANIMATION
  ==========================================
  */

  useEffect(() => {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  /*
  ==========================================
  CLEANUP
  ==========================================
  */

  useEffect(() => {
    return () => {
      Voice.destroy()
        .then(Voice.removeAllListeners)
        .catch(err => console.log(err));
    };
  }, []);

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F1F2F6"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.Body}>
          {/* HEADER */}

          <View style={styles.Header}>
            <View style={styles.HeaderLft}>
              <View style={styles.indicator}>
                <View
                  style={[
                    styles.statusindicator,
                    styles.checkIn,
                  ]}
                />

                <Text style={styles.indicatorTxt}>
                  Check In
                </Text>
              </View>

              <Text style={styles.HeaderLftTxt}>
                The New Rectory
              </Text>
            </View>

            <View style={styles.HeaderRgt}>
              <TouchableOpacity
                style={styles.MoreBtn}
                onPress={() =>
                  setShowTooltip(!showTooltip)
                }>
                <Icon
                  name="dots-three-vertical"
                  size={26}
                  color="#393D47"
                />
              </TouchableOpacity>

              {showTooltip && (
                <View style={styles.tooltipContainer}>
                  <View style={styles.tooltipArrow} />

                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>
                      Download Report
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* LIST */}

          <View style={styles.List}>
            <Text style={styles.ListHr}>
              Sections of inspection
            </Text>

            {items.map((item, index) => (
              <Animated.View
                key={item.id}
                style={{
                  opacity: fadeAnims[index],
                }}>
                {/* LIST ITEM */}

                <TouchableOpacity
                  style={[
                    styles.ListItem,
                    selectedItemId === item.id &&
                      styles.ActiveListItem,
                  ]}
                  onPress={() => {
                    setSelectedItemId(item.id);

                    setExpandedItemId(prev =>
                      prev === item.id
                        ? null
                        : item.id,
                    );
                  }}>
                  <View
                    style={styles.ListItemInner}>
                    {item.icon}

                    <Text
                      style={styles.ListItemTxt}>
                      {item.text}
                    </Text>
                  </View>

                  <Arrow
                    name={
                      expandedItemId === item.id
                        ? 'chevron-down-outline'
                        : 'chevron-forward-outline'
                    }
                    size={24}
                    color="#393D47"
                  />
                </TouchableOpacity>

                {/* TOGGLE NOTE */}

                {expandedItemId === item.id && (
                  <View
                    style={styles.NoteContainer}>
                    <Text
                      style={styles.NoteTitle}>
                      Inspection Note
                    </Text>

                    <Text style={styles.NoteText}>
                      {sectionNotes[item.id]
                        ? sectionNotes[item.id]
                        : 'No note added yet'}
                    </Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* SPEECH SECTION */}

      <View style={styles.SpeechSection}>
        <Text style={styles.SpeechTitle}>
          Speech Notes
        </Text>

        <Text style={styles.DynamicMessage}>
          {selectedItemId
            ? `Selected Section: ${
                items.find(
                  i => i.id === selectedItemId,
                )?.text
              }`
            : 'Please select a section'}
        </Text>

        {/* MIC */}

        <View style={styles.MicContainer}>
          <TouchableOpacity
            style={[
              styles.MicButton,
              isRecording &&
                styles.MicButtonRecording,
            ]}
            onPress={handleMicPress}>
            <MaterialIcon
              name={
                isRecording
                  ? 'stop-circle'
                  : 'mic'
              }
              size={36}
              color="#fff"
            />
          </TouchableOpacity>

          <Text style={styles.RecordingStatus}>
            {isRecording
              ? 'Recording... Tap again to stop'
              : 'Tap microphone to record'}
          </Text>

          {recognitionError ? (
            <Text style={styles.ErrorMessage}>
              {recognitionError}
            </Text>
          ) : null}
        </View>

        {/* TEXT AREA */}

        <TextInput
          style={styles.SpeechInput}
          placeholder="Speak or type inspection notes..."
          placeholderTextColor="#6D7D93"
          multiline
          textAlignVertical="top"
          value={speechText}
          onChangeText={setSpeechText}
        />

        {/* SAVE BUTTON */}

        <TouchableOpacity
          style={styles.SubmitSpeechBtn}
          onPress={handleSubmitSpeech}>
          <Text
            style={
              styles.SubmitSpeechBtnText
            }>
            Submit Note
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}

      <View style={styles.Footer}>
        <TouchableOpacity style={styles.NextBtn}>
          <Text style={styles.NextBtnTxt}>
            Approve Edited Report
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ClientWaitingforapprovalfeedbackReportDetails;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#F1F2F6',
  },

  Body: {
    width: '100%',
    paddingHorizontal: 25,
  },

  Header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25,
  },

  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  statusindicator: {
    width: 12,
    height: 12,
    borderRadius: 100,
  },

  checkIn: {
    backgroundColor: '#3CC6ED',
  },

  indicatorTxt: {
    color: '#393D47',
    fontSize: 15,
  },

  HeaderLftTxt: {
    color: '#151313',
    fontSize: 20,
    fontWeight: '600',
  },

  MoreBtn: {
    width: 20,
  },

  tooltipContainer: {
    position: 'absolute',
    top: 40,
    right: -7,
    alignItems: 'flex-end',
  },

  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    marginRight: 5,
    marginBottom: -1,
  },

  tooltip: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 5,
    width: 155,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },

  /*
  ==========================================
  LIST
  ==========================================
  */

  List: {
    paddingTop: 35,
  },

  ListHr: {
    color: '#525050',
    fontSize: 14,
    marginBottom: 25,
    textTransform: 'uppercase',
  },

  ListItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ActiveListItem: {
    borderWidth: 2,
    borderColor: '#393D47',
  },

  ListItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  ListItemTxt: {
    color: '#393D47',
    fontSize: 15,
  },

  /*
  ==========================================
  NOTE TOGGLE
  ==========================================
  */

  NoteContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: -4,
    marginBottom: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E4EA',
  },

  NoteTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#393D47',
    marginBottom: 6,
  },

  NoteText: {
    fontSize: 14,
    color: '#6D7D93',
    lineHeight: 22,
  },

  /*
  ==========================================
  SPEECH SECTION
  ==========================================
  */

  SpeechSection: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    backgroundColor: '#F1F2F6',
    minHeight: 320,
  },

  SpeechTitle: {
    color: '#151313',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  DynamicMessage: {
    fontSize: 13,
    color: '#6D7D93',
    marginBottom: 15,
    fontStyle: 'italic',
  },

  MicContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },

  MicButton: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#393D47',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  MicButtonRecording: {
    backgroundColor: '#FF4444',
  },

  RecordingStatus: {
    fontSize: 14,
    color: '#6D7D93',
  },

  ErrorMessage: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 8,
    textAlign: 'center',
  },

  /*
  ==========================================
  TEXT INPUT
  ==========================================
  */

  SpeechInput: {
    width: '100%',
    minHeight: 140,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E4EA',
    padding: 15,
    fontSize: 14,
    color: '#393D47',
    textAlignVertical: 'top',
  },

  SubmitSpeechBtn: {
    backgroundColor: '#393D47',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  SubmitSpeechBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  /*
  ==========================================
  FOOTER
  ==========================================
  */

  Footer: {
    padding: 25,
  },

  NextBtn: {
    backgroundColor: '#393D47',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 8,
  },

  NextBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});