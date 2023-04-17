const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/keys');



exports.login = async (credentials) => {
    try {
        // Check if user exists in mongodb
        if (!credentials.username || !credentials.password) return { error: 'Invalid login credentials' };
        const user = User.find({ username: credentials.username });
        if (!user) return { error: 'User not found' };
        // Compare password
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) return { error: 'Invalid login credentials' };
        // Generate JWT
        const token = jwt.sign({ id: user.username }, JWT_SECRET, { expiresIn: 3600 });

        return { user, token };
    } catch (err) {
        console.error(err);
        return { error: err.message };
    }
}

exports.register = async (credentials) => {
    try {
        // Check if user exists in mongodb
        if(User.find({ username: credentials.username })){
            return { error: 'User already exists' };
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(credentials.password, salt);
        // Create user
        const user = new User({
            username: credentials.name,
            password: hash,
            age : credentials.age,
            gender : credentials.gender,
            interests : credentials.interests,
            preferences : {
                gender : credentials.preferences.gender,
                ageRange : {
                    min : credentials.preferences.ageRange.min,
                    max : credentials.preferences.ageRange.max
                },
                interests : credentials.preferences.interests
            }
        });
        // Save user
        await user.save();
        // Generate JWT
        const token = jwt.sign({ id: user.username }, JWT_SECRET, { expiresIn: 3600 });        
        return { user, token };
    } catch (err) {
        console.error(err);
        return { error: "Internal Error" };
    }
}