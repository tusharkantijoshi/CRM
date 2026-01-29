import mongoose from 'mongoose';

const baseSchema = {
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: String,
        default: null,
    },
    modified_at: {
        type: Date,
        default: Date.now,
    },
    modified_by: {
        type: String,
        default: null,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deleted_by: {
        type: String,
        default: null,
    },
};

export default baseSchema;
