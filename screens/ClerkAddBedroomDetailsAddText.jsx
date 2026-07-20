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
  ActivityIndicator,
  Alert
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import GalleryIcon from '../assets/images/GalleryIcon.svg';
import CameraIcon from '../assets/images/CameraIcon.svg';
import {SectionUpdateTextBySectionIdApi,SectionUpdateImageBySectionIdApi,SectionAddSupportingImageApi} from '../services/apiService';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { categorizeInspectionNotes } from '../utils/punctuateTextModel';

const ClerkAddBedroomDetailsAddText = ({navigation}) => {
   const [isFocused, setIsFocused] = useState(false);
    const {sectionDetails, setsectionDetails, setCategorizedNotes} = useUserContext();
    const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

const handleSaveText = async () => {
  if (!description.trim()) {
    Toast.show('Please enter a description.');
    return;
  }

  try {
// Categorize the description text using Gemini API
    const categorized = await categorizeInspectionNotes(description, sectionDetails);
    setCategorizedNotes(categorized);
    
    let fd = new FormData();
     fd.append("section_id",sectionDetails?.id);
     fd.append("description",description);

    let response = await SectionUpdateTextBySectionIdApi(fd);
await uploadImages();
    navigation.navigate('ClerkAddBedroomDetails');
  } catch (error) {
    console.error('Error saving description:', error);
    Toast.show('Failed to save description. Please try again.', Toast.SHORT);
  }
};


const selectImage = (fromCamera) => {


    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    const callback = (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Toast.show('Image selection error. Try again.');
      } else {
        const selectedAsset = response.assets[0];
         setImages(prev => [
        ...prev,
        {
          uri: selectedAsset.uri,
          fileName: selectedAsset.fileName,
          fileSize: selectedAsset.fileSize,
        },
      ]);
      }
    };

    fromCamera
      ? launchCamera(options, callback)
      : launchImageLibrary(options, callback);
  };

const uploadImages = async () => {
    try {
      const fd = new FormData();
      fd.append('section_id', sectionDetails?.id);

      images.forEach((img, index) => {
        fd.append('image', {
          uri: img.uri,
          type: 'image/jpeg',
          name: img.fileName || `image_${index}.jpg`,
        });
      }); 
      console.log(fd);
    let response = await SectionUpdateImageBySectionIdApi(fd);

      console.log('Image upload response:', response.data);
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('ClerkAddBedroomDetails')}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Text</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.subtitel}>Description</Text>
          <TextInput
  style={[styles.searchInput, isFocused && styles.searchFocused]}
  placeholder="Type"
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  multiline
  value={description}
  onChangeText={setDescription}
/>

          <Text style={styles.infoTxt}>
            Please describe the Bedroom summary
          </Text>

          <Text style={styles.subtitel}>Supporting Photo</Text>
        {images==''? <View style={styles.BtnGap}>
            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() => selectImage(true)}>
              <CameraIcon width={50} height={50} />
              <Text style={styles.StartBtnTxt}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() => selectImage(false)}>
              <GalleryIcon width={50} height={50} />
              <Text style={styles.StartBtnTxt}>Gallery</Text>
            </TouchableOpacity>
          </View>
:''}
          {images.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                style={styles.imagePreview}
                source={{ uri: img.uri }}
              />

              <View style={styles.imageContainerRgt}>
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName}>{img.fileName || `Image-${index + 1}`}</Text>
                  <Text style={styles.fileSize}>{(img.fileSize / 1024).toFixed(2)} KB</Text>
                </View>
                <TouchableOpacity onPress={() => removeImage(index)}>
                  <Text style={{color: 'red'}}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.Footer}>
          <TouchableOpacity
            style={styles.NextBtn}
            onPress={handleSaveText}>
            <Text style={styles.NextBtnTxt}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClerkAddBedroomDetailsAddText;

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
  infoTxt: {
    fontSize: 13,
    color: '#393D47',
    fontFamily: 'BeVietnamPro-Regular',
    marginBottom: 20,
  },
});
