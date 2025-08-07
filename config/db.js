const moongoose = require('mongoose');  



const db = async () => {    

    moongoose
         .connect(process.env.MONGO_URI)
         .then(() => console.log('MongoDB connected'))
         .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = db;
