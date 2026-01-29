import mongoose from 'mongoose';
import baseSchema from '../schemas/base.schema.js';

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Lead', 'Prospect', 'Customer'],
        default: 'Lead'
    },
    notes: {
        type: String
    },
    ...baseSchema
});

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
