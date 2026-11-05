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

// Resolve property name whether property_details is an object or an array
const getPropertyName = item => {
  const propertyDetails = item?.property_details;
  const details = Array.isArray(propertyDetails)
    ? propertyDetails?.[0]
    : propertyDetails;
  return details?.address_1 || details?.name || 'N/A';
};

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

const ClerkInventoryWaitingforapproval = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refetch the inventory list every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const getInventoryListByClerkId = async () => {
        try {
          setIsLoading(true);
          const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
          const values = {
            date_from: today,
            date_to: today,
          };

          const response = await getInventoryListByClerkIdApi(values);

          console.log(JSON.stringify(response.data.data));
          setTasks(response.data?.data ?? []);
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
      getInventoryListByClerkId();
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
            navigation.navigate('ClerkInventoryWaitingforApprovalTaskDetails', {
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

export default ClerkInventoryWaitingforapproval;

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
