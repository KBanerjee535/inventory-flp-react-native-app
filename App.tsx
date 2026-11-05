import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
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
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
 
    <NavigationContainer>    
      <Router />
    </NavigationContainer>
        </SafeAreaProvider>
    </UserProvider>

  );
};
export default App;