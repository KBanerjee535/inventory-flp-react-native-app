import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';

const ClientInvoiceSummary = () => {
  const items = [
    {name: 'Bed', qty: 1, rate: 20, total: 20},
    {name: 'Wardrobe', qty: 1, rate: 10, total: 10},
    {name: 'Bed side Table', qty: 1, rate: 8, total: 8},
    {name: 'Table Lamp', qty: 2, rate: 5, total: 10},
  ];

  const subTotal = items.reduce((acc, item) => acc + item.total, 0);
  const vat = 5;
  const grandTotal = subTotal + vat;

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.itemCell, styles.headerText]}>
            ITEMS
          </Text>
          <Text style={[styles.cell, styles.smallCell, styles.headerText]}>
            QTY
          </Text>
          <Text style={[styles.cell, styles.smallCell, styles.headerText]}>
            RATE
          </Text>
          <Text style={[styles.cell, styles.smallCell, styles.headerText]}>
            TOTAL
          </Text>
        </View>

        {/* Table Rows */}
        {items.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, styles.itemCell]}>{item.name}</Text>
            <Text style={[styles.cell, styles.smallCell]}>{item.qty}</Text>
            <Text style={[styles.cell, styles.smallCell]}>£{item.rate}</Text>
            <Text style={[styles.cell, styles.smallCell]}>£{item.total}</Text>
          </View>
        ))}

        {/* Summary Rows */}
        <View style={[styles.row, styles.summaryRow]}>
          <Text style={[styles.cell, styles.itemCell]}>Sub Total</Text>
          <Text style={[styles.cell, styles.smallCell]}></Text>
          <Text style={[styles.cell, styles.smallCell]}></Text>
          <Text style={[styles.cell, styles.smallCell, styles.boldText]}>
            £{subTotal.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.row, styles.summaryRow]}>
          <Text style={[styles.cell, styles.itemCell]}>VAT</Text>
          <Text style={[styles.cell, styles.smallCell]}></Text>
          <Text style={[styles.cell, styles.smallCell]}></Text>
          <Text style={[styles.cell, styles.smallCell, styles.boldText]}>
            £{vat.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.row, styles.summaryRow]}>
          <Text style={[styles.cell, styles.itemCell]}>Grand Total</Text>
          <Text style={[styles.cell, styles.smallCell]}></Text>
          <Text style={[styles.cell, styles.smallCell]}></Text>
          <Text style={[styles.cell, styles.smallCell, styles.boldText]}>
            £{grandTotal.toFixed(2)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ClientInvoiceSummary;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
  },
  headerRow: {
    backgroundColor: '#f1f2f6',
    paddingBottom: 12,
  },
  summaryRow: {},
  cell: {
    textAlign: 'center',
    fontSize: 16,
    color: '#717171',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
  },
  itemCell: {
    width: '120',
    textAlign: 'left',
    // flex: 2,
    //textAlign: 'left', // Align text to the left
  },
  smallCell: {
    //  flex: 1, // Makes QTY, RATE, and TOTAL smaller
    // textAlign: 'right',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 14,
    color: '#525050',
    fontWeight: 400,
    fontFamily: 'BeVietnamPro-Regular',
    textTransform: 'uppercase',
  },
  boldText: {
    fontWeight: 700,
    fontSize: 16,
    color: '#393D47',
    fontFamily: 'BeVietnamPro-Bold',
  },
});
