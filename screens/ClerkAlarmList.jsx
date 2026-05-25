import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Arrow from 'react-native-vector-icons/Ionicons';
import ItemIcon4 from '../assets/images/ItemIcon4.svg';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import { useUserContext } from '../context/UserContext';
import { AlarmListByInventoryIdApi } from '../services/apiService';

const items = [
  {
    id: 1,
    icon: <ItemIcon4 width={24} height={24} />,
    text: 'Carbon Monoxide Alarm',
    screen: 'ClerkAddAlarm',
  },
];

const ClerkAlarmList = ({navigation}) => {
const { userData, setIsLoggedIn, seletedJobId,alarmlist,setAlarmlist} = useUserContext();
const [screenLoading, setScreenLoading] = useState(false);


   const getsetAlarmList= async () => {
  try {
    setScreenLoading(true);
     let fd = new FormData();
     fd.append("inventory_id",seletedJobId);
    let response = await AlarmListByInventoryIdApi(fd);
   
    setAlarmlist(response?.data?.data); 
    console.log('alarm List Response:', alarmlist);
    setScreenLoading(false);
  } catch (error) {
        setScreenLoading(false);
    console.log(JSON.stringify(error));

 
        //alert(JSON.stringify(error));

            Toast.show(error.response?.data?.errors || 'Something went wrong, please try again.');

    //throw error.response?.data || 'Failed to fetch inventory list';
  }
};

  useEffect(() => {
    getsetAlarmList();
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 200, // Staggered effect
        useNativeDriver: true,
      }).start();
    });
  }, []);








  const fadeAnims = useRef(items.map(() => new Animated.Value(0))).current; // Create an array of Animated values

  useEffect(() => {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 200, // Staggered effect
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('ClerkInspection')}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Alarms</Text>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.List}>
            {Array.isArray(alarmlist) && alarmlist?.map((item, index) => (
              <Animated.View key={item.id} style={{opacity: fadeAnims[index]}}>
                <TouchableOpacity
                  style={styles.ListItem}
                  onPress={() => {                    
                    navigation.navigate('ClerkAddAlarm', {
                      alarmData: item,
                      mode: 'edit'
                    });
                  }}>
                  <View style={styles.ListItemInner}>
                    <ItemIcon4 width={24} height={24} />
                    <Text style={styles.ListItemTxt}>{item.alarm_title}</Text>
                  </View>
                  <Arrow
                    name="chevron-forward-outline"
                    size={28}
                    color="#393D47"
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}

            <TouchableOpacity
              style={styles.NextBtn}
              onPress={() => navigation.navigate('ClerkAddAlarm', {alarmData: '', mode: 'add',
               })}>
              <Text style={styles.NextBtnTxt}>
                {alarmlist?.length > 0 ? 'Add Another Alarm' : 'Add Your First Alarm'}    
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClerkAlarmList;

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
    backgroundColor: '#f1f2f6',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 20,
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
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    marginTop: 15,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#000000',
  },
  NextBtnTxt: {
    color: '#393D47',
    fontSize: 18,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '40',
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
  ListItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ListItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  ListItemTxt: {
    color: '#393D47',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
});
