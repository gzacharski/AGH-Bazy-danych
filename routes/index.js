const express = require('express');
const router = express.Router();

const {
  getAll,
  getById,
  create,
  deleteById,
  updateById,
} = require("../controllers/nodes/SimpleCrud");
const {
  getAllOrderedByRelations,
  getOrderedByRelationsByOrderCustomer,
  createOrderedByRelation,
  getCustomersWhoOrderedOrder,
  getOrdersOrderedByCustomer,
  deleteOrderedByRelationsOrderCustomer,
} = require("../controllers/relations/OrderedBy");
const {
  createSuppliesRelation,
  deleteSuppliesRelationsSupplierProduct,
  getAllSuppliesRelations,
  getSuppliesRelationsBySupplierProduct,
  getProductSuppliedBySupplier,
  getSuppliersWhichSupplyProduct,
} = require("../controllers/relations/Supplies");
const {
  createBelongsToRelation,
  getAllBelongsToRelations,
  getBelongsToRelationsByProductCategory,
  deleteBelongsToRelationsProductCategory,
  getCategoriesAssignedToProduct,
  getProductsBelongToCategory,
} = require("../controllers/relations/BelongsTo");
const {
  getAllContainsRelations,
  getContainsRelationById,
  createContainsRelation,
  getProductsContainedInOrder,
  getContainsRelationsByOrderProduct,
  getOrdersWhichContainProduct,
  deleteContainsRelationsOrderProduct,
  deleteContainsRelationById,
  updateContainsRelationById,
} = require("../controllers/relations/Contains");
const {
  createProductOrder,
  createOrderCrudOneProduct,
  getOrderCrud,
  getOrderCrudCustomer,
  createOrderCrud,
  deleteOrderCrudById,
  getCustomerOrderDetailsByOrderId,
} = require("../controllers/nodes/Order");

const { health } = require("../controllers/Controller");

const { select } = require('../middlewares/switchToNode');
const {delay}=require('../middlewares/delayRequest');
const {test}=require('../controllers/TestRequestResponse');
const {createProduct}=require('../controllers/nodes/Product');

router.post('/api/test',delay,createProduct);

router.get('/health', health)

//simple CRUD
router.get('/api/customers',delay, select, getAll);
router.get('/api/customers/:id', delay, select, getById);
router.post('/api/customers',delay, select, create);
router.put('/api/customers/:id',delay, select, updateById);
router.delete('/api/customers/:id',delay, select, deleteById);

router.get('/api/categories', delay, select, getAll);
router.get('/api/categories/:id',delay, select, getById);
router.post('/api/categories', delay,select, create);
router.put('/api/categories/:id', delay, select, updateById);
router.delete('/api/categories/:id',delay, select, deleteById);

router.get('/api/suppliers',delay, select, getAll);
router.get('/api/suppliers/:id', delay, select, getById);
router.post('/api/suppliers',delay, select, create)
router.put('/api/suppliers/:id', delay, select, updateById);
router.delete('/api/suppliers/:id',delay, select, deleteById);

//advanced CRUD
router.get('/api/products', select, getAll);
router.get('/api/products/:id', select, getById);
router.post('/api/products', select, create)
router.put('/api/products/:id', select, updateById);
router.delete('/api/products/:id', select, deleteById);

router.get('/api/orders/old', select, getAll);
router.get('/api/orders/:id', select, getById);
router.post('/api/orders/old', select, create)
router.put('/api/orders/:id', select, updateById);
router.delete('/api/orders/:id/old', select, deleteById);



router.get('/api/orders/customers/all', select, getAllOrderedByRelations);
router.get('/api/orders/:order/customers/:customer', select, getOrderedByRelationsByOrderCustomer);
router.post('/api/orders/:order/customers/:customer', select, createOrderedByRelation);
router.get('/api/orders/:id/customers', select, getCustomersWhoOrderedOrder);
router.get('/api/customers/:id/orders', select, getOrdersOrderedByCustomer);
router.delete('/api/orders/:order/customers/:customer', select, deleteOrderedByRelationsOrderCustomer);

router.get('/api/suppliers/products/all', select, getAllSuppliesRelations);
router.get('/api/suppliers/:supplier/products/:product', select, getSuppliesRelationsBySupplierProduct);
router.post('/api/suppliers/:supplier/products/:product', select, createSuppliesRelation);
router.get('/api/suppliers/:id/products', select, getProductSuppliedBySupplier);
router.get('/api/products/:id/suppliers', select, getSuppliersWhichSupplyProduct);
router.delete('/api/suppliers/:supplier/products/:product', select, deleteSuppliesRelationsSupplierProduct);

router.get('/api/products/categories/all', select, getAllBelongsToRelations);
router.get('/api/products/:product/categories/:category', select, getBelongsToRelationsByProductCategory);
router.post('/api/products/:product/categories/:category', select, createBelongsToRelation);
router.get('/api/products/:id/categories', select, getCategoriesAssignedToProduct);
router.get('/api/category/:id/products', select, getProductsBelongToCategory);
router.delete('/api/products/:product/categories/:category', select, deleteBelongsToRelationsProductCategory);

router.get('/api/orders/products/all', select, getAllContainsRelations);
router.get('/api/orders/products/:id', select, getContainsRelationById);
router.get('/api/orders/:order/products/:product', select, getContainsRelationsByOrderProduct);
router.post('/api/orders/:order/products/:product', select, createContainsRelation);
router.get('/api/orders/:id/products', select, getProductsContainedInOrder);
router.get('/api/products/:id/orders', select, getOrdersWhichContainProduct);
router.delete('/api/orders/:order/products/:product', select, deleteContainsRelationsOrderProduct);
router.delete('/api/orders/products/:id', select, deleteContainsRelationById);
router.put('/api/orders/products/:id', select, updateContainsRelationById);

router.post('/api/customers/:customer/products/:product', select, createProductOrder);
router.post('/api/orders/oneproduct', select, createOrderCrudOneProduct);

router.get('/api/orders', select, getOrderCrud);
router.get('/api/orders/customers/:id', select, getOrderCrudCustomer);
router.post('/api/orders', select, createOrderCrud);
router.delete('/api/orders/:id', select, deleteOrderCrudById);
router.get('/api/orders/:id/customer/orderdetails', getCustomerOrderDetailsByOrderId);

module.exports = router;