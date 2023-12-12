import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const RewardListScreen = () => {
  // State initialization
  const [user, setUser] = useState({
    username: 'JohnDoe',
    totalPoints: 1000,
    loggedIn: true,
  });

  const [accessToken, setAccessToken] = useState('');
  const [profile, setProfile] = useState({});
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');
  const [selectedLogo, setSelectedLogo] = useState(null);

  // Handlers and fetch functions
  const toggleLogo = (rewardCategory) => {
    if (selectedLogo?.id === rewardCategory.id) {
      setSelectedLogo(null);
    } else {
      setSelectedLogo(rewardCategory);
    }
  };

  const redeemReward = async (reward) => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (profile.point < reward.redeemPoint) {
        Alert.alert(
          'Error',
          'Your points are not enough to redeem this reward.'
        );
        return;
      }

      const response = await axios.patch(
        `https://temandonasi-backend.aldrincloud.com/pub/profile/${profile.id}`,
        {
          point: profile.point - reward.redeemPoint,
        },
        {
          headers: { access_token: token },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', response.data.message);

        setProfile({
          ...profile,
          point: profile.point - reward.redeemPoint,
        });
        fetchProfile(profile.id);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert(
          'Error',
          error.response.data.message ||
            'Error occurred while redeeming reward.'
        );
      } else {
        Alert.alert(
          'Error',
          'An error occurred while trying to redeem the reward.'
        );
      }
    }
  };

  const fetchProfile = async (id) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setAccessToken(token);
      const decodedToken = jwtDecode(token);
      const decodedUserId = decodedToken.id;

      const response = await axios.get(
        `https://temandonasi-backend.aldrincloud.com/pub/user/${decodedUserId}`,
        {
          headers: {
            access_token: token,
          },
        }
      );

      setProfile(response.data.data);
    } catch (err) {
      setError('Failed to fetch profile data');
    }
  };

  const fetchRewards = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        'https://temandonasi-backend.aldrincloud.com/pub/reward-category',
        {
          headers: { access_token: token },
        }
      );

      setRewards(response.data.data);
    } catch (err) {
      setError('Failed to fetch rewards');
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchRewards();
  }, []);

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View style={styles.profileSection}>
            {accessToken ? (
              <Image
                style={styles.profileImage}
                source={{ uri: profile.Profile?.profileImg }}
              />
            ) : (
              <Image
                style={styles.profileImage}
                source={{
                  uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                }}
              />
            )}

            <Text style={styles.username}>
              {accessToken ? profile.Profile?.fullName : 'Guest'}
            </Text>

            {user.loggedIn && (
              <View style={styles.totalPoints}>
                <Text>Total Points: {profile.Profile?.point}</Text>
              </View>
            )}
          </View>

          <View style={styles.logoSection}>
            <FlatList
              data={rewards}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleLogo(item)}>
                  <Image
                    style={styles.logo}
                    source={{
                      uri:
                        item.id === 1
                          ? 'https://digitu.my.id/images/produk/ewallet/ovo-besar-212-repc.png'
                          : item.id === 2
                          ? 'https://digitu.my.id/images/produk/pulsa/thumb-telkomsel-1-dtax.png'
                          : item.id === 3
                          ? 'https://digitu.my.id/images/produk/ewallet/dana-500-besar-181-shiz.png'
                          : item.id === 4
                          ? 'https://digitu.my.id/images/produk/ewallet/thumb-gopay-kecil-209-ydfw.png'
                          : item.id === 5
                          ? 'https://digitu.my.id/images/produk/ewallet/shopeepay-full-kecil-124-zftc.png'
                          : item.id === 6
                          ? 'https://www.robynandryleigh.com/wp-content/uploads/2013/02/Google-Play-logo.png'
                          : null,
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </>
      }
      data={selectedLogo ? selectedLogo.Reward : []}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.rewardSection}>
          <TouchableOpacity
            style={styles.rewardItem}
            onPress={() => redeemReward(item)}
          >
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardItemTitle}>{item.name}</Text>
              <Text style={styles.rewardItemPoints}>
                Points Needed: {item.redeemPoint}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    marginTop: 10,
  },
  totalPoints: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  logoSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  logoColumn: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 80,
    margin: 10,
    resizeMode: 'contain',
  },
  rewardSection: {
    paddingHorizontal: 20,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  rewardLogo: {
    width: 50,
    height: 40,
    marginRight: 10,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardItemTitle: {
    fontSize: 16,
  },
  rewardItemPoints: {
    fontSize: 14,
    color: '#888',
  },
});

export default RewardListScreen;
