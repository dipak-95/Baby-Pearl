const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

// Dashboard Stats
router.get('/dashboard', async (req, res) => {
    try {
        const totalPhotos = await Photo.countDocuments();
        const boyPhotos = await Photo.countDocuments({ gender: 'boy' });
        const girlPhotos = await Photo.countDocuments({ gender: 'girl' });

        // Most liked photos (limit 5)
        const mostLiked = await Photo.find().sort({ likes: -1 }).limit(5);

        // Recent uploads (limit 5)
        const recentUploads = await Photo.find().sort({ uploadDate: -1 }).limit(5);

        res.json({
            counts: {
                total: totalPhotos,
                boy: boyPhotos,
                girl: girlPhotos
            },
            mostLiked,
            recentUploads
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
