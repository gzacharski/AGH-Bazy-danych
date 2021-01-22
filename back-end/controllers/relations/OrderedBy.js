const driver = require('../../config/dbconfig').driver;
const config = require('../../config/dbconfig').config;
const uuid = require('uuid');

module.exports.getAllOrderedByRelations = async (request, response) => {
    console.log('Get all Ordered By relations...');

    const session = driver.session(config);

    try {
        const query = `MATCH ()-[r:ORDERED_BY]->() RETURN r`;

        const result = await session.readTransaction(tx => tx.run(query));
        const nodes = result.records.map(record => record.get(0));

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

module.exports.getOrderedByRelationsByOrderCustomer = async (request, response) => {
    console.log('Get Ordered By Relations between specific Order and Customer...');

    const orderId = request.params.order;
    const customerId = request.params.customer;
    const session = driver.session(config);

    try {
        const query = `MATCH (o:Order)-[r:ORDERED_BY]->(c:Customer) WHERE o.id=$order AND c.id=$customer RETURN r`;
        const params =  {order: Number.parseInt(orderId), customer: customerId};
        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0));

        if(nodes.length<1) {
            response
                .status(404)
                .send({
                    //quantity: nodes.length,
                    message: `Not found ORDERED BY relationship between Order: ${orderId} and Customer: ${customerId}.`
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

module.exports.deleteOrderedByRelationsOrderCustomer = async (request, response) => {
    console.log('Delete Ordered By Relations by Order and Customer Id...');

    const orderId = request.params.order;
    const customerId = request.params.customer;
    const session = driver.session(config);

    try {
        const existingRelationshipQuery = `MATCH (o:Order)-[r:ORDERED_BY]->(c:Customer) WHERE o.id=$order AND c.id=$customer RETURN r`;
        const existingRelationshipParams =  {order: Number.parseInt(orderId), customer: customerId};
        const existingRelationshipResult = await session.readTransaction(tx => tx.run(existingRelationshipQuery, existingRelationshipParams));
        const existingRelationshipNodes = existingRelationshipResult.records.map(record => record.get(0));

        if(existingRelationshipNodes.length<1) {
            response
                .status(404)
                .send({
                    quantity: nodes.length,
                    message: `Not found ORDERED BY relationship between Order: ${orderId} and Customer: ${customerId}.`
                })
        }

        const query = `MATCH (o:Order)-[r:ORDERED_BY]->(c:Customer) WHERE o.id=$order AND c.id=$customer DELETE r`;
        const params =  {order: Number.parseInt(orderId), customer: customerId};
        await session.writeTransaction(tx => tx.run(query, params));

        response
            .status(200)
            .send({
                message: `ORDERED BY relationship between Order ${orderId} and Customer ${customerId} has been deleted.`
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


//create order relation
module.exports.createOrderedByRelation = async (request, response) => {
    console.log('Create relation...');

    const customerId = request.params.customer;
    const orderId = request.params.order;
    const session = driver.session(config);
    const customerNodeLabel = 'Customer';
    const orderNodeLabel = 'Order';

    try {
        const existingOrderCustomersQuery = `MATCH (o:${orderNodeLabel})-[r:ORDERED_BY]-(c:${customerNodeLabel}) WHERE o.id = $id RETURN c`;
        const existingOrderCustomersParams =  {id: Number.parseInt(orderId)};
        const existingOrderCustomersResult = await session.writeTransaction(tx => tx.run(existingOrderCustomersQuery, existingOrderCustomersParams));
        const customersCount = existingOrderCustomersResult.records.length;

        if(customersCount != 0){
            const existingCustomer = existingOrderCustomersResult.records[0].get(0).properties.id;
            throw new Error(`ERROR - cannot create ORDERED BY relationship between Order: ${orderId} and Customer: ${customerId} Order: ${orderId} has already got Customer ${existingCustomer}.`);
        }

        const relationOrderQuery = `MATCH (o:${orderNodeLabel}),(c:${customerNodeLabel}) WHERE o.id = $order AND c.id =$customer CREATE (o)-[r:ORDERED_BY]->(c) RETURN type(r)`;

        const params =  {order: Number.parseInt(orderId), customer: customerId};
        const result = await session.writeTransaction(tx => tx.run(relationOrderQuery, params));
        const node = result.records[0];

        if (!node) throw new Error(`ERROR - cannot create ORDERED BY relationship between Order: ${orderId} and Customer: ${customerId} `);

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

module.exports.getCustomersWhoOrderedOrder = async (request, response) => {
    console.log('Get Customers Who ordered the Order...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (order:Order)-[r:ORDERED_BY]->(customer:Customer) WHERE order.id=$id RETURN customer`;
        const params =  {id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR -The server was not able to get Customers who ordered the Order: ${id}.`);

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

module.exports.getOrdersOrderedByCustomer = async (request, response) => {
    console.log('Get Orders ordered by Customer...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (order:Order)-[r:ORDERED_BY]->(customer:Customer) WHERE customer.id=$id RETURN order`;
        const params =  {id: id };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Order ordered by Customer: ${id}.`);

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