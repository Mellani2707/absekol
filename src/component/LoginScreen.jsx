import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LoginButton from './LoginButton';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lakukan validasi email dan password jika diperlukan

    // Kirim permintaan login ke backend
    fetch('http://192.168.179.117:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Tangani respon dari backend
        if (data.status === 'success') {
          // Login berhasil
          console.log('User logged in successfully');
          console.log('Token:', data.data.token);
          // Simpan token ke penyimpanan lokal jika diperlukan
        } else {
          // Login gagal, tampilkan pesan kesalahan
          console.error('Login failed:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Icon name="user-circle" size={100} color="blue" style={styles.icon} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <LoginButton color="blue" text="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
});

export default LoginScreen;
