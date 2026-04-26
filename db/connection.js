import mongoose from "mongoose";

//const MONGO_URI = "mongodb+srv://10945078:H0w!$m0vingc@st13@clusterp4.mby6u65.mongodb.net/?appName=ClusterP4";
//const MONGO_URI = "mongodb+srv://10945078:H0w%21%24m0vingc%40st13@clusterp4.mby6u65.mongodb.net/?appName=ClusterP4"; //URLencoded special characters
const MONGO_URI = "mongodb+srv://10945078:H0w%21%24m0vingc%40st13@clusterp4.mby6u65.mongodb.net/local_library?retryWrites=true&w=majority"; //Point to local libary database

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}