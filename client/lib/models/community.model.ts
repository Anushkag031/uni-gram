import mongoose from "mongoose"; 

 const CommunitySchema  = new mongoose.Schema({

    id: { type: String, required: true }, 
    username: { type: String, required: true, unique: true}, 
    name : { type: String, required: true}, 
    image: String, 
    bio : String, 
    createdBy:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    threads : [ 
//one user can have multiple refrences to multiple threads in the threads array
//stored in database
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    members: [
//one user can have multiple refrences to multiple members in the members array
//stored in database
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
    
 });

 const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);

 export default Community;