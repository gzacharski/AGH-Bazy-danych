const neo4j=require('neo4j-driver');

const uri='bolt://localhost:7687'; 
const user='neo4j';
const password='@Dmin12345';

const driver=neo4j.driver(uri, neo4j.auth.basic(user,password));

const dbConfig={
    database: 'northwind',
    defaultAccessMode: neo4j.session.READ,
}

module.exports.driver=driver;
module.exports.config=dbConfig;