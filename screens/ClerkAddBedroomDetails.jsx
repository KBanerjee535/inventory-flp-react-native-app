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
import { getNotesForSection } from '../utils/punctuateTextModel';

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

  const handleToggle = (id) => {
    setAudioToggles((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const [screenLoading, setScreenLoading] = useState(false);

  const deleteSection = async() => {

let fd = new FormData();
    fd.append("section_id", SelectedSection?.id);
 let response = await DeleteSectionSectionIdApi(fd);
    const apiData = response.data;

if(apiData.status==true){
Toast.show(response.data.message);
navigation.navigate('ClerkInspection')
}
  };

const fetchSectionItemList = async () => {
  try {

    setScreenLoading(true);
    let fd = new FormData();
    fd.append("section_id", SelectedSection?.section_id);
    fd.append("inventory_id", SelectedSection?.inventory_id);
  
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
    fd.append("inventory_id", SelectedSection?.inventory_id);
  
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
    
    return (
    <View key={section?.section_id} style={styles.AddedInfocontainer}>
      
      {!isDeleted && (
        <Animated.View style={{ transform: [{ scale: descriptionAnim }] }}>
          
          <AccordionEntity title={sectionTitle}>
               <>
                 {/* Always use subsubsection items - simpler approach */}
                 {section?.subsubSection && section?.subsubSection?.length > 0 ? (
                   section?.subsubSection?.map((item) => {
                     const itemTitle = item.title || item.name;
                     
                     const note = item?.content ? Object.values(item?.content)[0] : null;

                     return (
                       <View
                         key={item?.subsub_section_id}
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

                         {/* {notes.length > 0 ? (
                           notes.map((note, index) => ( */}
                          {note ? (
                             <Text
                               key={note?.items}
                               style={{
                                 marginLeft: 15,
                                 marginTop: 4,
                                 color: '#666',
                               }}
                             >
                               • {note.items} - {note.condition}
                             </Text>
                           
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
                 ) : (
                   // No subsubsections - display notes directly under the main section
                   (() => {
                     // Use helper function to get notes for the section
                     const sectionNotes = JSON.parse(section?.subsubSection?.content);
                     console.log('sectionNotes: ', sectionNotes);
                    
                     return sectionNotes ? (
                       <View style={{ marginTop: 4 }}>
                         {Object.entries(sectionNotes).map(([title, value]) => (
                           <Text
                             key={section?.sub_section_id + title}
                             style={{
                               marginLeft: 15,
                               marginTop: 4,
                               color: '#666',
                             }}
                           >
                             • {value.items} - {value.condition}
                           </Text>
                         ))}
                       </View>
                     ) : (
                       <Text style={{ fontSize: 16, color: '#999' }}>No notes available</Text>
                     );
                   })()
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
