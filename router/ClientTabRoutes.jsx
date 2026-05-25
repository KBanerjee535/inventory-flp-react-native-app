import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import InventoryScreen from '../screens/InventoryScreen';
import SnaggingScreen from '../screens/SnaggingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FooterIcon1 from '../assets/images/FooterIcon1.svg';
import FooterIcon1Act from '../assets/images/FooterIcon1Act.svg';
import FooterIcon2 from '../assets/images/FooterIcon2.svg';
import FooterIcon2Act from '../assets/images/FooterIcon2Act.svg';
import FooterIcon3 from '../assets/images/FooterIcon3.svg';
import FooterIcon3Act from '../assets/images/FooterIcon3Act.svg';
import FooterIcon4 from '../assets/images/FooterIcon4.svg';
import FooterIcon4Act from '../assets/images/FooterIcon4Act.svg';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import ClientDashboardScreen from '../screens/ClientDashboardScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import Invoices from '../assets/images/Invoices.svg';
import InvoicesAct from '../assets/images/InvoicesAct.svg';
import HistoricalScreen from '../screens/HistoricalScreen';
import Historical from '../assets/images/Historical.svg';
import HistoricalAct from '../assets/images/HistoricalAct.svg';

const Tab = createBottomTabNavigator();
const CustomTabButton = ({children, onPress}) => {
  return Platform.OS === 'android' ? (
    <TouchableNativeFeedback
      style={styles.TabBtn}
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple('#FF8800', true)} // Circular ripple effect in red
    >
      <View style={styles.TabBtnTxt}>{children}</View>
    </TouchableNativeFeedback>
  ) : (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{flex: 1}}>
      {children}
    </TouchableOpacity>
  );
};

const ClientTabRoutes = () => {
  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000', // Keeping default active color
        tabBarInactiveTintColor: '#A7A6AF',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 80,
          paddingBottom: 9,
          paddingTop: 9,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '400',
          fontFamily: 'BeVietnamPro-Regular',
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={ClientDashboardScreen}
        options={{
          tabBarButton: props => <CustomTabButton {...props} />,
          tabBarIcon: ({focused}) =>
            focused ? (
              <FooterIcon1Act width={25} height={25} />
            ) : (
              <FooterIcon1 width={25} height={25} />
            ),
        }}
      />

      <Tab.Screen
        name="Invoices"
        component={InvoicesScreen}
        options={{
          tabBarButton: props => <CustomTabButton {...props} />,
          tabBarIcon: ({focused}) =>
            focused ? (
              <InvoicesAct width={25} height={25} />
            ) : (
              <Invoices width={25} height={25} />
            ),
        }}
      />

      <Tab.Screen
        name="Historical"
        component={HistoricalScreen}
        options={{
          tabBarButton: props => <CustomTabButton {...props} />,
          tabBarIcon: ({focused}) =>
            focused ? (
              <HistoricalAct width={25} height={25} />
            ) : (
              <Historical width={25} height={25} />
            ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarButton: props => <CustomTabButton {...props} />,
          tabBarIcon: ({focused}) =>
            focused ? (
              <FooterIcon4Act width={22} height={22} />
            ) : (
              <FooterIcon4 width={22} height={22} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ClientTabRoutes;

const styles = StyleSheet.create({
  TabBtn: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  TabBtnTxt: {
    flex: 1,
    borderRadius: 50,
    overflow: 'hidden',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
