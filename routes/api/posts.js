const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validatePostInput = require('../../validation/post');
const validateCommentInput = require('../../validation/comment');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


router.get('/test',(req,res)=>{
    res.json({status:'success'});
})

//  @route  POST api/posts
//  @desc   Create New Post
//  @access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const {errors, isValid} = validatePostInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    const tags = req.body.tags.split(',');
    const newPost = new Post({
        user:req.user.id,
        avatar:req.user.avatar,
        name:req.user.name,
        text:req.body.text,
        title:req.body.title,
        tags:tags,
        category:req.body.category,
        image:req.body.image
    });

    newPost.save().then(post => res.json(post))
        .catch(err=> res.json(err));
})

//  @route  GET api/posts
//  @desc   Get All Post
//  @access Public
router.get('/',(req,res)=>{
    Post.find().sort({date:-1})
    .populate('user',['name','avatar'])
    .then(posts=>res.json(posts))
    .catch(err => res.status(404).json(err));
})

//  @route  GET api/posts/:id
//  @desc   Get Single Post by Id
//  @access Public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
    .populate('user',['name','avatar'])
    .then(posts=>res.json(posts))
    .catch(err => res.status(404).json({msg:"no post found by given id"}));
})

//  @route  DELETE api/posts/:id
//  @desc   Delete Single Post by Id
//  @access Private
router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            Post.findById(req.params.id)
                .then(post=>{
                    //check for owner post
                    if(post.user.toString()!==req.user.id){
                        return res.status(401).json({notautorized:'User not autorized'});
                    }
                    //Delete
                    post.remove().then(()=>res.json({success:true}))
                        .catch(err=> res.status(404).json({notpostfound:"No post found"}))
                }).catch(err => res.status(404).json({notautorized:'User not autorized'}))
        })
})

//  @route  POST api/posts/like/:id
//  @desc   Delete Single Post by Id
//  @access Private
router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            Post.findById(req.params.id)
                .then(post=>{
                   //check user already liked
                   if(post.likes.filter(like => like.user.toString()=== req.user.id).length > 0){
                       return res.status(400).json({alreadyliked:"User alrady like this post"});
                   }
                   // add user id to likes array
                   post.likes.unshift({user:req.user.id});
                   post.save().then(post=> res.json(post));
                })
                .catch(err=> res.status(404).json({postnotfound:'No post found'}));
        })
})

//  @route  POST api/posts/unlike/:id
//  @desc   Delete Single Post by Id
//  @access Private
router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post=> {
                    if(post.likes.filter(like=>like.user.toString() === req.user.id).length===0){
                        res.status(400)
                            .json({alreadyliked:'You have not yel liked this post'})
                    }
                    //get remove index
                    const index = post.likes
                                    .map(item=>item.user.toString())
                                    .indexOf(req.user.id)
                    //splice 
                    post.likes.splice(index,1);
                    //save
                    post.save().then(post=> res.json(post))
                })
                .catch(err=> res.status(404).json({postnotfound:'No Post Found'}))
        })
})

// @route   POST api/posts/comment/:id
// @desc    add comment
// @access  private
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const {errors, isValid} = validateCommentInput(req.body)
    //check validation
    if(!isValid){
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post=>{
            const newComment={
                text:req.body.text,
                name:req.user.name,
                avatar:req.user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment);
            post.save().then(post=> res.json(post))
        })
        .catch(err => res.status(404).json({postnotfound:'No post Found'}))
   
})


// @route   DELETE api/posts/comment/:id
// @desc    remove comment
// @access  private
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Post.findById(req.params.id)
        .then(post=>{
            
            //check to see comment exist
            if(post.comments.
                filter(comment => comment._id.toString()===req.params.comment_id)
                .length===0){
                    return res.status(404).json({commentnotexist:"Comment not exist"})
                }

                //get remove index
                const index = post.comments
                            .map(item=>item._id.toString())
                            .indexOf(req.params.comment_id)
                //splice 
                post.comments.splice(index,1);
                //save
                post.save().then(post=> res.json(post))
            
        })
        .catch(err => res.status(404).json({postnotfound:'No post Found'}))
   
})


module.exports = router;
