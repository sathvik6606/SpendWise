import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            lastLogin: new Date(),
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                currency: user.currency,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            user.lastLogin = new Date();
            await user.save();
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                currency: user.currency,
                timezone: user.timezone,
                theme: user.theme,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                currency: user.currency,
                timezone: user.timezone,
                theme: user.theme,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, email, password, currency, avatar, timezone, theme } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (currency) user.currency = currency;
        if (avatar !== undefined) user.avatar = avatar;
        if (timezone) user.timezone = timezone;
        if (theme) user.theme = theme;
        if (password) user.password = password;

        await user.save();

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            currency: user.currency,
            timezone: user.timezone,
            theme: user.theme,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
