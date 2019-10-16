const mongoose = require('mongoose');

const pizzaSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        acitve: {
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
);

const Pizza = mongoose.model('Pizza', pizzaSchema);

module.exports = Pizza;