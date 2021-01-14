const express = require('express');
const router = express.Router();

const {
    getCustomersServedBySupplier,
    getCustomersServedBySupplierOneQuery,
    getAllProductsPurchasedByCustomer,
    getStatsForCategory,
    getStatsForProduct,
} = require("../controllers/Statistics");
const { select } = require('../middlewares/switchToNode');
const {test}=require('../controllers/Test');

router.post('/test',test);

//For specific customer get list of all products purchased in specified range of dates
//np. api/products/customers/ALFKI/orders?from="2007-01-01"&to="2007-01-31"
router.get('/products/customers/:customerID/orders',getAllProductsPurchasedByCustomer);

router.get('/products/:id', select, getStatsForProduct)
router.get('/categories/:id', select, getStatsForCategory)

router.get('/suppliers/:id/customers/:from/:to/manyqueries', select, getCustomersServedBySupplier);
router.get('/suppliers/:id/customers/:from/:to/onequery', select, getCustomersServedBySupplierOneQuery);

module.exports=router;