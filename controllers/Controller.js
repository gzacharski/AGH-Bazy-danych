
const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;

module.exports.getAll = async (request, response) => {

    console.log('Get all supplies...');
    const session = driver.session(config);

    const node_label = request.get('node_label');
    console.log(node_label);

    try {
        if (!node_label) throw new Error("Node label has not been specified.");

        const query = `MATCH (s:${node_label}) RETURN s`;
        console.log(query);

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
            .send({
                message: error.message
            });

    } finally {
        await session.close();
    }
}