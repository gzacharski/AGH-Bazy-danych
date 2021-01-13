const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;
const uuid = require('uuid');

const nodeExists = async (id, label) => {

    const session = driver.session(config);
    let exists;

    try {
        const checkQuery = `MATCH (n:${label}) WHERE n.id=$id RETURN n`;
        const params = (label === 'Customer') ? { id } : { id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(checkQuery, params));

        if (label === 'Customer') {
            exists = result.records.length !== 0 && result.records[0].get(0).properties.id === id;
        } else {
            exists = result.records.length !== 0 && result.records[0].get(0).properties.id.low === Number.parseInt(id);
        }

    } finally {
        await session.close();
    }

    return exists;
}

module.exports.createProductOrder = async (request, response) => {
    console.log('Create product order...');

    const customerId = request.params.customer;
    const productId = request.params.product;
    const nodeDetails = { properties: request.body };

    const session = driver.session(config);

    const nodeLabelCustomer = 'Customer';
    const nodeLabelProduct = 'Product';

    try {
        //check if customer exists
        if (!await nodeExists(customerId, nodeLabelCustomer)) {
            response
                .status(404)
                .send({
                    message: `There is no ${nodeLabelCustomer} with provided id: ${customerId}`
                });
        }

        //check if product exists
        if (!await nodeExists(productId, nodeLabelProduct)) {
            response
                .status(404)
                .send({
                    message: `There is no ${nodeLabelProduct} with provided id: ${productId}`
                });
        }
        //create new order
        let orderId = nodeDetails.properties.id;
        if (!orderId) orderId = Number.parseInt(uuid.v4(), 16);
        const orderDate = nodeDetails.properties.unitPrice;
        const requiredDate = nodeDetails.properties.requiredDate;
        const shippedDate = nodeDetails.properties.shippedDate;
        const freight = nodeDetails.properties.freight;
        const shipName = nodeDetails.properties.shipName;
        const shipAddress = nodeDetails.properties.shipAddress;
        const shipCity = nodeDetails.properties.shipCity;
        const shipPostalCode = nodeDetails.properties.shipPostalCode;
        const shipCountry = nodeDetails.properties.shipCountry;

        const orderBodyParsed = {
            "orderDate": orderDate,
            "requiredDate": requiredDate,
            "shippedDate": shippedDate,
            "freight": Number.parseInt(freight),
            "shipName": shipName,
            "shipAddress": shipAddress,
            "shipCity": shipCity,
            "shipPostalCode": shipPostalCode,
            "shipCountry": shipCountry
        }

        const nodeLabelOrder = 'Order';

        let createOrderQuery = `CREATE (n:${nodeLabelOrder}) SET n+=$properties, n.id=${orderId} RETURN n`;

        const orderParams = {
            properties: orderBodyParsed
        };

        const orderResult = await session.writeTransaction(tx => tx.run(createOrderQuery, orderParams));
        const orderNode = orderResult.records[0];

        if (!orderNode) {
            response
                .status(400)
                .send({
                    message: `The server was not able to register a new ${nodeLabelOrder}.`
                });
        }

        //create contains relation
        let orderDetailsId = nodeDetails.properties.odId;
        if (!orderDetailsId) orderDetailsId = nodeDetails.properties.odId = Number.parseInt(uuid.v4(), 16);
        const unitPrice = nodeDetails.properties.unitPrice;
        const quantity = nodeDetails.properties.quantity;
        const discount = nodeDetails.properties.discount;

        const orderDetailsBodyParsed = {
            "odID": orderDetailsId,
            "unitPrice": Number.parseFloat(unitPrice),
            "quantity": Number.parseInt(quantity),
            "discount": Number.parseFloat(discount)
        }

        const containsSuppliesQuery = `MATCH (o:${nodeLabelOrder}),(p:${nodeLabelProduct}) WHERE o.id = $order AND p.id = $product CREATE (o)-[r:CONTAINS]->(p) SET r+=$properties RETURN type(r)`;

        const orderDetailsParams = {
            order: Number.parseInt(orderId),
            product: Number.parseInt(productId),
            properties: orderDetailsBodyParsed
        };

        const containsResult = await session.writeTransaction(tx => tx.run(containsSuppliesQuery, orderDetailsParams));
        const containsNode = containsResult.records[0];

        if (!containsNode) throw new Error(`ERROR - cannot create CONTAINS relationship between Order: ${orderId} and Product: ${productId}.`);

        //create ordered by relation
        const existingOrderCustomersQuery = `MATCH (o:${nodeLabelOrder})-[r:ORDERED_BY]-(c:${nodeLabelCustomer}) WHERE o.id = $id RETURN c`;
        const existingOrderCustomersParams =  {id: Number.parseInt(orderId)};
        const existingOrderCustomersResult = await session.writeTransaction(tx => tx.run(existingOrderCustomersQuery, existingOrderCustomersParams));
        const customersCount = existingOrderCustomersResult.records.length;

        if(customersCount != 0){
            const existingCustomer = existingOrderCustomersResult.records[0].get(0).properties.id;
            throw new Error(`ERROR - cannot create ORDERED BY relationship between Order: ${orderId} and Customer: ${customerId} Order: ${orderId} has already got Customer ${existingCustomer}.`);
        }

        const relationOrderQuery = `MATCH (o:${nodeLabelOrder}),(c:${nodeLabelCustomer}) WHERE o.id = $order AND c.id =$customer CREATE (o)-[r:ORDERED_BY]->(c) RETURN type(r)`;

        const orderedByParams =  {order: Number.parseInt(orderId), customer: customerId};
        const orderedByResult = await session.writeTransaction(tx => tx.run(relationOrderQuery, orderedByParams));
        const orderedByNode = orderedByResult.records[0];

        if (!orderedByNode) throw new Error(`ERROR - cannot create ORDERED BY relationship between Order: ${orderId} and Customer: ${customerId} `);

        response
            .status(201)
            .send({
                message: `New Product Order has been created. Order no: ${orderId}, Product no: ${productId}, Customer ${customerId}`,
                orderBodyParsed,
                containsNode,
                orderedByNode,
                orderDetailsParams
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

module.exports.getOrderCrud = async (request, response) => {
    console.log('Get all Orders CRUD...');

    const session = driver.session(config);

    try{
        const query = `MATCH (customer:Customer)<-[obr:ORDERED_BY]-(order:Order)-[cr:CONTAINS]->(product:Product) RETURN customer, order, cr, product`;

        const result = await session.readTransaction(tx => tx.run(query));
        const nodes = result.records;

        if (!nodes) throw new Error(`ERROR - The server was not able to get Orders with related Customers and Products (and other details).`);

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

module.exports.getOrderCrudCustomer = async (request, response) => {
    console.log('Get all Orders of Customer CRUD...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (customer:Customer)<-[obr:ORDERED_BY]-(order:Order)-[cr:CONTAINS]->(product:Product) WHERE customer.id=$id RETURN order, cr, product`;
        const params =  {id: id };
        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records;

        if (!nodes) throw new Error(`ERROR - The server was not able to get Orders and related Products (and other details) for specific Customer of id ${id}.`);

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


module.exports.createOrderCrud = async (request, response) => {
    console.log('Create Order CRUD...');

    const session = driver.session(config);

    try {
        let query, nodeDetails = { properties: request.body };

        query = `MATCH (customer:Customer), (product:Product) WHERE customer.id=$customerId AND product.id=$productId CREATE (customer)<-[obr:ORDERED_BY]-(order:Order)-[cr:CONTAINS]->(product) SET order+=$orderProperties, order.id=$orderId, cr+=$orderDetailsProperties RETURN customer, order, cr, product`

        const customerId = nodeDetails.properties.customerId;
        const productId = nodeDetails.properties.productId;

        const orderId = Number.parseInt(uuid.v4(),16);
        const orderDate = nodeDetails.properties.unitPrice;
        const requiredDate = nodeDetails.properties.requiredDate;
        const shippedDate = nodeDetails.properties.shippedDate;
        const freight = nodeDetails.properties.freight;
        const shipName = nodeDetails.properties.shipName;
        const shipAddress = nodeDetails.properties.shipAddress;
        const shipCity = nodeDetails.properties.shipCity;
        const shipPostalCode = nodeDetails.properties.shipPostalCode;
        const shipCountry = nodeDetails.properties.shipCountry;

        const orderBodyParsed = {
            "orderDate": orderDate,
            "requiredDate": requiredDate,
            "shippedDate": shippedDate,
            "freight": Number.parseInt(freight),
            "shipName": shipName,
            "shipAddress": shipAddress,
            "shipCity": shipCity,
            "shipPostalCode": shipPostalCode,
            "shipCountry": shipCountry
        }

        const orderDetailsId = Number.parseInt(uuid.v4(),16);
        const unitPrice = nodeDetails.properties.unitPrice;
        const quantity = nodeDetails.properties.quantity;
        const discount = nodeDetails.properties.discount;

        const orderDetailsBodyParsed = {
            "odID": orderDetailsId,
            "unitPrice": Number.parseFloat(unitPrice),
            "quantity": Number.parseInt(quantity),
            "discount": Number.parseFloat(discount)
        }

        const orderParams = {
            customerId: customerId,
            productId: productId,
            orderId: orderId,
            orderProperties: orderBodyParsed,
            orderDetailsProperties: orderDetailsBodyParsed
        };

        if (await nodeExists(orderId, 'Order')) throw new Error(`There is an existing Order with provided id: ${orderId}`);

        const result = await session.writeTransaction(tx => tx.run(query, orderParams));
        const nodes = result.records;

        if (!nodes) throw new Error(`The server was not able to register a new Order.`);

        response
            .status(201)
            .send(nodes);

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

module.exports.deleteOrderCrudById = async (request, response) => {
    console.log('Delete Order by Id CRUD...');

    const id = request.params.id;
    const session = driver.session(config);

    try {
        const query = `MATCH (customer:Customer)<-[obr:ORDERED_BY]-(order:Order)-[cr:CONTAINS]->(product:Product) WHERE order.id=$id DETACH DELETE obr, order, cr`;
        const params =  {id: Number.parseInt(id)};
        await session.writeTransaction(tx => tx.run(query, params));

        response
            .status(200)
            .send({
                id,
                message: `Order ${id} has been deleted.`
            });
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