const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;
const uuid = require('uuid');

//create contains relation
module.exports.createContainsRelation = async (request, response) => {
    console.log('Create Contains relation...');

    const orderId = request.params.order;
    const productId = request.params.product;
    const session = driver.session(config);
    const orderNodeLabel = 'Order';
    const productNodeLabel = 'Product';

    try {
        const nodeDetails = { properties: request.body };

        let id = nodeDetails.properties.odId;
        if (!id) id = nodeDetails.properties.odId = Number.parseInt(uuid.v4(),16);
        const unitPrice = nodeDetails.properties.unitPrice;
        const quantity = nodeDetails.properties.quantity;
        const discount = nodeDetails.properties.discount;

        const bodyParsed = {
            "odID": id,
            "unitPrice" : Number.parseFloat(unitPrice),
            "quantity" : Number.parseInt(quantity),
            "discount" : Number.parseFloat(discount)
        }

        const containsSuppliesQuery = `MATCH (o:${orderNodeLabel}),(p:${productNodeLabel}) WHERE o.id = $order AND p.id = $product CREATE (o)-[r:CONTAINS]->(p) SET r+=$properties RETURN type(r)`;

        const params =  {
            order: Number.parseInt(orderId),
            product: Number.parseInt(productId),
            properties: bodyParsed
        };

        const result = await session.writeTransaction(tx => tx.run(containsSuppliesQuery,params));
        const node = result.records[0];

        if (!node) throw new Error(`ERROR - cannot create CONTAINS relationship between Order: ${orderId} and Product: ${productId}.`);

        response
            .status(201)
            .send({
                quantity: node.length,
                node
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

module.exports.getProductsContainedInOrder = async (request, response) => {
    console.log('Get Products contained in the Order...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (order:Order)-[r:CONTAINS]->(product:Product) WHERE order.id=$id RETURN product`;
        const params =  {id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Products contained in Order: ${id}.`);

        response
            .status(200)
            .send({
                quantity: nodes.length,
                nodes
            })
    }

    catch (error) {
        response
            .status(500)
            .send({
                error: error.message
            });
    } finally {
        await session.close();
    }
}

module.exports.getOrdersWhichContainProduct = async (request, response) => {
    console.log('Get Orders which contain the Product...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (order:Order)-[r:CONTAINS]->(product:Product) WHERE product.id=$id RETURN order`;
        const params =  {id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Orders which contain Product: ${id}.`);

        response
            .status(200)
            .send({
                quantity: nodes.length,
                nodes
            })
    }

    catch (error) {
        response
            .status(500)
            .send({
                error: error.message
            });
    } finally {
        await session.close();
    }
}


module.exports.getAllContainsRelations = async (request, response) => {
    console.log('Get All Contains Relations (between Orders and Product)...');

    const session = driver.session(config);

    try {
        const query = `MATCH ()-[r:CONTAINS]->() RETURN r`;

        const result = await session.readTransaction(tx => tx.run(query));
        const nodes = result.records.map(record => record.get(0).properties);

        response
            .status(200)
            .send({
                quantity: nodes.length,
                nodes
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

module.exports.getContainsRelationById = async (request, response) => {
    console.log('Get Contains Relation by Id...');

    const id = request.params.id;
    const session = driver.session(config);

    try {
        const query = `MATCH ()-[r:CONTAINS]->() WHERE r.odID=$id RETURN r`;
        const params =  {id: Number.parseInt(id)};
        const result = await session.readTransaction(tx => tx.run(query, params));
        const node = result.records[0];

        if(!node) {
            response
                .status(404)
                .send({
                    message: `Not found CONTAINS relationship of ID: ${id}.`
                })
        }

        response
            .status(200)
            .send(node.get(0).properties);

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

module.exports.getContainsRelationsByOrderProduct = async (request, response) => {
    console.log('Get Contains Relations between specific Order and Product...');

    const orderId = request.params.order;
    const productId = request.params.product;
    const session = driver.session(config);

    try {
        const query = `MATCH (o:Order)-[r:CONTAINS]->(p:Product) WHERE o.id=$order AND p.id=$product RETURN r`;
        const params =  {order: Number.parseInt(orderId), product: Number.parseInt(productId)};
        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if(nodes.length<1) {
            response
                .status(404)
                .send({
                    message: `Not found CONTAINS relationship between Order: ${orderId} and Product: ${productId}.`
                })
        }

        response
            .status(200)
            .send({
                quantity: nodes.length,
                nodes
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

module.exports.deleteContainsRelationsOrderProduct = async (request, response) => {
    console.log('Delete Contains Relations by Order and Product Id...');

    const orderId = request.params.order;
    const productId = request.params.product;
    const session = driver.session(config);

    try {
        const existingRelationshipQuery = `MATCH (o:Order)-[r:CONTAINS]->(p:Product) WHERE o.id=$order AND p.id=$product RETURN r`;
        const existingRelationshipParams =  {order: Number.parseInt(orderId), product: Number.parseInt(productId)};
        const existingRelationshipResult = await session.readTransaction(tx => tx.run(existingRelationshipQuery, existingRelationshipParams));
        const existingRelationshipNode = existingRelationshipResult.records[0];

        if(!existingRelationshipNode) {
            response
                .status(404)
                .send({
                    message: `Not found CONTAINS relationship between Order ${orderId} and Product ${productId}.`
                })
        }

        const query = `MATCH (o:Order)-[r:CONTAINS]->(p:Product) WHERE o.id=$order AND p.id=$product DELETE r`;
        const params =  {order: Number.parseInt(orderId), product: Number.parseInt(productId)};
        await session.writeTransaction(tx => tx.run(query, params));

        response
            .status(200)
            .send({
                message: `CONTAINS relationship between Order ${orderId} and Product ${productId} has been deleted.`
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


module.exports.deleteContainsRelationById = async (request, response) => {
    console.log('Delete Contains Relation by Id...');

    const id = request.params.id;
    const session = driver.session(config);

    try {
        const existingRelationshipQuery = `MATCH ()-[r:CONTAINS]->() WHERE r.odID=$id RETURN r`;
        const existingRelationshipParams =  {id: Number.parseInt(id)};
        const existingRelationshipResult = await session.readTransaction(tx => tx.run(existingRelationshipQuery, existingRelationshipParams));
        const existingRelationshipNode = existingRelationshipResult.records[0];

        if(!existingRelationshipNode) {
            response
                .status(404)
                .send({
                    message: `Not found CONTAINS relationship of ID: ${id}.`
                })
        }

        const query = `MATCH (o:Order)-[r:CONTAINS]->(p:Product) WHERE r.odID=$id DELETE r`;
        const params =  {id: Number.parseInt(id)};
        await session.writeTransaction(tx => tx.run(query, params));

        response
            .status(200)
            .send({
                id,
                message: `CONTAINS ${id} relationship has been deleted.`
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

module.exports.updateContainsRelationById = async (request, response) => {
    console.log('Update Contains Relation by Id...');

    const id = request.params.id;
    const session = driver.session(config);

    try {
        const existingRelationshipQuery = `MATCH ()-[r:CONTAINS]->() WHERE r.odID=$id RETURN r`;
        const existingRelationshipParams =  {id: Number.parseInt(id)};
        const existingRelationshipResult = await session.readTransaction(tx => tx.run(existingRelationshipQuery, existingRelationshipParams));
        const existingRelationshipNode = existingRelationshipResult.records[0];

        if(!existingRelationshipNode) {
            response
                .status(404)
                .send({
                    message: `Not found CONTAINS relationship of ID: ${id}.`
                })
        }

        const nodeDetails = { properties: request.body };

        const unitPrice = nodeDetails.properties.unitPrice;
        const quantity = nodeDetails.properties.quantity;
        const discount = nodeDetails.properties.discount;

        const bodyParsed = {
            "odID": Number.parseInt(id),
            "unitPrice" : Number.parseFloat(unitPrice),
            "quantity" : Number.parseInt(quantity),
            "discount" : Number.parseFloat(discount)
        }

        const query = `MERGE (o:Order)-[r:CONTAINS{odID:$id}]->(p:Product) SET r+=$properties RETURN r`;

        const params = {
            id: Number.parseInt(id),
            properties: bodyParsed
        };

        const result = await session.writeTransaction(tx => tx.run(query, params));
        const node = result.records[0];

        if (!node) throw new Error(`ERROR - The server was not able to update CONTAINS relationship of id ${id}.`);

        response
            .status(200)
            .send(node.get(0).properties);

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
