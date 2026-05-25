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
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import PrevPageArrow from "../assets/images/BackArrow.svg";
import TextIcon from "../assets/images/TextIcon.svg";
import AudioIcon from "../assets/images/AudioIcon.svg";
import Trash from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Entypo";
import Toast from "react-native-simple-toast";
import { useUserContext } from "../context/UserContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";

import {
  DeleteAllImageByIdApi,
  MeterAddApi,
  MeterDeleteApi,
  MeterDeleteAudioByIdApi,
  MeterDetailsByMeterIdApi,
  MeterUpdateApi,
  MeterUpdateTextByIdApi,
  getMeterTypesApi,
} from "../services/apiService";

const ClerkAddMeter = ({ navigation, route }) => {
  const {
    metersData,
    setMetersData,
    setRecordingPath,
    seletedJobId,
    seletedJobDetails,
  } = useUserContext();
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const descriptionAnim = useRef(new Animated.Value(1)).current;
  const [focusedInput, setFocusedInput] = useState(null);
  const [screenLoading, setScreenLoading] = useState(false);

  const { meterData, mode } = route.params || {};

  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    inventory_id: meterData?.inventory_id || "77",
    property_id: meterData?.property_id || "1",
    client_id: meterData?.client_id || "100",
    meter_title: meterData?.meter_title || "",
    reading_date: meterData?.reading_date || "",
    serial_number: meterData?.serial_number,
    meter_reading: meterData?.meter_reading,
    location: meterData?.location || "",
    description: meterData?.description || "",
    accessible: meterData?.accessible,
    type: meterData?.type,
    audio: meterData?.audio || null,
    id: meterData?.id || null,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [MeterTypes, setMeterType] = useState();
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setFormData({
      ...formData,
      reading_date: moment(date).format("YYYY-MM-DD"),
    });
    hideDatePicker();
  };

  const [audioFile, setAudioFile] = useState(
    meterData?.audio
      ? {
          uri: meterData.audio_with_path,
          type: "audio/mp3",
          name: meterData.audio,
        }
      : null
  );

  const headerTitle = isEditMode ? "Edit Meter" : "Add Meter";

  const handleSubmit = async () => {
    if (!formData.meter_title.trim()) {
      Toast.show("Please enter meter title", Toast.SHORT);
      return;
    }

    if (!formData.serial_number.trim()) {
      Toast.show("Please enter serial number", Toast.SHORT);
      return;
    }
    if (!formData.reading_date.trim()) {
      Toast.show("Please enter reading date", Toast.SHORT);
      return;
    }
    if (!formData.location.trim()) {
      Toast.show("Please enter location", Toast.SHORT);
      return;
    }
    if (!formData.type.trim()) {
      Toast.show("Please enter meter type ", Toast.SHORT);
      return;
    }
    if (!formData.meter_reading.trim()) {
      Toast.show("Please enter meter reading ", Toast.SHORT);
      return;
    }

    try {
      const fd = new FormData();

      // Append all text fields
      fd.append("inventory_id", seletedJobDetails?.id);
      fd.append("property_id", seletedJobDetails?.property_id);
      fd.append("client_id", seletedJobDetails?.client_id);
      fd.append("meter_title", formData.meter_title);
      fd.append("reading_date", formData.reading_date);
      fd.append("serial_number", formData.serial_number);
      fd.append("meter_reading", formData.meter_reading);
      fd.append("location", formData.location);
      fd.append("type", formData.type);
      fd.append("accessible", formData.accessible);

      // Use the appropriate API endpoint based on mode
      let response;
      if (isEditMode) {
        fd.append("meter_id", formData.id);
        response = await MeterUpdateApi(fd); // You'll need to create this API function
      } else {
        response = await MeterAddApi(fd);
      }

      if (response.data.status === true) {
        Toast.show(
          isEditMode
            ? "Meter updated successfully!"
            : "Meter added successfully!",
          Toast.SHORT
        );
        navigation.navigate("ClerkMetersList");
      } else {
        Toast.show(
          response.data.message ||
            (isEditMode ? "Failed to update meter" : "Failed to add meter"),
          Toast.SHORT
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.show("Error processing request", Toast.SHORT);
    }
  };

  // Add delete functionality
  const handleDelete = async () => {
    Alert.alert(
      "Delete Meter",
      "Are you sure you want to delete this meter?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const fd = new FormData();
              fd.append("meter_id", formData.id);

              const response = await MeterDeleteApi(fd); // You'll need to create this API function

              if (response.data.status === true) {
                Toast.show("Meter deleted successfully!", Toast.SHORT);
                navigation.navigate("ClerkMetersList");
              } else {
                Toast.show(
                  response.data.message || "Failed to delete meter",
                  Toast.SHORT
                );
              }
            } catch (error) {
              console.error("Error deleting meter:", error);
              Toast.show("Error deleting meter", Toast.SHORT);
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
      fd.append("meter_id", meterData?.id);
      fd.append("description", "");

      let response = await MeterUpdateTextByIdApi(fd);
      if (response.status === 200) {
        Animated.timing(descriptionAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsDeleted(true);
          setMetersData((prev) => ({ ...prev, description: null })); // Clear from state
          Toast.show("Text deleted successfully!", Toast.SHORT);
          getMeterDetail();
          setScreenLoading(false);
        });
      } else {
        setScreenLoading(false);
        Toast.show("Failed to delete text. Please try again.", Toast.SHORT);
      }
    } catch (error) {
      console.error("Error deleting text:", error);
      Toast.show("An error occurred. Please try again.", Toast.SHORT);
    }
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
  const handleDeleteImage = async (pid) => {
    try {
      let fd = new FormData();
      fd.append("image_id", pid);
      //alert(JSON.stringify(fd))
      let response = await DeleteAllImageByIdApi(fd);
      //alert(JSON.stringify(response));

      getMeterDetail();
      // Remove from local state after successful delete
    } catch (error) {
      //alert();
    }
  };

  const [recordedAudios, setRecordedAudios] = useState(
    meterData?.audio
      ? [
          {
            id: meterData.id,
            name: meterData.audio,
            duration: "00:00:00",
            scaleAnim: new Animated.Value(1),
          },
        ]
      : []
  );

  const [playingId, setPlayingId] = useState(null);
  const [showAudioSection, setShowAudioSection] = useState(true);

  const togglePlayPause = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  const deleteAudio = async (id, scheduleConditionId) => {
    const audioToDelete = recordedAudios.find((audio) => audio.id === id);
    if (!audioToDelete) return;

    try {
      setScreenLoading(true);

      // 🔹 Call API to delete audio from the backend
      let fd = new FormData();
      fd.append("meter_id", meterData?.id);
      let response = await MeterDeleteAudioByIdApi(fd);

      if (response.status === 200) {
        // 🔹 Animate zoom-out effect before deletion
        Animated.timing(audioToDelete.scaleAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(async () => {
          setScreenLoading(false);

          console.log("Audio deleted successfully:", response.data);
          getMeterDetail();
          // 🔹 Remove audio from UI after successful deletion
          const updatedAudios = recordedAudios.filter(
            (audio) => audio.id !== id
          );
          setRecordedAudios(updatedAudios);
        });
      } else {
        setScreenLoading(false);

        // console.warn('Failed to delete audio:', response.data);
      }
    } catch (error) {
      setScreenLoading(false);

      console.error("Error deleting audio:", error);
    }
  };

  const handleEditText = async () => {
    if (!isEditing) {
      setIsEditing(true); // Start editing
      return;
    }
    if (!description.trim()) {
      Toast.show("Please enter a description.");
      return;
    }

    try {
      setScreenLoading(true);
      let fd = new FormData();
      fd.append("meter_id", metersData?.id);
      fd.append("description", description);

      let response = await MeterUpdateTextByIdApi(fd);
      setIsEditing(false); // Start editing
      setScreenLoading(false);
      getMeterDetail();
    } catch (error) {
      console.error("Error saving description:", error);
      Toast.show("Failed to save description. Please try again.", Toast.SHORT);
    }
  };

  const getMeterList = async () => {
    try {
      setScreenLoading(true);

      let fd = new FormData();
      fd.append(" ", " ");

      let response = await getMeterTypesApi(fd);

      // Show response as a string (for debug purposes only)
      console.log(JSON.stringify(response));
      setMeterType(response?.data?.data);
      // You can optionally process the response here
      // Example: setMeterList(response.data);
    } catch (error) {
      console.error("Error fetching meter types:", error);
      alert("Failed to fetch meter types. Please try again.");
    } finally {
      setScreenLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(d.getFullYear()).slice(2)}`;
  };

  const getMeterDetail = async () => {
    //alert();
    try {
      setScreenLoading(true);
      let fd = new FormData();
      //alert(seletedJobId);
      fd.append("meter_id", meterData?.id);
      let response = await MeterDetailsByMeterIdApi(fd);
      console.log("Meter all details", response.data.data[0]);
      setMetersData(response.data.data[0]);
      setDescription(response.data.data[0]?.description);
      setScreenLoading(false);

      if (response.data.data[0]?.audio) {
        setRecordedAudios([
          {
            id: response.data.data[0]?.id,
            url: response.data.data[0]?.audio_with_paths,
            name: response.data.data[0]?.audio,
            duration: "00:00",
            scaleAnim: new Animated.Value(1),
          },
        ]);
      } else {
        setRecordedAudios();
      }
    } catch (error) {
      setScreenLoading(false);

      Toast.show(
        error.response?.data?.errors ||
          "Something went wrong, please try again."
      );

      //throw error.response?.data || 'Failed to fetch inventory list';
    }
  };

  useEffect(() => {
    getMeterDetail();
    getMeterList();
  }, []);

  // 🔹 Update audio list when new API response comes in

  console.log("MetersDatameter_image", metersData);
  useEffect(() => {
    if (metersData?.audio_with_paths) {
      setRecordedAudios([
        {
          id: metersData?.id,
          url: metersData?.audio_with_paths,
          name: metersData?.audio,
          duration: "00:00",
          scaleAnim: new Animated.Value(1),
        },
      ]);
    }
  }, [metersData]);
  const dropdownData = MeterTypes?.map((type) => ({
    label: type.name,
    value: type.name,
  }));
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate("ClerkMetersList")}
          >
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>{headerTitle}</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.subtitel}>Meter Title</Text>

          <View style={styles.frmRowFull}>
            <TextInput
              style={[
                styles.searchInput,
                focusedInput === "input1" && styles.searchFocused,
              ]}
              placeholder="Meter Title"
              value={formData.meter_title}
              onChangeText={(text) =>
                setFormData({ ...formData, meter_title: text })
              }
              onFocus={() => setFocusedInput("input1")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.frmRowFull}>
            <Text style={styles.subtitel}>Meter Type</Text>

            <Dropdown
              style={[
                styles.dropdown,
                focusedInput === "meterType" && styles.searchFocused,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={dropdownData}
              labelField="label"
              valueField="value"
              placeholder="Select Meter Type"
              value={formData.type}
              onFocus={() => setFocusedInput("meterType")}
              onBlur={() => setFocusedInput(null)}
              onChange={(item) => {
                setFormData({ ...formData, type: item.value });
              }}
            />
          </View>

          <View style={styles.frmRowinner}>
            <Text style={styles.subtitel}>Accessible</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {["Yes", "No"].map((option) => (
                <Pressable
                  key={option}
                  onPress={() =>
                    setFormData({ ...formData, accessible: option })
                  }
                  style={[
                    styles.toggleButton,
                    formData.accessible === option && styles.toggleButtonActive,
                  ]}
                >
                  <Text
                    style={
                      formData.accessible === option
                        ? styles.toggleTextActive
                        : styles.toggleText
                    }
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.frmRow}>
            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Meter Reading</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  focusedInput === "input3" && styles.searchFocused,
                ]}
                placeholder="Meter Reading"
                value={formData.meter_reading}
                onChangeText={(text) =>
                  setFormData({ ...formData, meter_reading: text })
                }
                onFocus={() => setFocusedInput("input3")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Serial Number</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  focusedInput === "input3" && styles.searchFocused,
                ]}
                placeholder="Serial Number"
                value={formData.serial_number}
                onChangeText={(text) =>
                  setFormData({ ...formData, serial_number: text })
                }
                onFocus={() => setFocusedInput("input3")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>
          <View style={styles.frmRow}>
            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Reading Date</Text>

              <Pressable
                onPress={showDatePicker}
                style={[
                  styles.searchInputDate,
                  focusedInput === "input2" && styles.searchFocused,
                ]}
                onFocus={() => setFocusedInput("input2")}
                onBlur={() => setFocusedInput(null)}
              >
                <Text>
                  {formData.reading_date
                    ? formatDate(formData.reading_date)
                    : "Select Reading Date"}
                </Text>
              </Pressable>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={
                  formData.reading_date
                    ? new Date(formData.reading_date)
                    : new Date()
                }
                minimumDate={new Date()}
              />
            </View>

            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Location</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  focusedInput === "input3" && styles.searchFocused,
                ]}
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                onFocus={() => setFocusedInput("input3")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {mode === "edit" ? (
            <>
              <Text style={styles.subtitel}>Select data recording option</Text>

              <View style={styles.BtnGap}>
                <TouchableOpacity
                  style={[
                    styles.StartBtn,
                    metersData?.description || metersData?.audio || !isEditMode
                      ? styles.disabledBtn
                      : {},
                  ]}
                  onPress={() => navigation.navigate("ClerkAddMeterAddText")}
                  disabled={
                    !!(
                      metersData?.description ||
                      metersData?.audio ||
                      !isEditMode
                    )
                  }
                >
                  <TextIcon />
                  <Text style={styles.StartBtnTxt}>Text</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.StartBtn,
                    metersData?.description || metersData?.audio || !isEditMode
                      ? styles.disabledBtn
                      : {},
                  ]}
                  // onPress={handleAudioRecording}
                  onPress={() =>
                    metersData?.description || metersData?.audio
                      ? null
                      : [
                          navigation.navigate("ClerkAddMeterAddAudio"),
                          setRecordingPath(""),
                        ]
                  }
                  disabled={
                    !!(
                      metersData?.description ||
                      metersData?.audio ||
                      !isEditMode
                    )
                  }
                >
                  <AudioIcon />
                  <Text style={styles.StartBtnTxt}>Audio</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            ""
          )}

          {metersData?.description && (
            <>
              <View style={styles.AddedInfocontainer}>
                {!isDeleted && (
                  <Animated.View
                    style={{ transform: [{ scale: descriptionAnim }] }}
                  >
                    <Text style={styles.descriptiontitle}>
                      Text Description
                    </Text>
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
                        onPress={handleEditText}
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
              </View>

              <View style={styles.AddedInfocontainer}>
                <View style={styles.imageRow}>
                  {metersData?.description !== "" &&
                    Array.isArray(metersData?.meter_image) &&
                    metersData.meter_image.map((img) => (
                      <Animated.View
                        key={img.id}
                        style={[
                          styles.imageWrapper,
                          img.scaleAnim && {
                            transform: [{ scale: img.scaleAnim }],
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: img.image_with_paths }}
                          style={styles.image}
                        />
                        <TouchableOpacity
                          style={styles.deleteIcon}
                          onPress={() => handleDeleteImage(img.id)}
                        >
                          <Trash
                            name="trash-outline"
                            size={18}
                            color="#393D47"
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                </View>
              </View>
            </>
          )}

          {/* Audio Section */}
          {metersData?.audio && (
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
                          <Text style={styles.audioname}>
                            {item?.name?.substring(0, 20)}...
                          </Text>
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

              <View style={styles.imageRow}>
                {Array.isArray(metersData?.meter_image) &&
                  metersData.meter_image.map((img) => (
                    <Animated.View
                      key={img.id}
                      style={[
                        styles.imageWrapper,
                        img.scaleAnim && {
                          transform: [{ scale: img.scaleAnim }],
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: img.image_with_paths }}
                        style={styles.image}
                      />
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
          <TouchableOpacity style={styles.NextBtn} onPress={handleSubmit}>
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

export default ClerkAddMeter;

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
    color: "#151313",
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
  searchInput: {
    fontWeight: "400",
    fontSize: 13,
    fontFamily: "BeVietnamPro-Regular",
    color: "#6D7D93",
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#6D7D93",
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#fff",
  },
  searchFocused: {
    borderColor: "#FF8800", // Highlighted border when focused
  },
  frmRow: {
    flexDirection: "row",
    gap: 14,
  },
  frmRowinner: {
    width: "48%",
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
    paddingBottom: 0,
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
  disabledBtn: {
    backgroundColor: "#A9A9A9", // Greyed out
  },
  searchInputDate: {
    fontWeight: "400",
    fontSize: 13,
    fontFamily: "BeVietnamPro-Regular",
    color: "#6D7D93",
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#6D7D93",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: "#FF8800",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  toggleButtonActive: {
    backgroundColor: "#FF8800",
    borderColor: "#FF8800",
  },
  toggleText: {
    color: "#FF8800",
    fontSize: 14,
  },
  toggleTextActive: {
    color: "#fff",
    fontSize: 14,
  },
  dropdown: {
    height: 55,
    borderColor: "#6D7D93",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 13,
    color: "#6D7D93",
    fontFamily: "BeVietnamPro-Regular",
  },
  selectedTextStyle: {
    fontSize: 13,
    color: "#434854",
    fontFamily: "BeVietnamPro-Regular",
  },
});
