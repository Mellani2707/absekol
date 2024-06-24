const path = require('path');
const { SHAREDPATH } = process.env;
const multer = require('multer');
const fs = require('fs');

// Konfigurasi penyimpanan file
// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'share/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Controller untuk upload file
const uploadFile = (req, res) => {
    res.status(200).json({
        message: 'File uploaded successfully',
        file: req.file
    });
};

// Controller untuk download file
const downloadFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../share', fileName);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.download(filePath, fileName, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error downloading file', error: err.message });
            }
        });
    });
};

module.exports = { upload, uploadFile, downloadFile };
