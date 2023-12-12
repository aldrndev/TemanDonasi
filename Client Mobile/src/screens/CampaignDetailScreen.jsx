import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DonationModal from '../components/DonationModal';
import axios from 'axios';
import useCampaignStore from '../stores/campaignStore';
import ImageCarousel from '../components/ImageCarousel';
import useAuthStore from '../stores/authStore';
import { useNavigation } from '@react-navigation/native';

const CampaignDetail = ({ route }) => {
  const { itemId } = route.params;
  const campaign = useCampaignStore((state) => state.campaign);
  const setCampaign = useCampaignStore((state) => state.setCampaign);
  const [loading, setLoading] = useState(true);
  const userType = useAuthStore((state) => state.userType);
  const navigation = useNavigation();

  const fetchCampaign = async () => {
    try {
      const { data } = await axios.get(
        `https://temandonasi-backend.aldrincloud.com/pub/post/${itemId}`
      );
      setCampaign(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const progressPercentage = campaign
    ? (campaign.progress / campaign.goal) * 100
    : 0;

  const newExpirationDate = campaign
    ? new Date(campaign.expirationDate)
    : new Date();
  const currentDate = new Date();

  const timeDifference = campaign ? newExpirationDate - currentDate : 0;
  const daysLeft = campaign
    ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    : 0;

  const [isDonationModalVisible, setDonationModalVisible] = useState(false);

  const toggleDonationModal = () => {
    if (userType !== 'Guest') {
      setDonationModalVisible(!isDonationModalVisible);
    } else {
      navigation.navigate('SignIn');
    }
  };

  const handleDonate = (amount, message) => {
    toggleDonationModal();
    Alert.alert(
      `${message}`,
      `Jumlah donasi: ${amount}\n\nTeam kami akan menghubungi anda untuk proses pickup`
    );
  };

  useEffect(() => {
    fetchCampaign();
  }, [itemId]);

  return (
    <ScrollView style={{ flex: 1 }}>
      {loading ? (
        <Text>Loading campaign details...</Text>
      ) : campaign ? (
        <>
          <ImageCarousel
            images={campaign.PostImages.map((image) => image.postImg)}
          />
          <Text style={styles.campaignTitle}>{campaign.title}</Text>
          <View style={styles.infoContainer}>
            <View>
              <Text
                style={{ fontWeight: 'bold', color: 'gray', marginRight: 5 }}
              >
                Diorganisir oleh
              </Text>
              <Text style={{ fontWeight: 'bold', color: '#00bcd4' }}>
                {campaign.User?.username}
              </Text>
            </View>
            <View style={styles.daysLeftContainer}>
              <FontAwesome name="clock-o" size={16} color="#00bcd4" />
              <Text
                style={{ fontWeight: 'bold', color: 'gray' }}
              >{`${daysLeft} hari tersisa`}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.campaignStatus}>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusText}>{campaign.progress}</Text>
                <Text style={{ color: 'gray' }}> dari </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                  {campaign.goal}
                </Text>
                <Text style={{ color: 'gray' }}> terkumpul </Text>
              </View>
              <Text style={styles.percentageText}>
                {progressPercentage.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFiller,
                  {
                    width: `${progressPercentage}%`,
                  },
                ]}
              />
            </View>
          </View>
          <View>
            <Text
              style={{ marginHorizontal: 16, fontWeight: 'bold', fontSize: 18 }}
            >
              Description
            </Text>
            <Text style={styles.descriptionText}>{campaign.description}</Text>
          </View>
          <TouchableOpacity
            style={styles.donateButton}
            onPress={toggleDonationModal}
          >
            <Text style={styles.donateButtonText}>Donate Now</Text>
          </TouchableOpacity>

          <DonationModal
            isVisible={isDonationModalVisible}
            onToggle={toggleDonationModal}
            onDonate={handleDonate}
            postId={itemId}
          />
        </>
      ) : (
        <Text>No campaign details found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  campaignImage: {
    width: '100%',
    height: 200,
  },
  campaignTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  progressContainer: {
    margin: 16,
  },
  campaignStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    color: '#00bcd4',
    fontSize: 17,
  },
  percentageText: {
    fontWeight: 'bold',
    color: 'gray',
    fontSize: 17,
  },
  progressBarBackground: {
    height: 15,
    backgroundColor: '#dedede',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFiller: {
    height: '100%',
    backgroundColor: '#00bcd4',
  },
  descriptionText: {
    fontSize: 16,
    margin: 16,
    color: 'gray',
  },
  daysLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  donateButton: {
    backgroundColor: '#00bcd4',
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  donateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CampaignDetail;
