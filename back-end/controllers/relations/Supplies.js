const driver = require('../../config/dbconfig').driver;
const config = require('../../config/dbconfig').config;
const uuid = require('uuid');

module.exports.getAllSuppliesRelations = async (request, response) => {
    console.log('Get All Supplies Relations (between Supplier and Product)...');

    const session = driver.session(config);

    try {
        const query = `MATCH p=()-[r:SUPPLIES]->() RETURN p`;

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

module.exports.getSuppliesRelationsBySupplierProduct = async (request, response) => {
    console.log('Get Supplies Relations between specific Supplier and Product...');

    const supplierId = request.params.supplier;
    const productId = request.params.product;
    const session = driver.session(config);

    try {
        const query = `MATCH (s:Supplier)-[r:SUPPLIES]->(p:Product) WHERE s.id=$supplier AND p.id=$product RETURN r`;
        const params =  {supplier: Number.parseInt(supplierId), product: Number.parseInt(productId)};
        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0));

        if(nodes.length<1) {
            response
                .status(404)
                .send({
                    message: `Not found SUPPLIES relationship between Supplier: ${supplierId} and Product: ${productId}.`
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


module.exports.deleteSuppliesRelationsSupplierProduct = async (request, response) => {
    console.log('Delete Supplies Relations by Supplier and Product Id...');

    const supplierId = request.params.supplier;
    const productId = request.params.product;
    const session = driver.session(config);

    try {

        const existingRelationshipQuery = `MATCH (s:Supplier)-[r:SUPPLIES]->(p:Product) WHERE s.id=$supplier AND p.id=$product RETURN r`;
        const existingRelationshipParams =  {supplier: Number.parseInt(supplierId), product: Number.parseInt(productId)};
        const existingRelationshipResult = await session.readTransaction(tx => tx.run(existingRelationshipQuery, existingRelationshipParams));
        const existingRelationshipNodes = existingRelationshipResult.records.map(record => record.get(0));

        if(existingRelationshipNodes.length<1) {
            response
                .status(404)
                .send({
                    message: `Not found SUPPLIES relationship between Supplier: ${supplierId} and Product: ${productId}.`
                })
        }

        const query = `MATCH (s:Supplier)-[r:SUPPLIES]->(p:Product) WHERE s.id=$supplier AND p.id=$product DELETE r`;
        const params =  {supplier: Number.parseInt(supplierId), product: Number.parseInt(productId)};
        await session.writeTransaction(tx => tx.run(query, params));

        response
            .status(200)
            .send({
                message: `SUPPLIES relationship between Supplier ${supplierId} and Product ${productId} has been deleted.`
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