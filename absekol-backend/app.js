const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const initializeDatabase = require('./models/initalizeModel')

const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const studentRoutes = require('./routes/studentRouters');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gpsLogRoutes = require('./routes/gpsLogRoutes');
const notificationLogRoutes = require('./routes/notificationLogRoutes');
const fileRoutes = require('./routes/fileRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger/swaggerConfig');



dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const { PORT } = process.env;
const port = PORT || 3000;

initializeDatabase();

// CORS configuration for specific URL
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['http://127.0.0.1:5500', 'https://vuejs.numpang.my.id', 'http://114.7.96.242:3003', 'https://waifu.numpang.my.id'];
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
// Routes
// Rute untuk file handling
app.use('/api/files', cors(corsOptions), fileRoutes);
//
app.use('/api', cors(corsOptions), roleRoutes);
app.use('/api', cors(corsOptions), userRoutes);
app.use('/api', cors(corsOptions), studentRoutes);
app.use('/api', cors(corsOptions), attendanceRoutes);
app.use('/api', cors(corsOptions), gpsLogRoutes);
app.use('/api', cors(corsOptions), notificationLogRoutes);

// Swagger setup
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
