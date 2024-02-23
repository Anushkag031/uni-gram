
import mongoose from "mongoose"; 

 const userSchema  = new mongoose.Schema({

    id: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    name : { type: String, required: true},
    image: String,
    bio : String,
    threads : [
//one user can have multiple refrences to multiple threads in the threads array
//stored in database
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    onboarded : {
        type: Boolean,
        default: false,
    },
    communities: [
//one user can have multiple refrences to multiple communities in the communities array
//stored in database
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ]
    
 });

 const User = mongoose.models.User || mongoose.model('User', userSchema);

 export default User;