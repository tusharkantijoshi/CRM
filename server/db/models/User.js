import mongoose from 'mongoose';
import baseSchema from '../schemas/base.schema.js';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    ...baseSchema,
});

const User = mongoose.model('User', userSchema);

export default User;
