"use server"


import { connectToDB } from "../mongoose"

import  User  from "../models/user.model";
import { revalidatePath } from "next/cache";

export async function updateUser(
    //params
    userId:string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
    
    ): Promise<void> {
    connectToDB();

    //model folder created----

   try {
    //update user function 

    await User.findOneAndUpdate(
        { id: userId },
        {
            username : username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true,
        },
        //update the row and insert if not found , update + insert
        { upsert: true}
        );

        if(path=== '/profile/edit'){

            revalidatePath(path);
        }
    
   } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`)
    
   }
}
//backend done here