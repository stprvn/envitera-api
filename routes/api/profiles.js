const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load profile and user modal
const Profile = require('../../models/Profile');
const User = require('../../models/User');

router.get('/test',(req,res)=>{
    res.json({status:'success'});
})

//  @route  GET api/profile
//  @desc   Get current user profile
//  @access Private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors = {};
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            errors.noprofile = "There is no profile for current user";
            if(!profile) return res.status(400).json(errors);
            return json.profile();
        })
        .catch(err => res.status(404).json(err));
})

module.exports = router;