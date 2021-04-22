const mongoose = require('mongoose');

mongoose.connect(process.env.DB_STRING, {useUnifiedTopology : true, useNewUrlParser : true, useCreateIndex : true})
.then(() => {
    console.log("DataBase is Connected");
}).catch((error) => {
    console.log(error);
})