import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const CampaignCard = ({ item }) => {
  const { PostImages, title, goal, progress, expirationDate } = item;
  const progressPercentage = Math.min((progress / goal) * 100, 100);

  const newExpirationDate = new Date(expirationDate);
  const currentDate = new Date();

  const timeDifference = newExpirationDate - currentDate;
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.campaignCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: PostImages[0]?.postImg }}
          style={styles.campaignImage}
        />
        <View style={styles.daysLeftContainer}>
          <Text style={styles.daysLeftText}>{daysLeft} hari tersisa</Text>
        </View>
      </View>
      <Text style={styles.campaignTitle}>{title}</Text>
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
      <View style={styles.campaignStatus}>
        <View style={styles.statusTextContainer}>
          <Text style={{ fontWeight: "bold", color: "#00bcd4", fontSize: 17 }}>
            {progress}
          </Text>
          <Text style={{ color: "gray" }}> dari </Text>
          <Text style={{ fontWeight: "bold", color: "#000", fontSize: 17 }}>
            {goal}
          </Text>
          <Text style={{ color: "gray" }}> terkumpul </Text>
        </View>
        <Text style={styles.percentageText}>
          {progressPercentage.toFixed(0)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  campaignCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  campaignImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  daysLeftContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 15,
  },
  daysLeftText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 15,
    backgroundColor: "#dedede",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBarFiller: {
    height: "100%",
    backgroundColor: "#00bcd4",
  },
  campaignStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  statusTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentageText: {
    fontWeight: "bold",
    color: "gray",
    fontSize: 17,
  },
});

export default CampaignCard;
