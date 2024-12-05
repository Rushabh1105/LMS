const {MONGO_URL} = require('./serverConfig')

const mongoose = require('mongoose');

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to mongo DB...")
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectToMongoDB,
}