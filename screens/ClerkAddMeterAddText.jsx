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
  Animated, Alert
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg'; 
import GalleryIcon from '../assets/images/GalleryIcon.svg';
import CameraIcon from '../assets/images/CameraIcon.svg';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { MeterAddImageApi, MeterUpdateTextByIdApi } from '../services/apiService';
import { PermissionsAndroid, Platform } from 'react-native';

const ClerkAddMeterAddText = ({navigation}) => {
   const [isFocused, setIsFocused] = useState(false);
const { metersData ,seletedJobId} = useUserContext(); // Note the capitalization
//alert(JSON.stringify(metersData));
  const [description, setDescription] = useState('');
const [meterImages, setMeterImages] = useState([]);
 const [screenLoading, setScreenLoading] = useState(false);



const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};
const handleCamera = () => {

    launchCamera({mediaType: 'photo', saveToPhotos: true}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
    console.log('Camera Error', response.errorMessage);
        return;
      }
      const asset = response.assets[0];
      setMeterImages(prev => [
        ...prev,
        {
          uri: asset.uri,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
        },
      ]);
    });
  };

const handleGallery = () => {
  launchImageLibrary({mediaType: 'photo', selectionLimit: 0}, response => {
    if (response.didCancel) return;
    if (response.errorCode) {
      Alert.alert('Gallery Error', response.errorMessage);
      return;
    }
    const selectedAssets = response.assets.map(asset => ({
      uri: asset.uri,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
    }));
    setMeterImages(prev => [...prev, ...selectedAssets]);
  });
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const uploadImages = async () => {
    try {
      const fd = new FormData();
      fd.append('inventory_id', seletedJobId);
      fd.append("meter_id",metersData?.id);

      meterImages.forEach((img, index) => {
        fd.append('image[]', {
          uri: img.uri,
          type: 'image/jpeg',
          name: img.fileName || `image_${index}.jpg`,
        });
      });
    let response = await MeterAddImageApi(fd);

      console.log('Image upload response:', response.data);
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

const handleSaveText = async () => {
  if (!description.trim()) {
    Toast.show('Please enter a description.');
    return;
  }

  try {//
    setScreenLoading(true);
    let fd = new FormData();
      fd.append("meter_id",metersData?.id);
      fd.append("description",description);
    let response = await MeterUpdateTextByIdApi(fd); 
    console.log('Meter Update Response:', response);
    setScreenLoading(false);
      await uploadImages();

    navigation.navigate('ClerkAddMeter', {
                      meterData: metersData,
                      mode: 'edit'
                    });
  } catch (error) {
    setScreenLoading(false);
    console.error('Error saving description:', error);
    Toast.show('Failed to save description. Please try again.', Toast.SHORT);
  }

  
};

useEffect(() => {
  metersData?.id && setDescription(metersData?.description || '');
}, [metersData?.id]);
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('ClerkAddMeter', {
                      meterData: metersData,
                      mode: 'edit'
                    })}>
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
        
                  <Text style={styles.infoTxt}>Please describe the meter summary</Text>
        
                  {description && description !== ''&&
                  <>
                            <Text style={styles.subtitel}>Supporting Photo(s)</Text>
                            <View style={styles.BtnGap}>
                              <TouchableOpacity
                                style={styles.StartBtn} onPress={handleCamera}
                                >
                                <CameraIcon width={50} height={50} />
                                <Text style={styles.StartBtnTxt}>Camera</Text>
                              </TouchableOpacity>
                  
                              <TouchableOpacity
                                style={styles.StartBtn} onPress={handleGallery}
                                >
                                <GalleryIcon width={50} height={50} />
                                <Text style={styles.StartBtnTxt}>Gallery</Text>
                              </TouchableOpacity>
                            </View>
                            </>}
        
                  {meterImages.map((img, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image style={styles.imagePreview} source={{uri: img.uri}} />
                      <View style={styles.imageContainerRgt}>
                        <View style={styles.fileDetails}>
                          <Text style={styles.fileName}>{img.fileName}</Text>
                          <Text style={styles.fileSize}>{formatFileSize(img.fileSize)}</Text>
                        </View>
                        {/* <View style={styles.progressBar}>
                          <View style={styles.progress} />
                        </View> */}
                      </View>
                    </View>
                  ))}
        
                </ScrollView>
                <View style={styles.Footer}>
                  <TouchableOpacity
                    style={styles.NextBtn}
                    onPress={() => handleSaveText()}>
                    <Text style={styles.NextBtnTxt}>Save</Text>
                  </TouchableOpacity>
                </View>
      </View>
    </SafeAreaView>
  );
};

export default ClerkAddMeterAddText;

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
