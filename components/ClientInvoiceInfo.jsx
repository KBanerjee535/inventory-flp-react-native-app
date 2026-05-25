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
} from 'react-native';
import React from 'react';

const ClientInvoiceInfo = () => {
  return (
    <View>
      <ScrollView style={styles.container}>
        <View style={styles.keyInfo}>
          <Text style={styles.sectionTitel}>Invoice info</Text>

          <View style={styles.keyInfoBox}>
            <Text style={styles.LftTxt}>Invoice Status</Text>
            <View
              style={[
                styles.invoicesstatusIndicator,
                styles.invoicesstatusIndicatorOverdue,
              ]}>
              <Text
                style={[
                  styles.invoiceStatusTxt,
                  styles.invoiceStatusTxtOverdue,
                ]}>
                Overdue
              </Text>
            </View>
          </View>
          <View style={styles.keyInfoBox}>
            <Text style={styles.LftTxt}>Invoice Created on</Text>
            <Text style={styles.RgtTxt}>07/01/2025</Text>
          </View>
          <View style={styles.keyInfoBox}>
            <Text style={styles.LftTxt}>Invoice Due Date</Text>
            <Text style={styles.RgtTxt}>18/03/2025</Text>
          </View>
          <View style={styles.keyInfoBox}>
            <Text style={styles.LftTxt}>Invoice Type</Text>
            <Text style={styles.RgtTxt}>Weekly Recurring</Text>
          </View>
          <View style={styles.keyInfoBox}>
            <Text style={styles.LftTxt}>Recurring Start Date </Text>
            <Text style={styles.RgtTxt}>18/03/2025</Text>
          </View>
          <View style={styles.keyInfoBox}>
            <Text style={styles.LftTxt}>Recurring End Date </Text>
            <Text style={styles.RgtTxt}>18/04/2025</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ClientInvoiceInfo;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingLeft: 25,
    paddingRight: 25,
  },
  keyInfo: {
    width: '100%',
    paddingTop: 10,
  },
  keyInfoBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 5,
  },
  LftTxt: {
    fontSize: 16,
    color: '#717171',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
  },
  RgtTxt: {
    fontSize: 16,
    color: '#151313',
    fontFamily: 'BeVietnamPro-Regular',
    fontWeight: '400',
  },
  invoicesstatusIndicatorOverdue: {backgroundColor: '#FFCECE'},
  invoiceStatusTxtOverdue: {color: '#EF1010'},

  invoicesstatusIndicatorUnpaid: {backgroundColor: '#FFEFD3'},
  invoiceStatusTxtUnpaid: {color: '#D06100'},

  invoicesstatusIndicatorPaid: {backgroundColor: '#E3FCD9'},
  invoiceStatusTxtPaid: {color: '#2D7C0B'},

  invoicesstatusIndicator: {
    borderRadius: 5,
    padding: 8,
    paddingBottom: 8,
    paddingTop: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
  invoiceStatusTxt: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
  },
  sectionTitel: {
    marginBottom: 15,
    fontSize: 14,
    color: '#525050',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
    textTransform: 'uppercase',
  },
});
