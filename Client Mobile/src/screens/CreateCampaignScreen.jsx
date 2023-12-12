import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import mime from 'mime';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const CreateCampaignScreen = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    donatedItem: '',
    categoryId: '',
    goal: '0',
    expirationDate: moment().add(1, 'day').startOf('day').toDate(),
    location: '',
    postImg: [],
  });

  const initialFormData = {
    title: '',
    description: '',
    donatedItem: '',
    categoryId: '',
    goal: '0',
    expirationDate: moment().add(1, 'day').startOf('day').toDate(),
    location: '',
    postImg: [],
  };

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newExpirationDate, setNewExpirationDate] = useState(`${new Date()}`);

  const dateFormatter = (date) => {
    const event = new Date(date);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return event.toLocaleDateString('id-ID', options);
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
          location: response.data.results[0].formatted_address,
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

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: formData.expirationDate,
      onChange: (event, selectedDate) => {
        if (event.type === 'set') {
          const chosenDate = moment(selectedDate);
          setNewExpirationDate(chosenDate);
          console.log(newExpirationDate);
          setFormData((prevData) => ({
            ...prevData,
            expirationDate: chosenDate.format('YYYY-MM-DD HH:mm:ss.SSS'),
          }));
        }
      },
      mode: currentMode,
      is24Hour: true,
    });
  };

  const handleInputChange = (field, value) => {
    if (field === 'goals') {
      const numberValue = parseFloat(value);
      if (!isNaN(numberValue)) {
        setFormData({ ...formData, [field]: numberValue });
      } else {
        console.log('Invalid input for Goals');
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const pickImage = async () => {
    if (formData.postImg.length < 3) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const updatedImages = [...formData.postImg, result.assets[0].uri];
        setFormData({ ...formData, postImg: updatedImages });
      }
    } else {
      alert('You can select a maximum of 3 images.');
    }
  };

  const deleteImage = (index) => {
    const updatedImages = [...formData.postImg];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, postImg: updatedImages });
  };

  const createCampaign = async () => {
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('donatedItem', formData.donatedItem);
    form.append('categoryId', formData.categoryId);
    form.append('goal', formData.goal);
    form.append(
      'expirationDate',
      moment(formData.expirationDate).format('YYYY-MM-DD HH:mm:ss.SSS')
    );

    form.append('location', formData.location);

    formData.postImg.forEach((imageUri, index) => {
      const newImageUri = 'file:///' + imageUri.split('file:/').join(''); // corrects the file path for the image
      const fileType = mime.getType(newImageUri) || 'image/jpg'; // gets the image MIME type, defaults to JPG if not obtainable

      form.append('postImg', {
        uri: newImageUri,
        name: `image_${index}.${fileType.split('/').pop()}`,
        type: fileType,
      });
    });
    setLoading(true);
    try {
      await axios.post(
        'https://temandonasi-backend.aldrincloud.com/pub/post',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            access_token: await AsyncStorage.getItem('access_token'),
          },
        }
      );

      Alert.alert('Success', 'Campaign created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setFormData(initialFormData);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating campaign:', error);

      Alert.alert('Error', 'Error creating campaign. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://temandonasi-backend.aldrincloud.com/pub/category',
          {
            headers: {
              access_token: await AsyncStorage.getItem('access_token'),
            },
          }
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
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
        <View style={styles.inputGroup}>
          <Text>Title:</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
          />
          <Text>Description:</Text>
          <TextInput
            style={styles.input}
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Item Needed:</Text>
          <TextInput
            style={styles.input}
            value={formData.donatedItem}
            onChangeText={(text) => handleInputChange('donatedItem', text)}
          />
          <View style={styles.pickerContainer}>
            <Text>Item Category:</Text>
            <View style={styles.pickerBorder}>
              <Picker
                selectedValue={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <Picker.Item label="Select Category" value="Select Category" />
                {categories.map((category, index) => (
                  <Picker.Item
                    key={index}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <Text>Goals:</Text>
          <TextInput
            style={styles.input}
            value={formData.goal}
            onChangeText={(text) => handleInputChange('goal', text)}
            keyboardType="numeric"
          />
          <View style={styles.dateButtonContainer}>
            <Text>Expiration Date: </Text>
            <View style={styles.iconButton}>
              <Text> {dateFormatter(newExpirationDate)} 00 : 00</Text>
              <TouchableOpacity onPress={showDatepicker}>
                <Icon name="calendar-alt" solid size={24} color="#00bcd4" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { width: '85%' }]}
              value={formData.location}
              onChangeText={(text) => handleInputChange('location', text)}
            />
            {showMap ? (
              <Pressable style={styles.toggleButton} onPress={hideMapHandler}>
                <Icon name="map-marker" size={24} color="red" />
              </Pressable>
            ) : (
              <Pressable
                style={styles.toggleButton}
                onPress={getLocationHandler}
              >
                <Icon name="map" size={24} color="green" />
              </Pressable>
            )}
            {loadingMap && <ActivityIndicator size="small" color="green" />}
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
        </View>
        <Text>Images: {formData.postImg.length} selected</Text>
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.button}>
            Select Images <Icon name="images" size={16} />
          </Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {formData.postImg.map((uri, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                onPress={() => deleteImage(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.createButton} onPress={createCampaign}>
          <Text style={styles.createButtonText}>Create Campaign</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 5,
    padding: 10,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  pickerBorder: {
    borderWidth: 1,
    borderColor: 'gray',
    marginTop: 5,
  },
  dateButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageItem: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: 'white',
  },
  createButton: {
    backgroundColor: '#00bcd4',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  inputWrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginBottom: 10,
  },
});

export default CreateCampaignScreen;
