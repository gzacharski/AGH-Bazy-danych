const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;
const uuid = require('uuid');

const customerExists = async (id) => {

    const checkQuery = `MATCH (c:Customer) WHERE c.id='${id}' RETURN c`;
    const session = driver.session(config);
    let exists;

    console.log(checkQuery);

    try {
        const result = await session.readTransaction(tx => tx.run(checkQuery));
        exists = result.records.length !== 0 && result.records[0].get(0).properties.id === id;

    } finally {
        await session.close();
    }

    return exists;
}

//HTTP GET
//get Customer by Id
module.exports.getById = async (request, response) => {
    console.log("get by id...");

    const userId = request.params.id;
    const session = driver.session(config);

    try {

        if (!await customerExists(userId)) {
            response
                .status(404)
                .send({
                    message: `There is no customer with provided id: ${userId}`
                });

        } else {
            const query = `MATCH (c:Customer) WHERE c.id='${userId}' RETURN c`;

            const result = await session.readTransaction(tx => tx.run(query));
            const theCustomer = result.records[0].get(0).properties;

            response
                .status(200)
                .send(theCustomer);
        }

    } catch (error) {
        response
            .status(500)
            .send(error.message);
    } finally {
        await session.close();
    }
}

//HTTP PUT
//update Customer by Id
module.exports.updateById = async (request, response) => {
    console.log('update by Id...')

    const userProps = {
        properties: request.body
    };
    const id = request.params.id;

    const session = driver.session(config);
    const query = `MATCH (c:Customer) WHERE c.id='${id}' SET c+=$properties RETURN c;`;
    const params = userProps;

    try {
        if (!await customerExists(id)) throw new Error(`There is no such a customer with provided id: ${id}`);

        const result = await session.writeTransaction(tx => tx.run(query, params));

        const theCustomer = result.records[0].get(0).properties;

        response
            .status(201)
            .send(theCustomer);

    } catch (error) {
        response
            .status(404)
            .send(error.message);
    } finally {
        await session.close();
    }
}

//HTTP POST
//create Customer
module.exports.create = async (request, response) => {
    console.log('create...')

    const userDetails = { properties: request.body };
    const query = `CREATE (c:Customer) SET c+=$properties RETURN c;`
    const session = driver.session(config);

    let id = userDetails.properties.id;

    if (!id) id = userDetails.properties.id = uuid.v4();

    try {
        if (await customerExists(id)) throw new Error(`There is a customer with provided id: ${id}`);

        const result = await session.writeTransaction(tx => tx.run(query, userDetails));

        const newCustomer = result.records[0];

        if (!newCustomer) throw new Error("The server couldn't register a new user.");

        response
            .status(201)
            .send(newCustomer.get(0).properties);

    } catch (error) {
        response
            .status(400)
            .send({
                message: error.message,
                userDetails
            });

    } finally {
        await session.close();
    }
}

//DELETE
module.exports.deleteById = async (request, response) => {
    console.log('delete by id...');

    const id = request.params.id;
    const query = `MATCH (c:Customer) WHERE c.id='${id}' DETACH DELETE c;`;
    const session = driver.session(config);

    try {

        if (!await customerExists(id)) {
            throw new Error(`There is no customer with provided id: ${id}`);
        }

        await session.writeTransaction(tx => tx.run(query));

        //send response if customer has been deleted
        response
            .status(200)
            .send({
                id,
                message: "User has been deleted."
            });

    } catch (error) {
        //send response if customer hasn't been found in database
        //or other error took place
        response
            .status(404)
            .send(error.message);

    } finally {
        await session.close();
    }
}

//HTTP GET
//get all user
module.exports.getAll = async (request, response) => {
    console.log('get all ...')

    const session = driver.session(config);
    const query = `MATCH (c:Customer) RETURN c`;

    try {
        const result = await session.readTransaction(tx => tx.run(query));

        const customers = result.records.map(record => record.get(0).properties);

        if (customers.length === 0) throw new Error("There is no customers in database.");

        //send resposne with status 200 with found customers
        response
            .status(200)
            .send({
                quantity: customers.length,
                customers
            });

    } catch (error) {

        //send response with status 404 if error took place
        response
            .status(404)
            .send(error.message);

    } finally {
        await session.close();
    }
}