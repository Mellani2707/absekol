const express = require('express');
const router = express.Router();
const {
    getAllConfigAppController,
    createConfigAppController,
    getConfigAppByIdController,
    deleteConfigAppByIdController,
    getConfigAppByParamController
} = require('../controllers/ConfigAppController');

// Mendapatkan semua ConfigApp
router.get('/configs', getAllConfigAppController);

// Membuat ConfigApp baru
router.post('/configs', createConfigAppController);

// Mendapatkan ConfigApp berdasarkan id
router.get('/configs/:id', getConfigAppByIdController);

// Menghapus ConfigApp berdasarkan id
router.delete('/configs/:id', deleteConfigAppByIdController);

// Mendapatkan ConfigApp berdasarkan parameter
router.get('/configs/search', getConfigAppByParamController);

module.exports = router;
