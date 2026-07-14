import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Switch,
  Text,
  Animated,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import TextIcon from '../assets/images/TextIcon.svg';
import AudioIcon from '../assets/images/AudioIcon.svg';
import Trash from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import GalleryIcon from '../assets/images/GalleryIcon.svg';
import CameraIcon from '../assets/images/CameraIcon.svg';
import WhiteArrow from '../assets/images/whiteArrow.svg';
import { useUserContext } from '../context/UserContext';
import {
  DeleteSectionSectionIdApi,
  sectionDetailsBySectionIdAPI,
  SectionUpdateTextBySectionIdApi,
  SectionDeleteAudioBySectionIdApi,
  SectionItemListBySectionIdAPI,
SectionDeleteImageBySectionIdApi,
SectionItemUpdateTextApi,
SectionAddSupportingImageApi,
GetSupportingImageBySectionIdApi,
SectionDeleteSupportingImageByIdApi} from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import { check, request, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AccordionEntity from '../utils/AccordionEntity';

import Toast from 'react-native-simple-toast';

const ClerkAddBedroomDetails = ({navigation}) => {
  const [description, setDescription] = useState();
const [supportingMedia, setSupportingMedia] = useState([]); // holds both images & videos

const { setRecordingPath, SelectedSection, sectionDetails, setsectionDetails, sectionItems, setsectionItems, categorizedNotes } = useUserContext();
const [textValues, setTextValues] = useState({});
const [isSaved, setIsSaved] = useState({}); // track save state for each item
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const descriptionAnim = useRef(new Animated.Value(1)).current;

  // State for toggles
  const [roomAudio, setRoomAudio] = useState(true);
  const [furnitureAudio, setFurnitureAudio] = useState(false);
  const [windowsAudio, setWindowsAudio] = useState(false);
  const [fixturesAudio, setFixturesAudio] = useState(false);
  // State to track focused input field
  const [focusedInput, setFocusedInput] = useState(null);
  const [audioToggles, setAudioToggles] = useState({});

  const [serverSupportingMedia, setServerSupportingMedia] = useState([]);

//   const fetchSupportingImages = async () => {
//   try {
//     const fd = new FormData();
//     fd.append('section_id', SelectedSection?.section_id);
    
//     const response = await GetSupportingImageBySectionIdApi(fd);
    
//     if (response.data.status) {
//       setServerSupportingMedia(response.data.data);
//       console.log('Supporting images fetched successfully:', response.data.data);
//     }
//   } catch (error) {
//     console.error('Error fetching supporting images:', error);
//   }
// };

// const deleteServerImage = async (imageId) => {
//   Alert.alert(
//     'Delete Image',
//     'Are you sure you want to delete this image?',
//     [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//       },
//       {
//         text: 'Delete',
//         onPress: async () => {
//           try {
//             const fd = new FormData();
//             fd.append('image_id', imageId);
            
//             setScreenLoading(true);
//             const response = await SectionDeleteSupportingImageByIdApi(fd);
            
//             if (response.data.status) {
//               Toast.show('Image deleted successfully!', Toast.SHORT);
//               // fetchSupportingImages(); // Refresh the list after deletion
//             } else {
//               Toast.show(response.data.message || 'Failed to delete image', Toast.SHORT);
//             }
//           } catch (error) {
//             console.error('Error deleting image:', error);
//             Toast.show('Error deleting image', Toast.SHORT);
//           } finally {
//             setScreenLoading(false);
//           }
//         },
//       },
//     ],
//     { cancelable: true }
//   );
// };

  const handleToggle = (id) => {
    setAudioToggles((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };



  // const [audioimages, setaudioImages] = useState([
  //   {
  //     id: 1,
  //     uri: require('../assets/images/image1.jpg'),
  //     scaleAnim: new Animated.Value(1),
  //   },
  //   {
  //     id: 2,
  //     uri: require('../assets/images/image2.jpg'),
  //     scaleAnim: new Animated.Value(1),
  //   },
  // ]);
// const requestCameraPermission = async () => {
//   const permission = Platform.select({
//     ios: PERMISSIONS.IOS.CAMERA,
//     android: PERMISSIONS.ANDROID.CAMERA,
//   });

//   const result = await check(permission);

//   if (result === RESULTS.GRANTED) {
//     return true;
//   }

//   if (result === RESULTS.BLOCKED) {
//     Alert.alert(
//       'Permission Blocked',
//       'Camera permission is blocked. Please enable it from settings.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Open Settings', onPress: openSettings }
//       ]
//     );
//     return false;
//   }

//   const requestResult = await request(permission);

//   if (requestResult === RESULTS.GRANTED) {
//     return true;
//   } else {
//     Alert.alert('Permission Denied', 'Camera permission is required.');
//     return false;
//   }
// };

  // Zoom-out animation for deleting images
// const handleDeleteImage = async () => {
//     try {
//       let fd = new FormData();
//      fd.append("section_id",SelectedSection?.id);
// //alert(JSON.stringify(fd))
//     let response = await SectionDeleteImageBySectionIdApi(fd);

//         getSectionDetails();
//                 // Remove from local state after successful delete
      
//     } catch (error) {
//      //alert();
    
//     }
  
// };
// const pickSupportingMedia = async (type) => {
//   try {
//     if (supportingMedia.length >= 4) {
//       Alert.alert('Limit Reached', 'You can only upload up to 4 media files.');
//       return;
//     }

//     let media = null;

//     if (type === 'camera') {
//       const hasPermission = await requestCameraPermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Camera permission is required.');
//         return;
//       }

//       media = await ImagePicker.openCamera({
//         mediaType: 'any',
//       });
//     } else if (type === 'gallery') {
//       media = await ImagePicker.openPicker({
//         mediaType: 'any',
//         multiple: true,
//       });
//     }

//     if (!media) return;

//     const mediaArray = Array.isArray(media) ? media : [media];

//     const remainingSlots = 4 - supportingMedia.length;

//     const selectedMedia = mediaArray.slice(0, remainingSlots);

//     setSupportingMedia(prev => [...prev, ...selectedMedia]);
//     console.log(selectedMedia);

//   } catch (error) {
//     console.log('Media picking cancelled or error:', error);
//     Alert.alert('Error', 'Media selection failed. Please try again.');
//   }
// };

// const uploadMediaFiles = async () => {
//   try {
//     const fd = new FormData();
//     fd.append('section_id', sectionDetails?.id);
//     fd.append('inventory_id', sectionDetails?.inventory_id);

//     console.log(supportingMedia);

//     supportingMedia.forEach((file, index) => {
//       const fileType = file.mime || 'image/jpeg';
//       const fileName = file.filename || `file_${index}.${fileType.includes('video') ? 'mp4' : 'jpg'}`;

//       fd.append('image[]', {
//         uri: file.path.startsWith('file://') ? file.path : `file://${file.path}`,
//         type: fileType,
//         name: fileName,
//       });
//     });

//     const response = await SectionAddSupportingImageApi(fd); // Make sure this uses axios or fetch with correct headers
//     console.log('Upload response:', response.data);
//     if( response.data.status){ 
//       setSupportingMedia([]); // Clear after successful upload {
//       Toast.show('Media uploaded successfully!', Toast.SHORT);
//       // fetchSupportingImages(); // Refresh the list after upload
//     } else {
//       Toast.show(response.data.message || 'Failed to upload media.', Toast.SHORT);

//     }
    
//   } catch (error) {
//     console.error('Upload error:', error.response?.data || error.message);
//   }
// };


// const removeSupportingMedia = (index) => {
//   const updatedMedia = [...supportingMedia];
//   updatedMedia.splice(index, 1);
//   setSupportingMedia(updatedMedia);
// };


//   const [recordedAudios, setRecordedAudios] = useState([
//     {
//       id: 1,
//       name: 'Section_Audio.mp3',
//       duration: '00:05:33',
//       scaleAnim: new Animated.Value(1),
//     },
//   ]);
//   const [playingId, setPlayingId] = useState(null);
//   const [showAudioSection, setShowAudioSection] = useState(true);
  const [screenLoading, setScreenLoading] = useState(false);

//   const togglePlayPause = id => {
//     setPlayingId(playingId === id ? null : id);
//   };

// const deleteAudio = async (id) => {
//   const audioToDelete = recordedAudios.find(audio => audio.id === id);
//   if (!audioToDelete) return;

//   try {
//     setScreenLoading(true);

//       // 🔹 Call API to delete audio from the backend
//  let fd = new FormData();
//      fd.append("section_id",SelectedSection?.section_id);
//     let response = await SectionDeleteAudioBySectionIdApi(fd);

//       if (response.status === 200) {
//          // 🔹 Animate zoom-out effect before deletion
//     Animated.timing(audioToDelete.scaleAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(async () => {
//        setScreenLoading(false);

//         console.log('Audio deleted successfully:', response.data);
//     getSectionDetails();
//         // 🔹 Remove audio from UI after successful deletion
//         const updatedAudios = recordedAudios.filter(audio => audio.id !== id);
//         setRecordedAudios(updatedAudios);
//          });
//       } else {
//          setScreenLoading(false);

//        // console.warn('Failed to delete audio:', response.data);
//       }
   
//   } catch (error) {
//      setScreenLoading(false);

//     console.error('Error deleting audio:', error);
//   }
// };

  const deleteSection = async() => {

let fd = new FormData();
    fd.append("section_id", SelectedSection?.section_id);
 let response = await DeleteSectionSectionIdApi(fd);
    const apiData = response.data;

if(apiData.status==true){
Toast.show(response.data.message);
navigation.navigate('ClerkInspection')
}
  };



// const handleDeleteText = async () => {
//   try {
//  setScreenLoading(true);
//  let fd = new FormData();
//      fd.append("section_id",SelectedSection?.id);
//      fd.append("description",'');

//     let response = await SectionUpdateTextBySectionIdApi(fd);
//     if (response.status === 200) {
//       Animated.timing(descriptionAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => {
//         setIsDeleted(true);
//         setsectionDetails(prev => ({ ...prev, description: null })); // Clear from state
//         Toast.show('Text deleted successfully!', Toast.SHORT);
//         setScreenLoading(false);
//       });
//     } else {
//       setScreenLoading(false);
//       Toast.show('Failed to delete text. Please try again.', Toast.SHORT);
//     }
//   } catch (error) {
//     console.error('Error deleting text:', error);
//     Toast.show('An error occurred. Please try again.', Toast.SHORT);
//   }
// };


const fetchSectionItemList = async () => {
  try {

    setScreenLoading(true);
    let fd = new FormData();
    fd.append("section_id", SelectedSection?.section_id);
  
    let response = await SectionItemListBySectionIdAPI(fd);
    const apiData = response.data;

     //alert(JSON.stringify(response));

if(response.data.status){
console.log('sectionItems: ', response.data.data);
  setsectionItems(response.data.data);

          }else{
 Toast.show(response.data.message);
          }
    setScreenLoading(false);
  } catch (error) {
    Toast.show(error.response?.data?.message || 'Something went wrong, please try again.');
    setScreenLoading(false);
  }
};


const getSectionDetails = async () => {
  try {

    setScreenLoading(true);
    let fd = new FormData();
    fd.append("section_id", SelectedSection?.section_id);
  
    let response = await sectionDetailsBySectionIdAPI(fd);
    const apiData = response.data;

    // alert(JSON.stringify(response));

if(response.data.status){
console.log('sectionDetails: ', response.data.data);
  setsectionDetails(response.data.data);
  // await fetchSectionItemList();
      setDescription(response.data.data[0]?.description);
          }else{
 Toast.show(response.data.message);
          }
    setScreenLoading(false);
  } catch (error) {
    Toast.show(error.response?.data?.message || 'Something went wrong, please try again.');
    setScreenLoading(false);
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
     fd.append("section_id",SelectedSection?.id);
     fd.append("description",description);

    let response = await SectionUpdateTextBySectionIdApi(fd);
        setIsEditing(false); // Start editing
setScreenLoading(false);
getSectionDetails();
  } catch (error) {
    console.error('Error saving description:', error);
    Toast.show('Failed to save description. Please try again.', Toast.SHORT);
  }
};
const handleSaveText = async (itemId) => {
  const text = textValues[itemId];
  if (!text?.trim()) {
    Toast.show('Please enter some text.');
    return;
  }

  try {
    setScreenLoading(true);

    const payload = {
      id: itemId,
      description: text,
    };

    const response = await SectionItemUpdateTextApi(payload);

    if (response.data.status) {
      Toast.show('Saved successfully.');

      // Update sectionItems with new description
      setsectionItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, description: text } : item
        )
      );
    } else {
      Toast.show(response.data.message || 'Failed to save.');
    }
  } catch (error) {
    Toast.show(error.response?.data?.message || 'Something went wrong.');
  } finally {
    setScreenLoading(false);
  }
};

useEffect(() => {
    getSectionDetails();
    // fetchSupportingImages();
    console.log('categorizedNotes: ', categorizedNotes);
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
          <Text style={styles.pagetitleTxt}>{sectionDetails?.name}</Text>
        </View>
      

           <ScrollView>
              <View style={styles.container}>

                {screenLoading ? <ActivityIndicator size="large" color="#0000ff" />:''}

          <Text style={styles.subtitel}>Select data recording option</Text>

        <View style={styles.BtnGap}>

        {/* <TouchableOpacity
  style={[styles.StartBtn, (sectionDetails?.description || sectionDetails?.audio) ? styles.disabledBtn : {}]}
  onPress={() => 
    (sectionDetails?.description || sectionDetails?.audio) ? null : navigation.navigate('ClerkAddBedroomDetailsAddText')
  }
  disabled={!!(sectionDetails?.description || sectionDetails?.audio)}>
  <TextIcon />
  <Text style={styles.StartBtnTxt}>Text</Text>
</TouchableOpacity> */}

<TouchableOpacity
  style={[styles.StartBtn, (sectionDetails?.description || sectionDetails?.audio) ? styles.disabledBtn : {}]}
  onPress={() => 
    (sectionDetails?.description || sectionDetails?.audio) ? null : [navigation.navigate('ClerkAddBedroomDetailsAddAudio'),setRecordingPath('')]
  }
  disabled={!!(sectionDetails?.description || sectionDetails?.audio)}>
  <AudioIcon />
  <Text style={styles.StartBtnTxt}>Speech</Text>
</TouchableOpacity>



          </View>

          {sectionDetails?.length > 0 && <Text style={styles.descriptiontitle}>Features</Text>}
{sectionDetails?.length > 0 &&
  sectionDetails?.map((section) => {
    // Get section title (handle both 'title' and 'name' properties)
    const sectionTitle = section.title || section.name;
    
    // Check if this section has a nested structure (dynamic for any section type)
    const sectionData = categorizedNotes?.[sectionTitle];
    const isNestedStructure = sectionData && 
      Array.isArray(sectionData) && 
      sectionData.length > 0 && 
      typeof sectionData[0] === 'object' && 
      !Array.isArray(sectionData[0]);
    
    // Helper function to filter notes by section name (for nested structures)
    const filterNotesBySection = (notes, sectionName) => {
      if (!Array.isArray(notes)) return [];
      return notes.filter(note => {
        if (typeof note === 'string') {
          const lowerNote = note.toLowerCase();
          const lowerSection = sectionName.toLowerCase();
          return lowerNote.includes(lowerSection);
        }
        return true;
      });
    };
    
    return (
    <View key={section?.id} style={styles.AddedInfocontainer}>
      
      {!isDeleted && (
        <Animated.View style={{ transform: [{ scale: descriptionAnim }] }}>
          

          {/* {isEditing ? (
            <TextInput
              style={styles.input}
              // value={description}
              value={section?.title}
              onChangeText={setDescription}
              multiline
            />
          ) : ( */}
          
<AccordionEntity title={sectionTitle}>
               <>
                 {/* Check if this is a nested structure (works for any section type) */}
                 {isNestedStructure ? (
                   // For nested structure, display categories from the data
                   sectionData.map((categoryObj, categoryIndex) => {
                     if (typeof categoryObj === 'object' && categoryObj !== null) {
                       return Object.keys(categoryObj).map(categoryName => {
                         const notes = categoryObj[categoryName];
                         // Filter notes to only show those matching this section name
                         const filteredNotes = filterNotesBySection(notes, sectionTitle);
                         const hasNotes = Array.isArray(filteredNotes) && filteredNotes.length > 0;
                        
                         return (
                           <View key={`${categoryIndex}-${categoryName}`} style={{ marginBottom: 10 }}>
                             <Text
                               style={{
                                 fontSize: 16,
                                 color: '#333',
                                 fontWeight: '600',
                                 marginBottom: 4,
                               }}
                             >
                               {categoryName}
                             </Text>
                             {hasNotes ? (
                               <View style={{ marginLeft: 15, marginTop: 4 }}>
                                 {filteredNotes.map((note, index) => (
                                   <Text
                                     key={index}
                                     style={{
                                       color: '#666',
                                     }}
                                   >
                                     • {note}
                                   </Text>
                                 ))}
                               </View>
                             ) : (
                               <Text
                                 style={{
                                   marginLeft: 15,
                                   marginTop: 4,
                                   color: '#999',
                                 }}
                               >
                                 No notes
                               </Text>
                             )}
                           </View>
                         );
                       });
                     }
                     return null;
                   })
                 ) : (
                   // For non-nested or flat structure, use subsubsection items
                   section?.subsubSection?.map((item) => {
                     const itemTitle = item.title || item.name;
                     const notes = categorizedNotes?.[sectionTitle]?.[itemTitle] || [];

                     return (
                       <View
                         key={item.id}
                         style={{
                           marginBottom: 10,
                           paddingBottom: 10,
                           marginTop: 4,
                         }}
                       >
                         <Text
                           style={{
                             fontSize: 16,
                             color: '#333',
                             fontWeight: '600',
                           }}
                         >
                           {itemTitle}
                         </Text>

                         {notes.length > 0 ? (
                           notes.map((note, index) => (
                             <Text
                               key={index}
                               style={{
                                 marginLeft: 15,
                                 marginTop: 4,
                                 color: '#666',
                               }}
                             >
                               • {note}
                             </Text>
                           ))
                         ) : (
                           <Text
                             style={{
                               marginLeft: 15,
                               marginTop: 4,
                               color: '#999',
                             }}
                           >
                             No notes
                           </Text>
                         )}
                       </View>
                     );
                   })
                 )}
                 {section?.subsubSection?.length === 0 && !isNestedStructure && (
                   <Text style={{ fontSize: 16, color: '#999' }}>No sub-sections available</Text>
                 )}
               </>
             </AccordionEntity>
          {/* )} */}
          
          {/* <View style={styles.buttonRow}>
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
          </View> */}
        </Animated.View>
      )}

      {/* <View style={styles.imageRow}>
        {section?.image_with_path ? (
          <Animated.View style={[styles.imageWrapper]}>
            <Image
              source={{ uri: section.image_with_path }}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={handleDeleteImage}>
              <Trash name="trash-outline" size={18} color="#393D47" />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Text style={styles.noImageText}>No Image Available</Text>
        )}
      </View> */}
    </View>
    );
  })}

          

       {supportingMedia.length > 0 && (
  <TouchableOpacity 
    style={[styles.NextBtn, styles.NextBtn2]}
    onPress={uploadMediaFiles}
  >
    <Text style={styles.NextBtnTxt}>Save</Text>
  </TouchableOpacity>
)}

</View> 
        
        </ScrollView>

             


              {/* <View style={styles.Footer}>
         


          <TouchableOpacity style={styles.ForgetBtn} onPress={() => deleteSection()}>
            <Text style={styles.ForgetBtnTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
 */}

        </View>

  
     
    </SafeAreaView>
  );
};

export default ClerkAddBedroomDetails;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  Body: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
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

    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
  
    flex:1,
   
  

    
 
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
    marginTop: 20,
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
    borderRadius: 8,
    marginBottom: 15,
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


  NextBtn: {
  backgroundColor: '#393D47', // brighter blue for modern look
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: 50,
  borderRadius: 12,
  shadowColor: '#393D47',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3, // for Android shadow
  marginTop: 10,
},
NextBtnTxt: {
  color: '#FFF',
  fontSize: 16,
  fontFamily: 'BeVietnamPro-SemiBold',
  fontWeight: '600',
  letterSpacing: 0.5,
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

  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#434854',
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
  },
  input: {
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00218F47',
    minHeight: 50,
  },
  inputFocused: {
    borderColor: '#D97706',
  },
  recordButton: {
    backgroundColor: '#D97706',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Bold',
    fontWeight: 700,
  },
  newcontainer: {
    width: '100%',
  },
  StartBtn2: {
    width: '47%',
    backgroundColor: '#fff',
    height: 150,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00218F47',
  },
  OtherGap: {
    borderTopWidth: 1,
    borderTopColor: '#00218F47',
    width: '100%',
    paddingTop: 15,
    marginBottom: 20,
  },
  AudioSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
  },
    disabledBtn: {
    backgroundColor: '#A9A9A9', // Greyed out
  },
  supportingMediaContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginVertical: 10,
},
mediaItemMain:{
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap:10,
  marginBottom: 20,
},
mediaItem: {
  width: '48%',
  height: 100,
  //marginBottom: 15,
  position: 'relative',
},
supportingImage: {
  width: '100%',
  height: '100%',
  borderRadius: 8,
},
deleteIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 20,
  padding: 5,
},

NextBtn2:{
  marginBottom:40


}
});
