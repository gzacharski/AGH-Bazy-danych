const driver=require('../config/dbconfig').driver;
const config=require('../config/dbconfig').config;

async function testCallDB(){

    const session = driver.session(config);
    const cypherQuery='MATCH (c:Customer) RETURN c LIMIT 10';
    const params={};

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

exports.getSampleCustomers=async (request,response)=>{

    let searchedNode=await testCallDB();

    if(!searchedNode) return res.status(404).send('The database is empty.');
    response.send(searchedNode);
}