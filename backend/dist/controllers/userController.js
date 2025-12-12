"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddresses = exports.addAddress = exports.getById = exports.getAll = void 0;
const User_1 = __importDefault(require("../models/User"));
// GET /api/users
const getAll = async (req, res) => {
    try {
        const users = await User_1.default.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAll = getAll;
// GET /api/user/:id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id).select('-password').lean();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getById = getById;
// POST /api/user/:id/addresses
const addAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = req.body;
        const user = await User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // If new address is default, unset others
        if (address.isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }
        user.addresses.push(address);
        await user.save();
        res.status(201).json(user.addresses);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addAddress = addAddress;
// PUT /api/user/:id/addresses
const updateAddresses = async (req, res) => {
    try {
        const { id } = req.params;
        const { addresses } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { addresses }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateAddresses = updateAddresses;
//# sourceMappingURL=userController.js.map