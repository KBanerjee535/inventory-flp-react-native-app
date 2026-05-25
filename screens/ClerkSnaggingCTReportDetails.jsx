import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Arrow from 'react-native-vector-icons/Ionicons';

const items = [
  {
    id: 1,
    text: 'Walls and Ceiling: Check for..',
    screen: 'ClerkSnagginginspectionrecord',
  },
  {
    id: 2,
    text: 'Flooring: Inspect for damp p..',
    screen: 'ClerkSnagginginspectionrecord',
  },
  {
    id: 3,
    text: 'Electrical: Check light switc..',
    screen: 'ClerkSnagginginspectionrecord',
  },
  {
    id: 4,
    text: 'Furniture: Check dinning ch..',
    screen: 'ClerkSnagginginspectionrecord',
  },
  {
    id: 5,
    text: 'Lock: Check main door lock..',
    screen: 'ClerkSnagginginspectionrecord',
  },
];

const ClerkSnaggingCTReportDetails = ({navigation}) => {
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
            <View style={styles.HeaderLft}>
              <View style={styles.indicator}>
                <View style={[styles.statusindicator, styles.Snagging]}></View>
                <Text style={styles.indicatorTxt}>Snagging</Text>
              </View>
              <Text style={styles.HeaderLftTxt}>The New Rectory</Text>
            </View>

            <View style={styles.HeaderRgt}>
              <TouchableOpacity
                style={styles.MoreBtn}
                onPress={() => setShowTooltip(!showTooltip)}>
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
            <Text style={styles.ListHr}>General Interior Inspection</Text>

            {items.map((item, index) => (
              <Animated.View key={item.id} style={{opacity: fadeAnims[index]}}>
                <TouchableOpacity
                  style={styles.ListItem}
                  onPress={() => navigation.navigate(item.screen)}>
                  <View style={styles.ListItemInner}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClerkSnaggingCTReportDetails;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  Body: {
    width: '100%',
    height: '100%',
    paddingLeft: 25,
    paddingRight: 25,
  },
  Header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 25,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusindicator: {
    width: 12,
    height: 12,
    borderRadius: '100%',
  },
  checkIn: {
    backgroundColor: '#3CC6ED',
    width: 12,
    height: 12,
    borderRadius: '100%',
  },
  Snagging: {
    backgroundColor: '#FF7C5E',
    width: 12,
    height: 12,
    borderRadius: '100%',
  },
  indicatorTxt: {
    color: '#393D47',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
  MoreBtn: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: 20,
  },
  HeaderLftTxt: {
    color: '#151313',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 20,
    fontWeight: '500',
  },
  List: {
    width: '100%',
    paddingTop: 35,
  },
  ListHr: {
    color: '#151313',
    fontFamily: 'BeVietnamPro-Medium',
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'capitalize',
    marginBottom: 25,
  },
  ListItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ListItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  ListItemTxt: {
    color: '#393D47',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
  },

  tooltipContainer: {
    position: 'absolute',
    top: 40,
    right: -7, // Align tooltip to the right
    alignItems: 'flex-end', // Align arrow to the right
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333', // Same as tooltip background
    alignSelf: 'flex-end', // Align arrow to the right
    marginRight: 5, // Adjust arrow position
    marginBottom: -1, // Slight overlap with tooltip
  },
  tooltip: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 5,
    width: 155,
    height: 45,
    alignItems: 'center',
  },

  tooltipText: {
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: '#fff',
  },
});
