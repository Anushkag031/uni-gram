"use server"


import { connectToDB } from "../mongoose"

import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";


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

export async function fetchUserPosts(userId : string){
    try {
        connectToDB();

        //populate the community also(left)


        //fetching the user threads authorized by the user
        const threads= await User
        .findOne({ id: userId })
        .populate({
            path:'threads',
            model: Thread,
            populate: {
                path:'children',
                model: 'Thread',
                populate: {
                    path: 'author',
                    model: 'User',
                    select:'name image id'
                }
            }
        })
        return threads;
    } catch (error : any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)  ;
        
    }
}

export async function fetchUsers({ 
    userId,
    searchString = " ",
    pageNumber = 1,
    pageSize = 20,
    sortBy="desc",
} : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;

}) {
    try {
        //to understand this
        connectToDB();

        const skipAmount = (pageNumber -1) * pageSize; //This calculates the number of documents to skip based on the pageNumber and pageSize parameters, which are used for pagination.

        const regex = new RegExp(searchString, "i"); //case insensitive, This line creates a regular expression object (RegExp) using the searchString parameter. The "i" flag makes the regular expression case-insensitive, meaning it will match both uppercase and lowercase characters.

        const query: FilterQuery<typeof User>= {
            id : { $ne : userId }
        }

        if(searchString.trim() !== '') { //not empty, the query object is updated to include conditions for searching usernames or names that match the provided search string using regular expressions.
            query.$or = [
                {
                    username : { $regex: regex}
                },
                {
                    name : { $regex: regex}
                }
            ]
        }

        //sorting

        const sortOptions = { createdAt : sortBy};

        const usersQuery = User.find(query) //This line constructs the MongoDB query to find users based on the specified criteria 
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize);

        const totalUserCount = await User.countDocuments(query); //This line retrieves the total number of users that match the query criteria, regardless of pagination.

        const users = await usersQuery.exec(); //this line executes the query to fetch a subset of users based on the pagination parameters. It returns an array of user documents.

        const isNext = totalUserCount > skipAmount + users.length; //This calculates whether there are more users available beyond the current page. It compares the total user count with the sum of skipped users and the number of users fetched on the current page.

        return { users, isNext};

        
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

       /* const user = await User.findOne({ id: userId });

        if(!user) {
            throw new Error("User not found");
        } */
//find all threads created by user
        const userThreads = await Thread.find({ author: userId });

        //collect all child thread ids (replies) from the children field

       // childThreadIds will be an array containing all the children thread IDs from each userThreads element in the userThreads array.


       // example : 

     /*  const userThreads = [
        { id: 'thread1', children: ['child1', 'child2'] },
        { id: 'thread2', children: ['child3'] },
        { id: 'thread3', children: ['child4', 'child5', 'child6'] }
      ];

      ["child1", "child2", "child3", "child4", "child5", "child6"]
*/
      

        const childThreadIds = userThreads.reduce((acc, userThreads) => {
            return acc.concat(userThreads.children);
        },[])

        const replies = await Thread.find({ 
            _id: { $in: childThreadIds },
            author: { $ne: userId }
        })
        .populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        });
        

        return replies;
    } catch (error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`);
    }
}