const express=require('express');
const neo4j=require('neo4j-driver');
const path=require('path');
const bodyParser=require('body-parser');

const app=express();

const uri='bolt://localhost:7687'; 
const user='neo4j';
const password='@Dmin12345';

const driver=neo4j.driver(uri, neo4j.auth.basic(user,password));
const dbConfig={
    database: 'movies',
    defaultAccessMode: neo4j.session.READ,
}

async function testCallDB(){

    const session = driver.session(dbConfig);
    const cypherQuery='MATCH (m:Movie) RETURN m LIMIT 10';
    const params={theTitle: filmTitle};

    let searchedNode;

    try {
        const result= await session.readTransaction(tx =>tx.run(cypherQuery,params));

        const records = result.records.map(record => record.get(0));
        searchedNode = records;
    } finally {
        await session.close()
    }

    //await driver.close();
    return searchedNode;
}

app.get('/api/films', async (request,response)=>{

    let searchedNode=await testCallDB();

    if(!searchedNode) return res.status(404).send('The is now film in database.');
    response.send(searchedNode);
});

const port=process.env.PORT || 3000;
app.listen(port, () =>console.log(`Listening on port ${port}...`));