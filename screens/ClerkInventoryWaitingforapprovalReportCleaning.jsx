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
  Modal,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import TextIcon from '../assets/images/TextIcon.svg';
import AudioIcon from '../assets/images/AudioIcon.svg';
import DownLoad from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import Download from '../assets/images/Download.svg';
import CloseIcon from '../assets/images/BlackCross.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ClientWaitingforapprovalfeedbackCleaning = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const [images] = useState([
    {
      id: 1,
      uri: require('../assets/images/image1.jpg'), // Replace with your actual image path
    },
    {
      id: 2,
      uri: require('../assets/images/image2.jpg'), // Replace with your actual image path
    },
  ]);

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() =>
              navigation.navigate(
                'ClerkInventoryWaitingforApprovalReportDetails',
              )
            }>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Cleaning Summary</Text>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.Addedaduiocontainer}>
            <Text style={styles.descriptiontitle}>Recorded Audio</Text>
            <View style={styles.audioItem}>
              <View style={styles.audioItemLft}>
                <TouchableOpacity
                  style={styles.playIconaudio}
                  onPress={togglePlayPause}>
                  <Icon
                    name={isPlaying ? 'controller-paus' : 'controller-play'}
                    size={28}
                    color="#393D47"
                  />
                </TouchableOpacity>

                <View style={styles.audioinfo}>
                  <Text style={styles.audioname}>Schedule_of_Con.mp3</Text>
                  <Text style={styles.audioduration}>00:05:33</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.deleteIconaudio}>
                <Download />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.SupportingBox}>
            <Text style={styles.descriptiontitle}>Supporting Images</Text>
            <View style={styles.imageRow}>
              {images.map(img => (
                <View key={img.id} style={styles.imageWrapper}>
                  <Image source={img.uri} style={styles.image} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.Footer}>
          <TouchableOpacity
            style={styles.ViewBtn}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.ViewBtnTxt}>View/Report Issue</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal for Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <CloseIcon width={30} height={30} />
            </TouchableOpacity>
            <Text style={styles.ModalTitel}>Report Issue</Text>

            <ScrollView style={styles.ModalContainer}>
              <View style={styles.ModalInfo}>
                <View style={styles.frmBox}>
                  <Text style={styles.subtitel}>Describe Issue</Text>
                  <TextInput
                    style={[
                      styles.searchInput,
                      focusedInput === 'input2' && styles.searchFocused,
                    ]}
                    placeholder="Type"
                    onFocus={() => setFocusedInput('input2')}
                    onBlur={() => setFocusedInput(null)}
                    multiline
                  />
                </View>
              </View>

              <View style={styles.typeBox}>
                {/* Flash Call Verification */}
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelectedOption('Tenantissue')}>
                  <Ionicons
                    name={
                      selectedOption === 'Tenantissue'
                        ? 'radio-button-on'
                        : 'radio-button-off-outline'
                    }
                    size={28}
                    color="#393D47"
                  />
                  <View style={styles.radioView}>
                    <Text style={styles.radioText}>Tenant issue</Text>
                  </View>
                </TouchableOpacity>

                {/* OTP Verification */}
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSelectedOption('Clientmaintenanceissue')}>
                  <Ionicons
                    name={
                      selectedOption === 'Clientmaintenanceissue'
                        ? 'radio-button-on'
                        : 'radio-button-off-outline'
                    }
                    size={28}
                    color="#393D47"
                  />
                  <View style={styles.radioView}>
                    <Text style={styles.radioText}>
                      Client maintenance issue
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.BtnGrp}>
                <TouchableOpacity style={styles.NextBtn}>
                  <Text style={styles.NextBtnTxt}>Submit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.InfoBoxList}>
                <View style={styles.InfoBox}>
                  <Text style={styles.InfoTitle}>Tenant Issue</Text>
                  <Text style={styles.InfoTxt}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>

              <View style={styles.InfoBoxList}>
                <View style={styles.InfoBox}>
                  <Text style={styles.InfoTitle}>Client Issue</Text>
                  <Text style={styles.InfoTxt}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>

              <View style={styles.InfoBoxList}>
                <View style={styles.InfoBox}>
                  <Text style={styles.InfoTitle}>Super Admin</Text>
                  <Text style={styles.InfoTxt}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ClientWaitingforapprovalfeedbackCleaning;

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
    textAlign: 'center',
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
  },
  StartBtnTxt: {
    color: '#151313',
    fontSize: 19,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 15,
  },
  descriptiontitle: {
    fontSize: 15,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 15,
  },
  input: {
    fontSize: 14,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF8800', // Highlight border when editing
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 15,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    width: '48%',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },

  deleteIcon: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 20,

    width: 28,
    height: 28,
    margin: 'auto',
  },
  AddedInfocontainer: {
    width: '100%',
    paddingTop: 30,
  },
  Addedaduiocontainer: {width: '100%', paddingTop: 30},

  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteIconaudio: {
    backgroundColor: '#FFFFFF',
    borderRadius: '100%',
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconaudio: {
    backgroundColor: '#E4E5E7',
    borderRadius: '100%',
    width: 55,
    height: 55,

    alignItems: 'center',
    justifyContent: 'center',
  },
  audioItemLft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  audioname: {
    fontSize: 17,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    marginBottom: 5,
  },
  audioduration: {
    fontSize: 14,
    color: '#727272',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
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
  SupportingBox: {
    width: '100%',
    marginTop: 30,
  },
  /* Modal Styles */
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    cursor: 'pointer',
    marginRight: 10,
    marginBottom: 15,
    zIndex: 999,
  },

  ModalContainer: {
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 20,
  },
  subtitel: {
    color: '#151313',
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    marginBottom: 15,
  },
  ViewBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    marginTop: 10,
    borderColor: '#393D47',
    borderWidth: 1,
  },
  ViewBtnTxt: {
    color: '#393D47',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
  Footer: {
    padding: 25,
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
  BtnGap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 25,
    marginBottom: 20,
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
  ModalTitel: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'BeVietnamPro-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -40,
  },

  searchInput2: {
    fontWeight: '400',
    fontSize: 13,
    fontFamily: 'BeVietnamPro-Regular',
    color: '#6D7D93',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#6D7D93',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  InfoBoxInner: {
    width: '100%',
  },
  InfoTitle: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Medium',
    fontWeight: '500',
    marginBottom: 5,
  },
  InfoTxt: {
    fontWeight: '400',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-Regular',
    color: '#434854',
    lineHeight: 20,
  },
  BtnGrp: {
    width: '100%',
    marginBottom: 20,
  },

  radioText: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
  radioView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  selected: {
    backgroundColor: '#DC7027',
  },
});
