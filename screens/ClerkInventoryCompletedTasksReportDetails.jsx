import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Modal,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Arrow from 'react-native-vector-icons/Ionicons';
import ItemIcon1 from '../assets/images/ItemIcon1.svg';
import ItemIcon2 from '../assets/images/ItemIcon2.svg';
import ItemIcon3 from '../assets/images/ItemIcon3.svg';
import ItemIcon4 from '../assets/images/ItemIcon4.svg';
import ItemIcon5 from '../assets/images/ItemIcon5.svg';
import ItemIcon6 from '../assets/images/ItemIcon6.svg';
import ItemIcon7 from '../assets/images/ItemIcon7.svg';
import ItemIcon8 from '../assets/images/ItemIcon8.svg';
import CloseIcon from '../assets/images/BlackCross.svg';

import GalleryIcon from '../assets/images/GalleryIcon.svg';
import CameraIcon from '../assets/images/CameraIcon.svg';

import Trash from 'react-native-vector-icons/Ionicons';

const items = [
  {
    id: 1,
    icon: <ItemIcon1 width={24} height={24} />,
    text: 'Schedule of Conditions',
    screen: 'ClerkInventoryCompletedTasksReportSOC',
  },
  {
    id: 2,
    icon: <ItemIcon2 width={24} height={24} />,
    text: 'Cleaning Summary',
    screen: 'ClerkInventoryCompletedTasksReportCleaning',
  },
  {
    id: 3,
    icon: <ItemIcon3 width={24} height={24} />,
    text: 'Keys',
    screen: 'ClerkInventoryCompletedTasksReportKeyslist',
  },
  {
    id: 4,
    icon: <ItemIcon4 width={24} height={24} />,
    text: 'Alarms',
    screen: 'ClerkInventoryCompletedTasksReportAlarmlist',
  },
  {
    id: 5,
    icon: <ItemIcon5 width={24} height={24} />,
    text: 'Meters',
    screen: 'ClerkInventoryCompletedTasksReportMeterlist',
  },
  {
    id: 6,
    icon: <ItemIcon6 width={24} height={24} />,
    text: 'Bedroom',
    screen: 'ClerkInventoryCompletedTasksReportBedroomlist',
  },
  {
    id: 7,
    icon: <ItemIcon7 width={24} height={24} />,
    text: 'Kitchen',
    screen: 'ClientWaitingforapprovalfeedbackKitchen',
  },

  {
    id: 8,
    icon: <ItemIcon8 width={24} height={24} />,
    text: 'Bathroom',
    screen: 'ClientWaitingforapprovalfeedbackBathroom',
  },
];

const handleDeleteText = () => {
  Animated.timing(descriptionAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start(() => {
    setIsDeleted(true);
  });
};

const ClerkInventoryCompletedTasksReportDetails = ({navigation}) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const fadeAnims = useRef(items.map(() => new Animated.Value(0))).current; // Create an array of Animated values

  useEffect(() => {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 200, // Staggered effect
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <ScrollView>
        <View style={styles.Body}>
          <View style={styles.Header}>
            <View style={styles.HeaderLft}>
              <View style={styles.indicator}>
                <View style={[styles.statusindicator, styles.checkIn]}></View>
                <Text style={styles.indicatorTxt}>Check In</Text>
              </View>
              <Text style={styles.HeaderLftTxt}>The New Rectory</Text>
            </View>

            <View style={styles.HeaderRgt}>
              <TouchableOpacity
                style={styles.MoreBtn}
                onPress={() => setShowTooltip(!showTooltip)}>
                <Icon name="dots-three-vertical" size={28} color="#393D47" />
              </TouchableOpacity>

              {showTooltip && (
                <View style={styles.tooltipContainer}>
                  {/* Arrow */}
                  <View style={styles.tooltipArrow} />
                  {/* Tooltip Box */}
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>Download Report</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.List}>
            <Text style={styles.ListHr}>Sections of inspection</Text>

            {items.map((item, index) => (
              <Animated.View key={item.id} style={{opacity: fadeAnims[index]}}>
                <TouchableOpacity
                  style={styles.ListItem}
                  onPress={() => navigation.navigate(item.screen)}>
                  <View style={styles.ListItemInner}>
                    {item.icon}
                    <Text style={styles.ListItemTxt}>{item.text}</Text>
                  </View>
                  <Arrow
                    name="chevron-forward-outline"
                    size={28}
                    color="#393D47"
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>
      {/* <View style={styles.Footer}>
        <TouchableOpacity style={styles.NextBtn}>
          <Text style={styles.NextBtnTxt}>Mark Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ViewBtn}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.ViewBtnTxt}>View/Make a Comment</Text>
        </TouchableOpacity>
      </View> */}

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
            <Text style={styles.ModalTitel}>Make a Comment</Text>

            <ScrollView style={styles.ModalContainer}>
              <View style={styles.ModalInfo}>
                <View style={styles.frmBox}>
                  <Text style={styles.subtitel}>Title</Text>
                  <TextInput
                    style={[
                      styles.searchInput2,
                      focusedInput === 'input1' && styles.searchFocused,
                    ]}
                    placeholder="Type"
                    onFocus={() => setFocusedInput('input1')}
                    onBlur={() => setFocusedInput(null)}
                  />

                  <Text style={styles.subtitel}>Comment</Text>
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

                  <Text style={styles.subtitel}>Supporting Photo(s)</Text>
                  <View style={styles.BtnGap}>
                    <TouchableOpacity style={styles.StartBtn}>
                      <CameraIcon width={50} height={50} />
                      <Text style={styles.StartBtnTxt}>Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.StartBtn}>
                      <GalleryIcon width={50} height={50} />
                      <Text style={styles.StartBtnTxt}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.BtnGrp}>
                <TouchableOpacity style={styles.NextBtn}>
                  <Text style={styles.NextBtnTxt}>Submit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.InfoBoxList}>
                <View style={styles.InfoBox}>
                  <View style={styles.InfoBoxInner}>
                    <View style={styles.InfoBoxLft}>
                      <Image
                        source={require('../assets/images/image1.jpg')}
                        style={styles.image}
                      />
                    </View>
                    <View style={styles.InfoBoxRgt}>
                      <Text style={styles.InfoTitle}>Tenant Issue</Text>
                      <Text style={styles.InfoTxt}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setIsEditing(!isEditing)}>
                      <Icon
                        name={isEditing ? 'save' : 'edit'}
                        size={18}
                        color="#393D47"
                      />
                      <Text style={styles.buttonText}>
                        {isEditing ? 'Save' : 'Edit'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Trash name="trash-outline" size={18} color="#393D47" />
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ClerkInventoryCompletedTasksReportDetails;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  Body: {
    width: '100%',
    height: '100%',
    paddingLeft: 25,
    paddingRight: 25,
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
    borderRadius: '100%',
  },
  checkIn: {
    backgroundColor: '#3CC6ED',
  },
  indicatorTxt: {
    color: '#393D47',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
  MoreBtn: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: 20,
  },
  HeaderLftTxt: {
    color: '#151313',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 20,
    fontWeight: '500',
  },
  List: {
    width: '100%',
    paddingTop: 35,
  },
  ListHr: {
    color: '#525050',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    fontWeight: '400',
    textTransform: 'uppercase',
    marginBottom: 25,
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
  ListItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  ListItemTxt: {
    color: '#393D47',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
  },

  tooltipContainer: {
    position: 'absolute',
    top: 40,
    right: -7, // Align tooltip to the right
    alignItems: 'flex-end', // Align arrow to the right
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333', // Same as tooltip background
    alignSelf: 'flex-end', // Align arrow to the right
    marginRight: 5, // Adjust arrow position
    marginBottom: -1, // Slight overlap with tooltip
  },
  tooltip: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 5,
    width: 155,
    height: 45,
    alignItems: 'center',
  },

  tooltipText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: '#fff',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  InfoBoxLft: {
    width: 100,
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
  },

  InfoBoxRgt: {
    width: '72%',
    paddingLeft: 20,
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

  buttonRow: {
    flexDirection: 'row',
    marginBottom: 25,
    marginTop: 15,
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
});
