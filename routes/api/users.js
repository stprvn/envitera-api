const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');


const keys = require('../../config/keys');
//load user model
const User = require('../../models/User');
//Input Validation
const validationRegisterInput = require('../../validation/register');
const validationLoginInput = require('../../validation/login');

router.get('/test', (req, res) => {
    res.json({ status: 'success' });
})

//  @route  POST api/users/register
//  @desc   Register User
//  @access Public
router.post('/register', (req, res) => {

    //validate input
    const { errors, isValid } = validationRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    //proses valid input
    //check user exist on database
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                errors.email = "Email Sudah Terdafar";
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    e: 200, //Size
                    r: 'pg', //rating
                    d: 'mm' // default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: avatar
                })

                //encrypt user password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user => {
                                //generate token and embeded payload in token
                                const payload = {
                                    id: user.id, name: user.name, avatar: user.avatar
                                }
                                jwt.sign(payload,
                                    keys.secretOrKey,
                                    { expiresIn: 7200 },
                                    (err, token) => {
                                        res.send({
                                            success: true,
                                            token: 'Bearer ' + token
                                        })
                                    }
                                );
                            })
                            .catch(err => console.log(err.message));
                    })
                })
            }
        })
})

//  @route  POST api/users/login
//  @desc   Login User and Return a token
//  @access Public
router.post('/login', (req, res) => {
    //validate input
    const { errors, isValid } = validationLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    //find user by email from database
    User.findOne({ email })
        .then(user => {
            //check user exist
            errors.email = "User Not Found"
            if (!user) return res.status(404).json(errors);
            //user is exist
            //check pass
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Match
                        //generate token and embeded payload in token
                        const payload = {
                            id: user.id, name: user.name, avatar: user.avatar
                        }
                        jwt.sign(payload,
                            keys.secretOrKey,
                            { expiresIn: 7200 },
                            (err, token) => {
                                res.send({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            }
                        );
                    } else {
                        errors.msg = "Password or Email Wrong";
                        return res.status(400).json(errors);
                    }
                })
        })
})

//  @route  GET api/users/current
//  @desc   return user current payload
//  @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})



module.exports = router;