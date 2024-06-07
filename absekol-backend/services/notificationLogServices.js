const NotificationLog = require('../models/notificationLog');


const getNotificationLog = async () => {
    try {
        const result = await NotificationLog.findAll();
        return result;
    } catch (error) {
        throw error.errors ? error : new Error(`Error fetchs : ${error.message}`);
    }
}
const createNotificationLog = async (raw) => {

    try {
        const result = await NotificationLog.create(raw);
        return result
    } catch (error) {
        throw error.errors ? error : new Error(`Error creating : ${error.message}`);
    }
}
const updateNotificationLog = async (id, updateData) => {
    try {
        const result = await NotificationLog.findByPk(id);
        if (!result) throw new Error(`update failed,  data with id ${id} not found `)
        await result.update(updateData)
        return result;
    } catch (error) {
        throw error.errors ? error : new Error(`Error updating : ${error.message}`);

    }
}
const deleteNotificationLog = async (id) => {
    try {
        const result = await NotificationLog.findByPk(id);
        if (!result) throw new Error(`delete failed, data with  id ${id} not found `)
        await result.destroy();
        return true;
    } catch (error) {
        throw error.errors ? error : new Error(`Error deleting: ${error.message}`);
    }
}
module.exports={getNotificationLog,createNotificationLog,updateNotificationLog,deleteNotificationLog}