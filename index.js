const express=require('express');
const port=8001;
const path=require('path');
const db=require('./config/mongoose');
const mongoose=require('mongoose');
mongoose.connect()
const cookieParser=require('cookie-parser');
const nodemailer=require('nodemailer');
const app=express();
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname,'assets')));
app.use('/assets',express.static(path.join(__dirname,'assets')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use('/',require('./routes'));
app.listen(port,(err)=>{
    err?console.log('Something is wrong !'):console.log(`port is running on server ! ${port}`);
});