import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  FlatList,
  Animated,
  TextInput,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SearchIcon from '../assets/images/SearchIcon.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import AssignedTasks from '../components/SnaggingAssignedTasks';
import UpcomingTasks from '../components/SnaggingUpcomingTasks';
import CompletedTasks from '../components/SnagginCompletedTasks';
import WaitingApproval from '../components/SnaggingWaitingApproval';
import ApprovedTasks from '../components/SnaggingApprovedTasks';
import PendingFeedbackRequests from '../components/PendingFeedbackRequests';
import ReAssignedReports from '../components/ReAssignedReports';
import CompletedReports from '../components/CompletedReports';
import { InventoryListByClientIdApi} from '../services/apiService';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { format } from 'date-fns';
// Tabs data
const tabLabels = [
  'Pending Feedback Requests',
  'Re Assigned Reports',
  'Completed Reports',
];

const ClientDashboardScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Default to first tab
  const [inventoryDetailsList, setInventoryDetailsList] = useState([]);
  const { setUserData, setIsLoggedIn,setseletedJobId } = useUserContext();
  const [screenLoading, setScreenLoading] = useState(true);
  const [inventoryList, setInventoryList] = useState();



 const getInventoryListByClientId= async () => {
  try {
    let fd = new FormData();
     fd.append("assign_date", '');
        setScreenLoading(true);    
    let response = await InventoryListByClientIdApi(fd);


 // console.log(JSON.stringify(response.data.data));
  setInventoryList(response.data.data);
      setScreenLoading(false);

  } catch (error) {
   // alert(JSON.stringify(error));
      setInventoryList();
    setScreenLoading(false);

            Toast.show(error.response?.data?.errors || 'Something went wrong, please try again.');

    //throw error.response?.data || 'Failed to fetch inventory list';
  }
};
 useEffect(() => {
    getInventoryListByClientId();
  }, []);
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          {/* Search Bar with Icon */}
          <View
            style={[styles.searchContainer, isFocused && styles.searchFocused]}>
            <SearchIcon
              name="search"
              size={20}
              color={isFocused ? '#007bff' : '#666'}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={text => setSearchQuery(text)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>

          <TouchableOpacity
            style={styles.FilterBtn}
            onPress={() => navigation.navigate('ClerkInventoryFilter')}>
            <Icon name="filter-outline" size={20} color="#000" />
            <Text style={styles.FilterBtnTxt}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          {/* Horizontal Scrollable Tabs */}
                   {screenLoading ? <ActivityIndicator size="large" color="#0000ff" />:''}

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
              <PendingFeedbackRequests navigation={navigation} inventoryList={inventoryList}/>
            ) : activeTab === 1 ? (
              <ReAssignedReports navigation={navigation} />
            ) : activeTab === 2 ? (
              <CompletedReports navigation={navigation} />
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClientDashboardScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  Body: {
    width: '100%',
    height: '100%',
  },
  Header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25,
    backgroundColor: '#fff',
    paddingBottom: 25,
    paddingLeft: 25,
    paddingRight: 25,
    gap: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F2F7',
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#F3F2F7', // Default border color
    width: '70%',
    height: 45,
    color: '#6D7D93',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
  searchFocused: {
    borderColor: '#FF8800', // Highlighted border when focused
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  FilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    gap: 8,
    height: 45,
    borderWidth: 1,
    borderColor: '#00218F47',
    paddingLeft: 15,
    paddingRight: 15,
    width: '30%',
  },
  FilterBtnTxt: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30,
  },

  container: {
    backgroundColor: '#F5F5F5',
    paddingTop: 10,
    flex: 1,
  },
  tabButton: {
    borderRadius: 50,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    paddingHorizontal: 15,
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
