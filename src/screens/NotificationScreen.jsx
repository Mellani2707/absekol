import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const notifications = [
  { id: '1', date: 'Rabu, 3 Januari 2024', timeIn: '07:30', timeOut: '14:30' },
  { id: '2', date: 'Kamis, 4 Januari 2024', timeIn: '07:30', timeOut: '14:30' },
  { id: '3', date: 'Jumat, 5 Januari 2024', timeIn: '07:30', timeOut: '14:30' },
  { id: '4', date: 'Sabtu, 6 Januari 2024', timeIn: '07:30', timeOut: '14:30' },
  { id: '5', date: 'Senen, 8 Januari 2024', timeIn: '07:30', timeOut: '14:30' },
  { id: '6', date: 'Selasa, 9 Januari 2024', timeIn: '07:30', timeOut: '14:30' },
  { id: '7', date: 'Rabu, 10 Januari 2024', timeIn: '07:30', timeOut: '14:30' },
];

const NotificationScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Icon name="calendar-outline" size={24} color="#6A1B9A" />
      <View style={styles.notificationDetails}>
        <Text style={styles.notificationDate}>{item.date}</Text>
        <View style={styles.notificationTimes}>
          <Icon name="time-outline" size={20} color="#333" />
          <Text style={styles.notificationTime}>{item.timeIn}</Text>
          <Icon name="time-outline" size={20} color="#333" />
          <Text style={styles.notificationTime}>{item.timeOut}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}></Text>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationList}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  notificationDetails: {
    marginLeft: 10,
    flex: 1,
  },
  notificationDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
  },
});

export default NotificationScreen;
