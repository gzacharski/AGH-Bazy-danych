const driver = require('../../config/dbconfig').driver;
const config = require('../../config/dbconfig').config;
const uuid = require('uuid');
const {uniqWith,isEqual}=require("lodash");

const productExists = async (productID) => {

    const session = driver.session(config);
    let exists;

    try {
        const checkQuery = 
            `MATCH (p:Product) 
            WHERE p.id=$id 
            RETURN p`;

        const params = { id: Number.parseInt(productID) };

        const result = await session.readTransaction(tx => tx.run(checkQuery, params));

        exists = result.records.length !== 0 && result.records[0].get(0).properties.id.low === Number.parseInt(productID);

    } finally {
        await session.close();
    }

    return exists;
}

module.exports.createProduct = async (request, response) => {
    console.log("Creating new Product...");

    const session = driver.session(config);
    const { categories, product, supplier } = request.body;

    try {
        const query =
            `CREATE (p:Product)
            SET p.id=id(p),
                p.name=$product.name,
                p.quantityPerUnit=$product.quantityPerUnit,
                p.unitPrice=toFloat($product.unitPrice),
                p.unitsInStock=toInteger($product.unitsInStock),
                p.unitsOnOrder=toInteger($product.unitsOnOrder),
                p.reorderLevel=toInteger($product.reorderLevel),
                p.discontinued=toInteger($product.discontinued)
            WITH p
            UNWIND $categories as category
            MATCH (c:Category), (s:Supplier)
            WHERE c.id=category.id.low and s.id=$supplierID
            MERGE (s)-[:SUPPLIES]->(p)
            MERGE (p)-[:BELONGS_TO]->(c)
            RETURN s,p,c`;

        const params = {
            categories,
            supplierID: supplier.id.low,
            product 
        }

        const result = await session.writeTransaction(tx => tx.run(query, params));

        const records = result.records.map(record => record._fields);

        const theProduct =records[0]
            .filter(node=>node.labels.includes('Product'))[0]
            .properties;

        const theSupplier =records[0]
            .filter(node=>node.labels.includes('Supplier'))[0]
            .properties;

        const theCategories=uniqWith(records
            .map(record=>record.filter(node=>node.labels.includes('Category')))
            .map(item=>item[0].properties),isEqual);

        response
            .status(201)
            .send({
                categories: theCategories,
                product: theProduct,
                supplier: theSupplier
            });

    } catch (error) {
        console.log(error);
        response
            .status(500)
            .send({
                error: error.message
            })
    } finally {
        await session.close();
    }
}

module.exports.getProduct=async (request, response) => {

    const session = driver.session(config);
    const productID = request.params.id;
    
    try {
        if (!await productExists(productID)) {
            response
                .status(404)
                .send({
                    message: `There is no product with provided id: ${productID}`
                });
        } else {
            const query = 
                `MATCH (s:Supplier)-[:SUPPLIES]->(p:Product)-[:BELONGS_TO]->(c:Category) 
                WHERE p.id=$id 
                RETURN s,p,c`;
            const params = { id: Number.parseInt(productID) };

            const result = await session.readTransaction(tx => tx.run(query, params));
            const records = result.records.map(record => record._fields);

            if (!result) throw new Error(`The server was not able to get a product.`);

            const theProduct =records[0]
                .filter(node=>node.labels.includes('Product'))[0]
                .properties;

            const theSupplier =records[0]
                .filter(node=>node.labels.includes('Supplier'))[0]
                .properties;

            const theCategories=uniqWith(records
                .map(record=>record.filter(node=>node.labels.includes('Category')))
                .map(item=>item[0].properties),isEqual);

            response
                .status(200)
                .send({
                    categories: theCategories,
                    product: theProduct,
                    supplier: theSupplier
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

module.exports.updateProduct=async (request, response) => {

    console.log("Updating product...");

    const session = driver.session(config);
    const { categories, product, supplier } = request.body;
    const productID = Number.parseInt(request.params.id);

    try {
        if (!await productExists(productID)) {
            response
                .status(404)
                .send({
                    message: `There is no product with provided id: ${productID}`
                });
        } else {

            //spliting one query beaceuse of cartesian output
            const query =
                `MATCH (:Supplier)-[supplies:SUPPLIES]->(p:Product)-[belongs_to:BELONGS_TO]->(:Category) 
                WHERE p.id=$productID
                DELETE supplies,belongs_to
                WITH p
                UNWIND $categories as category
                MATCH (s:Supplier), (c:Category)
                WHERE c.id=category.id.low and s.id=$supplier.id.low
                MERGE (s)-[:SUPPLIES]->(p)
                SET p.name=$product.name,
                    p.quantityPerUnit=$product.quantityPerUnit,
                    p.unitPrice=toFloat($product.unitPrice),
                    p.unitsInStock=toInteger($product.unitsInStock),
                    p.unitsOnOrder=toInteger($product.unitsOnOrder),
                    p.reorderLevel=toInteger($product.reorderLevel),
                    p.discontinued=toInteger($product.discontinued)
                MERGE (p)-[:BELONGS_TO]->(c)
                RETURN s,p,c`;

            const params = { productID, categories, supplier, product };
            const result = await session.writeTransaction(tx => tx.run(query, params));
            
            const records = result.records.map(record => record._fields);

            const theProduct =records[0]
                .filter(node=>node.labels.includes('Product'))[0]
                .properties;

            const theSupplier =records[0]
                .filter(node=>node.labels.includes('Supplier'))[0]
                .properties;

            const theCategories=uniqWith(records
                .map(record=>record.filter(node=>node.labels.includes('Category')))
                .map(item=>item[0].properties),isEqual);
                
            response
                .status(201)
                .send({
                    categories: theCategories,
                    product: theProduct,
                    supplier: theSupplier
                });
        }
    } catch (error) {
        console.log(error);
        response
            .status(500)
            .send({
                error: error.message
            })
    } finally {
        await session.close();
    }
}

module.exports.deleteProduct=async (request, response) => {
    console.log("Deleting product by ID...");

    const session = driver.session(config);
    const productID = request.params.id;

    try{
        if (!await productExists(productID)) {
            response
                .status(404)
                .send({
                    message: `There is no product with provided id: ${productID}`
                });
        }else{
            const query = 
                `MATCH (p:Product) 
                WHERE p.id=$id 
                DETACH DELETE p`;

            const params = {id: Number.parseInt(productID)};

            const result=await session.writeTransaction(tx => tx.run(query, params));

            if(Array.isArray(result.records) && result.records.length==0){
                response
                .status(200)
                .send({
                    id : productID,
                    message: "Product has been deleted."
                });
            }else{
                throw new Error(`The server was not able to delete the product ID=${productID}.`);
            }
        }
    } catch (error) {
        console.log(error);
        response
            .status(500)
            .send({
                error: error.message
            })
    } finally {
        await session.close();
    }
}