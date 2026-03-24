import express from 'express';
import { RestaurantInfo } from '../models/index.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'node:path';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'logo-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// POST /api/restaurant/logo (Admin only)
router.post('/logo', authenticate, isAdmin, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const logoUrl = `/uploads/${req.file.filename}`;
        
        // Update restaurant info automatically
        let info = await RestaurantInfo.findOne();
        if (!info) {
            info = await RestaurantInfo.create({ logo: logoUrl });
        } else {
            info.logo = logoUrl;
            await info.save();
        }
        
        res.json({ success: true, logoUrl });
    } catch (err) {
        console.error('Logo upload error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/restaurant
router.get('/', async (req, res) => {
    try {
        let info = await RestaurantInfo.findOne();
        if (!info) {
            // Create default if not exists
            info = await RestaurantInfo.create({});
        }
        res.json(info);
    } catch (err) {
        console.error('Get restaurant info error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/restaurant (Admin only)
router.put('/', authenticate, isAdmin, async (req, res) => {
    try {
        const body = req.body;
        
        let info = await RestaurantInfo.findOne();
        if (!info) {
            info = await RestaurantInfo.create(body);
        } else {
            // Use hasOwnProperty so empty strings are also saved (not ignored)
            if (body.hasOwnProperty('name')) info.name = body.name;
            if (body.hasOwnProperty('address')) info.address = body.address;
            if (body.hasOwnProperty('phone')) info.phone = body.phone;
            if (body.hasOwnProperty('email')) info.email = body.email;
            if (body.hasOwnProperty('website')) info.website = body.website;
            if (body.hasOwnProperty('description')) info.description = body.description;
            if (body.hasOwnProperty('logo')) info.logo = body.logo;
            if (body.hasOwnProperty('openingHours')) info.openingHours = body.openingHours;
            await info.save();
        }
        
        res.json({ success: true, info });
    } catch (err) {
        console.error('Update restaurant info error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
