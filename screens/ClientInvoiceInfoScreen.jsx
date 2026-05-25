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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';

import ClientInvoiceSummary from '../components/ClientInvoiceSummary';
import ClientInvoiceRecurringBills from '../components/ClientInvoiceRecurringBills';
import ClientInvoiceInfo from '../components/ClientInvoiceInfo';

// Tabs data
const tabLabels = ['Info', 'Summary', 'Recurring Bills'];

const ClientInvoiceInfoScreen = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Default to first tab
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() =>
              navigation.navigate('ClientTabRoutes', {screen: 'Invoices'})
            }>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Invoice ID #0165</Text>
        </View>
        <View style={styles.TopPart}>
          <Text style={styles.HeaderLftTxt}>The New Rectory</Text>
          <View style={styles.indicator}>
            <View style={[styles.statusindicator, styles.checkIn]}></View>
            <Text style={styles.indicatorTxt}>Check In</Text>
          </View>
        </View>

        <View style={styles.container}>
          {/* Horizontal Scrollable Tabs */}

          <View style={styles.TabButtonPart}>
            {/* Tabs Section */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingLeft: 25}}
              style={styles.tabContainer}>
              {tabLabels.map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tabButton,
                    activeTab === index && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab(index)}>
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === index && styles.activeTabText,
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Render Content Based on Selected Tab */}
          {/* Tab Content */}
          <View style={styles.contentContainer}>
            {activeTab === 0 ? (
              <ClientInvoiceInfo />
            ) : activeTab === 1 ? (
              <ClientInvoiceSummary />
            ) : activeTab === 2 ? (
              <ClientInvoiceRecurringBills />
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClientInvoiceInfoScreen;

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
    backgroundColor: '#fff',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 15,
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
  infoTxt: {
    fontSize: 13,
    color: '#393D47',
    fontFamily: 'BeVietnamPro-Regular',
    marginBottom: 20,
  },

  TopPart: {
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#Fff',
    paddingTop: 15,
    paddingBottom: 25,
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

  tabButton: {
    borderRadius: 50,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    paddingHorizontal: 25,
    paddingTop: 5,
    paddingBottom: 5,
  },
  activeTab: {
    backgroundColor: 'black',
  },
  tabText: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 35,
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    flex: 1, // Allows child components to fill available space
    width: '100%', // Ensures full width
  },

  TabButtonPart: {
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    flex: 1, // Allows child components to fill available space
  },
});
