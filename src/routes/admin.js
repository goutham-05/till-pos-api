const express = require('express');
var ObjectId = require('mongoose').Types.ObjectId;

const app = express.Router();

// models start
const Companies = require('../modals/company');
const Items = require('../modals/items');
const PricingRule = require('../modals/pricing-rules');


// company api's start


app.get('/get-all-companies', async (req, res) => {
    const result = { success: false, data: [], errors: [] };
    try {
        
        const company = await Companies.find({});

        if (company.length === 0) {
            result.errors.push('No companies found');
            return res.json(result);
        }

        result.success = true;
        result.data = company;
        return res.json(result);


    } catch (error) {
        result.errors.push(error);
        return res.json(result);
    }

});

app.get('/get-active-companies', async (req, res) => {
    const result = { success: false, data: [], errors: [] };
    try {
        
        const company = await Companies.find({active: true, deleted: false});

        if (company.length === 0) {
            result.errors.push('No companies found');
            return res.json(result);
        }

        result.success = true;
        result.data = company;
        return res.json(result);


    } catch (error) {
        result.errors.push(error);
        return res.json(result);
    }

});


app.get('/get-company-by-id/:id', async (req, res) => {
    const result = { success: false, data: [], errors: [] };

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid object id');
        return res.json(result);
    }


    try {
        
        const company = await Companies.findById(req.params.id);

        if (!company) {
            result.errors.push('No company data found');
            return res.json(result);
        }

        result.success = true;
        result.data = company;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(result);
    }

})

app.post('/add-company', async (req, res) => {
    const data = req.body;
    const result = { success: false, data: [], errors: [] };
    const errors = [];

    if (!data.name) {
        errors.push('Company name is required');
    }
    
    if (data.name && data.name.trim().length === 0) {
        errors.push('Compnay name cannot be empty');
    }
    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    }

    try {
        
        const company = await Companies.findOne({name: data.name});
        if (company) {
            result.errors.push('Compnay name already exists');
            return res.json(result);
        }
        const newCompany = new Companies(
            {
                name: data.name
            }
        );
        newCompany.save();
        result.success = true;
        result.data = newCompany;
        return res.json(result);

    } catch (error) {
        result.errors.push(error);
        return res.json(result);
    }
    
});


app.delete('/delete-company/:id', async (req, res) => {
    const data = req.params.id;
    const result = { success: false, data: [], errors: [] };
    const errors = [];

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }

    try {
        
        const company = await Companies.findById(req.params.id);
    
        if (!company) {
            result.errors.push('No company data found');
            return res.json(result);
        }
    
    
        const deleteCompany = await Companies.findByIdAndUpdate(company._id, { deleted: true }, { new: true });
    
        result.success = true;
    
        result.data = deleteCompany;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }

});

app.patch('/revoke-company/:id', async (req, res) => {
    const data = req.params.id;
    const result = { success: false, data: [], errors: [] };
    const errors = [];

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }

    try {
        
        const company = await Companies.findById(req.params.id);
    
        if (!company) {
            result.errors.push('No company data found');
            return res.json(result);
        }
        const deleteCompany = await Companies.findByIdAndUpdate(company._id, { deleted: false }, { new: true });
        result.success = true;
        result.data = deleteCompany;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }
});


app.patch('/update-company/:id', async (req, res) => {

    
    const result = { success: false, data: [], errors: [] };
    const errors = [];
    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }
    const updates = Object.keys(req.body);
    const validUpdates = ['name', 'active', 'deleted', 'privilaged']

    const isValidOperation = updates.every(update => {
        return validUpdates.includes(update);
    })
    if (!isValidOperation) {
        result.errors.push('Invalid updates');
        return res.json(result);
    }

    try {
        
        const company = await Companies.findById(req.params.id);

        if (!company) {
            result.errors.push('No company found to update');
            return res.json(result);
        }

        // updates.forEach(update => (company[update] = req.body[update]));

        updates.forEach(update => {
            company[update] = req.body[update];
        })
        await company.save();

        result.success = true;
        result.data = company
        res.send(result);

    } catch (error) {
        if (error.code == 11000) {
            errors.push('This name already exists');
        }
        result.errors = errors;
        return res.json(result);
    }

})



// end of companies api's


// item api's start

app.get('/get-all-items', async (req, res) => {

    const result = { success: false, data: [], errors: [] };

    try {
        
        const items = await Items.find({});

        if (!items) {
            result.errors.push('No items found');
            return res.json(result);
        }

        result.success = true;
        result.data = items;
        return res.json(result);


    } catch (error) {
        result.errors.push(error);
        return res.json(result);
    }

});

app.get('/get-active-items', async (req, res) => {

    const result = { success: false, data: [], errors: [] };

    try {
        
        const items = await Items.find({active: true, deleted: false});

        if (!items) {
            result.errors.push('No items found');
            return res.json(result);
        }

        result.success = true;
        result.data = items;
        return res.json(result);


    } catch (error) {
        result.errors.push(error);
        return res.json(result);
    }

});

app.get('/get-item-by-id/:id', async (req, res) => {
    const result = { success: false, data: [], errors: [] };

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid object id');
        return res.json(result);
    }

    try {
        const item = await Items.findById(req.params.id);

        if (!item) {
            result.errors.push('No item data found');
            return res.json(result);
        }

        result.success = true;
        result.data = item;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(result);
    }

})

app.post('/add-item', async (req, res) => {
    
    const data = req.body;
    const result = { success: false, data: [], errors: [] };
    const errors = [];

    if (!data.name) {
        errors.push('Company name is required');
    }
    
    if (data.name && data.name.trim().length === 0) {
        errors.push('Compnay name cannot be empty');
    }
    if (!data.description) {
        errors.push('Description is required');
    }
    if (data.description && data.description.trim().length === 0) {
        errors.push('Description cannot be empty');
    }
    if (!data.price) {
        errors.push('Price is required');
    }

    if (data.price && data.price.trim().length === 0) {
        errors.push('Price cannot be empty');
    }

    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    }
    try {
        const item = await Items.findOne({name: data.name});

        if (item) {
            result.errors.push('Item name already exists');
            return res.json(result);
        }
        const newItem = new Items({
            name: data.name,
            description: data.description,
            price: data.price
        })
        await newItem.save();

        result.success = true;
        result.data = newItem;
        return res.json(result);

    } catch (error) {
        result.errors.push(error.message);
        return res.json(result);
    }



});

app.delete('/delete-item/:id', async (req, res) => {
    const data = req.params.id;
    const result = { success: false, data: [], errors: [] };

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }

    try {
        
        const item = await Items.findById(req.params.id);
    
        if (!item) {
            result.errors.push('No item data found');
            return res.json(result);
        }
    
    
        const deleteItem = await Items.findByIdAndUpdate(item._id, { deleted: true }, { new: true });
    
        result.success = true;
    
        result.data = deleteItem;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }

});

app.patch('/revoke-item/:id', async (req, res) => {
    const data = req.params.id;
    const result = { success: false, data: [], errors: [] };
    const errors = [];

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }

    try {
        
        const item = await Items.findById(req.params.id);
    
        if (!item) {
            result.errors.push('No item data found');
            return res.json(result);
        }
        const revokeItem = await Items.findByIdAndUpdate(item._id, { deleted: false }, { new: true });
        result.success = true;
        result.data = revokeItem;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }
});

app.patch('/update-item/:id', async (req, res) => {
    const result = { success: false, data: [], errors: [] };
    const errors = [];
    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }
    const updates = Object.keys(req.body);
    const validUpdates = ['name', 'active', 'deleted', 'description', 'price']

    const isValidOperation = updates.every(update => {
        return validUpdates.includes(update);
    })
    if (!isValidOperation) {
        result.errors.push('Invalid updates');
        return res.json(result);
    }

    try {
        
        const item = await Items.findById(req.params.id);

        if (!item) {
            result.errors.push('No item found to update');
            return res.json(result);
        }

        updates.forEach(update => (item[update] = req.body[update]));
        await item.save();

        result.success = true;
        result.data = item
        res.send(result);

    } catch (error) {
        if (error.code == 11000) {
            errors.push('This name already exists');
        }
        result.errors = errors;
        return res.json(result);
    }

})







/**
 * Function:: get-pricing-rule
 * @param::int ruleid
 * Description::
 * @return::Json
 */




/**
 * Function:: add-pricing-rule
 * @param::int ruleid
 * Description::
 * @return::Json
 */

app.post('/add-pricing-rule', async (req, res) => {
   
    const data = req.body;
    const result = { success: false, data: [], errors: [] };
    const errors = [];

    if (!data.item) {
        errors.push('Item id is required');
    }
    if (!data.company) {
        errors.push('Company id is required');
    }

    if (errors.length) {
        result.errors = errors;
        return res.json(result);
    }

    try {

        const company = await Companies.findById(data.company);

        if (!company) {
            result.errors.push('No company found for this id');
            return res.json(result);
        }
        
        const item = await Items.findById(data.item);

        if (!item) {
            result.errors.push('No item found for this id');
            return res.json(result);
        }

        const newItem = new PricingRule({
            item: data.item,
            company: data.company,
            min_buy: data.min_buy,
            offered_deal: data.offered_deal,
            discount: data.discount
        })
        const itemInserted = await newItem.save();
        if (itemInserted.length === 0) {
            result.errors.push('Something error occured');
            return res.json(result);
        }

        if(itemInserted) {
            result.success = true;
            result.data = itemInserted;
            return res.json(result);
        }

      
    } catch (error) {
        if (error.code == 11000) {
            result.errors.push('This combo exists');
        }
        // result.errors.push(error.message);
        return res.json(result);
    }
   

});


/**
 * Function:: get-company-pricing-rule
 * @param::int ruleid
 * Description::
 * @return::Json
 */

 app.get('/company-item-offer/:id', async (req, res) => {
    const data = req.params.id;

    
    const result = { success: false, data: [], errors: [] };

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid company id');
        return res.json(result);
    }

    try {

        const item = await PricingRule.find({company: req.params.id})
                    .populate('item')
                    .populate('company')
                    .exec();
        if (item.length === 0) {
            result.errors.push('No data found');
            return res.json(result);
        }


        result.success = true;
        result.data = item;
        return res.json(result);

    } catch (error) {
      
        result.errors.push(error);
        return res.json(result);
    }

 });

 app.get('/all-company-offers', async (req, res) => {
    const result = { success: false, data: [], errors: [] };

    try {
        
        const companies = await PricingRule.find({})
                            .populate('item')
                            .populate('company')
                            .exec();
        if (companies.length === 0) {
            result.errors.push('No data found');
            return res.json(result);
        }

        result.success = true;
        result.data = companies;
        return res.json(result);


    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }
 });

 app.get('/get-active-company-offers', async (req, res) => {
    const result = { success: false, data: [], errors: [] };

    try {
        
        const companies = await PricingRule.find({active: true, deleted: false})
                            .populate('item')
                            .populate('company')
                            .exec();
        if (companies.length === 0) {
            result.errors.push('No data found');
            return res.json(result);
        }

        result.success = true;
        result.data = companies;
        return res.json(result);


    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }
 });

 app.patch('/update-company-offer/:id', async (req, res) => {
    const result = { success: false, data: [], errors: [] };
    const updates = Object.keys(req.body);
    const validUpdates = ['min_buy', 'offered_deal', 'discount', 'active', 'deleted'];

                        if (!ObjectId.isValid(req.params.id)) {
                            result.errors.push('Invalid object id');
                            return res.json(result);
                        }
                        
                        const isValidOperation = updates.every(update => {
                            return validUpdates.includes(update);
                        })
                        if (!isValidOperation) {
                            result.errors.push('Invalid updates');
                            return res.json(result);
                        }

                        try {
                            const pricngRule = await PricingRule.findById(req.params.id);

                            if (!pricngRule) {
                                result.errors.push('Invalid offer id');
                                return res.json(result);
                            }
                            
                            updates.forEach(update => (pricngRule[update] = req.body[update]));
                            await pricngRule.save();
                    
                            result.success = true;
                            result.data = pricngRule
                            return res.json(result);
                    
                            
                        } catch (error) {
                            if (error.code == 11000) {
                                result.errors.push('This combo exists');
                            }
                            // result.errors.push(error.message);
                            return res.json(result);
                        }

 });


 app.delete('/delete-company-offer/:id', async (req, res) => {
    const data = req.params.id;
    const result = { success: false, data: [], errors: [] };

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }

    try {
        
        const offerId = await PricingRule.findById(req.params.id);
    
        if (!offerId) {
            result.errors.push('No item data found');
            return res.json(result);
        }
    
    
        const deleteCompanyOffer = await PricingRule.findByIdAndUpdate(offerId._id, { deleted: true }, { new: true });
    
        result.success = true;
        result.data = deleteCompanyOffer;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }

 });

 app.patch('/revoke-company-offer/:id', async (req, res) => {
    const result = { success: false, data: [], errors: [] };

    if (!ObjectId.isValid(req.params.id)) {
        result.errors.push('Invalid Object id');
        return res.json(result);
    }

    try {
        
        const offerData = await PricingRule.findById(req.params.id);
    
        if (!offerData) {
            result.errors.push('No item data found');
            return res.json(result);
        }
    
    
        const deleteCompanyOffer = await PricingRule.findByIdAndUpdate(offerData._id, { deleted: false }, { new: true });
    
        result.success = true;
        result.data = deleteCompanyOffer;
        return res.json(result);
        

    } catch (error) {
        result.errors.push(error);
        return res.json(error);
    }

 });


 app.post('/')




module.exports = app;
