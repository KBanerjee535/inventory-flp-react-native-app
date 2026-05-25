import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  'Check-in': '#00BFFF', // Sky Blue
  'Check-out': '#0000FF', // Blue
  Snagging: '#FF7C5E', // Orange
  'Mid-term': '#FFD700', // Yellow
};

const PendingFeedbackRequests = ({navigation,inventoryList}) => {
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
            <Text style={styles.taskName}>{item?.property_details[0]?.name}, {item?.property_details[0]?.address_1}</Text>
            {/* Status Indicator */}
            <View style={styles.indicator}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: statusColors[item.report_type]},
                ]}
              />
              <Text style={styles.indicatorTxt}>{item.report_type}</Text>
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
    <View style={styles.container}>
      <FlatList
        data={inventoryList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default PendingFeedbackRequests;

const styles = StyleSheet.create({
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
