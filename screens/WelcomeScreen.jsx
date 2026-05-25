import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Text,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Semicircle from '../assets/images/Semicircle.svg';
import NewLogoBlack from '../assets/images/NewLogoBlack.svg';
import Animated, {FadeInDown} from 'react-native-reanimated';

const WelcomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f2f6" />
      {/* Gradient Background */}
      <ImageBackground
        source={require('../assets/images/Gradient.jpg')} // Your image path
        style={styles.background}
        resizeMode="cover" // Adjusts image size and position
      >
        <Animated.View
          style={styles.overlay}
          entering={FadeInDown.duration(800)}>
          <NewLogoBlack style={styles.Logo} />
          <Text style={styles.titel}>Simplify Your Property Inspection</Text>

          <TouchableOpacity
            style={styles.signinBtn}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signinBtnTxt}>Sign in with email</Text>
          </TouchableOpacity>

          <Text style={styles.text}>Don’t have Sign in credentials?</Text>

          <TouchableOpacity style={styles.LinkBtn}>
            <Text style={styles.LinkBtnText}>Contact Administrator</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.BottomPart}>
          <Semicircle />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#f1f2f6',
  },
  gradient: {
    flex: 1,
  },
  background: {
    flex: 1, // Cover full screen
    justifyContent: 'center', // Center content
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  BottomPart: {
    position: 'absolute',
    bottom: 0,
  },
  Logo: {
    height: 59,
    marginBottom: 34,
    width: 92,
  },
  titel: {
    color: '#000000',
    fontFamily: 'Bodoni-Cyrillic',
    fontSize: 42,
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 30,
  },
  overlay: {
    paddingLeft: 30,
    paddingRight: 30,
    alignItems: 'center',
    width: '100%',
  },
  shadowButton: {
    padding: 20,
    paddingTop: 0,
    width: '100%',
  },
  signinBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6}, // More realistic depth
    shadowOpacity: 0.1, // Lighter shadow
    shadowRadius: 10, // Soft shadow spread

    // Shadow for Android
    elevation: 8, // Provides similar effect on Android
  },
  signinBtnTxt: {
    color: '#393D47',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
  },
  text: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 20,
    fontWeight: 400,
  },
  LinkBtnText: {
    borderBottomColor: '#DC7027',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    color: '#DC7027',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 16,
  },
});
