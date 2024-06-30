// Logger.js
const isDevelopment = __DEV__; // __DEV__ adalah variabel global yang disediakan oleh React Native untuk mode development

const log = (title, message) => {
    if (isDevelopment) {
        console.log(`=== ${title} ===`);
        console.log(message);
        console.log('====================');
    }
};

export default log;
