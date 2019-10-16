const mongoose = require('mongoose');

const pricingSchema = mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Items'
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Company'
        },
        min_buy: {
            type: Number,
            default: 1,
        },
        offered_deal: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0 
        },
        expiry_date: {
            type: Date
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
);
pricingSchema.index({ item: 1, company: 1, min_buy: 1 }, { unique: true });
const PricingRule = mongoose.model('PricingRule', pricingSchema);

module.exports = PricingRule;