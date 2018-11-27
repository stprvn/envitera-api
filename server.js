const mongoose  = require('mongoose');
const express = require('express');
const app = express();


mongoose.connect('mongodb://localhost/enviteramean')
    .then( ()=> console.log('Connected...'))
    .catch( err => console.error('Connecting Failed...',err))



app.listen(3000,()=>{
    console.log('Running on port 3000');
})
