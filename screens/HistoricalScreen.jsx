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
import Entypo from 'react-native-vector-icons/Entypo';

const tasks = [
  {
    id: '1',
    name: 'The New Rectory',
    status: 'Check In',
  },
  {
    id: '2',
    name: '22 Albert Street',
    status: 'Check In',
  },
  {
    id: '3',
    name: 'Lendess Street Malcolm',
    status: 'Midterm',
  },
  {
    id: '4',
    name: 'Park Avenue 22/6',
    status: 'Check Out',
  },
  {
    id: '5',
    name: 'Greenwood Plaza',
    status: 'Snagging',
  },
  {
    id: '6',
    name: 'Greenwood Plaza',
    status: 'Midterm',
  },

  {
    id: '7',
    name: 'Greenwood Plaza',
    status: 'Midterm',
  },
];

// Status colors
const statusColors = {
  'Check In': '#00BFFF', // Sky Blue
  'Check Out': '#0000FF', // Blue
  Snagging: '#FF7C5E', // Orange
  Midterm: '#FFD700', // Yellow
};

const HistoricalScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const renderItem = ({item, index}) => {
    const fadeAnim = new Animated.Value(0); // Start opacity from 0

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // Staggered animation
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={[styles.taskCard, {opacity: fadeAnim}]}>
        <TouchableOpacity
          style={styles.taskCardInner}
          onPress={() => navigation.navigate('ClientTaskDetails')}>
          <View style={styles.taskCardLft}>
            <Text style={styles.taskName}>{item.name}</Text>
            {/* Status Indicator */}
            <View style={styles.indicator}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: statusColors[item.status]},
                ]}
              />
              <Text style={styles.indicatorTxt}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.taskCardRgt}>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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

        <ScrollView>
          <View style={styles.container}>
            <FlatList
              data={tasks}
              keyExtractor={item => item.id}
              nestedScrollEnabled={true}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HistoricalScreen;

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
    flex: 1, // Makes sure FlatList takes full height
    height: '100%',
    paddingBottom: 0,
  },
  listContainer: {
    paddingVertical: 10,
  },
  taskCard: {
    marginBottom: 10,
    width: '100%',
  },
  taskCardInner: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    marginHorizontal: 15,
    flexDirection: 'row',

    justifyContent: 'space-between',
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskName: {
    color: '#151313',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 100,
    marginRight: 5,
  },
  indicatorTxt: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
    color: '#151313',
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    gap: 15,
    paddingTop: 10,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#393D47',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: 400,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFFFD6',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#2D7C0B',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: 400,
  },
  taskCardRgt: {
    alignItems: 'flex-end',
  },
});
