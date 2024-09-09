import mongoose from 'mongoose';

const createMongoDbConnection = (dbConnectionUri) => {
    mongoose.connect(dbConnectionUri);
    let dbConn = mongoose.connection;
    
    dbConn.on('error', error => {
        console.error(error);
    });
    
    dbConn.once('connected', () => {
        console.log('Connected to MongoDB');
    });
};

export default createMongoDbConnection;