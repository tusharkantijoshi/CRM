import mongoose from 'mongoose';
import baseSchema from '../schemas/base.schema.js';
import { EMAIL_REGEX } from '../../utils/validation.js';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return EMAIL_REGEX.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    ...baseSchema,
});

const User = mongoose.model('User', userSchema);

export default User;
