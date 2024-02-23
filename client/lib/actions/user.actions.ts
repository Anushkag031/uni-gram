"use server"


import { connectToDB } from "../mongoose"

import User from "../models/user.model";
import { revalidatePath } from "next/cache";


//defining the parameters
interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}
//destruction parameters and making it as a one object
export async function updateUser({
    //params
    userId,
    username,
    name,
    bio,
    image,
    path,
    //decalring the return type as parameter
}: Params): Promise<void> {
    //connect to the database
    connectToDB();

    //model folder created----

    try {
        //update user function 

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            //update the row and insert if not found , update + insert
            { upsert: true }
        );

        if (path === '/profile/edit') {

            revalidatePath(path);
        }

    } catch (error: any) {
        //throw new Error(`Failed to update user: ${error.message}`)
        console.error('Error occurred while updating user:', error);

    }
}
//backend done here for updating the user

export async function fetchUser(userId : string){
    try {
        connectToDB();

        return await User
        .findOne({ id: userId })
        /*.populate({
            path:'communities',
            model: Cummunity
        })*/
    } catch (error : any) {
        throw new Error(`Failed to fetch user: ${error.message}`)  ;
        
    }
}