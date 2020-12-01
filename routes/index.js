const express = require('express');
const router = express.Router();

const CustomerController = require('../controllers/CustomerController');
const { getAll, getById, create, deleteById, updateById } = require('../controllers/Controller');
const { select } = require('../middlewares/switchToNode');

router.get('/api/customers', CustomerController.getAll);
router.get('/api/customers/:id', CustomerController.getById);
router.post('/api/customers', CustomerController.create)
router.put('/api/customers/:id', CustomerController.updateById);
router.delete('/api/customers/:id', CustomerController.deleteById);

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

module.exports = router;