import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const LoginButton = ({ color, text, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    marginTop: 20,
    marginHorizontal: 25,
    borderRadius: 50,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LoginButton;
