const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;
const uuid = require('uuid');

module.exports.getAllBelongsToRelations = async (request, response) => {
    console.log('Get all Belongs To relations...');

    const session = driver.session(config);

    try {
        const query = `MATCH a = (p)-[r:BELONGS_TO]->(c) RETURN a`;

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

module.exports.getBelongsToRelationsByProductCategory = async (request, response) => {
    console.log('Get Belongs To Relations between specific Product and Category...');

    const productId = request.params.product;
    const categoryId = request.params.category;
    const session = driver.session(config);

    try {
        const query = `MATCH (p:Product)-[r:BELONGS_TO]->(c:Category) WHERE p.id=$product AND c.id=$category RETURN r`;
        const params =  {product: Number.parseInt(productId), category: Number.parseInt(categoryId)};
        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0));

        if(nodes.length<1) {
            response
                .status(404)
                .send({
                    message: `Not found BELONGS TO relationship between Product: ${productId} and Category: ${categoryId}.`
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


module.exports.deleteBelongsToRelationsProductCategory = async (request, response) => {
    console.log('Delete Belongs To Relations by Product and Category Id...');

    const productId = request.params.product;
    const categoryId = request.params.category;
    const session = driver.session(config);

    try {

        const existingRelationshipQuery = `MATCH (p:Product)-[r:BELONGS_TO]->(c:Category) WHERE p.id=$product AND c.id=$category RETURN r`;
        const existingRelationshipParams =  {product: Number.parseInt(productId), category: Number.parseInt(categoryId)};
        const existingRelationshipResult = await session.readTransaction(tx => tx.run(existingRelationshipQuery, existingRelationshipParams));
        const existingRelationshipNodes = existingRelationshipResult.records.map(record => record.get(0));

        if(existingRelationshipNodes.length<1) {
            response
                .status(404)
                .send({
                    message: `Not found BELONGS TO relationship between Product: ${productId} and Category: ${productId}.`
                })
        }

        const query = `MATCH (p:Product)-[r:BELONGS_TO]->(c:Category) WHERE p.id=$product AND c.id=$category DELETE r`;
        const params =  {product: Number.parseInt(productId), category: Number.parseInt(categoryId)};
        await session.writeTransaction(tx => tx.run(query, params));

        response
            .status(200)
            .send({
                message: `BELONGS TO relationship between Product ${productId} and Category ${categoryId} has been deleted.`
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