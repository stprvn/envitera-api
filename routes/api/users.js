const express = require('express');
const router  = express.Router();
const gravatar = require('gravatar');
const bcrypt    = require('bcryptjs');

//load user model
const User = require('../../models/User');

router.get('/test',(req,res)=>{
    res.json({status:'success'});
})

//  @route  POST api/users/register
//  @desc   Register User
//  @access Public
router.post('/register',(req,res)=>{
    //check user exist on database
    User.findOne({email:req.body.email})
    .then(user => {
        if(user){
            return res.status(400).json({email:"Email Sudah Terdafar"});
        }else{
            const avatar = gravatar.url(req.body.email,{
                e:200, //Size
                r:'pg', //rating
                d:'mm' // default
            });
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                avatar:avatar
            })

            //encrypt user password
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password = hash;
                    //save user
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err.message));
                })
            })
        }
    })
})

module.exports = router;