const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');

// GET Photos with filters
router.get('/', async (req, res) => {
    try {
        const { gender, type, category, status } = req.query;
        let query = {};

        if (gender) query.gender = gender;
        if (type) query.type = type;
        if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') };

        // Default to active only unless specified (e.g. for admin)
        if (status) {
            query.status = status;
        } else {
            query.status = 'active';
        }

        const photos = await Photo.find(query).sort({ uploadDate: -1 });
        res.json(photos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// SEARCH Photos
router.get('/search', async (req, res) => {
    try {
        const { q, gender } = req.query;
        if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

        let searchCriteria = {
            status: 'active',
            $or: [
                { category: { $regex: q, $options: 'i' } },
                { prompt: { $regex: q, $options: 'i' } },
                { type: { $regex: q, $options: 'i' } }
            ]
        };

        if (gender) {
            searchCriteria.gender = gender;
        }

        const photos = await Photo.find(searchCriteria).sort({ likes: -1 });
        res.json(photos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Single Photo
router.get('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: 'Photo not found' });
        res.json(photo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE Photo (Admin)
router.post('/', async (req, res) => {
    const photo = new Photo({
        gender: req.body.gender,
        type: req.body.type,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        prompt: req.body.prompt,
        keywords: req.body.keywords ? req.body.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
        status: req.body.status || 'active'
    });

    try {
        const newPhoto = await photo.save();
        res.status(201).json(newPhoto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE Photo (Admin)
router.put('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: 'Photo not found' });

        if (req.body.gender) photo.gender = req.body.gender;
        if (req.body.type) photo.type = req.body.type;
        if (req.body.category) photo.category = req.body.category;
        if (req.body.imageUrl) photo.imageUrl = req.body.imageUrl;
        if (req.body.prompt) photo.prompt = req.body.prompt;
        if (req.body.keywords !== undefined) {
            photo.keywords = typeof req.body.keywords === 'string'
                ? req.body.keywords.split(',').map(k => k.trim()).filter(k => k)
                : req.body.keywords;
        }
        if (req.body.status) photo.status = req.body.status;

        const updatedPhoto = await photo.save();
        res.json(updatedPhoto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE Photo (Soft Delete as per requirement: "Delete (Soft delete)")
router.delete('/:id', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: 'Photo not found' });

        // Soft delete: set status to inactive
        // Or if user meant "Delete (Soft delete)" explicitly they might want a deleted flag.
        // The requirement says: "Status: Active, Inactive (hide from app)".
        // And "Delete (Soft delete)".
        // So maybe 'inactive' is the soft delete state? Or a separate 'deleted' field?
        // I'll stick to 'status: inactive' for now unless 'deleted' is better.
        // Let's assume setting to inactive IS the soft delete or I add a isDeleted field.
        // Given the status list, 'inactive' hides it.

        photo.status = 'inactive';
        await photo.save();
        res.json({ message: 'Photo soft deleted (set to inactive)' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LIKE Photo (Increment)
router.post('/:id/like', async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: 'Photo not found' });

        photo.likes += 1;
        await photo.save();
        res.json({ likes: photo.likes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
