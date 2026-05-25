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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import GalleryIcon from '../assets/images/GalleryIcon.svg';
import CameraIcon from '../assets/images/CameraIcon.svg';

const ClerkSnagginginspectionrecordText = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() =>
              navigation.navigate('ClerkSnagginginspectionrecord')
            }>
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
          />

          <Text style={styles.subtitel}>Supporting Photo(s)</Text>
          <View style={styles.BtnGap}>
            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() =>
                navigation.navigate('ClerkSnagginginspectionrecordText')
              }>
              <CameraIcon width={50} height={50} />
              <Text style={styles.StartBtnTxt}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() =>
                navigation.navigate('ClerkSnaggingCTReportDetails')
              }>
              <GalleryIcon width={50} height={50} />
              <Text style={styles.StartBtnTxt}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <Image
              style={styles.imagePreview}
              source={require('../assets/images/image1.jpg')}
            />

            <View style={styles.imageContainerRgt}>
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>Image-1.jpg</Text>
                <Text style={styles.fileSize}>567KB</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progress} />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.Footer}>
          <TouchableOpacity style={styles.NextBtn}>
            <Text style={styles.NextBtnTxt}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClerkSnagginginspectionrecordText;

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
});
