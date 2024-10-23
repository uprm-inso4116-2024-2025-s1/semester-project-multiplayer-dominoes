import mongoose from 'mongoose';

class MongoDbConnection {
    static createConnection(dbConnectionUri) {
        mongoose.connect(dbConnectionUri);
        let dbConn = mongoose.connection;
        
        dbConn.on('error', error => {
            console.error(error);
        });
        
        dbConn.once('connected', () => {
            console.log('Connected to MongoDB');
        });
    }
}

export default MongoDbConnection;