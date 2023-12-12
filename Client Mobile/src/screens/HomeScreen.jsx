import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import CampaignCard from '../components/CampaignCard';
import useAuthStore from '../stores/authStore';
import axios from 'axios';
import useCampaignStore from '../stores/campaignStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const [greeting, setGreeting] = useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const userType = useAuthStore((state) => state.userType);
  const campaigns = useCampaignStore((state) => state.campaigns);
  const setCampaigns = useCampaignStore((state) => state.setCampaigns);
  const [donationsCount, setDonationsCount] = useState(0);
  const [usernamez, setUsernamez] = useState('');

  const fetchUserDonations = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const username = await AsyncStorage.getItem('username');
        const response = await axios.get(
          'https://temandonasi-backend.aldrincloud.com/pub/donation',
          {
            headers: { access_token: token },
          }
        );

        setDonationsCount(response.data.data.length);
        setUsernamez(username);
      } else {
        console.error('Access token is null or invalid.');
      }
    } catch (error) {
      console.error('There was an error fetching the donations!', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        'https://temandonasi-backend.aldrincloud.com/pub/post',
        {
          params: { search: searchQuery },
        }
      );
      setCampaigns(response.data.data);
    } catch (error) {
      console.error('There was an error fetching the campaigns!', error);
    }
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const navigation = useNavigation();

  const handleCardPress = (itemId) => {
    navigation.navigate('Campaign Detail', { itemId });
  };

  const fetchCampaigns = async () => {
    const { data } = await axios.get(
      'https://temandonasi-backend.aldrincloud.com/pub/post'
    );
    setCampaigns(data.data);
  };

  const [refresh, setRefresh] = useState(false);
  const onRefresh = async () => {
    setRefresh(true);

    try {
      await fetchUserDonations();

      await fetchCampaigns();
    } catch (err) {
      setError(err);
    } finally {
      setRefresh(false);
    }
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Selamat Pagi');
    } else if (currentHour < 18) {
      setGreeting('Selamat Siang');
    } else {
      setGreeting('Selamat Malam');
    }

    fetchCampaigns();
    if (userType !== 'Guest') {
      fetchUserDonations();
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      fetchCampaigns();
    }
  }, [searchQuery]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
        <View style={style.header}>
          <View style={style.headerLeft}>
            {userType === 'Guest' ? (
              <Image
                source={require('../assets/guest.png')}
                style={style.profileImage}
              />
            ) : (
              <Image
                source={{ uri: 'https://placekitten.com/200' }}
                style={style.profileImage}
              />
            )}
            <View>
              <Text style={style.greetingText}>Halo, {greeting}!</Text>
              {/* USERNAME */}
              <Text style={style.userName}>
                {userType === 'Guest' ? 'Guest' : usernamez}
              </Text>
            </View>
          </View>
        </View>

        {userType !== 'Guest' ?? (
          <View style={style.homeCard}>
            <View style={{ gap: 30 }}>
              <View>
                <Text>Kamu sudah</Text>
                <Text>berdonasi sebanyak</Text>
              </View>
              <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {donationsCount} barang bekas
                </Text>
              </View>
            </View>
            <View style={{ marginRight: 10 }}>
              <Image
                style={{ width: 100, height: 100, marginHorizontal: 'auto' }}
                source={require('../assets/donasi.png')}
              />
            </View>
          </View>
        )}

        <Searchbar
          placeholder="Cari donasi..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={style.searchBar}
        />
        <FlatList
          data={campaigns}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleCardPress(item.id)}>
              <CampaignCard item={item} />
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9DB2BF',
  },
  cardContainer: {
    marginRight: 20,
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  homeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#78C1F3',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  searchBar: {
    marginVertical: 15,
  },
  campaignCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  campaignImage: {
    width: 100,
    height: 100,
    marginHorizontal: 'auto',
    borderRadius: 10,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  campaignDescription: {
    fontSize: 16,
    color: '#777',
  },
});

export default HomeScreen;
