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
  Alert
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import TextIcon from '../assets/images/TextIcon.svg';
import AudioIcon from '../assets/images/AudioIcon.svg';
import Trash from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-simple-toast';
import { DeleteAllImageByIdApi, KeyAddApi, KeyDeleteApi, seletedJobId,KeyDeleteAudioByIdApi, KeyDetailsByKeyIdApi, KeyUpdateApi, KeyUpdateTextByIdApi } from '../services/apiService';
import { useUserContext } from '../context/UserContext';

const ClerkAddKey = ({navigation, route}) => {
  const { keysData, setKeysData, setRecordingPath,seletedJobId,seletedJobDetails } = useUserContext();
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const descriptionAnim = useRef(new Animated.Value(1)).current;
  const [focusedInput, setFocusedInput] = useState(null);
 const [screenLoading, setScreenLoading] = useState(false);


  const { keyData, mode } = route.params || {};

  const isEditMode = mode === 'edit';
  
  const [formData, setFormData] = useState({
    inventory_id: keyData?.inventory_id || '',
    property_id: keyData?.property_id || '',
    client_id: keyData?.client_id || '',
    key_title: keyData?.key_title || '',
    number_keys: keyData?.number_keys || '',
    missing_keys: keyData?.missing_keys || '',
    audio: keyData?.audio || null,
    id: keyData?.id || null
  });

  
const [audioFile, setAudioFile] = useState(
    keyData?.audio ? {
      uri: keyData.audio_with_path,
      type: 'audio/mp3',
      name: keyData.audio
    } : null
  );

 const headerTitle = isEditMode ? 'Edit Key' : 'Add Key';

  const handleSubmit = async () => {
    
    if (!formData.key_title.trim()) {
      Toast.show('Please enter key title', Toast.SHORT);
      return;
    }
    
    if (!formData.number_keys.trim()) {
      Toast.show('Please enter number of keys', Toast.SHORT);
      return;
    }

    try {
      const fd = new FormData();

      // Append all text fields
      fd.append('inventory_id', seletedJobDetails?.id);
      fd.append('property_id', seletedJobDetails?.property_id);
      fd.append('client_id', seletedJobDetails?.client_id);
      fd.append('key_title', formData?.key_title);
      fd.append('number_keys', formData?.number_keys);
      fd.append('missing_keys', formData?.missing_keys);
    alert(JSON.stringify(fd));

      // Use the appropriate API endpoint based on mode
      let response;
      if (isEditMode) {
        fd.append('key_id', formData.id);
        response = await KeyUpdateApi(fd); // You'll need to create this API function
      } else {
        response = await KeyAddApi(fd);
      }
      
      if (response.data.status === true) {
        Toast.show(isEditMode ? 'Key updated successfully!' : 'Key added successfully!', Toast.SHORT);
        navigation.navigate('ClerkKeysList');
      } else {
        Toast.show(response.data.message || (isEditMode ? 'Failed to update key' : 'Failed to add key'), Toast.SHORT);
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.show('Error processing request', Toast.SHORT);
    }
  };

// Add delete functionality
  const handleDelete = async () => {
    Alert.alert(
      'Delete Key',
      'Are you sure you want to delete this key?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const fd = new FormData();
              fd.append('key_id', formData.id);
              
              const response = await KeyDeleteApi(fd); // You'll need to create this API function
              
              if (response.data.status === true) {
                Toast.show('Key deleted successfully!', Toast.SHORT);
                navigation.navigate('ClerkKeysList');
              } else {
                Toast.show(response.data.message || 'Failed to delete key', Toast.SHORT);
              }
            } catch (error) {
              console.error('Error deleting key:', error);
              Toast.show('Error deleting key', Toast.SHORT);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  

  const handleDeleteText = async () => {
    try {
   setScreenLoading(true);
   let fd = new FormData();
       fd.append("key_id",keyData?.id);
       fd.append("description",'');
  
      let response = await KeyUpdateTextByIdApi(fd);
      if (response.status === 200) {
        Animated.timing(descriptionAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsDeleted(true);
          setKeysData(prev => ({ ...prev, description: null })); // Clear from state
          Toast.show('Text deleted successfully!', Toast.SHORT);
          getKeyDetail();

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

  const [images, setImages] = useState([
    {
      id: 1,
      uri: require('../assets/images/image1.jpg'),
      scaleAnim: new Animated.Value(1),
    },
    {
      id: 2,
      uri: require('../assets/images/image2.jpg'),
      scaleAnim: new Animated.Value(1),
    },
  ]);

  const [audioimages, setaudioImages] = useState([
    {
      id: 1,
      uri: require('../assets/images/image1.jpg'),
      scaleAnim: new Animated.Value(1),
    },
    {
      id: 2,
      uri: require('../assets/images/image2.jpg'),
      scaleAnim: new Animated.Value(1),
    },
  ]);

  // Zoom-out animation for deleting images
  const handleDeleteImage = async (pid) => {
      try {
        let fd = new FormData();
          fd.append("image_id",pid);
  //alert(JSON.stringify(fd))
      let response = await DeleteAllImageByIdApi(fd);
  //alert(JSON.stringify(response));
          
          getKeyDetail();
                  // Remove from local state after successful delete
        
      } catch (error) {
       alert();
      
      }
    
  };

  // When navigating to audio recording screen
const handleAudioRecording = () => {
  navigation.navigate('ClerkAddKeyAddAudio', {
    onAudioRecorded: (audioData) => {
      setAudioFile({
        uri: audioData.uri,
        type: audioData.type,
        name: audioData.name
      });
      // Also update the recordedAudios state for UI display
      setRecordedAudios([{
        id: Date.now(),
        name: audioData.name || 'New Recording.mp3',
        duration: '00:00:00', // You can calculate this from audioData
        scaleAnim: new Animated.Value(1)
      }]);
    }
  });
};



  const [recordedAudios, setRecordedAudios] = useState(
    keyData?.audio ? [{
      id: keyData.id,
      name: keyData.audio,
      duration: '00:00:00',
      scaleAnim: new Animated.Value(1)
    }] : []
  );
  
  const [playingId, setPlayingId] = useState(null);
  const [showAudioSection, setShowAudioSection] = useState(true);

  const togglePlayPause = id => {
    setPlayingId(playingId === id ? null : id);
  };

  

  const deleteAudio = async (id, scheduleConditionId) => {
    const audioToDelete = recordedAudios.find(audio => audio.id === id);
    if (!audioToDelete) return;
  
    try {
      setScreenLoading(true);
  
        // 🔹 Call API to delete audio from the backend
   let fd = new FormData();
       fd.append("key_id",keyData?.id);
      let response = await KeyDeleteAudioByIdApi(fd);
  
        if (response.status === 200) {
           // 🔹 Animate zoom-out effect before deletion
      Animated.timing(audioToDelete.scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(async () => {
         setScreenLoading(false);
  
          console.log('Audio deleted successfully:', response.data);
      getKeyDetail();
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
     fd.append("key_id",keysData?.id);
      fd.append("description",description);

    let response = await KeyUpdateTextByIdApi(fd);
        setIsEditing(false); // Start editing
setScreenLoading(false);
getKeyDetail();
  } catch (error) {
    console.error('Error saving description:', error);
    Toast.show('Failed to save description. Please try again.', Toast.SHORT);
  }
};



  const getKeyDetail= async () => {//alert();
    try {
      setScreenLoading(true);
      let fd = new FormData();
      //alert(seletedJobId);
      fd.append("key_id",keyData?.id);
      let response = await KeyDetailsByKeyIdApi(fd);
      console.log('key all details',response.data.data[0]);
      setKeysData(response.data.data[0]);
      setDescription(response.data.data[0]?.description);
      setScreenLoading(false);
    } catch (error) {
          setScreenLoading(false);


              Toast.show(error.response?.data?.errors || 'Something went wrong, please try again.');

      //throw error.response?.data || 'Failed to fetch inventory list';
    }
};




  
 useEffect(() => {
    getKeyDetail();
  }, []);
// 🔹 Update audio list when new API response comes in

console.log('keysDatakey_image', keysData);
useEffect(() => {
  if (keysData?.audio_with_paths) {
    setRecordedAudios([
      {
        id: keysData?.id,
        url: keysData?.audio_with_paths,
        name: keysData?.audio,
        duration: '00:00',
        scaleAnim: new Animated.Value(1),
      },
    ]);
  }

}, [keysData]);



  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('ClerkKeysList')}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>{headerTitle}</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.subtitel}>Key Title</Text>

          <View style={styles.frmRowFull}>
           
            <TextInput
                style={[
                  styles.searchInput,
                  focusedInput === 'input1' && styles.searchFocused,
                ]}
                placeholder="Key Title"
                value={formData.key_title}
                onChangeText={(text) => setFormData({...formData, key_title: text})}
                onFocus={() => setFocusedInput('input1')}
                onBlur={() => setFocusedInput(null)}
              />
          </View>
          <View style={styles.frmRow}>
            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Number of Keys</Text>
             
              <TextInput
                style={[
                  styles.searchInput,
                  focusedInput === 'input2' && styles.searchFocused,
                ]}
                placeholder="Number of Keys"
                value={formData.number_keys}
                onChangeText={(text) => setFormData({...formData, number_keys: text})}
                keyboardType="numeric"
                onFocus={() => setFocusedInput('input2')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.frmRowinner}>

              <Text style={styles.subtitel}>Missing Keys</Text>
             
              <TextInput
                style={[
                  styles.searchInput,
                  focusedInput === 'input3' && styles.searchFocused,
                ]}
                placeholder="Missing Keys"
                value={formData.missing_keys}
                onChangeText={(text) => setFormData({...formData, missing_keys: text})}
                keyboardType="numeric"
                onFocus={() => setFocusedInput('input3')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>
 {isEditMode?

<>
          <Text style={styles.subtitel}>Select data recording option</Text>

          <View style={styles.BtnGap}>
            <TouchableOpacity
              style={[styles.StartBtn, (keysData?.description || keysData?.audio ) ? styles.disabledBtn : {}]}
              onPress={() => navigation.navigate('ClerkAddKeyAddText')}
              disabled={!!(keysData?.description || keysData?.audio )}
              >
              <TextIcon />
              <Text style={styles.StartBtnTxt}>Text</Text>
            </TouchableOpacity>

            
            <TouchableOpacity
              style={[styles.StartBtn, (keysData?.description || keysData?.audio ) ? styles.disabledBtn : {}]}
             // onPress={handleAudioRecording}
  onPress={() => 
    (keysData?.description || keysData?.audio) ? null : [navigation.navigate('ClerkAddKeyAddAudio'),setRecordingPath('')]
  }
  disabled={!!(keysData?.description || keysData?.audio )}

             >
              <AudioIcon />
              <Text style={styles.StartBtnTxt}>Audio</Text>
            </TouchableOpacity>
          </View>

</>:''}



          {keysData?.description && (
            <>
  <View style={styles.AddedInfocontainer}>
    {!isDeleted && (
      <Animated.View style={{ transform: [{ scale: descriptionAnim }] }}>
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
          <TouchableOpacity style={styles.actionButton} onPress={handleEditText}>
            <Icon name={isEditing ? 'save' : 'edit'} size={18} color="#393D47" />
            <Text style={styles.buttonText}>
              {isEditing ? 'Save Text' : 'Edit Text'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteText}>
            <Trash name="trash-outline" size={18} color="#393D47" />
            <Text style={styles.buttonText}>Delete Text</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )}
  </View>

  <View style={styles.AddedInfocontainer}>
  <View style={styles.imageRow}>
    {keysData?.description !== '' && Array.isArray(keysData?.key_image) &&
      keysData.key_image.map(img => (
        <Animated.View
          key={img.id}
          style={[
            styles.imageWrapper,
            img.scaleAnim && { transform: [{ scale: img.scaleAnim }] },
          ]}
        >
          <Image source={{ uri: img.image_with_paths }} style={styles.image} />
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => handleDeleteImage(img.id)}
          >
            <Trash name="trash-outline" size={18} color="#393D47" />
          </TouchableOpacity>
        </Animated.View>
      ))
    }
  </View>
</View>
</>
)}



{/* Audio Section */}
{keysData?.audio && (
  <>
    <View style={styles.Addedaduiocontainer}>
      <Text style={styles.descriptiontitle}>Recorded Audio</Text>
      <FlatList
        data={recordedAudios}
        keyExtractor={(item) => item.id.toString()}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <Animated.View style={styles.audioItem}>
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
      {Array.isArray(keysData?.key_image) &&
        keysData.key_image.map(img => (
          <Animated.View
            key={img.id}
            style={[
              styles.imageWrapper,
              img.scaleAnim && { transform: [{ scale: img.scaleAnim }] },
            ]}
          >
            <Image source={{ uri: img.image_with_paths }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDeleteImage(img.id)}
            >
              <Trash name="trash-outline" size={18} color="#393D47" />
            </TouchableOpacity>
          </Animated.View>
        ))}
    </View>
  </>
)}



        </ScrollView>
        <View style={styles.Footer}>
          {/* <TouchableOpacity
            style={styles.NextBtn}
            onPress={() => navigation.navigate('ClerkKeysList')}>
            <Text style={styles.NextBtnTxt}>Save</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.NextBtn}
            onPress={handleSubmit}>
            <Text style={styles.NextBtnTxt}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ForgetBtn} onPress={handleDelete}>
            <Text style={styles.ForgetBtnTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClerkAddKey;

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
  searchInput: {
    fontWeight: '400',
    fontSize: 13,
    fontFamily: 'BeVietnamPro-Regular',
    color: '#6D7D93',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#6D7D93',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  searchFocused: {
    borderColor: '#FF8800', // Highlighted border when focused
  },
  frmRow: {
    flexDirection: 'row',
    gap: 14,
  },
  frmRowinner: {
    width: '48%',
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
  Footer: {
    padding: 25,
    paddingBottom: 0,
  },
  ForgetBtn: {
    width: '100%',
    marginTop: 15,
    lineHeight: 40,
    textAlign: 'center',
    height: 40,
  },
  ForgetBtnTxt: {
    color: '#6D7D93',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: '500',
    textAlign: 'center',
  }, 
  disabledBtn: {
    backgroundColor: '#A9A9A9', // Greyed out
  },
});
