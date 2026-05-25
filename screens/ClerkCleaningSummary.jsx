import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Text,
  Animated,
  FlatList,
  PermissionsAndroid,
  Platform,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import TextIcon from '../assets/images/TextIcon.svg';
import AudioIcon from '../assets/images/AudioIcon.svg';
import Trash from 'react-native-vector-icons/Ionicons';
import Tick from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Entypo';
import {CleaningSummaryDetailsApi} from '../services/apiService';
import {CleaningSummaryUpdateTextApi, CleaningSummaryDeleteAudioByIdApi,DeleteAllImageByIdApi} from '../services/apiService';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
const audioRecorderPlayer = new AudioRecorderPlayer();
import Toast from 'react-native-simple-toast';

const ClerkCleaningSummary = ({navigation}) => {
 const [description, setDescription] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const descriptionAnim = useRef(new Animated.Value(1)).current;
 const { userData, setIsLoggedIn, seletedJobId, seletedJobDetails,setRecordingPath ,recordingPath ,setScheduleConditions,scheduleConditions} = useUserContext();
  const [screenLoading, setScreenLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const playbackListenerRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false); // NEW

  const [recordedAudios, setRecordedAudios] = useState([
    {
      id: 1,
      name: 'Schedule_of_Con.mp3',
      duration: '00:05:33',
      scaleAnim: new Animated.Value(1),
    },
  ]);

  // Handle deleting the text section with animation
 const handleDeleteText = async () => {
  try {
 setScreenLoading(true);
 let fd = new FormData();
     fd.append("cleaning_summary_id",scheduleConditions?.id);
     fd.append("description",'');

    let response = await CleaningSummaryUpdateTextApi(fd);
    if (response.status === 200) {
      Animated.timing(descriptionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsDeleted(true);
        setScheduleConditions(prev => ({ ...prev, description: null })); // Clear from state
        Toast.show('Text deleted successfully!', Toast.SHORT);
        setScreenLoading(false);
      });
    } else {
      setScreenLoading(false);
      Toast.show('Failed to delete text. Please try again.', Toast.SHORT);
    }
  } catch (error) {
    console.error('Error deleting text:', error);
    Toast.show('An error occurred. Please try again.', Toast.SHORT);
  }
};



  // Zoom-out animation for deleting images
const handleDeleteImage = async (pid) => {
    try {
      let fd = new FormData();
        fd.append("image_id",pid);
//alert(JSON.stringify(fd))
    let response = await DeleteAllImageByIdApi(fd);
//alert(JSON.stringify(response));
        
        getCleaningSummaryDetail();
                // Remove from local state after successful delete
      
    } catch (error) {
     alert();
    
    }
  
};



const deleteAudio = async (id, scheduleConditionId) => {
  const audioToDelete = recordedAudios.find(audio => audio.id === id);
  if (!audioToDelete) return;

  try {
    setScreenLoading(true);

      // 🔹 Call API to delete audio from the backend
 let fd = new FormData();
     fd.append("cleaning_summary_id",scheduleConditions?.id);
    let response = await CleaningSummaryDeleteAudioByIdApi(fd);

      if (response.status === 200) {
         // 🔹 Animate zoom-out effect before deletion
    Animated.timing(audioToDelete.scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
       setScreenLoading(false);

        console.log('Audio deleted successfully:', response.data);
    getCleaningSummaryDetail();
        // 🔹 Remove audio from UI after successful deletion
        const updatedAudios = recordedAudios.filter(audio => audio.id !== id);
        setRecordedAudios(updatedAudios);
         });
      } else {
         setScreenLoading(false);

       // console.warn('Failed to delete audio:', response.data);
      }
   
  } catch (error) {
     setScreenLoading(false);

    console.error('Error deleting audio:', error);
  }
};
const handleEditText = async () => {

    if (!isEditing) {
    setIsEditing(true); // Start editing
    return;
  }
  if (!description.trim()) {
    Toast.show('Please enter a description.');
    return;
  }

  try {
    setScreenLoading(true);
    let fd = new FormData();
     fd.append("cleaning_summary_id",scheduleConditions?.id);
     fd.append("description",description);

    let response = await CleaningSummaryUpdateTextApi(fd);
        setIsEditing(false); // Start editing
setScreenLoading(false);
getCleaningSummaryDetail();
  } catch (error) {
    console.error('Error saving description:', error);
    Toast.show('Failed to save description. Please try again.', Toast.SHORT);
  }
};


   const getCleaningSummaryDetail= async () => {
  try {
    setScreenLoading(true);
     let fd = new FormData();
    //alert(seletedJobId);
     fd.append("inventory_id",seletedJobId);
    let response = await CleaningSummaryDetailsApi(fd);
    console.log(JSON.stringify(response.data.data[0]));
    setScheduleConditions(response.data.data[0]);
    setDescription(response.data.data[0]?.description);
    setScreenLoading(false);
  } catch (error) {
        setScreenLoading(false);

       //  alert(JSON.stringify(error));

            Toast.show(error.response?.data?.errors || 'Something went wrong, please try again.');

    //throw error.response?.data || 'Failed to fetch inventory list';
  }
};



  const stopPlayback = async () => {
  try {
    await audioRecorderPlayer.stopPlayer();
    if (playbackListenerRef.current) {
      playbackListenerRef.current.remove();
      playbackListenerRef.current = null;
    }
    setIsPlaying(false); // mark as stopped
    await new Promise(resolve => setTimeout(resolve, 300)); // optional delay
  } catch (e) {
    console.warn('stopPlayback error:', e);
  }
};

const togglePlayPause = async (id, url) => {
  if (isPlaying && playingId === id) {
    // Pause same audio
    await stopPlayback();
    setPlayingId(null);
  } else {
    if (isPlaying) {
      // Stop any currently playing audio before switching
      await stopPlayback();
    }

    try {
      const msg = await audioRecorderPlayer.startPlayer(url);
      console.log('Playback started:', msg);
      setIsPlaying(true);
      setPlayingId(id);

      playbackListenerRef.current = audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration) {
          stopPlayback();
          setPlayingId(null);
        }
      });
    } catch (err) {
      console.warn('Error starting playback:', err);
      setIsPlaying(false);
      setPlayingId(null);
    }
  }
};


 useEffect(() => {
    getCleaningSummaryDetail();
  }, []);
// 🔹 Update audio list when new API response comes in


useEffect(() => {
  if (scheduleConditions?.audio_with_paths) {
    setRecordedAudios([
      {
        id: scheduleConditions?.id,
        url: scheduleConditions?.audio_with_paths,
        name: scheduleConditions?.audio,
        duration: '00:00',
        scaleAnim: new Animated.Value(1),
      },
    ]);
  }

}, [scheduleConditions]);






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
          <Text style={styles.pagetitleTxt}>Cleaning Summary</Text>
        </View>

        <ScrollView style={styles.container}>
                                      {screenLoading ? <ActivityIndicator size="large" color="#0000ff" />:''}

          <View style={styles.BtnGap}>
        <TouchableOpacity
  style={[styles.StartBtn, (scheduleConditions?.description || scheduleConditions?.audio) ? styles.disabledBtn : {}]}
  onPress={() => 
    (scheduleConditions?.description || scheduleConditions?.audio) ? null : navigation.navigate('ClerkCleaningSummaryAddText')
  }
  disabled={!!(scheduleConditions?.description || scheduleConditions?.audio)}>
  <TextIcon />
  <Text style={styles.StartBtnTxt}>Text</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.StartBtn, (scheduleConditions?.description || scheduleConditions?.audio) ? styles.disabledBtn : {}]}
  onPress={() => 
    (scheduleConditions?.description || scheduleConditions?.audio) ? null : [navigation.navigate('ClerkCleaningSummaryAddAudio'),setRecordingPath('')]
  }
  disabled={!!(scheduleConditions?.description || scheduleConditions?.audio)}>
  <AudioIcon />
  <Text style={styles.StartBtnTxt}>Audio</Text>
</TouchableOpacity>

          </View>

         {scheduleConditions?.description&&<View style={styles.AddedInfocontainer}>
            {!isDeleted && (
              <Animated.View style={{transform: [{scale: descriptionAnim}]}}>
                <Text style={styles.descriptiontitle}>Text Description</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                ) : (
                  <Text style={styles.description}>{description}</Text>
                )}
                <View style={styles.buttonRow}>
             <TouchableOpacity
  style={styles.actionButton}
  onPress={handleEditText}>
  <Icon
    name={isEditing ? 'save' : 'edit'}
    size={18}
    color="#393D47"
  />
  <Text style={styles.buttonText}>
    {isEditing ? 'Save Text' : 'Edit Text'}
  </Text>
</TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDeleteText}>
                    <Trash name="trash-outline" size={18} color="#393D47" />
                    <Text style={styles.buttonText}>Delete Text</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

          </View>}
         <View style={styles.AddedInfocontainer}>
       <View style={styles.imageRow}>
  {scheduleConditions?.description!=''&& Array.isArray(scheduleConditions?.cleaning_summary_image)?

    scheduleConditions?.cleaning_summary_image?.map(img => (
    <Animated.View
      key={img.id}
      style={[
        styles.imageWrapper,
        img.scaleAnim && { transform: [{ scale: img.scaleAnim }] },
      ]}>
      <Image source={{ uri: img.image_with_paths }} style={styles.image} />
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeleteImage(img.id)}>
                  <Trash name="trash-outline" size={18} color="#393D47" />
      </TouchableOpacity>
    </Animated.View>
  )):''}
</View>
          </View>
          {/* Audio Section */}

            {scheduleConditions?.audio ? (
              <>
        <View style={styles.Addedaduiocontainer}>
          <Text style={styles.descriptiontitle}>Recorded Audio</Text>

          <FlatList
            data={recordedAudios}
            keyExtractor={(item) => item.id.toString()}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <Animated.View style={[styles.audioItem]}>
                <View style={styles.audioItemLft}>
                  <TouchableOpacity
                    style={styles.playIconaudio}
                    onPress={() => togglePlayPause(item.id, item.url)}
                  >
                    <Icon
                      name={playingId === item.id ? 'controller-paus' : 'controller-play'}
                      size={28}
                      color="#393D47"
                    />
                  </TouchableOpacity>

                  <View style={styles.audioinfo}>
                    <Text style={styles.audioname}>{item.name.substring(0, 20)}...</Text>
                    <Text style={styles.audioduration}>{item.duration}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => deleteAudio(item.id)}
                  style={styles.deleteIconaudio}
                >
                  <Trash name="trash-outline" size={20} color="#393D47" />
                </TouchableOpacity>
              </Animated.View>
            )}
          />
        </View>

        <View style={styles.imageRow}>
  { Array.isArray(scheduleConditions?.cleaning_summary_image) && scheduleConditions?.cleaning_summary_image?.map(img => (
    <Animated.View
      key={img.id}
      style={[
        styles.imageWrapper,
        img.scaleAnim && { transform: [{ scale: img.scaleAnim }] },
      ]}>
      <Image source={{ uri: img.image_with_paths }} style={styles.image} />
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeleteImage(img.id)}>
                  <Trash name="trash-outline" size={18} color="#393D47" />
      </TouchableOpacity>
    </Animated.View>
  ))}
</View>
          </>
      ) : null}



       
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClerkCleaningSummary;

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
    paddingTop: 40,
    paddingBottom: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  BackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 9999,
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
  },
  StartBtnTxt: {
    color: '#151313',
    fontSize: 19,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 15,
  },
  descriptiontitle: {
    fontSize: 15,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 15,
  },
  input: {
    fontSize: 14,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF8800', // Highlight border when editing
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 15,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 35,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  deleteIcon: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 20,

    width: 28,
    height: 28,
    margin: 'auto',
  },
  AddedInfocontainer: {
    width: '100%',
    paddingTop: 30,
  },
  Addedaduiocontainer: {width: '100%', paddingBottom: 40},

  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteIconaudio: {
    backgroundColor: '#FFFFFF',
    borderRadius: '100%',
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconaudio: {
    backgroundColor: '#E4E5E7',
    borderRadius: '100%',
    width: 55,
    height: 55,

    alignItems: 'center',
    justifyContent: 'center',
  },
  audioItemLft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  audioname: {
    fontSize: 17,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    marginBottom: 5,
  },
  audioduration: {
    fontSize: 14,
    color: '#727272',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
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
    disabledBtn: {
    backgroundColor: '#A9A9A9', // Greyed out
  },
});
