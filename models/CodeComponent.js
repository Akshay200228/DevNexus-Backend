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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
    },
});

const CodeComponent = mongoose.model('CodeComponent', codeComponentSchema);

export default CodeComponent;
