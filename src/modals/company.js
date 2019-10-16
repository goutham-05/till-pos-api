const mongoose = require('mongoose');

const companySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        privilaged: {
            type: Boolean,
            default: true
        },
        active: {
            type: Boolean,
            default: false
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

const Company = mongoose.model('Company', companySchema);

module.exports = Company;