const express = require('express');
require('dotenv').config();;
require('./DBConnection/DB');

const app = express();

///PORT
const PORT  = process.env.PORT;

//Middleware

app.use(express.json());

///Routes

app.use('/', require('./routes/loanRoutes'));



///Listening
app.listen(PORT, ()=> {
    console.log('Server is up : '+PORT);
})


