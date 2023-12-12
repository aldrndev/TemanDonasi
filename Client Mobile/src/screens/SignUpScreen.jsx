import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    address: '',
    profileImg: null,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      if (selectedImage) {
        setFormData({ ...formData, profileImg: selectedImage.uri });
      }
    }
  };

  const getLocationHandler = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    try {
      setLoadingMap(true);
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=AIzaSyDdJgN7dx4lLMQPUkristEW7hJ6Zmged6U`
      );

      if (response.data.results.length > 0) {
        setFormData({
          ...formData,
          address: response.data.results[0].formatted_address,
        });
        setShowMap(true);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setLoadingMap(false);
    }
  };

  const hideMapHandler = () => {
    setShowMap(false);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  const handleSignup = async () => {
    await sendFormDataToBackend(formData);
  };

  const sendFormDataToBackend = async (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('address', data.address);

    if (data.profileImg) {
      const uriParts = data.profileImg.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('profileImg', {
        uri: data.profileImg,
        name: `profileImg.${fileType}`,
        type: `profileImg/${fileType}`,
      });
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'https://temandonasi-backend.aldrincloud.com/pub/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Alert.alert('Sukses', 'Registrasi berhasil! Cek Email untuk Verifikasi', [
        { text: 'OK' },
      ]);
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert(
        'Gagal',
        error.response ? error.response.data.message : error.message,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? 0 : -Dimensions.get('window').height / 2
      }
    >
      <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Modal
            transparent={true}
            animationType="none"
            visible={loading}
            onRequestClose={() => {
              console.log('close modal');
            }}
          >
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator animating={loading} />
              </View>
            </View>
          </Modal>
          <View style={styles.form}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: 'gray',
                marginBottom: 5,
              }}
            >
              Buat Akun
            </Text>
            <View style={styles.inputContainer}>
              <Animatable.Text
                animation={focusedInput === 'fullName' ? 'fadeInUp' : 'fadeOut'}
                style={styles.label}
              >
                Full Name
              </Animatable.Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={focusedInput === 'fullName' ? '' : 'Full Name'}
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange('fullName', text)}
                  onFocus={() => handleInputFocus('fullName')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Animatable.Text
                animation={focusedInput === 'username' ? 'fadeInUp' : 'fadeOut'}
                style={styles.label}
              >
                Username
              </Animatable.Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={focusedInput === 'username' ? '' : 'Username'}
                  value={formData.username}
                  onChangeText={(text) => handleInputChange('username', text)}
                  onFocus={() => handleInputFocus('username')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Animatable.Text
                animation={
                  focusedInput === 'phoneNumber' ? 'fadeInUp' : 'fadeOut'
                }
                style={styles.label}
              >
                Phone Number
              </Animatable.Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={
                    focusedInput === 'phoneNumber' ? '' : 'Phone Number'
                  }
                  value={formData.phoneNumber}
                  onChangeText={(text) =>
                    handleInputChange('phoneNumber', text)
                  }
                  onFocus={() => handleInputFocus('phoneNumber')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Animatable.Text
                animation={focusedInput === 'email' ? 'fadeInUp' : 'fadeOut'}
                style={styles.label}
              >
                Email
              </Animatable.Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={focusedInput === 'email' ? '' : 'Email'}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  onFocus={() => handleInputFocus('email')}
                  onBlur={handleInputBlur}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Animatable.Text
                animation={focusedInput === 'password' ? 'fadeInUp' : 'fadeOut'}
                style={styles.label}
              >
                Password
              </Animatable.Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { width: '85%' }]}
                  placeholder={focusedInput === 'password' ? '' : 'Password'}
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={handleInputBlur}
                />
                <Pressable
                  style={styles.toggleButton}
                  onPress={toggleShowPassword}
                >
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={24}
                    color="gray"
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Animatable.Text
                animation={focusedInput === 'address' ? 'fadeInUp' : 'fadeOut'}
                style={styles.label}
              >
                Address
              </Animatable.Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { width: '85%' }]}
                  placeholder={focusedInput === 'address' ? '' : 'Address'}
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  onFocus={() => handleInputFocus('address')}
                  onBlur={handleInputBlur}
                />
                {showMap ? (
                  <Pressable
                    style={styles.toggleButton}
                    onPress={hideMapHandler}
                  >
                    <FontAwesome name="map-marker" size={24} color="red" />
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.toggleButton}
                    onPress={getLocationHandler}
                  >
                    <FontAwesome name="map" size={24} color="green" />
                  </Pressable>
                )}
                {loadingMap && <ActivityIndicator size="small" color="green" />}
              </View>
            </View>
            {showMap && (
              <View style={styles.mapContainer}>
                <View style={styles.mapWrapper}>
                  {currentLocation && (
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
              </View>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profile Image</Text>
              {formData.profileImg ? (
                <Image
                  source={{ uri: formData.profileImg }}
                  style={styles.profileImage}
                />
              ) : (
                <Pressable
                  style={styles.profileImagePicker}
                  onPress={pickImage}
                >
                  <Text style={styles.profileImagePickerText}>
                    Pick an image
                  </Text>
                </Pressable>
              )}
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 15,
              }}
            >
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitText}>Daftar</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>Sudah punya akun?</Text>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                Masuk
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  form: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    gap: 15,
    marginVertical: 30,
  },
  label: {
    fontSize: 12,
    color: 'gray',
    position: 'absolute',
    top: -10,
    left: 15,
    zIndex: 10,
    backgroundColor: '#fff',
  },
  labelFocused: {
    fontSize: 12,
    color: 'blue',
    marginBottom: 5,
  },
  input: {
    paddingVertical: 10,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  locationButton: {
    width: 30,
    marginHorizontal: 'auto',
  },
  mapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  mapWrapper: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
  },
  map: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#15AABF',
    padding: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  submitText: {
    color: 'white',
    textAlign: 'center',
    width: 100,
    fontWeight: '700',
  },
  profileImageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 5,
  },
  profileImagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#15AABF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  profileImagePickerText: {
    color: 'white',
  },
});

export default SignUpScreen;
