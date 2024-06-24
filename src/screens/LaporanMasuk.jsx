import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, FlatList, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {FetchData} from '../API/FetchData'; // Pastikan Anda telah mengimpor FetchData dengan benar
import {IndonesiaTimeConverter} from '../TimeZone/IndonesiaTimeConverter';

const LaporanMasuk = ({navigation}) => {
  const user = useSelector(state => state.user);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const userData = user.user;
  const studentUserData = userData.Student;
  const fetchAbsensiList = async nisn => {
    setLoading(true);
    try {
      const result = await FetchData(
        `https://absekol-api.numpang.my.id/api/attendances/nisn/${nisn}/checkin`,
      );
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (true) {
      fetchAbsensiList('9999999');
    }
  }, [userData]);

  const handleSearch = text => {
    setSearchText(text);
    if (text) {
      const newData = data.filter(item => {
        const itemData = `${item.checkIn.toUpperCase()} ${item.isFakeGps
          .toString()
          .toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.absensiItem}>
      <Icon name="calendar-outline" size={24} color="#6A1B9A" />
      <View style={styles.absensiDetails}>
        <Text style={styles.absensiDate}>
          Check-In: {IndonesiaTimeConverter(item.checkIn)}
        </Text>
        <View style={styles.absensiStatus}>
          <Icon name="checkmark-done-outline" size={20} color="#333" />
          <Text style={styles.absensiStatusText}>
            Fake GPS: {item.isFakeGps ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.content}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search absensi..."
          value={searchText}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.absensiList}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  absensiList: {
    paddingBottom: 20,
  },
  absensiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  absensiDetails: {
    marginLeft: 10,
    flex: 1,
  },
  absensiDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  absensiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  absensiStatusText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
  },
});

export default LaporanMasuk;
