import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';

const DonationModal = ({ isVisible, onToggle, onDonate, postId }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [userProfile, setUserProfile] = useState({});

  const handleDonate = async () => {
    if (donationAmount.trim() === '') {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
    } else {
      const { data } = await axios.post(
        `https://temandonasi-backend.aldrincloud.com/pub/donation/${postId}`,
        { amountDonated: donationAmount },
        {
          headers: {
            access_token: await AsyncStorage.getItem('access_token'),
          },
        }
      );

      onDonate(donationAmount, data.message);
    }
  };

  const getUserProfile = async () => {
    const token = await AsyncStorage.getItem('access_token');

    const decodedToken = jwtDecode(token);

    const decodedUserId = decodedToken.id;
    const { data } = await axios.get(
      `https://temandonasi-backend.aldrincloud.com/pub/user/${decodedUserId}`
    );

    setUserProfile(data?.data);

    console.log(userProfile);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Donate</Text>

          <Text>{userProfile.Profile?.fullName}</Text>
          <Text>{userProfile.Profile?.address}</Text>
          <Text>{userProfile.Profile?.phoneNumber}</Text>
          <Text>{userProfile.email}</Text>

          <TextInput
            style={styles.donationInput}
            placeholder="Enter the amount"
            keyboardType="numeric"
            value={donationAmount}
            onChangeText={(text) => setDonationAmount(text)}
          />
          {/* Button container for "Donate" and "Cancel" buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.donateButtonModal}
              onPress={handleDonate}
            >
              <Text style={styles.buttonText}>Donate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onToggle}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  donationInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  donateButtonModal: {
    backgroundColor: '#00bcd4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  donateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default DonationModal;
