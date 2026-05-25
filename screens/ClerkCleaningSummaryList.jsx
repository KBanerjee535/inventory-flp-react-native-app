import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/Entypo";
import Arrow from "react-native-vector-icons/Ionicons";
import ItemIcon1 from "../assets/images/ItemIcon1.svg";
import PrevPageArrow from "../assets/images/BackArrow.svg";

const items = [
  {
    id: 1,
    icon: <ItemIcon1 width={24} height={24} />,
    text: "General Overview",
    screen: "ClerkScheduleConditions",
  },
];

const ClerkCleaningSummaryList = ({ navigation }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const fadeAnims = useRef(items.map(() => new Animated.Value(0))).current; // Create an array of Animated values

  useEffect(() => {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 200, // Staggered effect
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F2F6" />

      <ScrollView>
        <View style={styles.Body}>
          <View style={styles.Header}>
            <TouchableOpacity
              style={styles.BackBtn}
              onPress={() => navigation.navigate("ClerkInspection")}
            >
              <PrevPageArrow style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.pagetitleTxt}>Schedule of Conditions</Text>
          </View>

          <View style={styles.List}>
            {items.map((item, index) => (
              <Animated.View
                key={item.id}
                style={{ opacity: fadeAnims[index] }}
              >
                <TouchableOpacity
                  style={styles.ListItem}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View style={styles.ListItemInner}>
                    {item.icon}
                    <Text style={styles.ListItemTxt}>{item.text}</Text>
                  </View>
                  <Arrow
                    name="chevron-forward-outline"
                    size={28}
                    color="#393D47"
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.NextBtn2}
            onPress={() => navigation.navigate("Addanother")}
          >
            <Text style={styles.NextBtn2Txt}>Add Schedule of Conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.Footer}>
        <TouchableOpacity
          style={styles.NextBtn3}
          onPress={() => navigation.navigate("AddGeneralNotes")}
        >
          <Text style={styles.NextBtnTxt3}>Add/Edit General Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.NextBtn}
          onPress={() => navigation.navigate("ClerkBathroomList")}
        >
          <Text style={styles.NextBtnTxt}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ClerkCleaningSummaryList;

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
    backgroundColor: "#f1f2f6",

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

  List: {
    width: "100%",
    paddingTop: 15,
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
  NextBtn3: {
    width: "100%",
    borderColor: "#393D47",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: 55,
    lineHeight: 50,
    borderWidth: 1,
    marginBottom: 10,

    borderRadius: 8,
  },
  NextBtnTxt3: {
    color: "#393D47",
    fontSize: 14,
    fontFamily: "BeVietnamPro-SemiBold",
    fontWeight: "600",
  },
});
