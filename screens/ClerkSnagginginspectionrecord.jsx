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
import TextIcon from '../assets/images/TextIcon.svg';
import AudioIcon from '../assets/images/AudioIcon.svg';
import Trash from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';

const ClerkSnagginginspectionrecord = ({navigation}) => {
  const [description, setDescription] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const descriptionAnim = useRef(new Animated.Value(1)).current;

  // Handle deleting the text section with animation
  const handleDeleteText = () => {
    Animated.timing(descriptionAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDeleted(true);
    });
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

  // Zoom-out animation for deleting images
  const handleDeleteImage = id => {
    const imageToDelete = images.find(img => img.id === id);
    if (!imageToDelete) return;

    Animated.timing(imageToDelete.scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setImages(images.filter(img => img.id !== id));
    });
  };

  const [recordedAudios, setRecordedAudios] = useState([
    {
      id: 1,
      name: 'Schedule_of_Con.mp3',
      duration: '00:05:33',
      scaleAnim: new Animated.Value(1),
    },
  ]);
  const [playingId, setPlayingId] = useState(null);
  const [showAudioSection, setShowAudioSection] = useState(true);

  const togglePlayPause = id => {
    setPlayingId(playingId === id ? null : id);
  };

  // Zoom-out animation for deleting audio
  const deleteAudio = id => {
    const audioToDelete = recordedAudios.find(audio => audio.id === id);
    if (!audioToDelete) return;

    Animated.timing(audioToDelete.scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const updatedAudios = recordedAudios.filter(audio => audio.id !== id);
      setRecordedAudios(updatedAudios);

      // Remove entire audio section if last audio is deleted
      if (updatedAudios.length === 0) {
        setShowAudioSection(false);
      }
    });
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('ClerkSnaggingCTReportDetails')}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.titel}>
            Walls and Ceilings:{'\n'} Check for cracks, uneven plaster, or paint
            imperfections.
          </Text>
          <Text style={styles.subtitel}>Select data recording option</Text>
          <View style={styles.BtnGap}>
            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() =>
                navigation.navigate('ClerkSnagginginspectionrecordText')
              }>
              <TextIcon />
              <Text style={styles.StartBtnTxt}>Text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() =>
                navigation.navigate('ClerkSnagginginspectionrecordAudio')
              }>
              <AudioIcon />
              <Text style={styles.StartBtnTxt}>Audio</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.AddedInfocontainer}>
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
                    onPress={() => setIsEditing(!isEditing)}>
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

            <View style={styles.imageRow}>
              {images.map(img => (
                <Animated.View
                  key={img.id}
                  style={[
                    styles.imageWrapper,
                    {transform: [{scale: img.scaleAnim}]},
                  ]}>
                  <Image source={img.uri} style={styles.image} />
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => handleDeleteImage(img.id)}>
                    <Trash name="trash-outline" size={18} color="#393D47" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
          {/* Audio Section */}
          {showAudioSection && (
            <View style={styles.Addedaduiocontainer}>
              <Text style={styles.descriptiontitle}>Recorded Audio</Text>
              <FlatList
                data={recordedAudios}
                keyExtractor={item => item.id.toString()}
                nestedScrollEnabled={true}
                renderItem={({item}) => (
                  <Animated.View
                    style={[
                      styles.audioItem,
                      {transform: [{scale: item.scaleAnim}]},
                    ]}>
                    <View style={styles.audioItemLft}>
                      <TouchableOpacity
                        style={styles.playIconaudio}
                        onPress={() => togglePlayPause(item.id)}>
                        <Icon
                          name={
                            playingId === item.id
                              ? 'controller-paus'
                              : 'controller-play'
                          }
                          size={28}
                          color="#393D47"
                        />
                      </TouchableOpacity>

                      <View style={styles.audioinfo}>
                        <Text style={styles.audioname}>{item.name}</Text>
                        <Text style={styles.audioduration}>
                          {item.duration}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => deleteAudio(item.id)}
                      style={styles.deleteIconaudio}>
                      <Trash name="trash-outline" size={20} color="#393D47" />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClerkSnagginginspectionrecord;

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
});
