import React, { Component } from 'react';
import { Text, View, PermissionsAndroid, Button } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../config';

class Koordinat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      la: 0,
      lo: 0,
      isMocked: false,
      range: 0,
    };
  }

  componentDidMount() {
    const requestACCESS_FINE_LOCATIONPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izin Mengakses GPS',
            message: 'Aplikasi ini harus mengakses Lokasi anda',
            buttonNeutral: 'Nanti Aja',
            buttonNegative: 'Batal/Cegah',
            buttonPositive: 'Izinkan',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Aplikasi Dapat mengakses lokasimu');
          Geolocation.getCurrentPosition(
            position => {
              console.log(position.mocked);
              this.setState({
                isMocked: position.mocked,
                la: position.coords.latitude,
                lo: position.coords.longitude,
              });
            },
            error => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        } else {
          console.log(
            'Akses lokasi ditolak, aplikasi mungkin tidak dapat digunakan dengan baik',
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    requestACCESS_FINE_LOCATIONPermission();
  }

  // Hitung jarak antara dua titik koordinat menggunakan formula Haversine
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert ke meter
    return distance;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  handleAbsen = () => {
    // Tentukan koordinat absen (misalnya, SMKN 1 Sintuk Toboh Gadang)
    const absenLat = -0.12345; // Ganti dengan koordinat latitude yang benar
    const absenLon = 100.12345; // Ganti dengan koordinat longitude yang benar
    const allowedDistance = 1; // Jarak yang diizinkan dalam meter

    // Hitung jarak antara koordinat pengguna dan koordinat absen
    const distance = this.calculateDistance(
      this.state.la,
      this.state.lo,
      absenLat,
      absenLon,
    );

    // Periksa apakah jarak kurang dari atau sama dengan jarak yang diizinkan
    if (distance <= allowedDistance) {
      // Izinkan pengguna untuk melakukan absen
      console.log('Anda berada dalam jarak yang diizinkan untuk absen.');
      // Lakukan sesuatu di sini, misalnya munculkan tombol absen
    } else {
      // Beritahu pengguna bahwa mereka tidak berada dalam jarak yang diizinkan
      console.log('Anda tidak berada dalam jarak yang diizinkan untuk absen.');
      // Lakukan sesuatu di sini, misalnya munculkan pesan bahwa absen tidak diizinkan
    }
  };

  render() {
    return (
      <View>
        <Text>Test call geolocation properties</Text>
        <Text>Koordinat Latitude saat ini: {this.state.la}</Text>
        <Text>Koordinat Longtitude saat ini: {this.state.lo}</Text>
        <Text>Is Mocked: {this.state.isMocked ? 'Yes' : 'No'}</Text>
        <Button title="Absen"/>
        </View>
        );
  }
}
export default Koordinat;
