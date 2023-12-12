import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

const RewardListScreen = () => {
  const userProfile = {
    name: "Aldrin",
    profileImage: "https://placekitten.com/200/300",
    points: 1000,
  };

  const rewardLogos = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/1280px-Logo_ovo_purple.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1200px-Gopay_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Google_Play_2022_logo.svg/1280px-Google_Play_2022_logo.svg.png",
  ];

  const [modalVisible, setModalVisible] = useState(false);

  const rewardCategories = [
    {
      category: "OVO",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png",
      rewards: [
        {
          id: 1,
          name: "Voucher OVO 50.000",
          pointsRequired: 500,
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png",
        },
        {
          id: 2,
          name: "Voucher OVO 250.000",
          pointsRequired: 500,
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png",
        },
      ],
    },
    {
      category: "Dana",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png",
      rewards: [
        {
          id: 1,
          name: "Voucher Dana 250.000",
          pointsRequired: 500,
          logo: "https://upload.wikimedia.org/wikipedia.commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png",
        },
      ],
    },
  ];

  const [selectedRewards, setSelectedRewards] = useState(null);

  const onLogoPress = (logoUrl) => {
    const selectedCategory = rewardCategories.find(
      (cat) => cat.logo === logoUrl
    );
    if (selectedCategory) {
      setSelectedRewards(selectedCategory.rewards);
    }
  };

  const onRewardPress = (reward) => {
    if (userProfile.points >= reward.pointsRequired) {
      Alert.alert(
        "Penukaran Sukses",
        "Anda telah berhasil menukar poin dengan reward."
      );
    } else {
      Alert.alert("Poin tidak cukup");
    }
  };

  return (
    <View style={styles.container}>
      {/* Profil Pengguna */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: userProfile.profileImage }}
        />
        <Text style={styles.profileName}>{userProfile.name}</Text>
      </View>

      {/* Total Poin */}
      <View style={styles.pointsCard}>
        <Text style={styles.pointsText}>Total Poin</Text>
        <Text style={styles.pointsText}>{userProfile.points}</Text>
      </View>

      {/* Grid Logo Reward */}
      <FlatList
        style={{ paddingHorizontal: 10 }}
        data={rewardLogos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onLogoPress(item)}
          >
            <Image style={styles.logo} source={{ uri: item }} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={4}
      />

      {/* Daftar Rewards */}
      {selectedRewards && (
        <View style={styles.rewardListContainer}>
          <Text style={styles.sectionTitle}>Rewards Tersedia:</Text>
          <FlatList
            data={selectedRewards}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.rewardCard}
                onPress={() => onRewardPress(item)}
              >
                <Image style={styles.rewardLogo} source={{ uri: item.logo }} />
                <Text style={styles.rewardName}>{item.name}</Text>
                <Text style={styles.rewardPoints}>
                  {item.pointsRequired} points
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },
  pointsCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "600",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: "contain",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 15,
  },
  rewardListContainer: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  rewardLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  rewardName: {
    fontSize: 16,
  },
  rewardPoints: {
    fontSize: 14,
    color: "#888",
  },
});

export default RewardListScreen;
