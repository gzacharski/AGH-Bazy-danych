const neo4j=require('neo4j-driver');

const uri='bolt://localhost:7687'; 
const user='neo4j';
const password='test';

const driver=neo4j.driver(uri, neo4j.auth.basic(user,password),{ disableLosslessIntegers: false });

const dbConfig={
    database: 'northwind',
    defaultAccessMode: neo4j.session.READ,
}

module.exports.driver=driver;
module.exports.config=dbConfig;