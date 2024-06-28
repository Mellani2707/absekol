const { error } = require('console');
const { Op } = require('sequelize');
const ConfigApp = require('../models/ConfigApp');

const create = async (content) => {
    try {
        const role = await Role.create(content);
        return role;
    } catch (error) {
        throw new Error(`Error creating role: ${error.message}`);
    }
}
const get = async () => {
    try {
        const roles = await Role.findAll();
        return roles;
    } catch (error) {
        throw new Error(`Error fetching roles: ${error.message}`);
    }
}
const getByPk = async (id) => {
    try {
        const role = await Role.findByPk(id);
        return role;
    } catch (error) {
        throw new Error(`Error fetching roles: ${error.message}`);
    }
}
const deleteByPK = async (idRole) => {
    try {
        const role = await Role.findByPk(idRole)
        if (!role) throw new Error("Role not found");
        await role.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error fetching roles: ${error.message}`);
    }
}

module.exports = {
    getRole,
    createRole,
    deleteRole,
    getRoleParam,
    getRoleByPk
}