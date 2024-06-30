import {Alert} from 'react-native';
import log from '../utils/Logger'; // Import utilitas logging

export const HitsData = async (url, content, customHeaders = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders, // Tambahkan custom headers jika ada
      },
      body: JSON.stringify(content), // Tambahkan content ke body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send data');
    }

    const data = await response.json();
    log('Success', 'Data sent successfully to ' + url);

    return data;
  } catch (error) {
    log('HitsData  Error', error);
    Alert.alert(
      'Error',
      'An error occurred while sending data: ' + error.message,
    );
    throw error;
  }
};
