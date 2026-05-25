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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SearchIcon from '../assets/images/SearchIcon.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import SnaggingAssignedTasks from '../components/SnaggingAssignedTasks';
import SnaggingUpcomingTasks from '../components/SnaggingUpcomingTasks';
import SnagginCompletedTasks from '../components/SnagginCompletedTasks';
import SnaggingWaitingApproval from '../components/SnaggingWaitingApproval';
import SnaggingApprovedTasks from '../components/SnaggingApprovedTasks';

// Tabs data
const tabLabels = [
  'Assigned New Tasks',
  'Upcoming Tasks',
  'Completed Tasks',
  'Waiting for Approval',
  'Approved',
];

const SnaggingScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Default to first tab

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
              <SnaggingAssignedTasks navigation={navigation} />
            ) : activeTab === 1 ? (
              <SnaggingUpcomingTasks navigation={navigation} />
            ) : activeTab === 2 ? (
              <SnagginCompletedTasks navigation={navigation} />
            ) : activeTab === 3 ? (
              <SnaggingWaitingApproval navigation={navigation} />
            ) : activeTab === 4 ? (
              <SnaggingApprovedTasks navigation={navigation} />
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SnaggingScreen;

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
