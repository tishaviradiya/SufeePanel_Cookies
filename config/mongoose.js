const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1/Sufee_Admin');
const db=mongoose.connection;
db.once('open',(err)=>{
    err?console.log('Something is Wrong !'):console.log(`db is connected !`);
});
module.exports=db;