import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CampaignsScreen,
  CreateCampaignScreen,
  HomeScreen,
  ProfileScreen,
  RewardListScreen,
} from "./src/screens";
import CampaignDetail from "./src/screens/CampaignDetailScreen";
import FAQScreen from "./src/screens/FAQScreen";
import SplashScreen from "./src/screens/SplashScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import useAuthStore from "./src/stores/authStore";
import { useState } from "react";
import DonationHistoryScreen from "./src/screens/DonationHistoryScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const navigationRef = React.createRef();

function MainContent({ navigation }) {
  const userType = useAuthStore((state) => state.userType);

  // const checkAccessToken = async () => {
  //   const access_token = await AsyncStorage.getItem("access_token");
  //   if (!access_token) {
  //     navigationRef.current?.navigate("Splash");
  //   }
  // };

  useEffect(() => {
    if (userType !== "Guest") {
      // checkAccessToken();
    }
  }, []);

  const handleTabPress = (screen) => {
    if (userType === "Guest") {
      navigation.navigate("SignIn");
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#00bcd4",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-activity" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateCampaignScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress("Create");
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus-square" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardListScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress("Rewards");
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="redeem" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress("Profile");
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [accessToken, setAccessToken] = useState("");
  const getAccessToken = async () => {
    const token = await AsyncStorage.getItem("access_token");
    setAccessToken(token);
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  const initialRouteName = accessToken ? "MainContent" : "Splash";
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainContent"
          component={MainContent}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Campaign Detail" component={CampaignDetail} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen
          name="DonationHistory"
          component={DonationHistoryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
