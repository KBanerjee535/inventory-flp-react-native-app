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
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PrevPageArrow from "../assets/images/BackArrow.svg";
import ItemIcon1 from "../assets/images/ItemIcon1.svg";
import DatePicker from "react-native-date-picker";
import DownArrow from "../assets/images/DownArrow.svg";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

const ClerkInventoryFilter = ({ navigation }) => {
  const [focusedInput, setFocusedInput] = useState(null);

  const [focusedField, setFocusedField] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const showEndDatePicker = () => setDatePickerVisibility2(true);
  const endhideDatePicker = () => setDatePickerVisibility2(false);
  const translateY = useState(new Animated.Value(300))[0];

  const [gender, setGender] = useState("");

  const [city, setCity] = useState("");
  const cityOptions = ["New York", "Los Angeles", "Chicago", "Houston"];
  const genderOptions = ["Male", "Female", "Other"];
  const relationOptions = ["Status1", "Status2"];
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const [showRelationDropdown, setShowRelationDropdown] = useState(false);

  const [relation, setRelation] = useState("");

  const [isFocused, setIsFocused] = useState(false); // State to track focus

  // Animation for Button Bounce Effect
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const openCityDropdown = () => {
    setShowCityDropdown(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeCityDropdown = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCityDropdown(false);
    });
  };

  const handleFocus = (input) => {
    setBorderColors({ ...borderColors, [input]: "#FF7F50" });
  };

  const handleBlur = (input) => {
    setBorderColors({ ...borderColors, [input]: "#C5C6E0" });
  };

  const [borderColors, setBorderColors] = useState({
    input1: "#6D7D93",
    input2: "#6D7D93",
    input3: "#6D7D93",
    input4: "#6D7D93",
    input5: "#6D7D93",
  });

  const openGenderDropdown = () => {
    setShowGenderDropdown(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeGenderDropdown = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowGenderDropdown(false);
    });
  };

  const openRelationDropdown = () => {
    setShowRelationDropdown(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeRelationDropdown = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowRelationDropdown(false);
    });
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.goBack()}
          >
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Filter</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.subtitel}>Date Range</Text>

          <View style={styles.InputRow}>
            <View style={styles.InputRowLft}>
              <TouchableOpacity onPress={showDatePicker} style={styles.DateBox}>
                <TextInput
                  numberOfLines={1}
                  editable={false}
                  placeholder="Start Date"
                  value={
                    startDate ? moment(startDate).format("DD MMM, YYYY") : ""
                  }
                  style={styles.input}
                />
                <DatePicker
                  modal
                  open={isDatePickerVisible}
                  date={startDate ? new Date(startDate) : new Date()}
                  onConfirm={(date) => {
                    console.log(date);
                    hideDatePicker();
                    setStartDate(date);
                  }}
                  onCancel={hideDatePicker}
                  mode="date"
                />
                <ItemIcon1 width={20} height={20} style={styles.InputIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.InputRowRgt}>
              <TouchableOpacity
                onPress={showEndDatePicker}
                style={styles.DateBox}
              >
                <TextInput
                  numberOfLines={1}
                  editable={false}
                  placeholder="Start Date"
                  value={endDate ? moment(endDate).format("DD MMM, YYYY") : ""}
                  style={styles.input}
                />
                <DatePicker
                  modal
                  open={isDatePickerVisible2}
                  date={endDate ? new Date(endDate) : new Date()}
                  onConfirm={(date) => {
                    console.log(date);
                    endhideDatePicker();
                    setEndDate(date);
                  }}
                  onCancel={endhideDatePicker}
                  mode="date"
                />
                <ItemIcon1 width={20} height={20} style={styles.InputIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.subtitel}>Assignor</Text>

          <TouchableOpacity
            style={[
              styles.dropdown,
              { borderColor: isFocused ? "#FF7F50" : "#6D7D93" }, // Change border color on focus
            ]}
            onPress={openCityDropdown}
            onFocus={() => setIsFocused(true)} // Focus handler
            onBlur={() => setIsFocused(false)} // Blur handler
          >
            <Text
              style={[
                styles.dropdownText,
                { color: gender ? "black" : "#6D7D93" }, // Change text color based on selection
              ]}
            >
              {city ? city : "Select Assignor"}
            </Text>
            <DownArrow width={12} height={8} style={styles.downarrowIcon} />
          </TouchableOpacity>

          <Text style={styles.subtitel}>Report Type</Text>

          <TouchableOpacity
            style={[
              styles.dropdown,
              { borderColor: isFocused ? "#FF7F50" : "#6D7D93" }, // Change border color on focus
            ]}
            onPress={openGenderDropdown}
            onFocus={() => setIsFocused(true)} // Focus handler
            onBlur={() => setIsFocused(false)} // Blur handler
          >
            <Text
              style={[
                styles.dropdownText,
                { color: gender ? "black" : "#6B7A8B" }, // Change text color based on selection
              ]}
            >
              {gender ? gender : "Choose Report"}
            </Text>
            <DownArrow width={12} height={8} style={styles.downarrowIcon} />
          </TouchableOpacity>

          <Text style={styles.subtitel}>Status</Text>

          <TouchableOpacity
            style={[
              styles.dropdown,
              { borderColor: isFocused ? "#FF7F50" : "#6D7D93" }, // Change border color on focus
            ]}
            onPress={openRelationDropdown}
            onFocus={() => setIsFocused(true)} // Focus handler
            onBlur={() => setIsFocused(false)} // Blur handler
            value={relation}
            onChangeText={setRelation}
          >
            <Text
              style={[
                styles.dropdownText,
                { color: relation ? "black" : "#6D7D93" }, // Change text color based on selection
              ]}
            >
              {relation ? relation : "Choose Status"}
            </Text>
            <DownArrow width={12} height={8} style={styles.downarrowIcon} />
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.Footer}>
          <TouchableOpacity style={styles.NextBtn}>
            <Text style={styles.NextBtnTxt}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ForgetBtn}>
            <Text style={styles.ForgetBtnTxt}>Reset Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* City Dropdown Modal */}
      <Modal
        visible={showCityDropdown}
        transparent
        animationType="none"
        onRequestClose={closeCityDropdown}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeCityDropdown}
          />
          <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY }] }]}
          >
            <FlatList
              data={cityOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setCity(item);
                    closeCityDropdown();
                    setBorderColors({ ...borderColors, city: "#FF7F50" });
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {city === item && (
                    <Icon
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

      {/* Gender Dropdown Modal */}
      <Modal
        visible={showGenderDropdown}
        transparent
        animationType="none"
        onRequestClose={closeGenderDropdown}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeGenderDropdown}
          />
          <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY }] }]}
          >
            <FlatList
              data={genderOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setGender(item);
                    closeGenderDropdown();
                    setBorderColors({ ...borderColors, gender: "#FF7F50" });
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {gender === item && (
                    <Icon
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

      {/* Relation Dropdown Modal */}
      <Modal
        visible={showRelationDropdown}
        transparent
        animationType="none"
        onRequestClose={closeRelationDropdown}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeRelationDropdown}
          />
          <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY }] }]}
          >
            <FlatList
              data={relationOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownOption}
                  onPress={() => {
                    setRelation(item);
                    closeRelationDropdown();
                    setBorderColors({ ...borderColors, relation: "#FF7F50" });
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {relation === item && (
                    <Icon
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

export default ClerkInventoryFilter;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  Body: {
    width: "100%",
    height: "100%",
    paddingLeft: 0,
    paddingRight: 0,
  },

  Header: {
    backgroundColor: "#fff",
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 40,
    paddingBottom: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  BackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 999,
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
    borderWidth: 1,
    borderColor: "#00218F47",
  },
  StartBtnTxt: {
    color: "#151313",
    fontSize: 19,
    fontFamily: "BeVietnamPro-Regular",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 5,
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
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#fff",
  },
  searchFocused: {
    borderColor: "#FF8800", // Highlighted border when focused
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
  imageContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#00218F47",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    flexDirection: "row",
    gap: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 0,
  },
  imageContainerRgt: {
    width: "77%",
  },

  fileName: {
    fontSize: 14,
    color: "#353535",
    fontFamily: "BeVietnamPro-Regular",
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 12,
    color: "#8E8E8E",
    fontFamily: "BeVietnamPro-Regular",
  },
  progressBar: {
    width: "100%",
    height: 7,
    backgroundColor: "#ddd",
    marginTop: 8,
    borderRadius: 5,
  },
  progress: {
    width: "50%",
    height: 7,
    backgroundColor: "#FF7F50",
    borderRadius: 5,
  },
  InputRow: {
    width: "100%",
    flexDirection: "row",
    gap: 20,
  },
  InputRowLft: {
    width: "47%",
    position: "relative",
  },
  InputRowRgt: {
    width: "47%",
    position: "relative",
  },
  InputIcon: {},
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
  DateBox: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#6D7D93",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  DateInput: {
    fontWeight: "400",
    fontSize: 14,
    fontFamily: "BeVietnamPro-Regular",
    color: "#6D7D93",
  },
  FocusedBorder: {
    borderColor: "#FF8800", // Highlighted border when focused
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
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
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
    lineHeight: 55,
  },
  downarrowIcon: {},

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 99,
  },
  closeText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  },
  optionText: {
    fontWeight: "400",
    fontSize: 13,
    fontFamily: "BeVietnamPro-Regular",
    color: "#6D7D93",
  },
  checkIcon: {
    position: "absolute",
    right: 0,
    top: 12,
  },
});
