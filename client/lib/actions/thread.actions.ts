"use server" // database operations


import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({
    text,
    author,
    communityId,
    path }: Params) {
    //connect to the database
    try {
        connectToDB();

    
        const createThread = await Thread.create({
            text,
            author,
            community: null,
        });

        //update user model after creating thread

        await  User.findByIdAndUpdate(author, {
            $push: { threads: createThread._id }
        });

        revalidatePath(path);
    } catch (error : any) {
        console.error('Error occurred while creating thread:', error);
        
    }
        
}