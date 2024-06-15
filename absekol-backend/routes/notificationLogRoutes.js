const express = require('express');
const {
createNotificationLogController,
geteNotificationLogController,
updateNotificationLogController,
deleteNotificationLogController
} = require('../controllers/notificationLogController')

const route = express.Router();

route.get('/notificationLogs', geteNotificationLogController);
route.post('/notificationLogs', createNotificationLogController);
route.put('/notificationLogs', updateNotificationLogController);
route.delete('/notificationLogs/:id', deleteNotificationLogController);

module.exports = route;
