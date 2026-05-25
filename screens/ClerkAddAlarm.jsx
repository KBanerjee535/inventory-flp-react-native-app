import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  Animated,
  Modal,
  Pressable,
  Alert,
  FlatList,
} from "react-native";
import moment from "moment";
import React, { useRef, useState, useCallback } from "react";
import PrevPageArrow from "../assets/images/BackArrow.svg";
import Icon from "react-native-vector-icons/Entypo";
import IconTick from "react-native-vector-icons/Ionicons";
import Toast from "react-native-simple-toast";
import { useUserContext } from "../context/UserContext";
import {
  AlarmAddApi,
  AlarmDeleteApi,
  AlarmUpdateApi,
} from "../services/apiService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect } from "@react-navigation/native";
import DownArrow from "../assets/images/DownArrow.svg";

const ClerkAddAlarm = ({ navigation, route }) => {
  const { seletedJobDetails } = useUserContext();

  const [screenLoading, setScreenLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [selectedAlarmType, setSelectedAlarmType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;

  const alarmTypeOptions = [
    "Smoke Detector",
    "Carbon Monoxide",
    "Heat Detector",
    "Combination",
  ];
  const yesNoOptions = ["Yes", "No"];

  const { alarmData, mode } = route.params || {};
  const isEditMode = mode === "edit";

  const defaultForm = {
    inventory_id: seletedJobDetails?.id || "",
    property_id: seletedJobDetails?.property_id || "",
    client_id: seletedJobDetails?.client_id || "",
    alarm_title: "",
    expiry_date: "",
    location: "",
    alarm_type: "",
    tested: "",
    working: "",
    id: null,
  };

  const [formData, setFormData] = useState(defaultForm);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Radio button handler
  const handleRadioSelect = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Dropdown handlers
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    Animated.timing(translateY, {
      toValue: showDropdown ? 300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSelectAlarmType = (type) => {
    setSelectedAlarmType(type);
    setFormData({ ...formData, alarm_type: type });
    toggleDropdown();
  };

  // Date picker handlers
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setFormData({
      ...formData,
      expiry_date: moment(date).format("YYYY-MM-DD"),
    });
    hideDatePicker();
  };

  // Form submission
  const handleSubmit = async () => {
    if (!formData.alarm_title.trim()) {
      Toast.show("Please enter alarm title", Toast.SHORT);
      return;
    }

    if (!formData.expiry_date.trim()) {
      Toast.show("Please enter expiry date", Toast.SHORT);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("inventory_id", seletedJobDetails?.id);
      fd.append("property_id", seletedJobDetails?.property_id);
      fd.append("client_id", seletedJobDetails?.client_id);
      fd.append("alarm_title", formData.alarm_title);
      fd.append("location", formData.location);
      fd.append("expiry_date", formData.expiry_date);
      fd.append("alarm_type", formData.alarm_type);
      fd.append("tested", formData.tested);
      fd.append("working", formData.working);

      let response;
      if (isEditMode) {
        fd.append("alarm_id", formData.id);
        response = await AlarmUpdateApi(fd);
      } else {
        response = await AlarmAddApi(fd);
      }

      if (response.data.status === true) {
        Toast.show(
          isEditMode
            ? "Alarm updated successfully!"
            : "Alarm added successfully!",
          Toast.SHORT
        );
        navigation.navigate("ClerkAlarmList");
      }
    } catch (error) {
      Toast.show("Error processing request", Toast.SHORT);
    }
  };

  // Initialize form data
  useFocusEffect(
    useCallback(() => {
      if (isEditMode && alarmData) {
        setFormData({
          ...defaultForm,
          ...alarmData,
        });
        setSelectedAlarmType(alarmData.alarm_type || "");
      } else {
        setFormData(defaultForm);
        setSelectedAlarmType("");
      }
    }, [route.params])
  );

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate("ClerkAlarmList")}
          >
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>
            {isEditMode ? "Edit Alarm" : "Add Alarm"}
          </Text>
        </View>

        <ScrollView style={styles.container}>
          {/* <Text style={styles.subtitel}>Alarm Title</Text>
          <TextInput
            style={[
              styles.searchInput,
              focusedInput === "alarm_title" && styles.searchFocused,
            ]}
            placeholder="Alarm title"
            value={formData.alarm_title}
            onChangeText={(text) =>
              setFormData({ ...formData, alarm_title: text })
            }
            onFocus={() => setFocusedInput("alarm_title")}
            onBlur={() => setFocusedInput(null)}
          /> */}

          {/* Alarm Type Dropdown */}
          <Text style={styles.subtitel}>Alarm Type</Text>
          <TouchableOpacity
            style={[
              styles.dropdown,
              {
                borderColor:
                  focusedInput === "alarm_type" ? "#FF7F50" : "#6D7D93",
              },
            ]}
            onPress={toggleDropdown}
            onFocus={() => setFocusedInput("alarm_type")}
            onBlur={() => setFocusedInput(null)}
          >
            <Text
              style={[
                styles.dropdownText,
                { color: selectedAlarmType ? "black" : "#6D7D93" },
              ]}
            >
              {selectedAlarmType || "Select Alarm Type"}
            </Text>
            <DownArrow width={12} height={8} style={styles.downarrowIcon} />
          </TouchableOpacity>

          <View style={styles.frmRow}>
            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Tested</Text>
              <View style={styles.radioGroup}>
                {yesNoOptions.map((option) => (
                  <TouchableOpacity
                    key={`tested-${option}`}
                    style={styles.radioOption}
                    onPress={() => handleRadioSelect("tested", option)}
                  >
                    <View style={styles.radioCircle}>
                      {formData.tested === option && (
                        <View style={styles.radioChecked} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.frmRowinner}>
              {/* Working Radio Buttons */}
              <Text style={styles.subtitel}>Working</Text>
              <View style={styles.radioGroup}>
                {yesNoOptions.map((option) => (
                  <TouchableOpacity
                    key={`working-${option}`}
                    style={styles.radioOption}
                    onPress={() => handleRadioSelect("working", option)}
                  >
                    <View style={styles.radioCircle}>
                      {formData.working === option && (
                        <View style={styles.radioChecked} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.frmRow}>
            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Expiry Date</Text>
              <Pressable
                onPress={showDatePicker}
                style={[
                  styles.searchInputDate,
                  focusedInput === "expiry_date" && styles.searchFocused,
                ]}
              >
                <Text>{formData.expiry_date || "Select Expiry Date"}</Text>
              </Pressable>
            </View>

            <View style={styles.frmRowinner}>
              <Text style={styles.subtitel}>Location</Text>
              <TextInput
                style={[
                  styles.searchInput,
                  focusedInput === "location" && styles.searchFocused,
                ]}
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                onFocus={() => setFocusedInput("location")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Tested Radio Buttons */}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
            date={
              formData.expiry_date ? new Date(formData.expiry_date) : new Date()
            }
          />
        </ScrollView>
        {/* Footer Buttons */}
        <View style={styles.Footer}>
          <TouchableOpacity
            style={styles.NextBtn}
            onPress={handleSubmit}
            disabled={screenLoading}
          >
            <Text style={styles.NextBtnTxt}>
              {screenLoading ? "Processing..." : "Save"}
            </Text>
          </TouchableOpacity>
          {isEditMode && (
            <TouchableOpacity
              style={styles.ForgetBtn}
              onPress={handleDelete}
              disabled={screenLoading}
            >
              <Text style={styles.ForgetBtnTxt}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Alarm Type Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="none"
        onRequestClose={toggleDropdown}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={toggleDropdown}
          />
          <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY }] }]}
          >
            <FlatList
              data={alarmTypeOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => handleSelectAlarmType(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {selectedAlarmType === item && (
                    <IconTick
                      name="checkmark-sharp"
                      size={24}
                      color="#FF7F50"
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: "#f1f2f6",
  },
  Body: {
    width: "100%",
    height: "100%",
  },
  Header: {
    backgroundColor: "#f1f2f6",
    padding: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  BackBtn: {
    zIndex: 9999,
  },
  container: {
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 20,
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
  subtitel: {
    color: "#151313",
    fontSize: 16,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
    marginBottom: 15,
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
    paddingHorizontal: 15,
    backgroundColor: "#fff",
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
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  searchFocused: {
    borderColor: "#FF8800",
  },
  frmRow: {
    flexDirection: "row",
    gap: 14,
  },
  frmRowinner: {
    width: "48%",
  },
  dropdown: {
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
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontWeight: "400",
    fontSize: 14,
    fontFamily: "BeVietnamPro-Regular",
    color: "#6D7D93",
  },
  // Radio button styles
  radioGroup: {
    flexDirection: "row",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF7F50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioChecked: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#FF7F50",
  },
  radioLabel: {
    fontSize: 14,
    color: "#6D7D93",
  },
  Footer: {
    padding: 25,
    paddingBottom: 40,
  },
  NextBtn: {
    backgroundColor: "#393D47",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 55,
    borderRadius: 8,
  },
  NextBtnTxt: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "BeVietnamPro-SemiBold",
    fontWeight: "600",
  },
  ForgetBtn: {
    width: "100%",
    marginTop: 15,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  ForgetBtnTxt: {
    color: "#6D7D93",
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Medium",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "50%",
  },
  dropdownOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: {
    fontWeight: "400",
    fontSize: 16,
    fontFamily: "BeVietnamPro-Regular",
    color: "#6D7D93",
  },
  checkIcon: {
    marginRight: 10,
  },
  downarrowIcon: {
    marginLeft: 10,
  },
});

export default ClerkAddAlarm;
