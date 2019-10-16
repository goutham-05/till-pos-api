const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/till-pos', 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(db => {
    console.log('DB connected successfully');
}).catch(err => {
    console.log(err);
})


