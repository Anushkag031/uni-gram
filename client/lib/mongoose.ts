import mongoose from "mongoose";

let isConnected = false; //check connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true); //prevent unknown field query

    if(!process.env.MONGODB_URL){
        //throw new Error('MongoDB URI is missing');
        return console.log('MongoDB URL is missing');
    }

    if(isConnected){
        return console.log('Using existing database connection');
    }
}