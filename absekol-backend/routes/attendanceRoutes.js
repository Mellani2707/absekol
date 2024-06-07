const express = require('express');
const { createAttendanceController,getAttendanceController,updateAttendanceController,deleteAttendanceController } = require('../controllers/attendanceController')

const route = express.Router();

route.get('/attendances', getAttendanceController);
route.post('/attendances', createAttendanceController);
route.put('/attendances', updateAttendanceController);
route.delete('/attendances/:id', deleteAttendanceController);

module.exports = route;
