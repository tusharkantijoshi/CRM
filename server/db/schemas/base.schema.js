import mongoose from 'mongoose';

const baseSchema = {
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    modified_at: {
        type: Date,
        default: Date.now,
    },
    modified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deleted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
};

export default baseSchema;
