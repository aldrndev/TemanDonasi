import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const LocationScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputAddress, setInputAddress] = useState("");
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const getLocationHandler = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setUsingCurrentLocation(true);
    fetchAddress(location.coords.latitude, location.coords.longitude);
  };

  const fetchAddress = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDdJgN7dx4lLMQPUkristEW7hJ6Zmged6U`
      );

      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address);
        setInputAddress(response.data.results[0].formatted_address);
        setShowMap(true);
      } else {
        setError("No address found for this location.");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setError("Error fetching address. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputAddress = () => {
    setAddress(inputAddress);
    if (inputAddress) {
      setUsingCurrentLocation(false);
      setShowMap(true);
      sendAddressToBackend(inputAddress);
    }
  };

  const sendAddressToBackend = async (address) => {
    console.log(address);
    // try {
    //   // Replace with your backend API endpoint
    //   const response = await fetch("YOUR_BACKEND_API_URL", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ address }),
    //   });

    //   if (response.ok) {
    //     console.log("Address sent to the backend successfully");
    //   } else {
    //     console.error("Failed to send address to the backend");
    //   }
    // } catch (error) {
    //   console.error("Error sending address to the backend:", error);
    // }
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputAddress}
          onChangeText={(text) => setInputAddress(text)}
          placeholder="Enter your address"
        />
        <Button title="Submit" onPress={handleInputAddress} />
      </View>
      <Button title="Get Current Location" onPress={getLocationHandler} />
      {usingCurrentLocation && (
        <Button
          title={showMap ? "Hide Map" : "Show Map"}
          onPress={toggleMapView}
        />
      )}
      {showMap && usingCurrentLocation && (
        <View style={styles.mapContainer}>
          {usingCurrentLocation && currentLocation && (
            <MapView
              style={styles.map}
              region={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Current Location"
              />
            </MapView>
          )}
        </View>
      )}
      {loading && <Text>Loading address...</Text>}
      {error && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: Dimensions.get("window").width * 0.8,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  mapContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").width * 0.8,
  },
  map: {
    flex: 1,
  },
});

export default LocationScreen;
