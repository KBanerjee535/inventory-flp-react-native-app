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
    status: 'Snagging',
    date: '14/12/24',
    time: '08:15am to 08:55am',
  },
  {
    id: '2',
    name: '22 Albert Street',
    status: 'Snagging',
    date: '14/12/24',
    time: '08:15am to 08:55am',
  },
  {
    id: '3',
    name: 'Lendess Street Malcolm',
    status: 'Snagging',
    date: '14/12/24',
    time: '08:15am to 08:55am',
  },
  {
    id: '4',
    name: 'Park Avenue 22/6',
    status: 'Snagging',
    date: '14/12/24',
    time: '08:15am to 08:55am',
  },
  {
    id: '5',
    name: 'Greenwood Plaza',
    status: 'Snagging',
    date: '14/12/24',
    time: '09:00am to 09:40am',
  },
  {
    id: '6',
    name: 'Greenwood Plaza',
    status: 'Snagging',
    date: '14/12/24',
    time: '09:00am to 09:40am',
  },

  {
    id: '7',
    name: 'Greenwood Plaza',
    status: 'Snagging',
    date: '14/12/24',
    time: '09:00am to 09:40am',
  },
];

// Status colors
const statusColors = {
  'Check In': '#00BFFF', // Sky Blue
  'Check Out': '#0000FF', // Blue
  Snagging: '#FF7C5E', // Orange
  Midterm: '#FFD700', // Yellow
};

const SnaggingAssignedTasks = ({navigation}) => {
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
          onPress={() => navigation.navigate('SnaggingTasksDetails')}>
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

            {/* Date & Time */}
            <View style={styles.taskDetails}>
              <View style={styles.dateBox}>
                <Ionicons name="calendar-outline" size={20} color="#393D47" />
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View style={styles.timeBox}>
                <Ionicons name="time-outline" size={20} color="#2D7C0B" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
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
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default SnaggingAssignedTasks;

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
