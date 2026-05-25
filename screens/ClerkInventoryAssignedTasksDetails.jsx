import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import Docfile from '../assets/images/Docfile.svg';
import Jpgfile from '../assets/images/Jpgfile.svg';
import Pdffile from '../assets/images/Pdffile.svg';
import {useRoute} from '@react-navigation/native';

const ClerkInventoryAssignedTasksDetails = ({navigation}) => {
  const route = useRoute(); // ✅ Get the route object
  const activeTabIndex = route.params?.activeTabIndex ?? 0; // Default to 0 if undefined
  const [isAccepted, setIsAccepted] = useState(false);
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() =>
              navigation.navigate('TabRoutes', {
                screen: 'Inventory',
                params: {activeTabIndex: 0},
              })
            }>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.TopPart}>
            <Text style={styles.HeaderLftTxt}>The New Rectory</Text>
            <View style={styles.indicator}>
              <View style={[styles.statusindicator, styles.checkIn]}></View>
              <Text style={styles.indicatorTxt}>Check In</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitel}>Task info</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Property Name</Text>
              <Text style={styles.info}>The New Factory</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Task Status</Text>
              <View style={styles.info}>
                <Text style={styles.AssignedStyle}>Assigned</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Assigner</Text>
              <Text style={styles.info}>Super Admin</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Created on</Text>
              <Text style={styles.info}>07/02/2025</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Report Type</Text>
              <View style={styles.infoindicator}>
                <View
                  style={[styles.infostatusindicator, styles.checkIn]}></View>
                <Text style={styles.infoindicatorTxt}>Check In</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Client Name</Text>
              <Text style={styles.info}>Zara Hunt</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Client Approval</Text>
              <View style={styles.info}>
                <Text style={styles.PendingStyle}>Pending</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tenant</Text>
              <Text style={styles.info}>--</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tenant Status</Text>
              <Text style={styles.info}>--</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitel}>Property Details</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Property Address</Text>
              <Text style={styles.info}>
                3 Station Street, Bristol, BS1 5QL
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Property Address 2</Text>
              <Text style={styles.info}>
                7 Victoria Road, Liverpool, L1 4EJ
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Property Type</Text>
              <Text style={styles.info}>1BHK</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Post Code</Text>
              <Text style={[styles.info, styles.bold]}>102958</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitel}>Assignee</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Clerk Name</Text>
              <Text style={styles.info}>Mia Lewis</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Clerk Status</Text>
              <Text style={styles.AssignedStyle}>Assigned</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Clerk’s Task Deadline</Text>
              <View style={styles.info}>
                <Text style={styles.bold}>06/01/2025</Text>
                <Text style={styles.bold}>8:15am - 8:55am</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Editor Name</Text>
              <Text style={[styles.info, styles.bold]}>Floyd Miles</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Editor Status</Text>
              <View style={styles.info}>
                <Text style={styles.AssignedStyle}>Assigned</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Editor’s Task Deadline</Text>
              <Text style={[styles.info, styles.bold]}>07/01/2025</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Prop. Manager</Text>
              <Text style={[styles.info, styles.bold]}>John Abraham</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Prop. Manager Status</Text>
              <View style={styles.info}>
                <Text style={styles.AssignedStyle}>Assigned</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitel}>Supporting Documents</Text>

            <View style={styles.sectionDoc}>
              <View style={styles.DocinfoBox}>
                <View style={styles.DocinfoImg}>
                  <Docfile />
                </View>
                <Text style={styles.DocinfoTxt}>Scope.doc</Text>
              </View>

              <View style={styles.DocinfoBox}>
                <View style={styles.DocinfoImg}>
                  <Jpgfile />
                </View>
                <Text style={styles.DocinfoTxt}>Property.jpg</Text>
              </View>

              <View style={styles.DocinfoBox}>
                <View style={styles.DocinfoImg}>
                  <Pdffile />
                </View>
                <Text style={styles.DocinfoTxt}>data.pdf</Text>
              </View>
            </View>
          </View>

          <View style={styles.BtnGrp}>
            <TouchableOpacity style={styles.NextBtn}>
              <Text style={styles.NextBtnTxt}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ForgetBtn}>
              <Text style={styles.ForgetBtnTxt}>Decline</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClerkInventoryAssignedTasksDetails;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  Body: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  Header: {
    backgroundColor: '#fff',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 30,
    paddingBottom: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  BackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  backIcon: {
    marginRight: 20,
  },

  Container: {
    backgroundColor: '#fff',
    paddingLeft: 30,
    paddingTop: 10,
    paddingRight: 30,
  },
  title: {
    color: '#000',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 30,
    marginBottom: 10,
    fontWeight: '600',
  },
  subText: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 30,
    fontWeight: '400',
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
  StartBtn: {
    backgroundColor: '#393D47',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    marginBottom: 15,
  },
  StartBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
  ForgetBtn: {
    width: '100%',
    marginTop: 15,
    lineHeight: 50,
    textAlign: 'center',
    height: 50,
  },
  ForgetBtnTxt: {
    color: '#6D7D93',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 50,
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
  Snagging: {
    backgroundColor: '#FF7C5E',
  },
  indicatorTxt: {
    color: '#393D47',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
  HeaderLftTxt: {
    color: '#151313',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
  },
  TopPart: {
    textAlign: 'center',
    alignItems: 'center',
  },
  section: {
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 15,
    color: '#717171',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
    width: '50%',
  },
  info: {
    fontSize: 15,
    color: '#151313',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
    width: '50%',
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  sectionTitel: {
    marginBottom: 15,
    fontSize: 14,
    color: '#525050',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
  },
  AssignedStyle: {
    color: '#2D7C0B',
    backgroundColor: '#E3FCD9',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  PendingStyle: {
    color: '#D06100',
    backgroundColor: '#FFEFD3',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  ActionPendingStyle: {
    color: '#0561AC',
    backgroundColor: '#D8EDFF',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  AcceptedStyle: {
    color: '#0561AC',
    backgroundColor: '#D8EDFF',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },

  infoindicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infostatusindicator: {
    width: 10,
    height: 10,
    borderRadius: '100%',
  },
  infoindicatorTxt: {
    fontSize: 15,
    color: '#151313',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
  },
  bold: {
    color: '#434854',
    fontWeight: 600,
    fontFamily: 'BeVietnamPro-SemiBold',
  },
  sectionDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },

  DocinfoBox: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  DocinfoImg: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    padding: 18,
    borderRadius: 8,
  },
  DocinfoTxt: {
    color: '#434854',
    fontWeight: 600,
    fontFamily: 'BeVietnamPro-SemiBold',
  },
  BtnGrp: {
    padding: 25,
    paddingBottom: 15,
    alignItems: 'center',
  },
});
