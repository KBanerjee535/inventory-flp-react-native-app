import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';
import InventoryIcon from '../assets/images/inventoryIcon.svg';
import SnaggingIcon from '../assets/images/SnaggingIcon.svg';
import InspectionHistory from '../components/InspectionHistory';

const ClientProfile = ({navigation}) => {
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.Body}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.ProfileView}>
            <View style={styles.ProfileImgBox}>
              <Image
                style={styles.ProfileImg}
                source={require('../assets/images/ProfileImg.jpg')}
              />
            </View>

            <Text style={styles.Name}>Mia Lewis</Text>
            <Text style={styles.degi}>Clerk</Text>

            <TouchableOpacity
              style={styles.EditBtn}
              onPress={() => navigation.navigate('EditAccount')}>
              <Text style={styles.EditBtnTxt}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.keyInfo}>
              <View style={styles.keyInfoBox}>
                <Text style={styles.LftTxt}>Phone Number</Text>
                <Text style={styles.RgtTxt}>+91 123 456 7890</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.LftTxt}>Email ID</Text>
                <Text style={styles.RgtTxt}>mia@email.com</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.LftTxt}>Address</Text>
                <Text style={styles.RgtTxt}>
                  5 Church Lane, Birmingham, B2 3CD
                </Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.LftTxt}>Address 2</Text>
                <Text style={styles.RgtTxt}>
                  14 Queen’s Avenue, Glasgow, G1 4EF
                </Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.LftTxt}>Account Created By</Text>
                <Text style={styles.RgtTxt}>Super Admin</Text>
              </View>
              <View style={styles.keyInfoBox}>
                <Text style={styles.LftTxt}>Account Created On</Text>
                <Text style={styles.RgtTxt}>05/10/2024 | 10:52am</Text>
              </View>
            </View>

            <View style={styles.InfoBox}>
              <View style={styles.InfoBoxLft}>
                <Text style={styles.InfoBoxTxt}>Inventory Inspected</Text>
                <Text style={styles.InfoBoxRTxtNumber}>03</Text>
              </View>
              <View style={styles.InfoBoxRgt}>
                <InventoryIcon />
              </View>
            </View>

            <View style={styles.InfoBox}>
              <View style={styles.InfoBoxLft}>
                <Text style={styles.InfoBoxTxt}>Inventory Inspected</Text>
                <Text style={styles.InfoBoxRTxtNumber}>28</Text>
              </View>
              <View style={styles.InfoBoxRgt}>
                <SnaggingIcon />
              </View>
            </View>
          </View>
          <View style={styles.HistoryBox}>
            <Text style={styles.HistoryBoxtxt}>Report Inspection History</Text>
            <InspectionHistory />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClientProfile;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  Body: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  ProfileView: {
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 70,
  },
  ProfileImgBox: {
    width: 105,
    height: 105,
    backgroundColor: '#EAEAEA',
    borderRadius: 200,
    margin: 'auto',
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 20,
  },
  ProfileImg: {},
  Name: {
    fontWeight: '500',
    fontSize: 23,
    fontFamily: 'BeVietnamPro-Medium',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },

  degi: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontWeight: '400',
    color: '#6D7D93',
    textAlign: 'center',
    fontSize: 13,
  },
  EditBtn: {
    backgroundColor: '#393D47',
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    margin: 'auto',
    marginTop: 20,
  },
  EditBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },

  keyInfo: {
    width: '100%',
    paddingTop: 30,
    marginBottom: 20,
  },
  keyInfoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
  },
  LftTxt: {
    fontSize: 16,
    color: '#717171',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    width: '40%',
  },
  RgtTxt: {
    fontSize: 16,
    color: '#151313',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    width: '55%',
    textAlign: 'right',
  },
  scrollView: {
    paddingBottom: 70,
  },
  InfoBox: {
    backgroundColor: '#30343C',
    width: '100%',
    borderRadius: 8,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  InfoBoxTxt: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
    marginBottom: 5,
  },
  InfoBoxRTxtNumber: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    marginBottom: 15,
  },
  HistoryBox: {
    width: '100%',
    backgroundColor: '#F1F2F6',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    marginTop: 25,
    paddingBottom: 15,
    paddingTop: 25,
  },
  HistoryBoxtxt: {
    fontWeight: '500',
    fontSize: 18,
    fontFamily: 'BeVietnamPro-Medium',
    color: '#151313',
    textAlign: 'center',
    marginBottom: 15,
  },
});
