import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';
import { UserProvider } from './context/UserContext';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });
  return ( 
          <UserProvider>
 
    <NavigationContainer >    
      <Router />
    </NavigationContainer>
        </UserProvider>

  );
};
export default App;