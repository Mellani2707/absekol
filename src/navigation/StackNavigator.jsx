import React from 'react';
import {Provider} from 'react-redux';
import store from '../redux/store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenGuru from '../screens/HomeScreenGuru';
import NotificationScreen from '../screens/NotificationScreen';

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
          <Stack.Screen name="Notification" component={NotificationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default StackNavigator;
