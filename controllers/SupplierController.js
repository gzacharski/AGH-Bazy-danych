const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;
const uuid = require('uuid');

const supplierExists = async (id) => {

    const session = driver.session(config);
    const checkQuery = 'MATCH (s:Supplier) WHERE s.id=$id RETURN s;';
    const params = {
        id: Number.parseInt(id)
    };

    let exists;

    try {
        const result = await session.readTransaction(tx => tx.run(checkQuery, params));

        exists = result.records.length !== 0 && result.records[0].get(0).properties.id.low === Number.parseInt(id);

    } finally {
        await session.close();
    }

    return exists;
}

module.exports.create = async (request, response) => {
    console.log('Create supplier...');

    const supplierDetails = { properties: request.body };
    const session = driver.session(config);
    const query = 'CREATE (s:Supplier) SET s+=$properties, s.id=id(s) RETURN s;';

    try {
        const result = await session.writeTransaction(tx => tx.run(query, supplierDetails));
        const newSupplier = result.records[0];

        if (!newSupplier) throw new Error("The server was not able to register a new supplier.");

        response
            .status(201)
            .send(newSupplier.get(0).properties);

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

module.exports.getById = async (request, response) => {
    console.log('Get supplier by Id...');

    //get supplier id from url
    const id = request.params.id;
    const session = driver.session(config);

    try {
        if (!await supplierExists(id)) {
            response
                .status(404)
                .send({
                    message: `There is no supplier with provided id: ${id}`
                });

        } else {
            const query = 'MATCH (s:Supplier) WHERE s.id=$id RETURN s;';
            const params = {
                id: Number.parseInt(id)
            };

            const result = await session.readTransaction(tx => tx.run(query, params));
            const theSupplier = result.records[0];

            if (!theSupplier) throw new Error("The server was not able to get a new supplier.");

            response
                .status(200)
                .send(theSupplier.get(0).properties);
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

module.exports.updateById = async (request, response) => {
    console.log('Update supplier by Id...');

    const id = Number.parseInt(request.params.id);
    const session = driver.session(config);

    try {
        if (!await supplierExists(id)) {
            response
                .status(404)
                .send({
                    message: `There is no supplier with provided id: ${id}`
                });

        } else {
            const query = 'MERGE (s:Supplier {id:$id}) SET s+=$properties RETURN s;';
            const params = {
                id: Number.parseInt(id),
                properties: request.body
            };

            const result = await session.writeTransaction(tx => tx.run(query, params));
            const theSupplier = result.records[0];

            if (!theSupplier) throw new Error("The server was not able to update the supplier.");

            response
                .status(200)
                .send(theSupplier.get(0).properties);
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
    console.log('Delete supplier by Id...');

    //get supplier id from url
    const id = request.params.id;
    const session = driver.session(config);

    try {
        if (!await supplierExists(id)) {
            response
                .status(404)
                .send({
                    message: `There is no supplier with provided id: ${id}`
                });

        } else {
            const query = 'MATCH (s:Supplier) WHERE s.id=$id DETACH DELETE s;';
            const params = {
                id: Number.parseInt(id)
            };

            await session.writeTransaction(tx => tx.run(query, params));

            response
                .status(200)
                .send({
                    id,
                    message: "Supplier has been deleted."
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

module.exports.getAll = async (request, response) => {
    console.log('Get all supplies...');

    const session = driver.session(config);
    const query = `MATCH (s:Supplier) RETURN s`;

    try {
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
            .send(error.message);

    } finally {
        await session.close();
    }
}