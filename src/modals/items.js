const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        description: {
            type: String,
            trime: true,
            lowercase: true,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Items = mongoose.model('Items', itemSchema);

module.exports = Items;