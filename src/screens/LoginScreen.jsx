import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import LoginButton from '../component/LoginButton';
import TextInputEmail from '../component/TextInputEmail';
import Menu from '../component/Menu';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/actions';
const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  // const handleLogin = () => {
  //   fetch('http://192.168.179.117:8000/api/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       email: email,
  //       password: password,
  //     }),
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.status === 'success') {
  //         Alert.alert('Success', 'User logged in successfully');
  //         navigation.navigate('Home'); // Navigasi ke halaman Home
  //       } else {
  //         Alert.alert('Error', 'Login failed: ' + data.message);
  //       }
  //     })
  //     .catch(error => {
  //       Alert.alert('Error', 'An error occurred: ' + error.message);
  //     });
  // };

  const handleLogin = () => {
    fetch('https://absekol-api.numpang.my.id/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(response => {
        if (response.ok) {
          // response.ok memeriksa apakah status code adalah 2xx
          return response.json();
        } else {
          return response.json().then(err => {
            throw new Error(err.message || 'Login failed');
          });
        }
      })
      .then(data => {
        Alert.alert('Success', 'User logged in successfully');
        const userdata = data.token.user;
        if (userdata) {
          console.log('Check user Data----------------------');
          console.log(userdata);
          console.log('----------------end');
          dispatch(setUser(userdata));
          if (userdata.Role) {
            if (
              userdata.Role.roleName == 'Guru' ||
              userdata.Role.roleName == 'guru'
            ) {
              Alert.alert(
                'Success',
                `User logged in successfully as ${userdata.Role.roleName}`,
              );
              navigation.navigate('HomeGuru'); // Navigasi ke halaman Home
            } else if (
              userdata.Role.roleName == 'Siswa' ||
              userdata.Role.roleName == 'siswa'
            ) {
              navigation.navigate('Home'); // Navigasi ke halaman
            } else if (
              userdata.Role.roleName == 'Admin' ||
              userdata.Role.roleName == 'admin'
            ) {
              navigation.navigate('Home'); // Navigasi ke halaman
            } else {
              navigation.navigate('HomeEmpty'); // Navigasi ke halaman
            }
          }
        }
      })
      .catch(error => {
        Alert.alert('Error', 'An error occurred: ' + error.message);
      });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar backgroundColor={'#dbe4f3'} barStyle="dark-content" />
      <View style={styles.container}>
        <Image source={require('../image/smk.png')} style={styles.image} />
        <Text style={styles.title}>
          SMK<Text style={styles.titleHighlight}>SINTOGA</Text>
        </Text>
        <Text style={styles.subtitle}>Login</Text>
      </View>

      <TextInputEmail
        state={username}
        set={setUsername}
        icon="envelope"
        placeholder="Masukkan email"
        isPassword={false}
      />
      <TextInputEmail
        state={password}
        set={setPassword}
        icon="lock"
        placeholder="Masukkan password"
        isPassword={true}
      />

      <LoginButton text="Login" color="#2396F2" onPress={handleLogin} />

      <Menu signupText="" forgotPasswordText="Lupa Password?" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#dbe4f3',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  titleHighlight: {
    color: '#2396F2',
  },
  subtitle: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LoginScreen;
