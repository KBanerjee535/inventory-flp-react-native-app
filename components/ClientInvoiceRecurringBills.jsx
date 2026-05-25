import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ClientInvoiceRecurringBills = () => {
  const [selected, setSelected] = useState(null);

  const data = [
    {
      id: '01',
      dueDate: '18/03/25',
      amount: 17.6,
      invoices: 'Paid',
    },
    {
      id: '02',
      dueDate: '26/04/25',
      amount: 17.6,
      invoices: 'Unpaid',
    },
    {
      id: '03',
      dueDate: '03/05/25',
      amount: 17.6,
      invoices: 'Overdue',
    },
  ];

  // InvoiceStatus
  const invoiceStatusColors = {
    Overdue: '#FFCECE',
    Unpaid: '#FFEFD3',
    Paid: '#E3FCD9',
  };

  // InvoiceStatustxt
  const invoiceStatusTxtColors = {
    Overdue: '#EF1010',
    Unpaid: '#D06100',
    Paid: '#2D7C0B',
  };

  const handleSelect = id => {
    setSelected(id === selected ? null : id);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.row} onPress={() => handleSelect(item.id)}>
      <View style={styles.cellCheckbox}>
        {/* Custom Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, selected === item.id && styles.checked]}
          onPress={() => handleSelect(item.id)}>
          {selected === item.id && (
            <Text style={styles.checkmark}>
              <Ionicons name="checkmark-outline" size={25} color="#EC732C" />
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.cell, styles.cellID]}>{item.id}</Text>
      <Text style={[styles.cell, styles.cellDate]}>{item.dueDate}</Text>
      <Text style={[styles.cell, styles.cellAmount]}>£{item.amount}</Text>
      <View
        style={[
          styles.invoicesstatusIndicator,
          {backgroundColor: invoiceStatusColors[item.invoices]},
        ]}>
        <Text
          style={[
            styles.invoiceStatusTxtColors,
            {color: invoiceStatusTxtColors[item.invoices]}, // Fixed 'Color' to 'color'
          ]}>
          {item.invoices}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerText, styles.headerCheckbox]}></Text>
            <Text style={[styles.headerText, styles.headerID]}>#</Text>
            <Text style={[styles.headerText, styles.headerDate]}>DUE DATE</Text>
            <Text style={[styles.headerText, styles.headerAmount]}>AMOUNT</Text>
            <Text style={[styles.headerText, styles.headerStatus]}>STATUS</Text>
          </View>

          {/* List */}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>

      <View style={styles.Footer}>
        <TouchableOpacity style={styles.paymentButton}>
          <Text style={styles.paymentText}>
            Make Payment £{selected ? '17.6' : '0.00'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClientInvoiceRecurringBills;

const styles = StyleSheet.create({
  container: {padding: 20, height: '63%'},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },

  headerText: {
    fontSize: 14,
    color: '#525050',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
    textTransform: 'uppercase',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 5,
    borderRadius: 5,
  },

  cellCheckbox: {alignItems: 'center'},
  cell: {
    textAlign: 'center',
    fontSize: 16,
    color: '#717171',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
  },

  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDFCC',
  },

  checked: {backgroundColor: '#FFDFCC'},
  checkmark: {color: '#fff', fontSize: 14},

  status: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusText: {fontWeight: 'bold', textAlign: 'center'},

  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 20,
  },
  invoicesstatusIndicator: {
    borderRadius: 5,
    padding: 8,
    paddingBottom: 8,
    paddingTop: 4,
    paddingLeft: 5,
    paddingRight: 5,
    height: 20,
  },
  invoiceStatusTxtColors: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
    textAlign: 'center',
  },
  cellCheckbox: {width: '10%'},
  cellID: {width: '10%'},
  cellDate: {width: '30%'},
  cellAmount: {width: '30%'},
  invoicesstatusIndicator: {width: '20%'},

  headerCheckbox: {width: '10%'},
  headerID: {width: '10%'},
  headerDate: {width: '30%'},
  headerAmount: {width: '30%'},
  headerStatus: {width: '20%'},
  Footer: {
    padding: 25,
  },
  paymentButton: {
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
  paymentText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'BeVietnamPro-SemiBold',
    fontWeight: '600',
  },
});
