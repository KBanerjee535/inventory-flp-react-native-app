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
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PrevPageArrow from "../assets/images/BackArrow.svg";
import TextIcon from "../assets/images/TextIcon.svg";
import AudioIcon from "../assets/images/AudioIcon.svg";
import Trash from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Entypo";
import GalleryIcon from "../assets/images/GalleryIcon.svg";
import CameraIcon from "../assets/images/CameraIcon.svg";
import WhiteArrow from "../assets/images/Blackarrow.svg";

import Download from "../assets/images/Download.svg";
import CloseIcon from "../assets/images/BlackCross.svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import PlusIcon from "../assets/images/PlusIcon.svg";

const Addanother = ({ navigation }) => {
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const descriptionAnim = useRef(new Animated.Value(1)).current;

  // State for toggles
  const [roomAudio, setRoomAudio] = useState(true);

  // State to track focused input field
  const [focusedInput, setFocusedInput] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

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
      uri: require("../assets/images/image1.jpg"),
      scaleAnim: new Animated.Value(1),
    },
    {
      id: 2,
      uri: require("../assets/images/image2.jpg"),
      scaleAnim: new Animated.Value(1),
    },
  ]);

  const [audioimages, setaudioImages] = useState([
    {
      id: 1,
      uri: require("../assets/images/image1.jpg"),
      scaleAnim: new Animated.Value(1),
    },
    {
      id: 2,
      uri: require("../assets/images/image2.jpg"),
      scaleAnim: new Animated.Value(1),
    },
  ]);

  // Zoom-out animation for deleting images
  const handleDeleteImage = (id) => {
    const imageToDelete = images.find((img) => img.id === id);
    if (!imageToDelete) return;

    Animated.timing(imageToDelete.scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setImages(images.filter((img) => img.id !== id));
    });
  };

  const [recordedAudios, setRecordedAudios] = useState([
    {
      id: 1,
      name: "Schedule_of_Con.mp3",
      duration: "00:05:33",
      scaleAnim: new Animated.Value(1),
    },
  ]);
  const [playingId, setPlayingId] = useState(null);
  const [showAudioSection, setShowAudioSection] = useState(true);

  const togglePlayPause = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  // Zoom-out animation for deleting audio
  const deleteAudio = (id) => {
    const audioToDelete = recordedAudios.find((audio) => audio.id === id);
    if (!audioToDelete) return;

    Animated.timing(audioToDelete.scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      const updatedAudios = recordedAudios.filter((audio) => audio.id !== id);
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
            onPress={() => navigation.navigate("ClerkCleaningSummaryList")}
          >
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Add Another</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.subtitel}>Title</Text>
          <TextInput style={styles.input} placeholder="Decorative Order" />

          <Text style={styles.subtitel}>Select data recording option</Text>
          <View style={styles.BtnGap}>
            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() =>
                navigation.navigate("ClerkAddBathroomDetailsAddText")
              }
            >
              <TextIcon />
              <Text style={styles.StartBtnTxt}>Text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.StartBtn}
              onPress={() =>
                navigation.navigate("ClerkAddBathroomDetailsAddAudio")
              }
            >
              <AudioIcon />
              <Text style={styles.StartBtnTxt}>Audio</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.AddedInfocontainer}>
            {!isDeleted && (
              <Animated.View
                style={{ transform: [{ scale: descriptionAnim }] }}
              >
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
                    onPress={() => setIsEditing(!isEditing)}
                  >
                    <Icon
                      name={isEditing ? "save" : "edit"}
                      size={18}
                      color="#393D47"
                    />
                    <Text style={styles.buttonText}>
                      {isEditing ? "Save Text" : "Edit Text"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDeleteText}
                  >
                    <Trash name="trash-outline" size={18} color="#393D47" />
                    <Text style={styles.buttonText}>Delete Text</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}

            <View style={styles.imageRow}>
              {images.map((img) => (
                <Animated.View
                  key={img.id}
                  style={[
                    styles.imageWrapper,
                    { transform: [{ scale: img.scaleAnim }] },
                  ]}
                >
                  <Image source={img.uri} style={styles.image} />
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => handleDeleteImage(img.id)}
                  >
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
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <Animated.View
                    style={[
                      styles.audioItem,
                      { transform: [{ scale: item.scaleAnim }] },
                    ]}
                  >
                    <View style={styles.audioItemLft}>
                      <TouchableOpacity
                        style={styles.playIconaudio}
                        onPress={() => togglePlayPause(item.id)}
                      >
                        <Icon
                          name={
                            playingId === item.id
                              ? "controller-paus"
                              : "controller-play"
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
                      style={styles.deleteIconaudio}
                    >
                      <Trash name="trash-outline" size={20} color="#393D47" />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            </View>
          )}
        </ScrollView>
        <View style={styles.Footer}>
          <TouchableOpacity style={styles.NextBtn}>
            <Text style={styles.NextBtnTxt}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Bottom Sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.ModalContainer}>
              <View style={styles.ModalContainerTop}>
                <View style={styles.ModalContainerTopHr}>
                  <Text style={styles.ModalTitel}>Add Item</Text>

                  {/* Close Button */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <CloseIcon width={30} height={30} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.descriptiontitle}>Item type</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Fixtures & Fittings"
                />
              </View>

              <View style={styles.ModalContainerBody}>
                <View style={styles.FrmBox}>
                  <Text style={styles.descriptiontitle}>Asset name</Text>
                  <TextInput style={styles.input} placeholder="Light" />
                  <Text style={styles.descriptiontitle}>Asset condition</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tested and working"
                  />
                </View>
                <View style={styles.FrmBox}>
                  <Text style={styles.descriptiontitle}>Asset name</Text>
                  <TextInput style={styles.input} placeholder="Light" />
                  <Text style={styles.descriptiontitle}>Asset condition</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Tested and working"
                  />

                  <TouchableOpacity
                    style={styles.dleButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.dleButtonTxt}>Remove asset</Text>
                    <Trash name="trash-outline" size={25} color="#393D47" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.addassetBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <PlusIcon name="trash-outline" size={25} color="#393D47" />
                  <Text style={styles.addassetBtnTxt}>Add new asset</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.Footer, styles.ModalFooter]}>
                <TouchableOpacity
                  style={styles.NextBtn}
                  onPress={() =>
                    navigation.navigate("ClerkCleaningSummaryList")
                  }
                >
                  <Text style={styles.NextBtnTxt}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Addanother;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: "#f1f2f6",
  },
  Body: {
    width: "100%",
    height: "100%",
    paddingLeft: 0,
    paddingRight: 0,
  },
  Header: {
    backgroundColor: "#f1f2f6",
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 40,
    paddingBottom: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  BackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 9999,
  },

  backIcon: {
    marginRight: 20,
  },
  container: {
    width: "100%",
    height: "100%",
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
  },
  titel: {
    color: "#151313",
    fontSize: 19,
    fontFamily: "BeVietnamPro-Medium",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 25,
  },
  subtitel: {
    color: "#434854",
    fontSize: 16,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",

    marginBottom: 15,
  },
  BtnGap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 25,
  },
  StartBtn: {
    width: "47%",
    backgroundColor: "#fff",
    height: 150,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  StartBtnTxt: {
    color: "#151313",
    fontSize: 19,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 15,
  },
  descriptiontitle: {
    fontSize: 15,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#434854",
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 15,
  },
  input: {
    fontSize: 14,
    color: "#434854",
    fontFamily: "BeVietnamPro-Regular",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FF8800", // Highlight border when editing
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 25,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 15,
    color: "#434854",
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
  },
  imageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 35,
    marginTop: 20,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  deleteIcon: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 20,

    width: 28,
    height: 28,
    margin: "auto",
  },
  AddedInfocontainer: {
    width: "100%",
    paddingTop: 30,
  },
  Addedaduiocontainer: { width: "100%", paddingBottom: 40 },

  audioItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deleteIconaudio: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: 40,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  playIconaudio: {
    backgroundColor: "#E4E5E7",
    borderRadius: "100%",
    width: 55,
    height: 55,

    alignItems: "center",
    justifyContent: "center",
  },
  audioItemLft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  audioname: {
    fontSize: 17,
    color: "#434854",
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
    marginBottom: 5,
  },
  audioduration: {
    fontSize: 14,
    color: "#727272",
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
  },
  pagetitleTxt: {
    color: "#151313",
    fontSize: 19,
    fontFamily: "BeVietnamPro-Medium",
    fontWeight: "500",
    textAlign: "center",
    position: "absolute",
    margin: "auto",
    left: 0,
    right: 0,
  },
  NextBtn: {
    backgroundColor: "#393D47",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 55,
    lineHeight: 50,

    borderRadius: 8,
  },
  NextBtnTxt: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "BeVietnamPro-SemiBold",
    fontWeight: "600",
  },
  Footer: {
    padding: 25,
    paddingBottom: 20,
  },
  ForgetBtn: {
    width: "100%",
    marginTop: 15,
    lineHeight: 40,
    textAlign: "center",
    height: 40,
  },
  ForgetBtnTxt: {
    color: "#6D7D93",
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    fontWeight: "500",
    textAlign: "center",
  },

  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    marginTop: 15,
    justifyContent: "flex-start",
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: "#434854",
    color: "#434854",
    fontFamily: "BeVietnamPro-Regular",
  },
  input: {
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#434854",
    fontFamily: "BeVietnamPro-Regular",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00218F47",
    minHeight: 50,
    marginBottom: 10,
  },
  inputFocused: {
    borderColor: "#D97706",
  },
  recordButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },
  recordText: {
    color: "#393D47",
    fontSize: 16,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "40",
  },
  newcontainer: {
    width: "100%",
  },
  StartBtn2: {
    width: "47%",
    backgroundColor: "#fff",
    height: 150,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#00218F47",
  },
  OtherGap: {
    borderTopWidth: 1,
    borderTopColor: "#00218F47",
    width: "100%",
    paddingTop: 15,
    marginBottom: 20,
  },
  AudioSwitch: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
  },
  sectionFixtures: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  NextBtn2: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    marginTop: 15,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 25,
  },
  NextBtn2Txt: {
    color: "#393D47",
    fontSize: 18,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "40",
  },
  /* Modal Styles */
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "95%",
  },
  closeButton: {
    alignSelf: "flex-end",
    cursor: "pointer",
    marginRight: 0,
    marginTop: 0,
    zIndex: 999,
  },

  ModalContainer: {
    backgroundColor: "#F1F2F6",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  ModalTitel: {
    fontSize: 16,
    color: "#000",
    fontFamily: "BeVietnamPro-SemiBold",
    marginBottom: 0,
    marginTop: 0,
  },

  ModalContainerTop: {
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  ModalContainerTopHr: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom: 15,
  },
  ModalContainerBody: {
    width: "100%",
    padding: 20,
  },
  FrmBox: {
    borderBottomColor: "#B8C1E0",
    borderBottomWidth: 1,
    paddingBottom: 15,
    paddingTop: 15,
  },
  dleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 15,
    paddingTop: 15,
    justifyContent: "flex-end",
  },
  dleButtonTxt: {
    fontSize: 16,
    color: "#9FA5BD",
    fontFamily: "BeVietnamPro-SemiBold",
  },
  addassetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    backgroundColor: "#F1F2F6",
    width: 180,
    left: 0,
    right: 0,
    margin: "auto",
    marginTop: -15,
  },
  addassetBtnTxt: {
    fontSize: 16,
    color: "#393D47",
    fontFamily: "BeVietnamPro-Regular",
  },
  ModalFooter: {
    backgroundColor: "#fff",
  },
});
