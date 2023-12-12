import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native-elements";
import useAuthStore from "../stores/authStore";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const SplashScreen = () => {
  const navigation = useNavigation();

  const setUserType = useAuthStore((state) => state.setUserType);
  const userType = useAuthStore((state) => state.userType);

  const handleLogin = () => {
    navigation.navigate("SignIn");
  };

  const handleSignup = () => {
    navigation.navigate("SignUp");
  };

  const handleGuestLogin = () => {
    setUserType("Guest");
    navigation.navigate("MainContent");
  };

  const [accessToken, setAccessToken] = useState("");
  const getAccessToken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setAccessToken(token);
  };

  useEffect(() => {
    getAccessToken();

    if (accessToken) {
      navigation.navigate("MainContent");
    }
  }, []);

  // const checkAccessToken = async () => {
  //   const access_token = await AsyncStorage.getItem("access_token");
  //   if (access_token) {
  //     navigation.navigate("MainContent");
  //   }
  // };

  // useEffect(() => {
  //   if (userType !== "Guest") {
  //     checkAccessToken();
  //   }
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Image
          style={{ width: 200, height: 150 }}
          source={require("../assets/logo-temandonasi.png")}
        />
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleGuestLogin}>
          <Text style={styles.buttonText}>Login as Guest</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#00bcd4",
    padding: 10,
    width: 200,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SplashScreen;
