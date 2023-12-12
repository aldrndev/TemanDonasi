import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import { FlatList } from "react-native";
import CampaignCard from "../components/CampaignCard";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Pressable } from "react-native";

const CampaignsScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const navigation = useNavigation();

  const handleCardPress = (item) => {
    navigation.navigate("Campaign Detail", { item });
  };

  const campaigns = [
    {
      id: "1",
      imageUrl:
        "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/64888927811821.5605180254653.jpg",
      title: "Baju untuk kami",
      goal: 1000,
      category: "pakaian",
      collected: 500,
      daysLeft: 12,
      organizer: "Nicodemus Theodore",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat at fugit laboriosam maiores sunt aliquam aut magnam optio facere molestias eveniet harum tenetur delectus, provident cum commodi deleniti corrupti doloribus!",
    },
    {
      id: "2",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3O3boTYpEONEdBzZqcwCzRsTsRLxSddU5QUOYD4u3J4hFReJKyhCTnzEpES0YG0jnb8c&usqp=CAU",
      title: "Campaign 1",
      goal: 1000,
      category: "pakaian",
      collected: 100,
      daysLeft: 15,
      organizer: "Nicodemus Theodore",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat at fugit laboriosam maiores sunt aliquam aut magnam optio facere molestias eveniet harum tenetur delectus, provident cum commodi deleniti corrupti doloribus!",
    },
    {
      id: "3",
      imageUrl:
        "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/64888927811821.5605180254653.jpg",
      title: "Sepatu untuk kami",
      goal: 1000,
      collected: 350,
      daysLeft: 5,
      organizer: "Nicodemus Theodore",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat at fugit laboriosam maiores sunt aliquam aut magnam optio facere molestias eveniet harum tenetur delectus, provident cum commodi deleniti corrupti doloribus!",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
        <View style={style.homeCard}>
          <View style={{ gap: 30 }}>
            <View>
              <Text>Bulan ini kamu sudah</Text>
              <Text>berdonasi sebanyak</Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                50 barang bekas
              </Text>
            </View>
          </View>
          <View style={{ marginRight: 10 }}>
            <Image
              style={{ width: 100, height: 100, marginHorizontal: "auto" }}
              source={require("../assets/donasi.png")}
            />
          </View>
        </View>
        <Searchbar
          placeholder="Cari donasi..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={style.searchBar}
        />
        <FlatList
          data={campaigns}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleCardPress(item)}>
              <CampaignCard item={item} />
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  homeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#78C1F3",
    padding: 20,
    justifyContent: "space-between",
    borderRadius: 10,
  },
  searchBar: {
    marginVertical: 20,
  },
  campaignCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  campaignImage: {
    width: 100,
    height: 100,
    marginHorizontal: "auto",
    borderRadius: 10,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  campaignDescription: {
    fontSize: 16,
    color: "#777",
  },
});

export default CampaignsScreen;
