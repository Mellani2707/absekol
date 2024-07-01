import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FetchData } from '../API/FetchData';
import { HitsData } from '../API/HitsData';
import { KirimNotifWa } from '../API/KirimNotifWa';
import { getConfigValue } from '../API/GetConfig';
import { StoreNotifications } from '../API/StoreNotifications';
import { getDistance } from '../Geolocations/getDistance';
import log from '../utils/Logger'; // Import utilitas logging

import {
  IndonesiaTimeConverter,
} from '../TimeZone/IndonesiaTimeConverter';
import moment from 'moment-timezone';
import Geolocation from 'react-native-geolocation-service';

const maleImage = require('../image/L.png');
const femaleImage = require('../image/P.png');

const HomeScreen = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const userData = user.user;
  const userStudentData = user.user.Student;
  const profileImage =
    userStudentData.jenisKelamin === 'L' ? maleImage : femaleImage;

  const [lastCheckIn, setLastCheckIn] = useState({});
  const [lastCheckOut, setLastCheckOut] = useState({});

  const [geoPositioningInfo, setGeoPositioningInfo] = useState({});
  const [stateRangeAttendance, setStateRangeAttendance] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInfoAbsen(userStudentData.nisn);
  }, []);

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
        log('GPS Permission', 'Aplikasi Dapat mengakses lokasimu');
        Geolocation.getCurrentPosition(
          position => {
            log('Geo Position', position);
            setGeoPositioningInfo({
              isMocked: position.mocked,
              la: position.coords.latitude,
              lo: position.coords.longitude,
            });
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

  const fetchInfoAbsen = async nisn => {
    setLoading(true);
    try {
      const result = await FetchData(
        'https://absekol-api.numpang.my.id/api/attendanceInfo/' + nisn,
      );
      setLastCheckIn(result.checkInTop);
      setLastCheckOut(result.checkOutTop);
      requestACCESS_FINE_LOCATIONPermission();
    } catch (error) {
      log('Fetch Info Error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbsensi = async type => {
    try {
      const currentDate = moment().tz('Asia/Jakarta').format();
      let data = {
        nisn: userStudentData.nisn,
        latitude: geoPositioningInfo ? geoPositioningInfo.la : '-0.9999999999',
        longtitude: geoPositioningInfo ? geoPositioningInfo.lo : '100.999999999',
        isFakeGps: geoPositioningInfo ? geoPositioningInfo.isMocked : false,
      };

      log('Absensi Data Before Distance', data);
      const jarakDenganTitikAbsensi = await getDistance(
        geoPositioningInfo.la,
        geoPositioningInfo.lo,
      );
      data.distance = jarakDenganTitikAbsensi;
      log('Jarak dengan Titik Absensi', jarakDenganTitikAbsensi);

      const configValue = await getConfigValue('ketetapan_jarak_absensi');
      setStateRangeAttendance(configValue);
      log('Jarak Maksimal', stateRangeAttendance);

      let dataNotifikasi = {
        uid: userData.uid,
      };

      if (!geoPositioningInfo.isMocked) {
        if (jarakDenganTitikAbsensi < stateRangeAttendance) {
          if (type === 'out') {
            data.checkOut = currentDate;
          } else {
            data.checkIn = currentDate;
          }
          const result = await HitsData(
            'https://absekol-api.numpang.my.id/api/attendances',
            data,
          );
          Alert.alert(
            'Success',
            `Absensi ${type === 'in' ? 'Masuk' : 'Pulang'} berhasil`,
          );
          fetchInfoAbsen(userStudentData.nisn);

          dataNotifikasi.message = `Absensi ${type === 'in' ? 'Masuk' : 'Pulang'
            } berhasil`;
          dataNotifikasi.receiver = userData.noWa;
          dataNotifikasi.attendanceId = result.id;
          dataNotifikasi.status = 'Notifikasi Dikrim  ke Siswa via WhatsApp';
          StoreNotifications(dataNotifikasi);

          KirimNotifWa({
            noWa: userData.noWa,
            nama: userStudentData.nama,
            currentDate: currentDate,
            status: 'absekol_suksess',
          });
          KirimNotifWa({
            noWa: userStudentData.hpOrtu,
            nama: userStudentData.nama,
            currentDate: currentDate,
            status: 'absekol_sukses_ortu',
            currentRange: jarakDenganTitikAbsensi,
          });

          dataNotifikasi.message = `Absensi ${type === 'in' ? 'Masuk' : 'Pulang'
            } berhasil`;
          dataNotifikasi.receiver = userStudentData.hpOrtu;
          dataNotifikasi.status =
            'Notifikasi Dikrim  ke Orang Tua via WhatsApp';
          StoreNotifications(dataNotifikasi);
        } else {
          const result = await HitsData(
            'https://absekol-api.numpang.my.id/api/attendances',
            data,
          );
          KirimNotifWa({
            noWa: userData.noWa,
            nama: userStudentData.nama,
            currentDate: currentDate,
            status: 'absekol_gagal_terlalujauh',
            currentRange: jarakDenganTitikAbsensi,
            stateRange: stateRangeAttendance,
          });

          dataNotifikasi.message = `Pengambilan Absensi Gagal. Lokasi anda terdeteksi terlalu jauh senilai ${jarakDenganTitikAbsensi} meter dari lokasi seharusnya, mohon lebih dekat lagi ${stateRangeAttendance} meter lagi dari titik absensi yang ditetapkan atau perbaiki keakuratan  GPS Anda!`;
          dataNotifikasi.receiver = userData.noWa;
          dataNotifikasi.attendanceId = result.id;
          dataNotifikasi.status = 'Notifikasi Dikrim  ke Siswa via WhatsApp';
          StoreNotifications(dataNotifikasi);

          Alert.alert('Peringatan', 'Lokasi mu terlalu jauh!');
        }
      } else {
        KirimNotifWa({
          noWa: userData.noWa,
          nama: userStudentData.nama,
          currentDate: currentDate,
          status: 'absekol_gagal',
        });

        dataNotifikasi.message =
          'Pengambilan Absensi Gagal. Lokasi Anda Palsu, Matikan Fake GPS Anda!';
        dataNotifikasi.receiver = userData.noWa;
        dataNotifikasi.status = 'Notifikasi Dikrim  ke Siswa via WhatsApp';
        StoreNotifications(dataNotifikasi);

        Alert.alert('Peringatan', 'Lokasi Anda Palsu, Matikan Fake GPS Anda!');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while taking attendance: ' + error.message,
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image source={require('../image/smk.png')} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Absensi Apel SMKN 1</Text>
            <Text style={styles.headerSubtitle}>
              Menggunakan Lokasi Handphone Anda
            </Text>
          </View>
        </View>
        <View style={styles.profile}>
          <Image source={profileImage} style={styles.profilePic} />
          <View>
            <Text style={styles.profileName}>{userStudentData.nama}</Text>
            <Text style={styles.profileNumber}>{userData.username}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleAbsensi('in')}>
          <Icon name="log-in" size={60} color="green" />
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Check In</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleAbsensi('out')}>
          <Icon name="log-out" size={60} color="red" />
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Check Out</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Last CheckIn and CheckOut */}
      <View style={styles.lastCheck}>
        <View style={styles.lastCheckCard}>
          <Icon name="time" size={60} color="black" />
          <View style={styles.lastCheckCardContent}>
            <Text style={styles.lastCheckText}>
              {lastCheckIn
                ? IndonesiaTimeConverter(lastCheckIn.created_at)
                : 'Tidak ada Check In'}
            </Text>
            <Text style={styles.lastCheckLabel}>Last Check In</Text>
          </View>
        </View>
        <View style={styles.lastCheckCard}>
          <Icon name="time" size={60} color="black" />
          <View style={styles.lastCheckCardContent}>
            <Text style={styles.lastCheckText}>
              {lastCheckOut
                ? IndonesiaTimeConverter(lastCheckOut.created_at)
                : 'Tidak ada Check Out'}
            </Text>
            <Text style={styles.lastCheckLabel}>Last Check Out</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileNumber: {
    fontSize: 14,
    color: '#666',
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  cardContent: {
    marginTop: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastCheck: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lastCheckCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  lastCheckCardContent: {
    marginTop: 10,
  },
  lastCheckText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastCheckLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
