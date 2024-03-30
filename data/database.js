const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
let database;

async function connect(){

    const client=await MongoClient.connect('mongodb://127.0.0.1:27017');
    database=client.db('athena');
}


function getDb(){
    if(!database){
        throw{message:'database connection not estabilished!'};

    }
    return database;
}

module.exports={
    connectToDatabase:connect,
    getDb:getDb
};