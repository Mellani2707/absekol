import { Alert } from 'react-native';
import { HitsData } from './HitsData'
export const StoreNotifications = async (data) => {
    try {

        const result = await HitsData(
            'https://absekol-api.numpang.my.id/api/notificationLogs',
            data,
        );
    } catch (error) {
        Alert.alert(
            'Error',
            'An error occurred while sending data: ' + error.message,
        );
        throw error;
    }
};
