const express=require('express');
const router=express.Router();

const CustomerController=require('../controllers/CustomerController');
const SupplierController=require('../controllers/SupplierController');

router.get('/api/customers', CustomerController.getAll);
router.get('/api/customers/:id',CustomerController.getById);
router.post('/api/customers',CustomerController.create)
router.put('/api/customers/:id',CustomerController.updateById);
router.delete('/api/customers/:id',CustomerController.deleteById);

router.get('/api/suppliers', SupplierController.getAll);
router.get('/api/suppliers/:id',SupplierController.getById);
router.post('/api/suppliers',SupplierController.create)
router.put('/api/suppliers/:id',SupplierController.updateById);
router.delete('/api/suppliers/:id',SupplierController.deleteById);

module.exports=router;