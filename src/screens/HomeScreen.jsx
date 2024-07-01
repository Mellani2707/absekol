import React, {useState, useEffect} from 'react';
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
import {useSelector} from 'react-redux';
import {FetchData} from '../API/FetchData';
import {HitsData} from '../API/HitsData';
import {KirimNotifWa} from '../API/KirimNotifWa';
import {getConfigValue} from '../API/GetConfig';
import {StoreNotifications} from '../API/StoreNotifications';
import {getDistance} from '../Geolocations/getDistance';
import log from '../utils/Logger'; // Import utilitas logging

import {IndonesiaTimeConverter} from '../TimeZone/IndonesiaTimeConverter';
import moment from 'moment-timezone';
import Geolocation from 'react-native-geolocation-service';

const maleImage = require('../image/L.png');
const femaleImage = require('../image/P.png');

const HomeScreen = ({navigation}) => {
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
  const [currentDistance, setCurrentDistance] = useState(0);

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
            log(
              'Korinat Info after Geolocation get',
              `la : ${geoPositioningInfo.la} dan lo: ${geoPositioningInfo.lo}`,
            );
            setCurrentDistance(
               getDistance(geoPositioningInfo.la, geoPositioningInfo.lo),
            );
          },
          
          error => {
            log('Geo Position Error', `${error.code}, ${error.message}`);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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
      await requestACCESS_FINE_LOCATIONPermission();
      if (geoPositioningInfo.la) {
        await GeocationsInfo();
      }
    } catch (error) {
      log('Fetch Info Error', error);
    } finally {
      setLoading(false);
    }
  };

  const GeocationsInfo = async () => {
    log(
      'Korinat Info X',
      `la : ${geoPositioningInfo.la} dan lo: ${geoPositioningInfo.lo}`,
    );
    setCurrentDistance(
      await getDistance(geoPositioningInfo.la, geoPositioningInfo.lo),
    );
    log('jarak saat ini', currentDistance);
    setStateRangeAttendance(await getConfigValue('ketetapan_jarak_absensi'));
    log('ketetapan jarak', stateRangeAttendance);
  };
  const handleAbsensi = async type => {
    try {
      const currentDate = moment().tz('Asia/Jakarta').format();
      let data = {
        nisn: userStudentData.nisn,
        latitude: geoPositioningInfo ? geoPositioningInfo.la : '-0.9999999999',
        longtitude: geoPositioningInfo
          ? geoPositioningInfo.lo
          : '100.999999999',
        isFakeGps: geoPositioningInfo ? geoPositioningInfo.isMocked : false,
      };

      log('Absensi Data Before Distance', data);
      // perbarui informasi jarak ke lokasi
      await GeocationsInfo();
      const jarakDenganTitikAbsensi = currentDistance;
      data.distance = jarakDenganTitikAbsensi;
      log('Jarak dengan Titik Absensi sebelum dibandingkan', jarakDenganTitikAbsensi);
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

          dataNotifikasi.message = `Absensi ${
            type === 'in' ? 'Masuk' : 'Pulang'
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

          dataNotifikasi.message = `Absensi ${
            type === 'in' ? 'Masuk' : 'Pulang'
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
  const InfoLokasi = () => {
    if (currentDistance > 0) {
      if (currentDistance > stateRangeAttendance) {
        return (
          <View>
            <Text style={styles.infoText}>
              Kamu berada {currentDistance}m dari Lokasi pengambilan Absen
              seharusnya. cobalah bergerak
              {currentDistance - stateRangeAttendance}m lagi hingga jarak kamu
              sudah tidak lebih dari {stateRangeAttendance}
            </Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text style={styles.infoText}>
              Kamu berada sudah berada diposisi {currentDistance}m dari Lokasi
              pengambilan Absen seharusnya.
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View>
          <Text style={styles.infoText}>
            Belum ada Info lokasi, coba ambil absen dulu nanti kami infokan
          </Text>
        </View>
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAbsensi('in')}>
          <Icon name="log-in-outline" size={40} color="#4CAF50" />
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAbsensi('out')}>
          <Icon name="log-out-outline" size={40} color="#E91E63" />
          <Text style={styles.buttonText}>Pulang</Text>
        </TouchableOpacity>
      </View>

      {/* Information */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Absensi Masuk Terakhir</Text>
          <Text style={styles.infoText}>
            {lastCheckIn ? IndonesiaTimeConverter(lastCheckIn.checkIn) : '-'}
          </Text>
          <TouchableOpacity
            style={styles.HistoryButton}
            onPress={() => navigation.navigate('HistoryMasuk')}>
            <Icon name="timer-outline" size={30} color="#998988" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Absensi Keluar Terakhir</Text>
          <Text style={styles.infoText}>
            {lastCheckOut ? IndonesiaTimeConverter(lastCheckOut.checkOut) : '-'}
          </Text>
          <TouchableOpacity
            style={styles.HistoryButton}
            onPress={() => navigation.navigate('HistoryKeluar')}>
            <Icon name="timer-outline" size={30} color="#998988" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Informasi Lokasi</Text>
          <InfoLokasi />
          {/* <TouchableOpacity
            style={styles.HistoryButton}
            onPress={() => navigation.navigate('HistoryLokasi')}>
            <Icon name="navigate-circle-outline" size={30} color="#998988" />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Map
       */}
      {/*
       <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Lokasi Saat ini</Text>
        <View style={styles.mapPlaceholder}>
          <Text>Map Placeholder</Text>
        </View>
      </View>
      */}
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
