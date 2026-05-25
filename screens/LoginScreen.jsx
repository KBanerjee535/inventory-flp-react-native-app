import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import React, {useState,useRef} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { loginApi } from '../services/apiService';
import { useUserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const LoginScreen = ({navigation}) => {
  const { setUserData, setIsLoggedIn } = useUserContext();
  const [btnDis, setBtnDis] = useState(false);
  const buttonScaleAnim = useRef(new Animated.Value(1)).current; // For button bounce effect
  const [userType, setUserType] = useState('Clark');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [borderColors, setBorderColors] = useState({
    input1: '#6D7D93',
    input2: '#6D7D93',
  });






  const handleFocus = input => {
    setBorderColors({...borderColors, [input]: '#FF8800'});
  };

  const handleBlur = input => {
    setBorderColors({...borderColors, [input]: '#6D7D93'});
  };
  const handlePressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.9,
      friction: 1,
      tension: 30,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      friction: 1,
      tension: 30,
      useNativeDriver: true,
    }).start();
  };
  const handleSubmit = async () => {

    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) return;
          setBtnDis(false);

    const userTypeValue = userType === 'Client' ? 4 : 6;
              setBtnDis(true);

    try {
      const response = await loginApi({
        email,
        password,
        user_type: userTypeValue,
      });

      await AsyncStorage.setItem('flpLoginInfo', JSON.stringify(response?.data?.user));
      setUserData(response?.data?.user);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('flpAuthToken', response?.data?.access_token);
                setBtnDis(false);

      navigation.navigate(userType === 'Client' ? 'ClientTabRoutes' : 'TabRoutes');
    } catch (error) {
                setBtnDis(false);

      setPasswordError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // adjust if needed
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('Welcome')}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.Container}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subText}>
            Enter the email associated with your account
          </Text>

          <View style={styles.frmBox}>
            <Text style={styles.Labelinput}>User Type</Text>

            <View style={styles.typeBox}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setUserType('Clark')}>
                <View style={styles.radioView}>
                  <Text style={styles.radioText}>Clerk</Text>
                </View>
                <Ionicons
                  name={
                    userType === 'Clark'
                      ? 'radio-button-on'
                      : 'radio-button-off-outline'
                  }
                  size={28}
                  color="#393D47"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setUserType('Client')}>
                <View style={styles.radioView}>
                  <Text style={styles.radioText}>Client</Text>
                </View>
                <Ionicons
                  name={
                    userType === 'Client'
                      ? 'radio-button-on'
                      : 'radio-button-off-outline'
                  }
                  size={28}
                  color="#393D47"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.Labelinput}>Email</Text>
            <TextInput
              style={[styles.Logininput, {borderColor: borderColors.input1}]}
              placeholder="Type email"
              placeholderTextColor="#6D7D93"
              onFocus={() => handleFocus('input1')}
              onBlur={() => handleBlur('input1')}
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={styles.Labelinput}>Password</Text>
            <TextInput
              style={[styles.Logininput, {borderColor: borderColors.input2}]}
              placeholder="Type password"
              placeholderTextColor="#6D7D93"
              secureTextEntry
              onFocus={() => handleFocus('input2')}
              onBlur={() => handleBlur('input2')}
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
           

            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>

            <TouchableOpacity style={styles.NextBtn} onPress={handleSubmit} 
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                 disabled={btnDis}>
                              <Text style={styles.NextBtnTxt}>{btnDis ? 'Please Wait...' : 'Sign In'}</Text>

            </TouchableOpacity>
            </Animated.View>

          </View>
        </View>
      </View>
      </ScrollView>
  </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  Body: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  Header: {
    backgroundColor: '#fff',
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 20,
    paddingTop: 40,
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

  BackBtnTxt: {
    color: '#000',
    fontFamily: 'Montserrat-Medium',
    fontWeight: 500,
    fontSize: 16,
  },
  backIcon: {
    marginRight: 20,
  },

  Container: {
    backgroundColor: '#fff',
    paddingLeft: 30,
    paddingTop: 10,
    paddingRight: 30,
  },
  title: {
    color: '#000',
    fontFamily: 'BeVietnamPro-SemiBold',
    fontSize: 30,
    marginBottom: 10,
    fontWeight: '600',
  },
  subText: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 30,
    fontWeight: '400',
  },

  frmBox: {
    width: '100%',
  },

  Labelinput: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 10,
  },
  Logininput: {
    fontWeight: '400',
    fontSize: 13,
    fontFamily: 'BeVietnamPro-Regular',
    color: '#6D7D93',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#6D7D93',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  NextBtn: {
    backgroundColor: '#393D47',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    marginTop: 15,
    borderRadius: 8,
  },
  NextBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
  ForgetBtn: {width: '100%', lineHeight: 50},
  ForgetBtnTxt: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  selected: {
    backgroundColor: '#DC7027',
  },
  radioText: {
    color: '#434854',
    fontFamily: 'BeVietnamPro-Regular',
    fontSize: 15,
    fontWeight: '400',
  },
  radioView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBox: {},
  radioButton: {
    fontWeight: '400',
    fontSize: 13,
    fontFamily: 'BeVietnamPro-Regular',
    color: '#6D7D93',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#6D7D93',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
   errorText: {
    color: '#FF4040',
    fontSize: 14,
    marginTop: 2,
  },
});
