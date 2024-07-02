import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const userImage = require('../image/akun.jpg');
import log from '../utils/Logger'; // Import utilitas logging
import { HitsData } from '../API/HitsData';

export default class HomeScreenGuru extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userData: null,
      jumlahSiswa:0,
      jumlahMasuk:0,
      jumlahPulang:0,
      jumlahFake:0,
    };
  }
  componentDidMount() {
    this.fetchUserData();
    this.fetchAbsensiReport();
  }
   fetchAbsensiReport = async () => {
    setLoading(true);
    try {
      const result = await FetchData(
        `https://absekol-api.numpang.my.id/api/attendances/report`,
      );
      this.setState({ jumlahMasuk: result.totalCheckIn })
      this.setState({ jumlahPulang: result.totalCheckOut })
      this.setState({ jumlahMasuk: result.totalFakeGPS })
      this.setState({ jumlahSiswa: result.totalStudents })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchUserData = async () => {
    //ambil data user dari redux
    const user = useSelector(state => state.user);
    this.setState({
      userData:user,
      profileImage: userImage
    })
    log("User Data",this.state.userData)
  }
  
  render() {
    const { navigation } = this.props;
    const { loading, userData } = this.state;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>Loading...</Text>
        </View>
      );
    }
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
            <Image
              source={this.state.profileImage}
              style={styles.profilePic}
            />
            <View>
              <Text style={styles.profileName}>{this.state.userData.Role ?this.state.userData.Role.roleName:'Tidak Ada Role'}</Text>
              <Text style={styles.profileNumber}>{this.state.userData.noWa ? this.state.userData.noWa : 'Tidak Ada Nomor WA'}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notification')}>
            <Icon name="notifications-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Buttons menu laporan*/}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LaporanMasuk')}>
            <Icon name="document-text-outline" size={40} color="#4CAF50" />
            <Text style={styles.buttonText}>Laporan Absensi Masuk Siswa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LaporanKeluar')}>
            <Icon name="document-text-outline" size={40} color="#E91E63" />
            <Text style={styles.buttonText}>Laporan Absensi Pulang Siswa</Text>
          </TouchableOpacity>
        </View>

        {/* Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Jumlah Siswa </Text>
            <Text style={styles.infoText}>{this.state.jumlahMasuk}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Jumlah Siswa Masuk Hari Ini</Text>
            <Text style={styles.infoText}>{this.state.jumlahMasuk}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              Jumlah Siswa Tidak Masuk Hari Ini
            </Text>
            <Text style={styles.infoText}>-</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              Jumlah Siswa Masuk Dengan Lokasi Palsu Hari ini
            </Text>
            <Text style={styles.infoText}>{this.state.jumlahFake}</Text>
          </View>
        </View>

        {/* Map */}
      </View>
    );
  }
}



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
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
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
