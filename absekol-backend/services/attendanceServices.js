const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');
const Role = require('../models/Role');

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

module.exports={getAttendance,createAttendance,updateAttendance,deleteAttendance}