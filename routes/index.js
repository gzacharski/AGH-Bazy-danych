const express=require('express');
const router=express.Router();

const TestController=require('../controllers/TestController');

router.get('/api/films', TestController.getAllFilms);

module.exports=router;