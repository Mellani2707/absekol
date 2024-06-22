const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');
const Role = require('../models/Role');
const { Op } = require('sequelize');
const getAttendance = async () => {
    try {
        const result = await Attendance.findAll({
            include:{
                model:Student,
                include:{
                    model:User,
                    include:{
                        model:Role
                    }
                }
            }
        });
        return result;
    } catch (error) {
        throw error.errors ? error : new Error(`Error fetchs : ${error.message}`);
    }
}
const createAttendance = async (raw) => {

    try {
        const result = await Attendance.create(raw);
        return result
    } catch (error) {
        throw error.errors ? error : new Error(`Error creating : ${error.message}`);
    }
}
const updateAttendance = async (id, updateData) => {
    try {
        const result = await Attendance.findByPk(id);
        if (!result) throw new Error(`update failed,  data with id ${id} not found `)
        await result.update(updateData)
        return result;
    } catch (error) {
        throw error.errors ? error : new Error(`Error updating : ${error.message}`);

    }
}
const deleteAttendance = async (id) => {
    try {
        const result = await Attendance.findByPk(id);
        if (!result) throw new Error(`delete failed, data with  id ${id} not found `)
        await result.destroy();
        return true;
    } catch (error) {
        throw error.errors ? error : new Error(`Error deleting: ${error.message}`);
    }
}
// Method baru untuk mendapatkan data Attendance berdasarkan nisn
const getTopAttendanceByNisn = async (nisn) => {
    try {
        // Dapatkan data checkIn teratas
        const checkInTop = await Attendance.findOne({
            where: {
                nisn: nisn,
                checkIn: {
                    [Op.ne]: null // Pastikan checkIn tidak null
                }
            },
            order: [['checkIn', 'DESC']],
            include: {
                model: Student,
                include: {
                    model: User,
                    include: {
                        model: Role
                    }
                }
            }
        });

        // Dapatkan data checkOut teratas
        const checkOutTop = await Attendance.findOne({
            where: {
                nisn: nisn,
                checkOut: {
                    [Op.ne]: null // Pastikan checkOut tidak null
                }
            },
            order: [['checkOut', 'DESC']],
            include: {
                model: Student,
                include: {
                    model: User,
                    include: {
                        model: Role
                    }
                }
            }
        });

        return { checkInTop, checkOutTop };
    } catch (error) {
        throw error.errors ? error : new Error(`Error fetching atendance: ${error.message}`);
    }
};
module.exports = { getAttendance, createAttendance, updateAttendance, deleteAttendance, getTopAttendanceByNisn}