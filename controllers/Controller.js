
const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;

const nodeExists = async (id, label) => {

    const session = driver.session(config);
    let exists;

    try {
        const checkQuery = `MATCH (n:${label}) WHERE n.id=$id RETURN n`;
        const params = {
            id: Number.parseInt(id)
        };

        const result = await session.readTransaction(tx => tx.run(checkQuery, params));

        exists = result.records.length !== 0 && result.records[0].get(0).properties.id.low === Number.parseInt(id);

    } finally {
        await session.close();
    }

    return exists;
}


module.exports.getAll = async (request, response) => {

    console.log('Get all ...');
    const session = driver.session(config);

    const node_label = request.get('node_label');
    console.log(node_label);

    try {
        if (!node_label) throw new Error("Node label has not been specified.");

        const query = `MATCH (s:${node_label}) RETURN s`;
        console.log(query);

        const result = await session.readTransaction(tx => tx.run(query));
        const suppliers = result.records.map(record => record.get(0).properties);

        response
            .status(200)
            .send({
                quantity: suppliers.length,
                suppliers
            })

    } catch (error) {
        //send response with status 500 if error took place
        response
            .status(500)
            .send({
                message: error.message
            });

    } finally {
        await session.close();
    }
}


//HTTP GET
//get Customer by Id
module.exports.getById = async (request, response) => {
    console.log("get by id...");

    const id = request.params.id;
    const session = driver.session(config);

    const node_label = request.get('node_label');

    try {
        if (!await nodeExists(id, node_label)) {
            response
                .status(404)
                .send({
                    message: `There is no ${node_label} with provided id: ${id}`
                });

        } else {
            const query = `MATCH (n:${node_label}) WHERE n.id=$id RETURN n`;
            const params = {
                id: Number.parseInt(id)
            };

            const result = await session.readTransaction(tx => tx.run(query, params));
            const node = result.records[0];

            if (!node) throw new Error(`The server was not able to get a ${node_label}.`);

            response
                .status(200)
                .send(node.get(0).properties);
        }

    } catch (error) {
        response
            .status(500)
            .send(error.message);
    } finally {
        await session.close();
    }
}


module.exports.create = async (request, response) => {
    console.log('Create ...');

    const node_label = request.get('node_label');
    const session = driver.session(config);

    try {
        const query = `CREATE (n:${node_label}) SET n+=$properties, n.id=id(n) RETURN n;`;
        const supplierDetails = {
            properties: request.body
        };

        const result = await session.writeTransaction(tx => tx.run(query, supplierDetails));
        const node = result.records[0];

        if (!node) throw new Error(`The server was not able to register a new ${node_label}.`);

        response
            .status(201)
            .send(node.get(0).properties);

    } catch (error) {
        response
            .status(500)
            .send({
                error: error.message
            });
    } finally {
        await session.close();
    }
}

module.exports.updateById = async (request, response) => {
    console.log('Update by Id...');

    const id = Number.parseInt(request.params.id);
    const session = driver.session(config);
    const node_label = request.get('node_label');

    try {
        if (!await nodeExists(id, node_label)) {
            response
                .status(404)
                .send({
                    message: `There is no ${node_label} with provided id: ${id}`
                });

        } else {
            const query = `MERGE (s:${node_label} {id:$id}) SET s+=$properties RETURN s;`;
            const params = {
                id: Number.parseInt(id),
                properties: request.body
            };

            const result = await session.writeTransaction(tx => tx.run(query, params));
            const node = result.records[0];

            if (!node ) throw new Error(`The server was not able to update the ${node_label}.`);

            response
                .status(200)
                .send(node .get(0).properties);
        }
    } catch (error) {
        response
            .status(500)
            .send({
                error: error.message
            });
    } finally {
        await session.close();
    }
}


module.exports.deleteById = async (request, response) => {
    console.log('Delete by Id...');

    //get supplier id from url
    const id = request.params.id;
    const session = driver.session(config);
    const node_label = request.get('node_label');

    try {
        if (!await nodeExists(id, node_label)) {
            response
                .status(404)
                .send({
                    message: `There is no ${node_label} with provided id: ${id}`
                });

        } else {
            const query = `MATCH (s:${node_label}) WHERE s.id=$id DETACH DELETE s;`;
            const params = {
                id: Number.parseInt(id)
            };

            await session.writeTransaction(tx => tx.run(query, params));

            response
                .status(200)
                .send({
                    id,
                    message: `${node_label} has been deleted.`
                });
        }
    } catch (error) {
        response
            .status(500)
            .send({
                error: error.message
            });
    } finally {
        await session.close();
    }
}