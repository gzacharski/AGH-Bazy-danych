const express=require('express');
const router=express.Router();

const TestController=require('../controllers/TestController');
const CustomerController=require('../controllers/CustomerController');

router.get('/api/customers', CustomerController.getAll);
router.get('/api/customers/:id',CustomerController.getById);
router.post('/api/customers',CustomerController.create)
router.put('/api/customers/:id',CustomerController.updateById);
router.delete('/api/customers/:id',CustomerController.deleteById);

module.exports=router;