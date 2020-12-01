const express=require('express');
const router=express.Router();

const CustomerController=require('../controllers/CustomerController');
const SupplierController=require('../controllers/SupplierController');
const Controller=require('../controllers/Controller');
const switchToNode=require('../middlewares/switchToNode');

router.get('/api/customers', CustomerController.getAll);
router.get('/api/customers/:id',CustomerController.getById);
router.post('/api/customers',CustomerController.create)
router.put('/api/customers/:id',CustomerController.updateById);
router.delete('/api/customers/:id',CustomerController.deleteById);

router.get('/api/suppliers', switchToNode.select, Controller.getAll);
router.get('/api/suppliers/:id',switchToNode.select, Controller.getById);
router.post('/api/suppliers',switchToNode.select, Controller.create)
router.put('/api/suppliers/:id',SupplierController.updateById);
router.delete('/api/suppliers/:id',SupplierController.deleteById);

module.exports=router;