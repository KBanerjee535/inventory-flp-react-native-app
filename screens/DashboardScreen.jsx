import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Linking,
  ActivityIndicator
} from 'react-native'; 
import Modal from 'react-native-modal';

import NotificationBell from '../assets/images/bell-icon.svg';
import CloseIcon from '../assets/images/BlackCross.svg';
import Docfile from '../assets/images/Docfile.svg';
import Jpgfile from '../assets/images/Jpgfile.svg';
import Docxfile from '../assets/images/Docxfile.svg';
import Jpgefile from '../assets/images/Jpgefile.svg';
import Pngfile from '../assets/images/Pngfile.svg';
import NoData from '../assets/images/no-data.png';
import Pdffile from '../assets/images/Pdffile.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { getInventoryListByClerkIdApi, getInventoryDetailsApi ,CreatetAcceptRejectApi} from '../services/apiService';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { format } from 'date-fns';


const getNext7Days = startDate => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    let date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push({
      date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
      dayName: date.toLocaleDateString('en-US', {weekday: 'short'}), // Mon, Tue, etc.
      dayNumber: date.getDate(), // 1, 2, 3...
    });
  }
  return days;
};
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle missing dates
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const DashboardScreen = ({navigation}) => {
  // State to track the selected (active) item
  const [today, setToday]= useState(new Date());
  const [dates, setDates] = useState(getNext7Days(today));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dates[0].date);
  const [inventoryList, setInventoryList] = useState();
  const [inventoryDetailsList, setInventoryDetailsList] = useState();
  const { setUserData, setIsLoggedIn, seletedJobId,setseletedJobId, setseletedJobDetails, setCategorizedNotes } = useUserContext();
  const [screenLoading, setScreenLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Function to get dynamic styles for different colors
  const getColorClass = color => {
    switch (color) {
      case 'red':
        return styles.redBox;
      case 'blue':
        return styles.blueBox;
      case 'purple':
        return styles.purpleBox;
      case 'orange':
        return styles.orangeBox;
      case 'green':
        return styles.greenBox;
      default:
        return styles.defaultBox;
    }
  };


 const getInventoryListByClerkId= async (seleteddate) => {
  setSelectedDate(seleteddate);
  setToday(new Date(seleteddate));
 //alert(seletedJobId)
  try {


    
        setScreenLoading(true);

    //  let fd = new FormData();
    //  fd.append("assign_date", seleteddate);
    const values = {
      date_from: seleteddate,
      date_to: seleteddate
    };
    
    let response = await getInventoryListByClerkIdApi(values);

  console.log(JSON.stringify(response.data.data));
  setInventoryList(response.data.data);
      setScreenLoading(false);

  } catch (error) {
      setInventoryList();
    setScreenLoading(false);

            Toast.show(error.response?.data?.errors || 'Something went wrong, please try again.');

    //throw error.response?.data || 'Failed to fetch inventory list';
  }
};




const GoToClerkInspection = async()=>{
setseletedJobDetails(inventoryDetailsList[0]);
  navigation.navigate('ClerkInspection')
}

 const getInventryDetails= async (id) => {
  try {
    setScreenLoading(true);
     let fd = new FormData();
     fd.append("inventory_id", id);
//alert(id)

    setseletedJobId(id);
    let response = await getInventoryDetailsApi(fd);
//alert(JSON.stringify(response));
  setInventoryDetailsList(response.data.data);
      

     if (response.data.status) {
      setModalVisible(true);
      setScreenLoading(false);
     }

  } catch (error) {
 Toast.show(error.response?.data?.errors || 'Something went wrong, please try again.');

    //throw error.response?.data || 'Failed to fetch inventory list';
  }
};
const convertToAmPm = (time24) => {
  if (!time24 || typeof time24 !== 'string') {
    return "Invalid time format";
  }

  const [hour, minute] = time24.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
};


 const acceptRejectJob= async (clerk_status) => {
  
  try {
     let fd = new FormData();
     fd.append("clerk_status", clerk_status);
     fd.append("inventory_id",seletedJobId);
    // alert(JSON.stringify(fd));
    let response = await CreatetAcceptRejectApi(fd);

    getInventryDetails(seletedJobId);

  } catch (error) {
            Toast.show(error.response?.data?.errors || 'Something went wrong, please try again.');

    //throw error.response?.data || 'Failed to fetch inventory list';
  }
};

 useEffect(() => {
    getInventoryListByClerkId(dates[0].date);
    setCategorizedNotes(null);
  }, []);
  // Timeline Item Component
  const TimelineItem = ({item, index, timelineData}) => {
  const [eventBoxHeight, setEventBoxHeight] = useState(40);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{convertToAmPm(item.created_date_time)}</Text>
        {index !== timelineData.length - 1 && (
          <View
            style={[
              styles.verticalLine,
              {backgroundColor: '#cbeffa', height: eventBoxHeight},
            ]}
          />
        )}
      </View>

      {/* Wrap content in a plain View that measures layout, NOT the touchable itself */}
      <View
        onLayout={event => {
          const height = event.nativeEvent.layout.height;
          if (height !== eventBoxHeight) {
            setEventBoxHeight(height);
          }
        }}
        style={[
            styles.eventBox,
            {
              backgroundColor: '#cbeffa',
              borderLeftColor: '#3CC6ED',
              width: '70%',
            },
          ]}
      >
        <TouchableOpacity
          
          onPress={() => getInventryDetails(item.inventory_id.toString())}>
          <Text style={[styles.eventTime, {color: '#0E6781'}]}>
            {convertToAmPm(item.created_date_time)} - {convertToAmPm(item.schedule_date_time)}
          </Text>
          <Text style={[styles.eventTitle, {color: '#0E6781'}]}>
            {item.property_details.address_1}
          </Text>
          <Text style={[styles.eventDescription, {color: '#0E6781'}]}>
            ({item.report_type})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

  // Document Item Component
  const DocumentItem = ({item}) => (
    <View style={styles.documentItem}>
      <View style={styles.card}>
        <Image source={fileIcons[item.type]} style={styles.documentIcon} />
      </View>
      <Text style={styles.fileName}>{item.name}</Text>
    </View>
  );

  

  const loadMoreDates = () => {
    let lastDate = new Date(dates[dates.length - 1].date);
    lastDate.setDate(lastDate.getDate() + 1); // Start from the next day
    setDates([...dates, ...getNext7Days(lastDate)]);
  };

  

useEffect(() => {
  if (modalVisible) {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    return () => clearTimeout(timer);
  } else {
    setShowContent(false);
  }
}, [modalVisible]);

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.Body}>
        <View style={styles.DashboardTop}>
          <View>
            {today.toDateString() === new Date().toDateString() && (
               <Text style={styles.dayTextUp}>Today</Text>
             )}
            <Text style={styles.timeTextUp}>
              {' '}
              {today.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.NotificationBox}>
            <NotificationBell
              width={35}
              height={35}
              style={styles.notificationBox}
            />
            <View style={styles.iconBadge}></View>
          </View>
        </View>

        <View style={styles.calDateList}>
          <FlatList
            data={dates}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.date}
            onEndReached={loadMoreDates} // Load more dates when reaching end
            onEndReachedThreshold={0.5}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.dateTab,
                  selectedDate === item.date && styles.selectedTab,
                ]}
                onPress={() => getInventoryListByClerkId(item.date)}>
                <Text
                  style={[
                    styles.dayText,
                    selectedDate === item.date && styles.selectedDayText,
                  ]}>
                  {item.dayName}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    selectedDate === item.date && styles.selectedDayText,
                  ]}>
                  {item.dayNumber}
                </Text>
              </TouchableOpacity>
            )}
          />
                   {screenLoading ? <ActivityIndicator size="large" color="#0000ff" />:''}

        </View>



        {inventoryList?.length === 0 && <Text style={{
textAlign: 'center', marginTop: 20, fontSize: 16, color: '#555'
        }}>No inventory found for the selected date.</Text>}
     { inventoryList ? <FlatList
          data={inventoryList}
          keyExtractor={item => item.inventory_id.toString()}
          renderItem={({item, index}) => (
            <TimelineItem
              item={item}
              index={index}
              timelineData={inventoryList}
            />
          )}
          contentContainerStyle={styles.Timelinecontent}
          showsVerticalScrollIndicator={false}
        />:
       ''}

      </View>
 
      {/* Modal for Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <CloseIcon width={30} height={30} />
            </TouchableOpacity>

          { showContent && (
            <ScrollView key={modalVisible ? 'open' : 'closed'}
            style={styles.ModalScrollContainer}
            contentContainerStyle={{
    paddingHorizontal: 20,
    paddingTop: 10,
    flexGrow: 1,
  }}
  nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
              <View style={styles.TopPart}>
                <Text style={styles.HeaderLftTxt}>{inventoryDetailsList?.property?.name || 'N/A'}</Text>
                <View style={styles.indicator}>
                  {inventoryDetailsList?.report_type=='check-in'&&
                  <>
                  <View style={[styles.statusindicator, styles.checkIn]}></View>
                  <Text style={styles.indicatorTxt}>Check In</Text>
                  </>
                }{inventoryDetailsList?.report_type=='check-out'&&
                  <>
                  <View style={[styles.statusindicator, styles.checkOut]}></View>
                  <Text style={styles.indicatorTxt}>Check-out</Text>
                  </>
                }{inventoryDetailsList?.report_type=='mid-term'&&
                  <>
                  <View style={[styles.statusindicator, styles.midterm]}></View>
                  <Text style={styles.indicatorTxt}>Mid-term</Text>
                  </>
                }
                </View>
                <View style={styles.timeBox}>
                  <Ionicons name="time-outline" size={20} color="#2D7C0B" />
                  <Text style={styles.timeTextpopup}>{convertToAmPm(inventoryDetailsList?.schedule_start_time)} to {convertToAmPm(inventoryDetailsList?.schedule_end_time)}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitel}>Task info</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Property Name</Text>
                  <Text style={styles.info}>{inventoryDetailsList?.property_type_name || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Task Status</Text>
                  <View style={styles.info}>
                  {/* {inventoryDetailsList?.status=='1'&&  <Text style={styles.AssignedStyle}>Assigned</Text>}
                  {inventoryDetailsList?.status=='2'&&  <Text style={styles.AssignedStyle}>Assigned</Text>}
                  {inventoryDetailsList?.status=='3'&&  <Text style={styles.AssignedStyle}>Assigned</Text>} */}
                  <Text style={styles.AssignedStyle}>{inventoryDetailsList?.status || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Assigner</Text>
                  <Text style={styles.info}>{inventoryDetailsList?.created_by.first_name || 'N/A'} {inventoryDetailsList?.created_by.last_name || ''}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Created on</Text>
                  <Text style={styles.info}>{formatDate(new Date(inventoryDetailsList?.created_at), "dd/MM/yyyy")}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Report Type</Text>
                  <View style={styles.infoindicator}>
                   {inventoryDetailsList?.report_type=='check-in'&&
                  <>
                  <View style={[styles.statusindicator, styles.checkIn]}></View>
                  <Text style={styles.indicatorTxt}>Check In</Text>
                  
                  </>
                }{inventoryDetailsList?.report_type=='check-out'&&
                  <>
                  <View style={[styles.statusindicator, styles.checkOut]}></View>
                  <Text style={styles.indicatorTxt}>Check-out</Text>
                  
                  </>
                }{inventoryDetailsList?.report_type=='mid-term'&&
                  <>
                  <View style={[styles.statusindicator, styles.midterm]}></View>
                  <Text style={styles.indicatorTxt}>Mid-term</Text>
                  
                  </>
                }
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Client Name</Text>
                  <Text style={styles.info}>{inventoryDetailsList?.client.first_name || 'N/A'} {inventoryDetailsList?.client.last_name || ''}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Client Approval</Text>
                  <View style={styles.info}>
                <Text style={styles.AssignedStyle}>{inventoryDetailsList?.client_status || 'N/A'}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Tenant</Text>
                  <Text style={styles.info}>{inventoryDetailsList?.tenant !== null ? inventoryDetailsList?.tenant_name : "N/A"}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Tenant Status</Text>
                  <Text style={styles.info}>{inventoryDetailsList?.tenant_status !== null ? inventoryDetailsList?.tenant_status : "N/A"}</Text>
                </View>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitel}>Property Details</Text>

                <View style={styles.row}>
                  <Text style={styles.label}>Property Address</Text>
                  <Text style={styles.info}>
                    {inventoryDetailsList?.property?.address_1 || 'N/A'}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Property Address 2</Text>
                  <Text style={styles.info}>
                   {inventoryDetailsList?.property?.address_2 || 'N/A'}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Property Type</Text>
                  <Text style={styles.info}>{inventoryDetailsList?.property_type_name || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Post Code</Text>
                  <Text style={[styles.info, styles.bold]}>{inventoryDetailsList?.property?.postal_code || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitel}>Assignee</Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Clerk Name</Text>
                  <Text style={styles.info}>{inventoryDetailsList?.clerk_name || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Clerk Status</Text>
                  <View style={styles.info}>
                   {/* {inventoryDetailsList?.clerk_status=='1' && <Text style={styles.AssignedStyle}>{inventoryDetailsList?.clerk_status}</Text>}
                  {inventoryDetailsList?.clerk_status=='2' && <Text style={styles.AssignedStyle}>Accepted</Text>}
                   {inventoryDetailsList?.clerk_status=='3' && <Text style={styles.PendingStyle}>Rejected</Text>} */}
                   <Text style={styles.AssignedStyle}>{inventoryDetailsList?.clerk_status || 'N/A'}</Text>

                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Editor Name</Text>
                  <Text style={[styles.info, styles.bold]}>{inventoryDetailsList?.editor_name || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Editor Status</Text>
                  <View style={styles.info}>
                  {/* {inventoryDetailsList?.editor_status=='1' &&   <Text style={styles.AssignedStyle}>Assigned</Text>}
                 {inventoryDetailsList?.editor_status=='2' &&   <Text style={styles.AssignedStyle}>Edited</Text>}
                  {inventoryDetailsList?.editor_status=='3' &&   <Text style={styles.AssignedStyle}>ReEdited</Text>} */}
                  <Text style={styles.AssignedStyle}>{inventoryDetailsList?.editor_status || 'N/A'}</Text>
                  </View>
                </View>
                {/* <View style={styles.row}>
                  <Text style={styles.label}>Editor’s Task Deadline</Text>
                  <Text style={[styles.info, styles.bold]}>{ formatDate(new Date(inventoryDetailsList?.editor_task_deadline), "dd/MM/yyyy")}</Text>
                </View> */}
                <View style={styles.row}>
                  <Text style={styles.label}>Prop. Manager</Text>
                  <Text style={[styles.info, styles.bold]}>{inventoryDetailsList?.property_manager.first_name || 'N/A'} {inventoryDetailsList?.property_manager.last_name || ''}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Prop. Manager Status</Text>
                  <View style={styles.info}>
                <Text style={styles.AssignedStyle}>{inventoryDetailsList?.property_manager_status || 'N/A'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitel}>Supporting Documents</Text>

                <View style={styles.sectionDoc}>
                  
          {inventoryDetailsList?.files?.length ? inventoryDetailsList?.files?.map((doc) => {
  const filePath = doc.file_with_path;
  
  // Function to get the file extension
  const getFileExtension = (filePath) => {
    return filePath?.split('.').pop().toLowerCase(); // Get the extension and convert to lowercase
  };

  const fileExtension = getFileExtension(filePath);
  // Render different components based on file extension
  const renderFileComponent = () => {
    switch (fileExtension) {
      case 'pdf':
        return <Pdffile />;
      case 'jpg':
      return <Jpgfile />;
      case 'jpeg':
      return <Jpgefile />;
      case 'png':
        return <Pngfile />;
      case 'doc':
      return <Docfile />;
      case 'docx':
        return <Docxfile />;
      default:
        return <Text>Unsupported file type</Text>; // For unsupported files
    }
  };
// Extract the file name without extension
  const fileNameWithExt = filePath.split('/').pop();

  // Split the file name and extension
  const [fileName, extension] = fileNameWithExt.split('.');

  // Truncate the file name if it's longer than 7 characters and keep the extension
  const truncatedFileName = fileName.length > 7 ? fileName.slice(0, 7) + '...' : fileName;

    // Function to handle file download or open in browser
  const handleDownload = async () => {
    try {
  
        await Linking.openURL(filePath); // Open the URL (download or view in browser)
    
    } catch (error) {
      console.error('Error opening file: ', error);
    }
  };

  return (
    <View style={styles.DocinfoBox} key={doc.id}>
     <TouchableOpacity onPress={handleDownload}>
      <View style={styles.DocinfoImg}>
        {renderFileComponent()} {/* Dynamically render based on file type */}
      </View>

      <Text style={styles.DocinfoTxt} 
       >{truncatedFileName}.{extension} </Text> {/* Display file name */}
     </TouchableOpacity>
    </View>
  );
}) : <Text style={{ fontSize: 14, color: '#333' }}>No supporting document found.</Text>}
               
                </View>
              </View>

              <View style={styles.BtnGrp}>
              {inventoryDetailsList?.clerk_status=='assigned'&&  <TouchableOpacity
                  style={styles.NextBtn}
                  onPress={() => GoToClerkInspection()}>
                  <Text style={styles.NextBtnTxt}>Start Inspection</Text>
                </TouchableOpacity>
}
              </View>
              {inventoryDetailsList?.clerk_status=='pending' && 
<View style={styles.BtnGrp}>
            <TouchableOpacity
                  style={styles.NextBtn}
                  onPress={() => acceptRejectJob('2')}>
                  <Text style={styles.NextBtnTxt}>Accept</Text>
                </TouchableOpacity>

<TouchableOpacity
style={styles.ForgetBtn}
onPress={() => acceptRejectJob('3')}>
<Text style={styles.ForgetBtnTxt}>Decline</Text>
</TouchableOpacity>
                </View>
                
              }
            </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  Body: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },

  DashboardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
  },
  dayTextUp: {
    color: '#525050',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 2,
  },
  timeTextUp: {
    color: '#151313',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 19,
    fontWeight: 500,
  },
  notificationBox: {
    height: 35,
    position: 'relative',
    width: 35,
  },

  text: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14, // Adjust font size for the small width
    fontWeight: '400',
  },
  dayText: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14, // Adjust font size for the small width
    marginTop: 4,
    fontWeight: 'normal',
  },
  dotBadge: {
    backgroundColor: '#FF8800',
    borderRadius: 3, // Make it a circle
    bottom: 7,
    height: 6,
    left: '50%',
    marginLeft: -3,
    position: 'absolute',
    width: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingRight: 15
  },
  timeContainer: {
    alignItems: 'center',
    width: 100,
  },
  timeText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: '#393D47',
  },
  verticalLine: {
    width: 3,
    marginTop: 5,
  },
  eventBox: {
    width: '70%',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
  },

  tabButton: {
    borderRadius: 50,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },

  tabText: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 35,
  },
  activeTabText: {
    color: '#fff',
  },

  todayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  dateTab: {
    backgroundColor: '#FFBB6D',
    borderRadius: 25,
    marginHorizontal: 5,
    height: 80,
    alignItems: 'center',
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  selectedTab: {
    backgroundColor: '#FF8800',
  },

  dayText: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    marginTop: 4,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  selectedDayText: {
    color: '#fff',
  },
  dayNumber: {
    color: '#fff',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  selectedDateBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calBody: {},
  calDateList: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 15,
  },
  Timelinecontent: {
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  iconBadge: {
    backgroundColor: '#9C0101',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: '100%',
    height: 16,
    position: 'absolute',
    right: 3,
    top: 0,
    width: 16,
  },

  /* Modal Styles */
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    // flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '95%',
    paddingTop: 20,
    paddingBottom: 20,
    // justifyContent: 'flex-end',
  },
  closeButton: {
    alignSelf: 'flex-end',
    cursor: 'pointer',
    marginRight: 10,
    marginBottom: 15,
  },

  ModalScrollContainer: {
    // backgroundColor: '#fff',
    // paddingLeft: 20,
    paddingTop: 10,
    // paddingRight: 20,
    paddingBottom: 20,
    width: '100%',
    // height: '100%',
    // flex: 1
  },
  title: {
    color: '#000',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 30,
    marginBottom: 10,
    fontWeight: '600',
  },
  subText: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 30,
    fontWeight: '400',
  },

  NextBtn: {
    backgroundColor: '#393D47',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
  },
  NextBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
  StartBtn: {
    backgroundColor: '#393D47',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    marginBottom: 15,
  },
  StartBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
  ForgetBtn: {
    width: '100%',
    marginTop: 15,
    lineHeight: 50,
    textAlign: 'center',
    height: 50,
    backgroundColor:'#ffb850'
  },
  ForgetBtnTxt: {
    color: '#f00',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 50,
  },

  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusindicator: {
    width: 12,
    height: 12,
    borderRadius: '100%',
  },
  checkIn: {
    backgroundColor: '#3CC6ED',
  },
    checkOut: {
    backgroundColor: '#4561aa',
  },
      midterm: {
    backgroundColor: '#ffb850',
  },
  Snagging: {
    backgroundColor: '#FF7C5E',
  },
  indicatorTxt: {
    color: '#393D47',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
  HeaderLftTxt: {
    color: '#151313',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 10,
  },
  TopPart: {
    textAlign: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 15,
    color: '#717171',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
    width: '50%',
  },
  info: {
    fontSize: 15,
    color: '#151313',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
    width: '50%',
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  sectionTitel: {
    marginBottom: 15,
    fontSize: 14,
    color: '#525050',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
  },
  AssignedStyle: {
    color: '#2D7C0B',
    backgroundColor: '#E3FCD9',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },

  PendingStyle: {
    color: '#D06100',
    backgroundColor: '#FFEFD3',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  ActionPendingStyle: {
    color: '#0561AC',
    backgroundColor: '#D8EDFF',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  AcceptedStyle: {
    color: '#0561AC',
    backgroundColor: '#D8EDFF',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },

  infoindicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infostatusindicator: {
    width: 10,
    height: 10,
    borderRadius: '100%',
  },
  infoindicatorTxt: {
    fontSize: 15,
    color: '#151313',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
  },
  bold: {
    color: '#434854',
    fontWeight: 600,
    fontFamily: 'BeVietnamPro-SemiBold',
  },
  sectionDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 15,
  },

  DocinfoBox: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: 10,
  },
  DocinfoImg: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    padding: 18,
    borderRadius: 8,
  },
  DocinfoTxt: {
    color: '#434854',
    fontWeight: 600,
    fontFamily: 'BeVietnamPro-SemiBold',
  },
  BtnGrp: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  frmBox: {
    width: '100%',
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
    marginBottom: 20,
    marginTop: 10,
  },
  timeTextpopup: {
    fontSize: 14,
    color: '#2D7C0B',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: 400,
  },
  NoContainer: {
    width: '100%',
    padding: 25,
    paddingTop: 100,
  },
  name: {
    fontSize: 20,
    fontWeight: 500,
    color: '#000',
    fontFamily: 'BeVietnamPro-Medium',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20,
  },
  IconImg: {
    margin: 'auto',
  }, 
});
