import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { FetchData } from '../API/FetchData';
import { HitsData } from '../API/HitsData';
import { KirimNotifWa } from '../API/KirimNotifWa';
import { getConfigValue } from '../API/GetConfig';
import { StoreNotifications } from '../API/StoreNotifications';
import { getDistance } from '../Geolocations/getDistance';
import log from '../utils/Logger'; // Import utilitas logging

import { IndonesiaTimeConverter } from '../TimeZone/IndonesiaTimeConverter';
import moment from 'moment-timezone';
import Geolocation from 'react-native-geolocation-service';

const maleImage = require('../image/L.png');
const femaleImage = require('../image/P.png');
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingStatement:"Loading . . .",
      userData: null,
      geoPositioningInfo:{},
      currentDistance: 999, 
      stateRangeAttendance:50
    };
  }
  componentDidMount() {
  }
   requestACCESS_FINE_LOCATIONPermission = async () => {
     this.setState({ loadingStatement: "Mencoba mengakses GPS mu dengan Akurat . ." })
     this.setState({ loading: true })
     log("Loading", this.state.loadingStatement)


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
        log('GPS Permission', 'Aplikasi Dapat mengakses lokasimu');
        log('GPS Load . . .', 'Mencoba mengakses');
        this.setState({ loadingStatement:"Mencoba mengakses GPS mu dengan Akurat . ."})
        log("GPS Load", this.state.loadingStatement)

        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude, mocked } = position.coords;
            log('Geo Position', position);
            this.setState({
              geoPositioningInfo: {
                isMocked: mocked,
                la: latitude,
                lo: longitude,
              }
            })
            
            this.setState({
              loadingStatement: ` Kordinat kamu berhasil didapatkan la : ${geoPositioningInfo.la} dan lo: ${geoPositioningInfo.lo}` });
            log(
              'Kordinat kamu berhasil didapatkan', this.state.loadingStatement );

            const distance = getDistance(latitude, longitude);
            this.setState({
              currentDistance:distance
            })
            this.setState({ loadingStatement: "Jarak kamu ke lokasi absensi "+this.state.currentDistance+"m" })
          },

          error => {
            log('Geo Position Error', `${error.code}, ${error.message}`);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );

      } else {
        log(
          'GPS Permission Denied',
          'Akses lokasi ditolak, aplikasi mungkin tidak dapat digunakan dengan baik',
        );
      }
    } catch (err) {
      log('Permission Request Error', err);
    }
  };
   GeolocationsInfo = async () => {
     while (this.state.currentDistance > this.state.stateRangeAttendance & this.state.currentDistance < 1){
      await this.requestACCESS_FINE_LOCATIONPermission()

       const ketetapan = await getConfigValue('ketetapan_jarak_absensi')
       await this.setState({stateRangeAttendance:ketetapan})


       await this.setState({
         loadingStatement: `jarak kamu kelokasi absen baru ${this.state.currentDistance}m,agar memenuhi jarak yang ditentukan maksimal ${this.state.currentDistance}m. Kami mencoba memuat data GPS kembali  . . .`,
       });
       await this.setState({ loading: false });
       log('reloading GPS . .', this.state.loadingStatement);
     }
     await this.setState({
       loadingStatement: 'load data GPS sudah selesai hingga akurat. .',
     });
     await this.setState({ loading: false });
     log('Loading GPS Success', this.state.loadingStatement);
  };
  fetchUserData = async () => {
    await this.setState({
      loadingStatement: 'load data user from redux useSelector. .',
    });
    await this.setState({ loading: true });
    log('Loading redux', this.state.loadingStatement);
    //ambil data user dari redux
    // const user = await useSelector(state => state.user);
    await this.setState({
      userData: this.props.user.user,
      profileImage: userImage,
    });

    log('User Data -->', this.state.userData);
    this.setState({ loading: false });
    log('Loading', 'load data user completed');
  };
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>{this.state.loadingStatement}</Text>
        </View>
      );
    }
    return (
      <View>
        <Text> Berhasil mendapatkan jarak absensi yang sesuai {this.state.currentDistance}</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps)(HomeScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowOffset: { width: 0, height: 2 },
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
  HistoryButton: {
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
