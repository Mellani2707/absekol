import { getDistance as geolibGetDistance } from 'geolib';

/**
 * Mengambil latitude dan longitude target dari API.
 * 
 * @returns {Promise<{latitude: number, longitude: number}>} - Target koordinat.
 */
const getTargetCoordinates = async () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    const response = await fetch("https://absekol-api.numpang.my.id/api/configs/search/kordinat_sekolah", requestOptions);
    const data = await response.json();

    const latitudeConfig = data.find(config => config.configName === 'kordinat_sekolah_la');
    const longitudeConfig = data.find(config => config.configName === 'kordinat_sekolah_lo');

    if (!latitudeConfig || !longitudeConfig) {
        throw new Error('Target coordinates not found in the API response.');
    }

    return {
        latitude: parseFloat(latitudeConfig.value),
        longitude: parseFloat(longitudeConfig.value)
    };
};

/**
 * Menghitung jarak antara dua titik koordinat.
 * 
 * @param {number} currentLa - Latitude saat ini.
 * @param {number} currentLo - Longitude saat ini.
 * @returns {Promise<number>} - Jarak dalam meter.
 */
export const getDistance = async (currentLa, currentLo) => {
    const targetCoordinates = await getTargetCoordinates();
    return geolibGetDistance(
        { latitude: currentLa, longitude: currentLo },
        { latitude: targetCoordinates.latitude, longitude: targetCoordinates.longitude }
    );
};
