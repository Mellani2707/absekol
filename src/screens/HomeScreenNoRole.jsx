import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreenNoRole = ({navigation}) => {
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
            source={require('../image/imel.jpeg')}
            style={styles.profilePic}
          />
          <View>
            <Text style={styles.profileName}>Ria Amanda</Text>
            <Text style={styles.profileNumber}>09997765655</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notification')}>
          <Icon name="notifications-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      <View style={styles.emptyContainer}>
        <Image
          source={require('../image/empty.png')}
          style={styles.emptyImage}
        />
        <Text style={styles.emptyTitle}>Tidak Ada Data</Text>
        <Text style={styles.emptySubtitle}>
          Anda tidak memiliki peran saat ini. Silakan hubungi administrator
          untuk mendapatkan akses yang sesuai.
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => Alert.alert('Refresh', 'Trying to refresh...')}>
          <Icon name="refresh-outline" size={20} color="#fff" />
          <Text style={styles.refreshButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  refreshButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
});

export default HomeScreenNoRole;
