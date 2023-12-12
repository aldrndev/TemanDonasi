import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({});
  const navigation = useNavigation();

  const user = {
    username: 'JohnDoe',
    profileImage: require('../assets/guest.png'),
    isLoggedIn: true,
  };

  const onEditProfilePress = () => {
    navigation.navigate('EditProfileScreen');
  };

  const onDonationHistoryPress = () => {
    navigation.navigate('DonationHistory');
  };

  const onRedeemHistoryPress = () => {
    navigation.navigate('RedeemHistoryScreen');
  };

  // const onTemanDonasiPress = () => {
  //   // Handle Teman Donasi press
  // };

  // const onTermOfUsePress = () => {
  //   // Handle Term of Use press
  // };

  // const onPrivacyPolicyPress = () => {
  //   // Handle Privacy Policy press
  // };

  const onSignOutPress = async () => {
    try {
      await AsyncStorage.removeItem('access_token');

      navigation.navigate('Splash');
    } catch (error) {
      console.error('Error clearing access token:', error);
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

    // console.log(userProfile);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: userProfile.Profile?.profileImg }}
            style={styles.profileImage}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.username}>
              {user.isLoggedIn ? userProfile.Profile?.fullName : 'Guest'}
            </Text>
            {/* {user.isLoggedIn && (
              <TouchableOpacity onPress={onEditProfilePress}>
                <Icon
                  name="pencil-alt"
                  size={20}
                  color="#000"
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            )} */}
          </View>
        </View>
        {user.isLoggedIn && (
          <View style={styles.historySection}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 17, marginVertical: 15 }}
            >
              Riwayat
            </Text>
            <View style={{ borderBottomWidth: 1, borderColor: '#B2C8DF' }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingRight: 10,
                  paddingVertical: 10,
                }}
                onPress={onDonationHistoryPress}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      style={{ fontSize: 17 }}
                      name="hand-holding-heart"
                      solid
                      color={'#06283D'}
                    />
                  </View>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 17,
                      color: '#06283D',
                    }}
                  >
                    Donasi
                  </Text>
                </View>
                <Icon color={'#06283D'} name="chevron-right" />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: 10,
                paddingVertical: 10,
              }}
              onPress={onRedeemHistoryPress}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 30,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    color={"#06283D"}
                    style={{ fontSize: 17 }}
                    name="gift"
                    solid
                  />
                </View>
                <Text
                  style={{ fontWeight: "500", fontSize: 17, color: "#06283D" }}
                >
                  Penukaran
                </Text>
              </View>
              <Icon color={"#06283D"} name="chevron-right" />
            </TouchableOpacity> */}
          </View>
        )}
        {/* <View style={styles.aboutSection}>
          <Text
            style={{ fontWeight: "bold", fontSize: 17, marginVertical: 15 }}
          >
            Tentang
          </Text>
          <View style={{ borderBottomWidth: 1, borderColor: "#B2C8DF" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: 10,
                paddingVertical: 10,
              }}
              onPress={onTemanDonasiPress}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 30,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    color={"#06283D"}
                    style={{ fontSize: 17 }}
                    name="hands"
                    solid
                  />
                </View>
                <Text
                  style={{ fontSize: 17, fontWeight: "500", color: "#06283D" }}
                >
                  Teman Donasi
                </Text>
              </View>
              <Icon color={"#06283D"} name="chevron-right" />
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomWidth: 1, borderColor: "#B2C8DF" }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: 10,
                paddingVertical: 15,
              }}
              onPress={onTermOfUsePress}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 30,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    color={"#06283D"}
                    style={{ fontSize: 17 }}
                    name="clipboard-list"
                  />
                </View>
                <Text
                  style={{ fontSize: 17, fontWeight: "500", color: "#06283D" }}
                >
                  Syarat dan Ketentuan
                </Text>
              </View>
              <Icon color={"#06283D"} name="chevron-right" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: 10,
              paddingVertical: 10,
            }}
            onPress={onPrivacyPolicyPress}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 30,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Icon
                  color={"#06283D"}
                  style={{ fontSize: 17 }}
                  name="shield-alt"
                />
              </View>
              <Text
                style={{ fontSize: 17, fontWeight: "500", color: "#06283D" }}
              >
                Kebijakan Privasi
              </Text>
            </View>
            <Icon color={"#06283D"} name="chevron-right" />
          </TouchableOpacity>
        </View> */}
        {user.isLoggedIn && (
          <Pressable style={styles.signOutButton} onPress={onSignOutPress}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    marginTop: 20,
    alignItems: 'center',
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
  editIcon: {
    marginTop: 10,
  },
  historySection: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  aboutSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  signOutButton: {
    backgroundColor: '#00bcd4',
    alignItems: 'center',
    padding: 16,
    marginVertical: 20,
    borderRadius: 30,
    marginHorizontal: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfileScreen;
