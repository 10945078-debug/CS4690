// Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://10945078:H0w!$m0vingc@st13@clusterp4.mby6u65.mongodb.net/?appName=ClusterP4";
async function connectMongoose() {
    await mongoose.connect(mongoDB);
    // Add connection error handlers
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
    });
}
try {
    connectMongoose();
}
catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
}
export {};
//# sourceMappingURL=www.js.map