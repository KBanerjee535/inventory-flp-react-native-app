import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import {getInventoryListByClerkIdApi} from '../services/apiService';

// Format date as DD/MM/YYYY (same helper used in DashboardScreen)
const formatDate = dateString => {
  if (!dateString) return 'N/A'; // Handle missing dates
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid dates
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Convert 24h time (HH:MM) to 12h am/pm format (same helper used in DashboardScreen)
const convertToAmPm = time24 => {
  if (!time24 || typeof time24 !== 'string') {
    return 'Invalid time format';
  }

  const [hour, minute] = time24.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
};

// Resolve property name whether property_details is an object or an array
const getPropertyName = item => {
  const propertyDetails = item?.property_details;
  const details = Array.isArray(propertyDetails)
    ? propertyDetails?.[0]
    : propertyDetails;
  return details?.address_1 || details?.name || 'N/A';
};

// Keep only snagging reports — the clerk list API returns every report type
const isSnaggingReport = item =>
  (item?.report_type || '').toLowerCase().includes('snag');

// Status colors mapped from the API report_type values
const getStatusColor = status => {
  const value = (status || '').toLowerCase().replace(/[\s_]+/g, '-');
  switch (value) {
    case 'check-in':
      return '#00BFFF'; // Sky Blue
    case 'check-out':
      return '#0000FF'; // Blue
    case 'snagging':
      return '#FF7C5E'; // Orange
    case 'mid-term':
    case 'midterm':
      return '#FFD700'; // Yellow
    default:
      return '#666666'; // Default grey for unknown statuses
  }
};

const SnaggingAssignedTasks = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refetch the snagging list every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const getSnaggingListByClerkId = async () => {
        try {
          setIsLoading(true);
          const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
          const values = {
            date_from: today,
            date_to: today,
          };

          const response = await getInventoryListByClerkIdApi(values);

          console.log(JSON.stringify(response.data.data));
          // The clerk list API returns every report type; snagging tabs
          // should only display snagging reports
          setTasks((response.data?.data ?? []).filter(isSnaggingReport));
          setIsLoading(false);
        } catch (error) {
          setTasks([]);
          setIsLoading(false);
          Toast.show(
            error.response?.data?.errors ||
              'Something went wrong, please try again.',
          );
        }
      };
      getSnaggingListByClerkId();
    }, []),
  );

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
          onPress={() =>
            navigation.navigate('SnaggingTasksDetails', {
              inventory_id: item?.inventory_id, // Pass the tapped inventory id
              inventoryDetails: item, // Pass the tapped inventory item details
            })
          }>
          <View style={styles.taskCardLft}>
            <Text style={styles.taskName}>{getPropertyName(item)}</Text>
            {/* Status Indicator */}
            <View style={styles.indicator}>
              <View
                style={[
                  styles.statusIndicator,
                  {backgroundColor: getStatusColor(item?.report_type)},
                ]}
              />
              <Text style={styles.indicatorTxt}>
                {item?.report_type ?? 'N/A'}
              </Text>
            </View>

            {/* Date & Time */}
            <View style={styles.taskDetails}>
              <View style={styles.dateBox}>
                <Ionicons name="calendar-outline" size={20} color="#393D47" />
                <Text style={styles.dateText}>
                  {formatDate(item?.created_at)}
                </Text>
              </View>
              <View style={styles.timeBox}>
                <Ionicons name="time-outline" size={20} color="#2D7C0B" />
                <Text style={styles.timeText}>
                  {convertToAmPm(item?.created_date_time)} -{' '}
                  {convertToAmPm(item?.schedule_date_time)}
                </Text>
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
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item, index) =>
            item?.inventory_id?.toString() ?? index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.noDataText}>
              No inventory found for the selected date.
            </Text>
          }
        />
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});
