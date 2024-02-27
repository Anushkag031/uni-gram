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

export async function fetchPosts(pageNumber =1, pageSize =20)
{
    try {
        // Ensure database connection
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        // Fetch posts query
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image "
                }
            });

        // Execute posts query
        const posts = await postsQuery.exec();

        // Total post count
        const totalPostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

        // Determine if there are more posts
        const isNext = totalPostCount > skipAmount + posts.length;

        // Return posts and pagination info
        return { posts, isNext };
    } catch (error) {
        // Handle any errors
        console.error('Error fetching posts:', error);
        throw error; // Re-throw the error to propagate it
    }
    
}