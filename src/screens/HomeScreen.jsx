import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
const maleImage = require('../image/L.png');
const femaleImage = require('../image/P.png');
const HomeScreen = ({navigation}) => {
  const user = useSelector(state => state.user);
  const userData = user.user;
  const userStudentData = user.user.Student;
  const profileImage =
    userStudentData.jenisKelamin === 'L' ? femaleImage : maleImage;

  const handleLogin = param => {
    fetch('https://absekol-api.numpang.my.id/api/attendanceInfo/' + param, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          // response.ok memeriksa apakah status code adalah 2xx
          return response.json();
        } else {
          return response.json().then(err => {
            throw new Error(err.message || 'No Attendance');
          });
        }
      })
      .then(data => {
        Alert.alert(
          'Success',
          'Ada aktifitas absensi terkahir terekam di database',
        );
        const attendanceData = data;
      })
      .catch(error => {
        Alert.alert('Error', 'An error ocfetch data : ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image source={require('../image/smk.png')} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Absensi Apel SMKN 1</Text>
            <Text style={styles.headerSubtitle}>SINTUK TOBOH GADANG</Text>
          </View>
        </View>
        <View style={styles.profile}>
          <Image source={profileImage} style={styles.profilePic} />
          <View>
            <Text style={styles.profileName}>
              {userStudentData ? userStudentData.nama : userData.username}
            </Text>
            <Text style={styles.profileNumber}>{userData.noWa}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notification')}>
          <Icon name="notifications-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Icon name="log-in-outline" size={40} color="#4CAF50" />
          <Text style={styles.buttonText}>Absensi Masuk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="log-out-outline" size={40} color="#E91E63" />
          <Text style={styles.buttonText}>Absensi Pulang</Text>
        </TouchableOpacity>
      </View>

      {/* Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Absensi Masuk</Text>
          <Text style={styles.infoText}>-</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Absensi Keluar</Text>
          <Text style={styles.infoText}>-</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Lokasi Saat ini</Text>
        <View style={styles.mapPlaceholder}>
          <Text>Map Placeholder</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileNumber: {
    fontSize: 16,
    color: '#666',
  },
  notificationButton: {
    position: 'absolute',
    top: 20,
    right: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '45%',
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomeScreen;
