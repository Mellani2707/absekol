const express = require('express');
const { createAttendanceController, getTopAttendanceByNisnController,getAttendanceController,updateAttendanceController,deleteAttendanceController } = require('../controllers/attendanceController')

const route = express.Router();

route.get('/attendanceInfo/:nisn', getTopAttendanceByNisnController);
route.get('/attendances', getAttendanceController);
route.post('/attendances', createAttendanceController);
route.put('/attendances', updateAttendanceController);
route.delete('/attendances/:id', deleteAttendanceController);

module.exports = route;
