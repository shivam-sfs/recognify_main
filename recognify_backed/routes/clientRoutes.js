const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { middleware } = require('../helper/middleware/authentication');


router.post('/list', middleware ,clientController.list);
router.post('/add',  middleware,clientController.save);
router.put('/update/:id', middleware, clientController.save);
router.put('/toggle/:id', middleware ,clientController.save);
router.delete('/delete/:id', middleware ,clientController.delete);

module.exports = router;