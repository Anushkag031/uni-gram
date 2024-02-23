
import mongoose from "mongoose"; 

 const threadSchema  = new mongoose.Schema({
    text : { type : String, required: true },
    author :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    community : {
        type : mongoose.Schema.Types.ObjectId,
        ref :'Community',

    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    //multilevel ccommenting functionality
    parentId : {
        type:String,
    },
    //one thread can have multiple refrences to multiple threads in the children array
    children : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Thread', 
        }
    ]
 });

 const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

 export default Thread;

