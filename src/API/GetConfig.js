export const getConfigValue = async (configName) => {
    try {
        const response = await fetch(`https://absekol-api.numpang.my.id/api/configs/search/${configName}`);
        const result = await response.json();
        if (result && result.length > 0) {
            return result[0].value;
        }
        throw new Error('Config not found');
    } catch (error) {
        console.error(`Error fetching config: ${error.message}`);
        return null;
    }
};