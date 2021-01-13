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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

module.exports.getCustomersServedBySupplier = async (request, response) => {
    console.log('Get Customer served by Supplier...');

    const id = request.params.id;
    const from = request.params.from;
    const to = request.params.to;
    const session = driver.session(config);

    try{
        const suppliesQuery = `MATCH (supplier:Supplier)-[r:SUPPLIES]->(product:Product) WHERE supplier.id=$id RETURN product`;
        const suppliesParams =  {id: Number.parseInt(id) };

        const productsResult = await session.readTransaction(tx => tx.run(suppliesQuery,suppliesParams));
        const products = productsResult.records.map(record => record.get(0).properties.id.low);

        if (!products) throw new Error(`ERROR - The server was not able to get Products supplies by Supplier: ${id}.`);

        let orders =[];

        for(let i=0; i<products.length; i++){
            const containsQuery = `MATCH (order:Order)-[r:CONTAINS]->(product:Product) WHERE product.id=$id AND order.orderDate>=$from AND order.orderDate<=$to RETURN order`;
            let containsParams =  {
                id: Number.parseInt(products[i]),
                from: from,
                to: to
            };

            let productOrdersResult = await session.readTransaction(tx => tx.run(containsQuery,containsParams));
            let productOrders = productOrdersResult.records.map(record => record.get(0).properties.id.low);
            orders = orders.concat(productOrders);
        }

        let customers = [];

        for(let i=0; i<orders.length; i++){
            const orderedByQuery = `MATCH (order:Order)-[r:ORDERED_BY]->(customer:Customer) WHERE order.id=$id RETURN customer`;
            let orderedByParams =  {id: Number.parseInt(orders[i]) };
            let customersResult = await session.readTransaction(tx => tx.run(orderedByQuery,orderedByParams));
            let customersProperties = customersResult.records.map(record => record.get(0).properties.id);
            customers = customers.concat(customersProperties);
        }

        const unique = customers.filter((v, i, a) => a.indexOf(v) === i);

        response
            .status(200)
            .send({
                quantity: unique.length,
                unique
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


module.exports.getCustomersServedBySupplierOneQuery = async (request, response) => {
    console.log('Get Customer served by Supplier...');

    const id = request.params.id;
    const from = request.params.from;
    const to = request.params.to;
    const session = driver.session(config);

    try{
        const query = `MATCH (supplier:Supplier)-[rs:SUPPLIES]->(product:Product)<-[cr:CONTAINS]-(order:Order)-[or:ORDERED_BY]->(customer:Customer) WHERE supplier.id=$id AND order.orderDate >= $from AND order.orderDate <= $to RETURN customer`;
        const params =  {id: Number.parseInt(id), from: from, to: to };

        const result = await session.readTransaction(tx => tx.run(query,params));
        const nodes = result.records.map(record => record.get(0).properties.id);

        if (!nodes) throw new Error(`ERROR - The server was not able to get Customers which were served by Supplier: ${id}.`);

        const unique = nodes.filter((v, i, a) => a.indexOf(v) === i);

        response
            .status(200)
            .send({
                quantity: unique.length,
                unique
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

module.exports.getAllProductsPurchasedByCustomer=async (request, response)=>{

    console.log("For specific customer get list of all products purchased in specified range of dates");

    const customerID=request.params.customerID;
    const fromDate=request.query.from;
    const toDate=request.query.to;

    const session=driver.session(config);

    try{
        const query=
            `Match (c:Customer)-[:ORDERED_BY]-(o:Order)-[:CONTAINS]-(p:Product)
            WHERE c.id=$customerID and date(o.orderDate)>date(${fromDate}) and date(o.orderDate)<date(${toDate})
            return p`;
        const params={customerID};

        const result=await session.readTransaction(tx => tx.run(query, params));
        const products = result.records.map(record => record.get(0));

        if (!products) throw new Error(`The server was not able to get a list of products for specified customer.`);

        response
            .status(200)
            .send({
                products,
            });

    }catch(error){
        response
            .status(500)
            .send({
                error: error.message
            });
    }finally{
        await session.close();
    }
}

module.exports.getStatsForProduct = async (request, response) => {
    console.log('Get statistics for product...');
    const id = request.params.id;
    const session = driver.session(config);
    try{
        const query = `MATCH (o:Order)-[r:CONTAINS]->(p:Product) WHERE p.id=$id
                        RETURN p.name, 
                                sum(r.unitPrice * r.quantity), 
                                sum(r.quantity), 
                                avg(r.unitPrice), 
                                collect(DISTINCT o.shipCountry)`;
        const params =  {id: Number.parseInt(id)};

        const result = await session.readTransaction(tx => tx.run(query,params));
        const productName = result.records.map(record => record.get(0))[0];
        const totalIncome = result.records.map(record => record.get(1))[0];
        let totalUnitsSold = result.records.map(record => record.get(2))[0];
        if (totalUnitsSold.low) {
            totalUnitsSold = totalUnitsSold.low;
        }
        const averagePrice = result.records.map(record => record.get(3))[0];
        const countriesShipped = result.records.map(record => record.get(4));

        if (!totalIncome) throw new Error(`ERROR - The server was not able to get statistics for product: ${id}.`);

        response
            .status(200)
            .send({
                productName: productName,
                totalIncome: totalIncome,
                totalUnitsSold: totalUnitsSold,
                averagePrice: averagePrice,
                countriesShipped: countriesShipped
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

module.exports.getStatsForCategory = async (request, response) => {
    console.log('Get statistics for category...');
    const id = request.params.id;
    const session = driver.session(config);
    try{
        const statsQuery = `MATCH (o:Order)-[contains:CONTAINS]->(p:Product)-[belongs:BELONGS_TO]->(c:Category)
                        WHERE c.id=$id
                        RETURN c.name, 
                                sum(contains.unitPrice * contains.quantity),
                                sum(contains.quantity)`;
        const statsParams =  {id: Number.parseInt(id)};
        const statsResult = await session.readTransaction(tx => tx.run(statsQuery,statsParams));
        const categoryName = statsResult.records.map(record => record.get(0))[0];
        const totalIncome = statsResult.records.map(record => record.get(1))[0];
        let totalUnitsSold = statsResult.records.map(record => record.get(2))[0];
        if (totalUnitsSold.low) {
            totalUnitsSold = totalUnitsSold.low;
        }

        const mostSoldProductQuery = `MATCH (o:Order)-[contains:CONTAINS]->(p:Product)-[belongs:BELONGS_TO]->(c:Category)
                        WHERE c.id=$id
                        RETURN p.name,
                                sum(contains.quantity) as count ORDER BY count DESC`;
        const mostSoldProductParams =  {id: Number.parseInt(id)};
        const mostSoldProductRes = await session.readTransaction(tx => tx.run(mostSoldProductQuery,mostSoldProductParams));
        const mostSoldProduct = mostSoldProductRes.records.map(record => record.get(0))[0];
        let mostSoldProductUnitsSold = mostSoldProductRes.records.map(record => record.get(1))[0];
        if (mostSoldProductUnitsSold.low) {
            mostSoldProductUnitsSold = mostSoldProductUnitsSold.low;
        }

        response
            .status(200)
            .send({
                categoryName: categoryName,
                totalIncome: totalIncome,
                totalUnitsSold: totalUnitsSold,
                mostSoldProduct: mostSoldProduct,
                mostSoldProductUnitsSold: mostSoldProductUnitsSold
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