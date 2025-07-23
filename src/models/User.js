const { Schema, model } = require('mongoose')

const UserSchema = new Schema({

    fullName: {
        type: String,
        required: true,
    },

    dayOfBirth: {
        type: Date,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
    },

    isActive: {
        type: Boolean,
        required: true,
        default: true
    }

})

module.exports = model('User', UserSchema)