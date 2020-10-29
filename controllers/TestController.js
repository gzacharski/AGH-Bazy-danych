const driver=require('../config/dbconfig').driver;
const config=require('../config/dbconfig').config;

async function testCallDB(){
    const filmTitle='The Matrix';

    const session = driver.session(config);
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

exports.getAllFilms=async (request,response)=>{

    let searchedNode=await testCallDB();

    if(!searchedNode) return res.status(404).send('The is now film in database.');
    response.send(searchedNode);
}