const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load profile and user modal
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const validateProfileInput = require('../../validation/profile');

router.get('/test',(req,res)=>{
    res.json({status:'success'});
})

//  @route  GET api/profile
//  @desc   Get current user profile
//  @access Private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors = {};
    Profile.findOne({user:req.user.id})
        .populate('user',['name','avatar','email'])
        .then(profile=>{
            errors.noprofile = "There is no profile for current user";
            if(!profile) return res.status(400).json(errors);
            return res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//  @route  GET api/profile/handle/:handle
//  @desc   Get profile by handle
//  @access Public
router.get('/handle/:handle',(req,res)=>{
    const errors = {};
    Profile.findOne({handle:req.params.handle})
        .populate('user',['name','avatar','email'])
        .then(profile=>{
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            return res.json(profile);
        }).catch(err => res.status(404).json(err))
})

//  @route  GET api/profile/user/:user_id
//  @desc   Get profile by user_id
//  @access Public
router.get('/user/:user_id',(req,res)=>{
    const errors = {};
    Profile.findOne({user:req.params.user_id})
        .populate('user',['name','avatar','email'])
        .then(profile=>{
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            return res.json(profile);
        }).catch(err => res.status(404).json({noprofile:"There is no profile for this user"}))
})

//  @route  GET api/profile/all
//  @desc   Get all profile
//  @access Public
router.get('/all',(req,res)=>{
    const errors = {};
    Profile.find()
        .populate('user',['name','avatar','email'])
        .then(profile=>{
            if(!profile){
                errors.noprofile = "There is no profile ";
                return res.status(404).json(errors);
            }
            return res.json(profile);
        }).catch(err => res.status(404).json({noprofile:"There is no profile"}))
})

//  @route  POST api/profile
//  @desc   Create current user profile
//  @access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors ,isValid} = validateProfileInput(req.body);
    const profileFields = {};

    //valitation
    if(!isValid){
        return res.status(400).json(errors);
    }

    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.location) profileFields.handle = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;


    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(profile){
                //update profile
                Profile.findOneAndUpdate(
                    {user:req.user.id},
                    {$set:profileFields},
                    {new:true}
                ).then(profile=> res.json(profile));
            }else{
                //Create new Profile
                //check if handle exist
                Profile.findOne({handle:profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = "That handle already exist";
                            return res.status(400).json(errors);
                        }else{
                            //save profile
                            new Profile(profileFields).save()
                                .then(profile => res.json(profile));
                        }
                    })
            }
        })
})


module.exports = router;