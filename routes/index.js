const express = require('express');
const router = express.Router();

const { health, getAll, getById, create, deleteById, updateById, createOrderedByRelation, getCustomersWhoOrderedOrder, getOrdersOrderedByCustomer,
        createSuppliesRelation, getProductSuppliedBySupplier, getSuppliersWhichSupplyProduct, createBelongsToRelation, getCategoriesAssignedToProduct,
        getProductsBelongToCategory, getAllContainsRelations, getContainsRelationById, createContainsRelation, getProductsContainedInOrder,
        getContainsRelationsByOrderProduct, getOrdersWhichContainProduct, deleteContainsRelationsOrderProduct, deleteContainsRelationById,
        updateContainsRelationById } = require('../controllers/Controller');
const { select } = require('../middlewares/switchToNode');

router.get('/health', health)

router.get('/api/customers', select, getAll);
router.get('/api/customers/:id', select, getById);
router.post('/api/customers', select, create);
router.put('/api/customers/:id', select, updateById);
router.delete('/api/customers/:id', select, deleteById);

router.get('/api/suppliers', select, getAll);
router.get('/api/suppliers/:id', select, getById);
router.post('/api/suppliers', select, create)
router.put('/api/suppliers/:id', select, updateById);
router.delete('/api/suppliers/:id', select, deleteById);

router.get('/api/products', select, getAll);
router.get('/api/products/:id', select, getById);
router.post('/api/products', select, create)
router.put('/api/products/:id', select, updateById);
router.delete('/api/products/:id', select, deleteById);

router.get('/api/shippers', select, getAll);
router.get('/api/shippers/:id', select, getById);
router.post('/api/shippers', select, create)
router.put('/api/shippers/:id', select, updateById);
router.delete('/api/shippers/:id', select, deleteById);

router.get('/api/orders', select, getAll);
router.get('/api/orders/:id', select, getById);
router.post('/api/orders', select, create)
router.put('/api/orders/:id', select, updateById);
router.delete('/api/orders/:id', select, deleteById);

router.get('/api/employees', select, getAll);
router.get('/api/employees/:id', select, getById);
router.post('/api/employees', select, create)
router.put('/api/employees/:id', select, updateById);
router.delete('/api/employees/:id', select, deleteById);

router.get('/api/categories', select, getAll);
router.get('/api/categories/:id', select, getById);
router.post('/api/categories', select, create)
router.put('/api/categories/:id', select, updateById);
router.delete('/api/categories/:id', select, deleteById);


router.post('/api/orders/:order/customers/:customer', select, createOrderedByRelation);
router.get('/api/orders/:id/customers', select, getCustomersWhoOrderedOrder);
router.get('/api/customers/:id/orders', select, getOrdersOrderedByCustomer);

router.post('/api/suppliers/:supplier/products/:product', select, createSuppliesRelation);
router.get('/api/suppliers/:id/products', select, getProductSuppliedBySupplier);
router.get('/api/products/:id/suppliers', select, getSuppliersWhichSupplyProduct);

router.post('/api/products/:product/categories/:category', select, createBelongsToRelation);
router.get('/api/products/:id/categories', select, getCategoriesAssignedToProduct);
router.get('/api/category/:id/products', select, getProductsBelongToCategory);

router.get('/api/orders/products/all', select, getAllContainsRelations);
router.get('/api/orders/products/:id', select, getContainsRelationById);
router.get('/api/orders/:order/products/:product', select, getContainsRelationsByOrderProduct);
router.post('/api/orders/:order/products/:product', select, createContainsRelation);
router.get('/api/orders/:id/products', select, getProductsContainedInOrder);
router.get('/api/products/:id/orders', select, getOrdersWhichContainProduct);
router.delete('/api/orders/:order/products/:product', select, deleteContainsRelationsOrderProduct);
router.delete('/api/orders/products/:id', select, deleteContainsRelationById);
router.put('/api/orders/products/:id', select, updateContainsRelationById);

module.exports = router;