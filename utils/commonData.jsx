import moment from 'moment';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from 'react-native-cookies';
import { useEffect } from 'react';

// Logout function
export const onLogout = async (value) => {
  try {
    await AsyncStorage.removeItem('tabsbookLoginInfo');
    await AsyncStorage.removeItem('isAciveDoctorAcc');
    await CookieManager.clearAll(); // Clears all cookies in React Native

    if (value !== 'notshow') {
      Toast.show({
        type: 'success',
        text1: 'Logout successfully',
        visibilityTime: 1500,
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Get Login Details
export const logInDetails = async () => {
  try {
    const value = await AsyncStorage.getItem('tabsbookLoginInfo');
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting login details:', error);
    return null;
  }
};

// Check if the date is a previous date from the current date
export const isPreviousDateFromCurrent = (date) => {
  const inputDate = date || moment().format('YYYY-MM-DD');
  const isPast = moment(inputDate).isBefore(moment(), 'day');
  return isPast;
};

// Format chat message date
export const chatMessgaeDateFormat = (date) => {
  const itemDate = moment(date);
  const currentDate = moment();
  const isToday = itemDate.isSame(currentDate, 'day');
  const displayDate = isToday ? `Today at ${itemDate.format('HH:mm')}` : itemDate.format('ddd D, YYYY');
  return displayDate;
};

// Get file extension from the file name
export const getFileExtension = (fileName) => {
  return fileName.split('.').pop(); // Gets the last part after the last dot
};

// Format date in "Day, Date, Year" format
export const formatDateInDayDateYear = (date) => {
  const itemDate = moment(date);
  const displayDate = itemDate.format('ddd D, YYYY');
  return displayDate;
};

// Calculate the difference in days from the given date
export const daysDifferenceFunction = (fromDate) => {
  const createdDate = moment(fromDate);
  const currentDate = moment();
  const daysDifference = currentDate.diff(createdDate, 'days');
  return daysDifference;
};

// Custom hook to handle clicks outside of a component (similar to React's useEffect with refs)
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return; // Click is inside the element, do nothing.
      }
      handler(); // Click is outside, call the handler.
    };

    // React Native does not have a `mousedown` event, we use `TouchableWithoutFeedback` for handling touch events
    const onPressOutside = () => handler();

    // You can use TouchableWithoutFeedback or GestureResponderEvent for touch events
    return () => {
      // Clean up the event listener if needed
    };
  }, [ref, handler]);
};
