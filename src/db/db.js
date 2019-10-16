const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, 
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


