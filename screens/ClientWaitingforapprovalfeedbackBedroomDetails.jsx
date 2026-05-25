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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import Icon from 'react-native-vector-icons/Entypo';
import Download from '../assets/images/Download.svg';

const ClientWaitingforapprovalfeedbackBedroomDetails = ({navigation}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const [mainimages] = useState([
    {
      id: 1,
      uri: require('../assets/images/image1.jpg'),
    },
  ]);

  const [images] = useState([
    {
      id: 1,
      uri: require('../assets/images/image1.jpg'),
    },
    {
      id: 2,
      uri: require('../assets/images/image2.jpg'),
    },
  ]);
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() =>
              navigation.navigate('ClientWaitingforapprovalfeedbackBedroom')
            }>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Bedroom 1</Text>
        </View>

        <ScrollView style={styles.container}>
          <View style={styles.AddedInfocontainer}>
            <Text style={styles.descriptiontitle}>Text Description</Text>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </Text>
          </View>

          <View style={styles.MainphotoBox}>
            <Text style={styles.descriptiontitle}>Main Photo</Text>
            <View style={styles.imageRow}>
              {mainimages.map(img => (
                <View key={img.id} style={styles.imageWrapper}>
                  <Image source={img.uri} style={styles.image} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.Othersections}>
            <Text style={styles.sectionstitle}>Other sections</Text>
            <Text style={styles.descriptiontitle}>Recorded Audio</Text>

            <View style={styles.audioItem}>
              <View style={styles.audioItemLft}>
                <TouchableOpacity
                  style={styles.playIconaudio}
                  onPress={togglePlayPause}>
                  <Icon
                    name={isPlaying ? 'controller-paus' : 'controller-play'}
                    size={28}
                    color="#393D47"
                  />
                </TouchableOpacity>

                <View style={styles.audioinfo}>
                  <Text style={styles.audioname}>Schedule_of_Con.mp3</Text>
                  <Text style={styles.audioduration}>00:05:33</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.deleteIconaudio}>
                <Download />
              </TouchableOpacity>
            </View>

            <View style={styles.ContentInfo}>
              <Text style={styles.Contenttitle}>Furniture & Furnishing</Text>
              <Text style={styles.ContentTxt}>
                Furnishings" are things like carpets, rugs and curtains:
                "furniture" consists of tables, chairs, beds and the like.
              </Text>
            </View>
            <View style={styles.ContentInfo}>
              <Text style={styles.Contenttitle}>Windows</Text>
              <Text style={styles.ContentTxt}>
                The window of my bedroom was an opening to various scenes at
                different times of the day.
              </Text>
            </View>

            <View style={styles.ContentInfo}>
              <Text style={styles.Contenttitle}>Fixtures & Fittings</Text>
              <Text style={styles.ContentTxt}>
                The window of my bedroom was an opening to various scenes at
                different times of the day.
              </Text>
            </View>

            <View style={styles.SupportingBox}>
              <Text style={styles.descriptiontitle}>Supporting Images</Text>
              <View style={styles.imageRow}>
                {images.map(img => (
                  <View key={img.id} style={styles.imageWrapper}>
                    <Image source={img.uri} style={styles.image} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClientWaitingforapprovalfeedbackBedroomDetails;

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
    textAlign: 'center',
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
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  imageWrapper: {
    width: '48%',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 150,
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
    marginBottom: 25,
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
  MainphotoBox: {
    width: '100%',
    borderBottomColor: '#00218F47',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 20,
  },

  SupportingBox: {
    width: '100%',
    paddingBottom: 10,
    marginBottom: 20,
  },

  sectionstitle: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
  },
  ContentInfo: {marginBottom: 20},
  Contenttitle: {
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    color: '#434854',
    marginBottom: 12,
  },
  ContentTxt: {
    fontSize: 14,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    color: '#434854',
    lineHeight: 20,
  },
});
