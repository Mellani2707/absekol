import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const AddStudentScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    noWa: '',
    roleName: 'Siswa',
    nisn: '',
    nama: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    hpOrtu: '',
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(formData);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        'https://absekol-api.numpang.my.id/api/register',
        requestOptions,
      );
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Student and User registered successfully');
        setFormData({
          email: '',
          username: '',
          password: '',
          noWa: '',
          roleName: 'Siswa',
          nisn: '',
          nama: '',
          jenisKelamin: '',
          tempatLahir: '',
          tanggalLahir: '',
          alamat: '',
          hpOrtu: '',
        });
      } else {
        Alert.alert(
          'Error',
          result.message || 'Failed to register student and user',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'An error occurred while registering student and user',
      );
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar backgroundColor={'#dbe4f3'} barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Add Student</Text>
        {Object.keys(formData).map(key => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{key}</Text>
            <TextInput
              style={styles.input}
              value={formData[key]}
              onChangeText={text => handleChange(key, text)}
              placeholder={`Enter ${key}`}
              secureTextEntry={key === 'password'}
            />
          </View>
        ))}
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#dbe4f3',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default AddStudentScreen;
