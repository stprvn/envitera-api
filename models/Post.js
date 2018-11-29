const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name:{
    type:String
  },
  avatar:{
    type:String
  },
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required:true,
  },
  image: {
    type: String
  },
  text:{
      type:String,
      required:true
  },
  tags:[String],
  likes:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'users'
        }
    }
  ],
  comments:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:'users'
        },
        text:{
            type:String,
            required:true
        },
        name:{
            type:String
        },
        avatar:{
            type:String
        },
        date:{
            type:Date,
            default:Date.now
        }
    }
  ],
  views:Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('Post', PostSchema);
