const express=require('express');
const bodyParser=require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const routes=require('./routes');
const stats=require('./routes/statistics');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

app.use('*',cors());

app.use('/',routes);
app.use('/stats/',stats);

module.exports=app;