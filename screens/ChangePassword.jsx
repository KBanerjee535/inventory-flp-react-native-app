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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PrevPageArrow from '../assets/images/BackArrow.svg';
import {defaultFormat} from 'moment';

const ChangePassword = ({navigation}) => {
  const [focusedInput, setFocusedInput] = useState(null);
  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.Body}>
        <View style={styles.Header}>
          <TouchableOpacity
            style={styles.BackBtn}
            onPress={() => navigation.navigate('EditAccount')}>
            <PrevPageArrow style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.pagetitleTxt}>Change Password</Text>
        </View>

        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.subtitel}>Existing Password</Text>
            <TextInput
              style={[
                styles.searchInput,
                focusedInput === 'input1' && styles.searchFocused,
              ]}
              placeholder="Type"
              onFocus={() => setFocusedInput('input1')}
              onBlur={() => setFocusedInput(null)}
            />
            <Text style={styles.subtitel}>New Password</Text>
            <TextInput
              style={[
                styles.searchInput,
                focusedInput === 'input2' && styles.searchFocused,
              ]}
              placeholder="Type"
              onFocus={() => setFocusedInput('input2')}
              onBlur={() => setFocusedInput(null)}
            />
            <Text style={styles.subtitel}>Confirm New Password</Text>
            <TextInput
              style={[
                styles.searchInput,
                focusedInput === 'input3' && styles.searchFocused,
              ]}
              placeholder="Type"
              onFocus={() => setFocusedInput('input3')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </ScrollView>
        <View style={styles.Footer}>
          <TouchableOpacity style={styles.NextBtn}>
            <Text style={styles.NextBtnTxt}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Body: {
    width: '100%',
    height: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },

  Header: {
    backgroundColor: '#fff',
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
    zIndex: 999,
  },

  backIcon: {
    marginRight: 20,
  },
  container: {
    width: '100%',
    height: '100%',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 20,
    paddingBottom: 20,
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
    borderWidth: 1,
    borderColor: '#00218F47',
  },
  StartBtnTxt: {
    color: '#151313',
    fontSize: 19,
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
  },

  pagetitleTxt: {
    color: '#151313',
    fontSize: 19,
    fontFamily: 'BeVietnamPro-Medium',
    fontWeight: '500',
    textAlign: 'center',
    position: 'absolute',
    margin: 'auto',
    left: 0,
    right: 0,
  },
  searchInput: {
    fontWeight: '400',
    fontSize: 13,
    fontFamily: 'BeVietnamPro-Regular',
    color: '#6D7D93',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#6D7D93',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  input: {
    fontWeight: '400',
    fontSize: 13,
    fontFamily: 'BeVietnamPro-Regular',
    color: '#6D7D93',
    width: '100%',
    borderWidth: 1,
    borderColor: '#6D7D93',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  searchFocused: {
    borderColor: '#FF8800', // Highlighted border when focused
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

    borderRadius: 8,
  },
  NextBtnTxt: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
  Footer: {
    padding: 25,
  },
  imageContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00218F47',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 0,
  },
  imageContainerRgt: {
    width: '77%',
  },

  fileName: {
    fontSize: 14,
    color: '#353535',
    fontFamily: 'BeVietnamPro-Regular',
    marginBottom: 5,
  },
  fileSize: {
    fontSize: 12,
    color: '#8E8E8E',
    fontFamily: 'BeVietnamPro-Regular',
  },
  progressBar: {
    width: '100%',
    height: 7,
    backgroundColor: '#ddd',
    marginTop: 8,
    borderRadius: 5,
  },
  progress: {
    width: '50%',
    height: 7,
    backgroundColor: '#FF7F50',
    borderRadius: 5,
  },

  ViewBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 55,
    lineHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#393D47',
    marginTop: 15,
  },
  ViewBtnTxt: {
    color: '#393D47',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
});
