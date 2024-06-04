import React, {Component} from 'react';
import {Text, View, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

class HomeScreen extends Component {
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
            message: 'Aplikasi ini harus mengakses Lokasi mu',
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
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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

  render() {
    return (
      <View>
        <Text>Test call geolocation properties</Text>
        <Text>Koordinat Latitude saat ini: {this.state.la}</Text>
        <Text>Koordinat Longtitude saat ini: {this.state.lo}</Text>
        <Text>Is Mocked: {this.state.isMocked ? 'Yes' : 'No'}</Text>
      </View>
    );
  }
}

export default HomeScreen;
