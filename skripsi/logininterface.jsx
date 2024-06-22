import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LoginButton from './src/component/LoginButton'
import TextInputEmail from './src/component/TextInputEmail';
import Menu from './src/component/Menu';
const logininterface = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#dbe4f3'}}>
      <StatusBar backgroundColor={'#dbe4f3'} barStyle="dark-content" />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 60,
        }}>
        <Image
          source={require('./src/images/smk.png')}
          style={{width: 200, height: 200}}
        />
        <Text style={{fontSize: 28, fontWeight: 'bold'}}>
          CODE<Text style={{color: '#2396F2'}}>INSIA</Text>
        </Text>
        <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 18}}>
          Login
        </Text>
      </View>

      <TextInputEmail
        state={email}
        set={setEmail}
        icon="envelope"
        placeholder="Masukkan email"
        isPassword={false}
      />
      <TextInputEmail
        state={password}
        set={setPassword}
        icon="lock"
        placeholder="masukkan password"
        isPassword={true}
      />

      <LoginButton text="Login" color="#2396F2" />

      <Menu signupText="Daftar" forgotPasswordText="Lupa Password?" />
    </ScrollView>
  );
};

export default logininterface;
