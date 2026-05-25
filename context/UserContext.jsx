import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
   const [userType, setuserType] = useState(null); 
  const [isActiveDocAcc, setIsActiveDocAcc] = useState(false);
  const [searchValuesContext, setSearchValuesContext] = useState(null);
  const [cookiesValue, setCookiesValue] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [seletedJobId, setseletedJobId] = useState();
const [seletedJobDetails, setseletedJobDetails] = useState();
const [scheduleConditions, setScheduleConditions] = useState();
const [SelectedSection, setSelectedSection] = useState();
const [sectionDetails, setsectionDetails] = useState();
const [sectionItems,setsectionItems] = useState();
const [keylist,setKeylist] =useState([]);
const [keysData, setKeysData] =useState();
const [alarmsData, setAlarmsData] = useState();
const [metersData, setMetersData] = useState();
const [meterlist, setMeterlist] = useState([]);
  const [address, setAddress] = useState('Fetching location...');
    const [recordingPath, setRecordingPath] = useState(null);
const [alarmlist, setAlarmlist] = useState([]);

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('flpLoginInfo');
        const storedSearchValues = await AsyncStorage.getItem('tabibookHomeSearchValue');
        
        if (storedUserData) {
          //alert(JSON.stringify(storedUserData));
          setUserData(JSON.parse(storedUserData));
        }
        if (storedSearchValues) {
          setSearchValuesContext(JSON.parse(storedSearchValues));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to AsyncStorage when changes are made
  useEffect(() => {
    const saveData = async () => {
      try {
        if (userData) {
          await AsyncStorage.setItem('flpLoginInfo', JSON.stringify(userData));
        }
        if (searchValuesContext) {
          await AsyncStorage.setItem('tabibookHomeSearchValue', JSON.stringify(searchValuesContext));
        }
      } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
      }
    };

    saveData();
  }, [userData, searchValuesContext]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userType,
        setuserType,
        seletedJobId,
        setseletedJobId,
        seletedJobDetails,
        setseletedJobDetails,
        userData,
        setUserData,
        scheduleConditions,
        setScheduleConditions,
        recordingPath,
        setRecordingPath,
        isActiveDocAcc,
        setIsActiveDocAcc,
        searchValuesContext,
        setSearchValuesContext,
        cookiesValue,
        setCookiesValue,
        address,
        setAddress,
        SelectedSection, 
        setSelectedSection,
        sectionDetails,
        setsectionDetails,
        sectionItems,
        setsectionItems,
        keylist,setKeylist,
        keysData,setKeysData,
        alarmlist, setAlarmlist,
        alarmsData, setAlarmsData,
        metersData, setMetersData,
        meterlist, setMeterlist
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  return useContext(UserContext);
}
