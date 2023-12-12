import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import useAuthStore from '../stores/authStore';
import { useEffect } from 'react';

const SignInScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const setUserType = useAuthStore((state) => state.setUserType);
  const userType = useAuthStore((state) => state.userType);

  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const { email, password } = formData;

      const response = await axios.post(
        'https://temandonasi-backend.aldrincloud.com/pub/login',
        {
          email,
          password,
        }
      );

      const { access_token, name } = response.data.data;

      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('username', name);

      setUserType('User');

      navigation.navigate('MainContent');
      Alert.alert('Success', 'Login berhasil!', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert(
        'Login Gagal',
        'Email atau password salah, atau ada masalah jaringan. Silahkan coba lagi.',
        [{ text: 'OK' }]
      );
      console.log(error);
    }
  };

  const checkAccessToken = async () => {
    const access_token = await AsyncStorage.getItem('access_token');
    if (access_token) {
      navigation.navigate('MainContent');
    }
  };

  useEffect(() => {
    if (userType !== 'Guest') {
      checkAccessToken();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, backgroundColor: 'lightblue', padding: 20 }}>
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
          </View>
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    justifyContent: 'space-between',
  },
  input: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#15AABF',
    padding: 10,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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
});

export default SignInScreen;
