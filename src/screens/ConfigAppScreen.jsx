import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StatusBar,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';

const ConfigAppScreen = () => {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const response = await fetch('https://absekol-api.numpang.my.id/api/configs');
            const data = await response.json();
            setConfigs(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch configs');
            setLoading(false);
        }
    };

    const handleSave = async (config) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            const raw = JSON.stringify({
                configName: config.configName,
                value: config.value,
                details: config.details,
            });

            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
            };

            const response = await fetch(
                'https://absekol-api.numpang.my.id/api/configs/update/search',
                requestOptions
            );
            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Config updated successfully');
            } else {
                Alert.alert('Error', result.message || 'Failed to update config');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while updating config');
        }
    };

    const handleChange = (id, field, value) => {
        setConfigs((prevConfigs) =>
            prevConfigs.map((config) =>
                config.id === id ? { ...config, [field]: value } : config
            )
        );
    };

    return (
        <ScrollView style={styles.scrollView}>
            <StatusBar backgroundColor={'#dbe4f3'} barStyle="dark-content" />
            <View style={styles.container}>
                <Text style={styles.title}>ConfigApp Settings</Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    configs.map((config) => (
                        <View key={config.id} style={styles.configItem}>
                            <Text style={styles.label}>{config.configName}</Text>
                            <TextInput
                                style={styles.input}
                                value={config.value}
                                onChangeText={(text) => handleChange(config.id, 'value', text)}
                            />
                            <TextInput
                                style={styles.input}
                                value={config.details}
                                onChangeText={(text) => handleChange(config.id, 'details', text)}
                            />
                            <Button title="Save" onPress={() => handleSave(config)} />
                        </View>
                    ))
                )}
            </View>
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
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    configItem: {
        width: '100%',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default ConfigAppScreen;
