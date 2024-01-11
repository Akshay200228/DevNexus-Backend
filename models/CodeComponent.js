// models/CodeComponent.js
import mongoose from 'mongoose';

const codeComponentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    code: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
    },
    creatorAvatar: String,
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, { timestamps: true });

const CodeComponent = mongoose.model('CodeComponent', codeComponentSchema);

export default CodeComponent;
