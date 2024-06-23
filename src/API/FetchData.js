import {Alert} from 'react-native';

export const FetchData = async url => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'No Data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    Alert.alert(
      'Error',
      'An error occurred while fetching data: ' + error.message,
    );
    throw error;
  }
};
