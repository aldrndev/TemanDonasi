import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const TrendingCard = ({ item }) => {
  const { imageUrl, title, goal, collected, daysLeft } = item;
  const collectedPercentage = ((collected / goal) * 100).toFixed(0);

  return (
    <View style={styles.campaignCard}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.campaignImage} />
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
              width: `${collectedPercentage}%`,
            },
          ]}
        />
      </View>
      <View style={styles.campaignStatus}>
        <View style={styles.statusTextContainer}>
          <Text style={{ fontWeight: "bold", color: "#00bcd4", fontSize: 17 }}>
            {collected}
          </Text>
          <Text style={{ color: "gray" }}> dari </Text>
          <Text style={{ fontWeight: "bold", color: "#000", fontSize: 17 }}>
            {goal}
          </Text>
          <Text style={{ color: "gray" }}> terkumpul </Text>
        </View>
        <Text style={styles.percentageText}>{collectedPercentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  campaignCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginBottom: 20,
    width: "110%",
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
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "auto",
  },
  percentageText: {
    fontWeight: "bold",
    color: "gray",
    fontSize: 16,
  },
  daysLeftContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 15,
  },
  daysLeftText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  imageContainer: {
    position: "relative",
  },
});

export default TrendingCard;
