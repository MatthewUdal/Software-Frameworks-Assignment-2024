const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const UserService = require('../models/UserService');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profilePictures/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload image route
router.post('/updateProfile', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const userId = req.body.userID;
    const imageUrl = `http://localhost:3000/profilePictures/${req.file.filename}`;

    try {
        // Update user profile picture in the database
        const updatedUser = await UserService.updateUserProfilePicture(userId, imageUrl);
        res.json({ message: 'Profile picture updated successfully.', imageUrl: imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
