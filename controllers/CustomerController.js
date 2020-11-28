const { response } = require('../app');

const driver=require('../config/dbconfig').driver;
const config=require('../config/dbconfig').config;

async function getCustomer(userId){

    const session=driver.session(config);
    const query=`MATCH (c:Customer) WHERE c.id='${userId}' RETURN c`;

    let theCustomer;

    try{
        const result=await session.readTransaction(tx => tx.run(query));

        theCustomer=result.records.map(record => record.get(0));
    }finally{
        await session.close();
    }

    return theCustomer;
}

let getById=async (request, response) => {
    let userId=request.params.id;
    console.log(`User id is ${userId}`);

    let theCustomer=await getCustomer(userId);

    if(!theCustomer) {
        return response.status(404).send(`There is no customer with provided id: ${userId}`);
    }else{
        response.send(theCustomer);
    }
}

let updateById=async (request,response) => {

    const userId=request.params.id;
    const userProps=request.body;
    console.log(`User id is ${userId}`);
    console.log(userProps);

    const session=driver.session(config);
    const query=`MATCH (c:Customer) WHERE c.id='${userId}' SET c+=$properties RETURN c;`;
    const params=userProps;

    let theCustomer;

    try{
        const result=await session.writeTransaction(tx=> tx.run(query,params));

        theCustomer=result.records.map(record=>record.get(0));
    }finally{
        await session.close();
    }

    response
        .status(201)
        .send(theCustomer);
}

let create=async (request,response) => {
    response
        .status(200)
        .send();
}

let deleteById=async (request,response) => {
    response
        .status(200)
        .send();
}

let getAll=async (request,response) => {
    response
        .status(200)
        .send();
}

module.exports.getAll=getAll;
module.exports.getById=getById;
module.exports.updateById=updateById;
module.exports.create=create;
module.exports.deleteById=deleteById;