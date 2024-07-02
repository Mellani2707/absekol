import React, { Component } from 'react'
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

import { IndonesiaTimeConverter } from '../TimeZone/IndonesiaTimeConverter';
import moment from 'moment-timezone';
import Geolocation from 'react-native-geolocation-service';

const maleImage = require('../image/L.png');
const femaleImage = require('../image/P.png');
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}
