const { createAttendance,getAttendance,updateAttendance, deleteAttendance} = require('../services/attendanceServices');

const getAttendanceController = async (req, res) => {
    try {
        const result = await getAttendance();
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            errors: error.errors ? error.errors[0].message : "undfined case :" + error.message,
            errorDetails: error
        });
    }
}
const createAttendanceController = async (req, res) => {
    try {
        const raw = req.body;
        const result = await createAttendance(raw);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            errors: error.errors ? error.errors[0].message : "undfined case :" + error.message,
            errorDetails: error
        });
    }
}
const updateAttendanceController = async (req, res) => {
    try {
        const id = req.body.id;
        const result = await updateAttendance(id, req.body);
        return res.status(201).json(result)
    } catch (error) {
        res.status(500).json({
            errors: error.errors ? error.errors[0].message : "undfined case :" + error.message,
            errorDetails: error
        });
    }
}
const deleteAttendanceController = async (req, res) => {
    try {
        await deleteAttendance(req.params.id)
        return res.status(204).send()
    } catch (error) {
        res.status(500).json({
            errors: error.errors ? error.errors[0].message : "undfined case :" + error.message,
            errorDetails: error
        });
    }
}
/**
 * Controller untuk mendapatkan data attendance checkIn teratas dan checkOut teratas berdasarkan nisn
 */
const getTopAttendanceByNisnController = async (req, res) => {
    try {
        const { nisn } = req.params;
        const result = await getTopAttendanceByNisn(nisn);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            errors: error.errors ? error.errors[0].message : "undefined case :" + error.message,
            errorDetails: error
        });
    }
};
module.exports={
    getTopAttendanceByNisnController,
    createAttendanceController,
    getAttendanceController,updateAttendanceController,deleteAttendanceController}