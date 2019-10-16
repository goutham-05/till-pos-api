const express = require('express');
const morgan = require('morgan');
const cors=require('cors');

require('./db/db');

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());


// routes
const AdminRouter = require('./routes/admin');




app.use(express.json());
app.use(morgan('dev'));

app.use('/admin', AdminRouter);

app.listen(port, () => {
    console.log('Server running at port', port);
});

