import React from 'react';
import {Provider} from 'react-redux';
import store from '../redux/store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenGuru from '../screens/HomeScreenGuru';
import HomeScreenAdmin from '../screens/HomeScreenAdmin';
import HomeScreenNoRole from '../screens/HomeScreenNoRole';
import NotificationScreen from '../screens/NotificationScreen';
import AbsensiMasukHistoryScreen from '../screens/AbsensiMasukHistoryScreen';
import AbsensiKeluarHistoryScreen from '../screens/AbsensiKeluarHistoryScreen';
import LaporanMasuk from '../screens/LaporanMasuk';
import LaporanKeluar from '../screens/LaporanKeluar';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="HomeGuru" component={HomeScreenGuru} />
          <Stack.Screen name="HomeAdmin" component={HomeScreenAdmin} />
          <Stack.Screen name="HomeEmpty" component={HomeScreenNoRole} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen
            name="HistoryMasuk"
            component={AbsensiMasukHistoryScreen}
          />
          <Stack.Screen
            name="HistoryKeluar"
            component={AbsensiKeluarHistoryScreen}
          />
          <Stack.Screen name="LaporanMasuk" component={LaporanMasuk} />
          <Stack.Screen name="LaporanKeluar" component={LaporanKeluar} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default StackNavigator;
