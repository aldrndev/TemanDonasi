import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const data = [
  {
    id: '1',
    donorName: 'John Doe',
    campaignName: 'COVID-19 Relief',
    amount: 50,
    verificationStatus: 'Verified',
  },
  {
    id: '2',
    donorName: 'Alice Smith',
    campaignName: 'Education Fund',
    amount: 30,
    verificationStatus: 'Pending',
  },
  {
    id: '3',
    donorName: 'Bob Johnson',
    campaignName: 'Food Drive',
    amount: 25,
    verificationStatus: 'Verified',
  },
];

const DonationHistoryScreen = () => {
  const [donationHistory, setDonationHistory] = useState([]);
  const fetchDonationHistory = async () => {
    const token = await AsyncStorage.getItem('access_token');

    const { data } = await axios.get(
      `https://temandonasi-backend.aldrincloud.com/pub/donation`,
      {
        headers: {
          access_token: token,
        },
      }
    );

    setDonationHistory(data.data);
  };

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={donationHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.donationItem}>
            <View style={{ width: '65%' }}>
              <Text style={styles.campaignName}>{item.Post?.title}</Text>
              <Text style={styles.verificationStatus}>
                Status Verifikasi: {item.isVerified ? 'Verified' : 'Pending'}
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text>Jumlah Donasi</Text>
              <Text style={styles.donationAmount}>{item.amountDonated}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  donationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  donationDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  donationAmount: {
    fontSize: 16,
    color: '#00bcd4',
    fontWeight: 'bold',
  },
});

export default DonationHistoryScreen;
