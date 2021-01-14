const driver = require('../../config/dbconfig').driver;
const config = require('../../config/dbconfig').config;
const uuid = require('uuid');

module.exports.createProduct = async (request, response) => {
    console.log("Creating new Product...");

    const session = driver.session(config);
    const { categories, product, supplier } = request.body;

    try {
        const query =
        `UNWIND $categories as category
        MATCH (c:Category), (s:Supplier)
        WHERE c.id=category.id.low and s.id=$supplierID
        MERGE (s)-[:SUPPLIES]->(p:Product)
        SET p.id=id(p),
            p.name=$product.name,
            p.quantityPerUnit=$product.quantityPerUnit,
            p.unitPrice=toFloat($product.unitPrice),
            p.unitsInStock=toInteger($product.unitsInStock),
            p.unitsOnOrder=toInteger($product.unitsOnOrder),
            p.reorderLevel=toInteger($product.reorderLevel),
            p.discontinued=toInteger($product.discontinued)
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

        const theCategories=records
            .map(record=>record.filter(node=>node.labels.includes('Category')))
            .map(item=>item[0].properties);

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