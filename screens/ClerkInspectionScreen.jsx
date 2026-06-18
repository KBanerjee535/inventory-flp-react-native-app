import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
  Modal,
  TextInput,
  ActivityIndicator
} from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Entypo";
import Arrow from "react-native-vector-icons/Ionicons";
import ItemIcon1 from "../assets/images/ItemIcon1.svg";
import ItemIcon2 from "../assets/images/ItemIcon2.svg";
import ItemIcon3 from "../assets/images/ItemIcon3.svg";
import ItemIcon4 from "../assets/images/ItemIcon4.svg";
import ItemIcon5 from "../assets/images/ItemIcon5.svg";
import ItemIcon6 from "../assets/images/ItemIcon6.svg";
import ItemIcon7 from "../assets/images/ItemIcon7.svg";
import ItemIcon8 from "../assets/images/sectionall.svg";
import axios from "axios";
import {
  getSectionListByInventoryIdAPI,
  AddSectionByClerkApi,
  allRequiredSectionsExistOrNotApi,
  ApproveEditedReportApi,
} from "../services/apiService";
import { useUserContext } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";
import { format } from "date-fns";

import AddPlus from "../assets/images/AddPlus.svg";
import Voice from '@react-native-voice/voice';
import Ionicons from 'react-native-vector-icons/Ionicons';

const staticItems = [
  {
    id: 2,
    icon: <ItemIcon2 width={24} height={24} />,
    text: "Cleaning Summary",
    screen: "ClerkCleaningSummary",
  },
  {
    id: 1,
    icon: <ItemIcon1 width={24} height={24} />,
    text: "Schedule of Conditions",
    screen: "ClerkCleaningSummaryList",
  },

  {
    id: 3,
    icon: <ItemIcon3 width={24} height={24} />,
    text: "Keys",
    screen: "ClerkKeysList",
  },
  {
    id: 4,
    icon: <ItemIcon4 width={24} height={24} />,
    text: "Alarms",
    screen: "ClerkAlarmList",
  },
  {
    id: 5,
    icon: <ItemIcon5 width={24} height={24} />,
    text: "Meters",
    screen: "ClerkMetersList",
  },
];

const ClerkInspectionScreen = ({ navigation }) => {
  const {
    setUserData,
    setIsLoggedIn,
    seletedJobId,
    seletedJobDetails,
    setRecordingPath,
    setSelectedSection,
  } = useUserContext();
  const [screenLoading, setScreenLoading] = useState(false);
  const [SectionListByInventoryId, setSectionListByInventoryId] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [fadeAnims, setFadeAnims] = useState(
    staticItems.map(() => new Animated.Value(0))
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
const [sectionNotesState, setSectionNotesState] = React.useState({});



  const getSectionsList = async () => {
    try {
      setScreenLoading(true);
      //alert(seletedJobId)
      let fd = new FormData();
      fd.append("inventory_id", seletedJobId);

      let response = await getSectionListByInventoryIdAPI(fd);
      const apiData = response.data.data;
      //alert(apiData);
      setSectionListByInventoryId(apiData);

      setScreenLoading(false);
    } catch (error) {
      Toast.show(
        error.response?.data?.errors ||
          "Something went wrong, please try again."
      );
      setScreenLoading(false);
    }
  };

  const getAllRequiredSectionsExistOrNot = async () => {
    //alert(seletedJobId)
    try {
      let fd = new FormData();
      fd.append("inventory_id", seletedJobId);
      let response = await allRequiredSectionsExistOrNotApi(fd);
      const apiData = response.data;
      console.log("all", response);
      if (apiData.status === true) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    } catch (error) {}
  };

  const addNewSection = async () => {
    try {
      if (newSectionName == "" || newSectionName == undefined) {
        Toast.show("Please enter Section name.");
        return false;
      }

      setScreenLoading(true);
      let fd = new FormData();
      fd.append("inventory_id", seletedJobId);
      fd.append("section_name", newSectionName);
      fd.append("section_type", newSectionName);
      fd.append("property_id", seletedJobDetails?.property_details[0]?.id);
      fd.append("report_type", seletedJobDetails?.report_type);
      let response = await AddSectionByClerkApi(fd);
      const apiData = response.data;
      if (response.data.status == true) {
        getSectionsList();
        setIsModalVisible(false);
        setNewSectionName("");
        Toast.show(response.data.message);
      } else {
        Toast.show(response.data.message);
      }
      setScreenLoading(false);
    } catch (error) {
      Toast.show(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
      setScreenLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      setScreenLoading(true);
      let fd = new FormData();
      fd.append("inventory_id", seletedJobId);

      let response = await ApproveEditedReportApi(fd);
      const apiData = response.data;
      console.log("onSubmit", response);
      if (apiData.status === true) {
        Toast.show(apiData.message);
        getAllRequiredSectionsExistOrNot();
      } else {
        Toast.show(apiData.errors);
      }
      setScreenLoading(false);
    } catch (error) {
      Toast.show(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
      setScreenLoading(false);
    }
  };

  const goToSectionDetailsPage = async (section) => {
    setSelectedSection(section);
    navigation.navigate("ClerkAddBedroomDetails");
  };
  useEffect(() => {
    setRecordingPath("");
    getSectionsList();
    getAllRequiredSectionsExistOrNot();
  }, []);

  useEffect(() => {
    // Recalculate fadeAnims when API data changes
  }, [SectionListByInventoryId]);

  useEffect(() => {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 200,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnims]);

  useEffect(() => {
    // Bind Voice Events
    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechError = (e) => {
      console.log('Voice Error: ', e.error);
      setIsRecording(false);
    };
    
    // Live results
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        // Option A: Overwrite text area with voice input
        // setRecognizedText(e.value[0]);
        
        // Option B: Append to existing text instead (uncomment below if preferred)
        setRecognizedText((prevText) => prevText + " " + e.value[0]);
      }
    };

    // Clean up listeners on unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // UI Control Functions
  const startRecording = async () => {
    try {
      setRecognizedText('');
      // Use 'en-US' or any locale code like 'es-ES', 'fr-FR', etc.
      await Voice.start('en-US'); 
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      // "Pause" or Stop listening
      try {
        await Voice.stop();
        setIsRecording(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      // Start listening
      try {
        Keyboard.dismiss(); // Close keyboard so user can focus on speaking
        setIsRecording(true);
        await Voice.start('en-US'); 
      } catch (error) {
        console.error(error);
      }
    }
  };

const handleTextAppend = () => {
  const fullSpokenText = recognizedText.trim();
  if (!fullSpokenText) return;

  // 1. Split the spoken text into individual sentences/lines 
  // This matches split parameters by line breaks, periods, or commas
  const sentences = fullSpokenText.split(/\n|\.|\,+/);

  // Create a temporary object to stage state updates before mutating React state
  const updatedNotesMap = {};

  sentences.forEach((sentence) => {
    const cleanSentence = sentence.trim();
    if (!cleanSentence) return; // Skip empty chunks

    let matchedId = null;
    let matchedType = null;
    let categoryName = "";

    // 2. Check Dynamic API items first for a match inside this single sentence
    const dynamicMatch = SectionListByInventoryId?.find(section => 
      cleanSentence.toLowerCase().includes(section.name.toLowerCase())
    );

    // 3. Check Static items second inside this single sentence
    const staticMatch = staticItems.find(item => 
      cleanSentence.toLowerCase().includes(item.text.toLowerCase())
    );

    if (dynamicMatch) {
      matchedId = dynamicMatch.id;
      matchedType = 'dynamic';
      categoryName = dynamicMatch.name;
    } else if (staticMatch) {
      matchedId = staticMatch.id;
      matchedType = 'static';
      categoryName = staticMatch.text;
    }

    // 4. If a match is found for this specific sentence, prepare the update entry
    if (matchedId) {
      const stateKey = `${matchedType}-${matchedId}`;
      
      // Clean up the text sentence by stripping away its matching category name prefix if desired
      // E.g., turning "Meter box is broken" into "is broken" or keep it as is.
      // To keep the full phrase, leave 'textToSave = cleanSentence'.
      const textToSave = cleanSentence; 

      if (!updatedNotesMap[stateKey]) {
        updatedNotesMap[stateKey] = [];
      }
      updatedNotesMap[stateKey].push(textToSave);
    }
  });

  // 5. Batch update your React Native state dictionary safely in one operational hook loop
  setSectionNotesState((prevState) => {
    const newState = { ...prevState };

    Object.keys(updatedNotesMap).forEach((key) => {
      const existingNotes = newState[key];
      const newSentencesString = updatedNotesMap[key].join('\n');

      newState[key] = existingNotes 
        ? `${existingNotes}\n${newSentencesString}` 
        : newSentencesString;
    });

    return newState;
  });

  // Clear your voice entry box smoothly
  setRecognizedText('');
};


  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <ScrollView>
        <View style={styles.Body}>
          <View style={styles.Header}>
            <View style={styles.HeaderLft}>
              {seletedJobDetails?.report_type == "Check-in" && (
                <View style={styles.indicator}>
                  <View style={[styles.statusindicator, styles.checkIn]}></View>
                  <Text style={styles.indicatorTxt}>
                    {seletedJobDetails?.report_type}
                  </Text>
                </View>
              )}

              {seletedJobDetails?.report_type == "Check-out" && (
                <View style={styles.indicator}>
                  <View
                    style={[styles.statusindicator, styles.checkOut]}
                  ></View>
                  <Text style={styles.indicatorTxt}>
                    {seletedJobDetails?.report_type}
                  </Text>
                </View>
              )}
              {seletedJobDetails?.report_type == "Mid-term" && (
                <View style={styles.indicator}>
                  <View style={[styles.statusindicator, styles.midterm]}></View>
                  <Text style={styles.indicatorTxt}>
                    {seletedJobDetails?.report_type}
                  </Text>
                </View>
              )}
              <Text style={styles.HeaderLftTxt}>
                {seletedJobDetails?.property_details[0]?.address_1}
              </Text>
            </View>

            <View style={styles.HeaderRgt}>
              <TouchableOpacity
                style={styles.MoreBtn}
                onPress={() => setShowTooltip(!showTooltip)}
              >
                <Icon name="dots-three-vertical" size={28} color="#393D47" />
              </TouchableOpacity>

              {showTooltip && (
                <View style={styles.tooltipContainer}>
                  {/* Arrow */}
                  <View style={styles.tooltipArrow} />
                  {/* Tooltip Box */}
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipText}>Download Report</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.List}>
            <Text style={styles.ListHr}>Sections of inspection</Text>

            {/* 1. Static items loop */}
{staticItems.map((item, index) => {
  // Safe layout key generation ensures React keeps nodes isolated
  const layoutKey = `static-entity-row-${item.id}`;
  const animationOpacity = fadeAnims && fadeAnims[index] ? fadeAnims[index] : 1;

  return (
    <Animated.View
      key={layoutKey}
      style={{ opacity: animationOpacity }}
    >
      <TouchableOpacity
        style={styles.ListItem}
        onPress={() => navigation.navigate(item.screen)}
      >
        <View style={styles.ListItemInnerContainer}>
          <View style={styles.ListItemInner}>
            {item.icon}
            <Text style={styles.ListItemTxt}>{item.text}</Text>
          </View>
          
          {/* Render Speech-to-text added notes safely */}
          {sectionNotesState && sectionNotesState[`static-${item.id}`] && (
            <Text style={styles.appendedNotesText}>
              {sectionNotesState[`static-${item.id}`]}
            </Text>
          )}
        </View>
        <Arrow name="chevron-forward-outline" size={28} color="#393D47" />
      </TouchableOpacity>
    </Animated.View>
  );
})}

{/* 2. Dynamic API items loop */}
{SectionListByInventoryId?.map((section, index) => {
  const layoutKey = `dynamic-entity-row-${section.id}`;
  
  // Calculate dynamic animation index offsets safely outside the style object
  const targetAnimIndex = staticItems.length + index;
  const animationOpacity = fadeAnims && fadeAnims[targetAnimIndex] ? fadeAnims[targetAnimIndex] : 1;

  return (
    <Animated.View
      key={layoutKey}
      style={{ opacity: animationOpacity }}
    >
      <TouchableOpacity
        style={styles.ListItem}
        onPress={() => goToSectionDetailsPage(section)}
      >
        <View style={styles.ListItemInnerContainer}>
          <View style={styles.ListItemInner}>
            <ItemIcon8 width={24} height={24} />
            <Text style={styles.ListItemTxt}>{section.name}</Text>
          </View>

          {/* Render Speech-to-text added notes safely */}
          {sectionNotesState && sectionNotesState[`dynamic-${section.id}`] && (
            <Text style={styles.appendedNotesText}>
              {sectionNotesState[`dynamic-${section.id}`]}
            </Text>
          )}
        </View>
        <Arrow name="chevron-forward-outline" size={28} color="#393D47" />
      </TouchableOpacity>
    </Animated.View>
  );
})}

          </View>

          {/* <TouchableOpacity
            style={styles.NextBtn}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.NextBtnTxt}>Add Another</Text>
          </TouchableOpacity> */}
          <Text style={styles.title}>Voice Note Editor</Text>
          {/* Speak / Pause Toggle Button */}
          <View style={{ alignItems: 'center', width: '90%', marginBottom: 8 }}>
  <TouchableOpacity 
    style={[styles.micButton, isRecording ? styles.micActive : styles.micInactive]} 
    onPress={handleMicPress}
    activeOpacity={0.7}
  >
    <Ionicons 
      name={isRecording ? "pause" : "mic"} 
      size={24} 
      color="#FFF" 
    />
  </TouchableOpacity>
</View>
{/* Container for Editable TextArea & Controls */}
<View style={styles.editorContainer}>
  <TextInput
    style={styles.textArea}
    multiline={true}
    numberOfLines={10}
    placeholder="Type something here or tap the mic to speak..."
    placeholderTextColor="#999"
    value={recognizedText}
    onChangeText={(newText) => setRecognizedText(newText)}
    textAlignVertical="top"
  />
  
  {/* Toolbar below the textarea */}
<View style={styles.toolbar}>
  {isRecording ? (
    <View style={styles.recordingStatus}>
      <ActivityIndicator size="small" color="#FF3B30" />
      <Text style={styles.recordingText}>Listening...</Text>
    </View>
  ) : (
    <View />
  )}

  {/* Button Container grouping Add and Mic buttons horizontally */}
<View style={styles.actionButtonsContainer}>
  
  {/* Conditionally render the Add Button only if recognizedText has content */}
  {recognizedText.trim().length > 0 && (
    <TouchableOpacity 
      style={styles.fullWidthAddButton} 
      onPress={handleTextAppend}
      activeOpacity={0.8}
    >
      <Text style={styles.fullWidthAddButtonLabel}>Add Text to Sections</Text>
    </TouchableOpacity>
  )}

  
</View>
</View>

</View>


          <TouchableOpacity
            //style={styles.StartBtn}
            style={[styles.StartBtn, isDisabled && styles.DisabledBtn]}
            disabled={isDisabled}
            onPress={() => onSubmit()}
          >
            <Text
              style={styles.StartBtnTxt}
              // style={[
              //   styles.StartBtnTxt,
              //   isDisabled && styles.DisabledBtnTxt,
              // ]}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Section</Text>

                <TextInput
                  style={styles.textInput}
                  placeholder="Enter section name"
                  value={newSectionName}
                  onChangeText={setNewSectionName}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      // handle save logic here
                      console.log("New Section:", newSectionName);
                      Keyboard.dismiss();
                      addNewSection();
                    }}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>

      <View style={styles.tooltip_container}>
        {/* Tooltip Text */}
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>ADD NEW SECTION</Text>
          <View style={styles.tooltipArrow} />
        </View>

        {/* Orange Plus Button */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate("AddNewSection")}
        >
          <AddPlus style={styles.AddPlus} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ClerkInspectionScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: "#f1f2f6",
  },
  Body: {
    width: "100%",
    height: "100%",
    paddingLeft: 25,
    paddingRight: 25,
  },
  Header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 25,
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusindicator: {
    width: 12,
    height: 12,
    borderRadius: "100%",
  },
  checkIn: {
    backgroundColor: "#3CC6ED",
  },
  checkOut: {
    backgroundColor: "#4561aa",
  },
  midterm: {
    backgroundColor: "#ffb850",
  },
  indicatorTxt: {
    color: "#393D47",
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    fontWeight: "400",
  },
  MoreBtn: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: 20,
  },
  HeaderLftTxt: {
    color: "#151313",
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 20,
    fontWeight: "500",
  },
  List: {
    width: "100%",
    paddingTop: 35,
  },
  ListHr: {
    color: "#525050",
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 14,
    fontWeight: "400",
    textTransform: "uppercase",
    marginBottom: 25,
  },
  ListItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ListItemInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
  },
  ListItemTxt: {
    color: "#393D47",
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 15,
    fontWeight: "400",
  },

  tooltipContainer: {
    position: "absolute",
    top: 40,
    right: -7, // Align tooltip to the right
    alignItems: "flex-end", // Align arrow to the right
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#333", // Same as tooltip background
    alignSelf: "flex-end", // Align arrow to the right
    marginRight: 5, // Adjust arrow position
    marginBottom: -1, // Slight overlap with tooltip
  },
  tooltip: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 5,
    width: 155,
    height: 45,
    alignItems: "center",
  },

  tooltipText: {
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 15,
    fontWeight: "400",
    color: "#fff",
  },
  NextBtn: {
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
  },
  NextBtnTxt: {
    color: "#393D47",
    fontSize: 18,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "40",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
  },
  BtnGrp: {
    padding: 25,
    paddingBottom: 15,
    alignItems: "center",
  },
  StartBtnTxt: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "BeVietnamPro-SemiBold",
    fontWeight: "600",
  },
  StartBtn: {
    backgroundColor: "#393D47",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 15,
  },
  DisabledBtn: {
    backgroundColor: "#b0b0b0", // Greyed out
  },
  DisabledBtnTxt: {
    color: "#666", // Dimmed text color
  },
  tooltip_container: {
    position: "absolute",
    right: 20,
    bottom: 40,
    alignItems: "center",
    gap: "15",
    flexDirection: "row",
  },
  tooltip: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
  },
  tooltipText: {
    color: "#333",
    fontWeight: "600",
  },
  tooltipArrow: {
    position: "absolute",
    right: -5,
    top: "40%",
    transform: [{ translateY: -10 }],
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#fff",
  },
  plusButton: {
    width: 60,
    height: 60,
    backgroundColor: "#ff8800",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  editorContainer: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  textArea: {
    width: '100%',
    height: 250,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  micInactive: {
    backgroundColor: '#007AFF', // Blue when idle
  },
  micActive: {
    backgroundColor: '#FF3B30', // Red when listening (acting as pause option)
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  fullWidthAddButton: {
    width: '100%',             // Direct full width structural stretching
    backgroundColor: '#007AFF', // Solid block color accent background
    paddingVertical: 14,       // Comfortable internal padding thickness
    borderRadius: 8,           // Smoothly matches text area radius cuts
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,             // Even distribution margins between components
    marginBottom: 4,
  },
  fullWidthAddButtonLabel: {
    color: '#FFFFFF',           // Crisp white label contrast over theme fill
    fontSize: 16,
    fontWeight: '600',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appendedNotesText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    paddingLeft: 32, // Indents the voice notes beautifully right underneath the item label row
  }
});
