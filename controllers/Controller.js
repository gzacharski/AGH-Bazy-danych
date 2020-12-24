
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

module.exports.health = async (request, response) => {
    response.status(200).send("ok")
}

module.exports.getAll = async (request, response) => {

    console.log('Get all ...');
    const session = driver.session(config);

    const node_label = request.get('node_label');

    try {
        if (!node_label) throw new Error("Node label has not been specified.");

        const query = `MATCH (n:${node_label}) RETURN n`;

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
            const params = (node_label === 'Customer') ? { id } : { id: Number.parseInt(id) };

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
            .send({
                error: error.message
            });
    } finally {
        await session.close();
    }
}


module.exports.create = async (request, response) => {
    console.log('Create ...');

    const node_label = request.get('node_label');
    const session = driver.session(config);

    try {
        let query, nodeDetails = { properties: request.body };

        if (node_label === 'Customer') {
            query = `CREATE (n:${node_label}) SET n+=$properties RETURN n;`

            let id = nodeDetails.properties.id;

            if (!id) id = nodeDetails.properties.id = uuid.v4();
            if (await nodeExists(id, node_label)) throw new Error(`There is a customer with provided id: ${id}`);
        } else {
            query = `CREATE (n:${node_label}) SET n+=$properties, n.id=id(n) RETURN n;`;
        }

        const result = await session.writeTransaction(tx => tx.run(query, nodeDetails));
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

    const session = driver.session(config);
    const node_label = request.get('node_label');
    const id = (node_label==='Customer')?request.params.id:Number.parseInt(request.params.id);

    try {
        if (!await nodeExists(id, node_label)) {
            response
                .status(404)
                .send({
                    message: `There is no ${node_label} with provided id: ${id}`
                });

        } else {
            const query = `MERGE (n:${node_label} {id:$id}) SET n+=$properties RETURN n;`;
            const params = {
                id: (node_label==='Customer')?id:Number.parseInt(id),
                properties: request.body
            };

            const result = await session.writeTransaction(tx => tx.run(query, params));
            const node = result.records[0];

            if (!node) throw new Error(`The server was not able to update the ${node_label}.`);

            response
                .status(200)
                .send(node.get(0).properties);
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
            const query = `MATCH (n:${node_label}) WHERE n.id=$id DETACH DELETE n;`;
            const params = {
                id: (node_label==='Customer')?id:Number.parseInt(id),
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


//create supplies relation
module.exports.createSuppliesRelation = async (request, response) => {
    console.log('Create supplies relation...');

    const supplierId = request.params.supplier;
    const productId = request.params.product;
    const session = driver.session(config);
    const supplierNodeLabel = 'Supplier';
    const productNodeLabel = 'Product';

    try {
        const existingProductSuppliersQuery = `MATCH (s:${supplierNodeLabel})-[r:SUPPLIES]-(p:${productNodeLabel}) WHERE p.id = $id RETURN s`;
        const existingProductSuppliersParams =  {id: Number.parseInt(productId)};
        const existingProductSuppliersResult = await session.writeTransaction(tx => tx.run(existingProductSuppliersQuery, existingProductSuppliersParams));
        const suppliersCount = existingProductSuppliersResult.records.length;
        if(suppliersCount != 0) {
            const existingSupplier = existingProductSuppliersResult.records[0].get(0).properties.id;
            throw new Error(`ERROR - cannot create SUPPLIES relationship between supplier: ${supplierId} and product: ${productId}. Product: ${productId} has already got Supplier ${existingSupplier}.`);
        }

        const relationSuppliesQuery = `MATCH (s:${supplierNodeLabel}),(p:${productNodeLabel}) WHERE s.id = $supplier AND p.id = $product CREATE (s)-[r:SUPPLIES]->(p) RETURN type(r)`;

        const params =  {supplier: Number.parseInt(supplierId), product:  Number.parseInt(productId)};
        const result = await session.writeTransaction(tx => tx.run(relationSuppliesQuery,params));
        const node = result.records[0];

        if (!node) throw new Error(`ERROR - cannot create SUPPLIES relationship between supplier: ${supplierId} and product: ${productId} `);

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

module.exports.getProductSuppliedBySupplier = async (request, response) => {
    console.log('Get Products supplied by Supplier...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (supplier:Supplier)-[r:SUPPLIES]->(product:Product) WHERE supplier.id=$id RETURN product`;
        const params =  {id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Products supplies by Supplier: ${id}.`);

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

module.exports.getSuppliersWhichSupplyProduct = async (request, response) => {
    console.log('Get Products supplied by Supplier...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (supplier:Supplier)-[r:SUPPLIES]->(product:Product) WHERE product.id=$id RETURN supplier`;
        const params =  {id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(query, params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Suppliers which supply Product: ${id}.`);

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

//create belongs to relation
module.exports.createBelongsToRelation = async (request, response) => {
    console.log('Create belongs to relation...');

    const productId = request.params.product;
    const categoryId = request.params.category;
    const session = driver.session(config);
    const productNodeLabel = 'Product';
    const categoryNodeLabel = 'Category';

    try {
        const existingProductCategoriesQuery = `MATCH (p:${productNodeLabel})-[r:BELONGS_TO]-(c:${categoryNodeLabel}) WHERE p.id = $id RETURN c`;
        const existingProductCategoriesParams =  {id: Number.parseInt(productId)};
        const existingProductCategoriesResult = await session.writeTransaction(tx => tx.run(existingProductCategoriesQuery, existingProductCategoriesParams));
        const categoriesCount = existingProductCategoriesResult.records.length;
        if(categoriesCount  != 0) {
            const existingCategory = existingProductCategoriesResult .records[0].get(0).properties.id;
            throw new Error(`ERROR - cannot create BELONGS TO relationship between Product: ${productId} and Category: ${categoryId}. Product: ${productId} has already got Category ${existingCategory}.`);
        }

        const belongsToSuppliesQuery = `MATCH (p:${productNodeLabel}),(c:${categoryNodeLabel}) WHERE p.id = $product AND c.id = $category CREATE (p)-[r:BELONGS_TO]->(c) RETURN type(r)`;

        const params =  {product: Number.parseInt(productId), category: Number.parseInt(categoryId)};
        const result = await session.writeTransaction(tx => tx.run(belongsToSuppliesQuery,params));
        const node = result.records[0];

        if (!node) throw new Error(`ERROR - cannot create BELONGS TO relationship between Product: ${productId} and Category: ${categoryId}.`);

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

module.exports.getCategoriesAssignedToProduct = async (request, response) => {
    console.log('Get Categories which product is assigned to...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (product:Product)-[r:BELONGS_TO]->(category:Category) WHERE product.id=$id RETURN category`;
        const params =  {id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Categories for which belongs Product: ${id}.`);

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

module.exports.getProductsBelongToCategory = async (request, response) => {
    console.log('Get Products which belong to Category...');

    const id = request.params.id;
    const session = driver.session(config);

    try{
        const query = `MATCH (product:Product)-[r:BELONGS_TO]->(category:Category) WHERE category.id=$id RETURN product`;
        const params =  {id: Number.parseInt(id) };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Products which belong to Product: ${id}.`);

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
                    quantity: nodes.length,
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