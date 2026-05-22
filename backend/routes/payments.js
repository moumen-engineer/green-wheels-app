const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const requireAuth = require('../middleware/requireAuth');

router.post('/create', requireAuth, paymentController.createPayment);
router.get('/my-payments', requireAuth, paymentController.getUserPayments);
router.get('/:payment_id', requireAuth, paymentController.getPaymentById);
router.patch('/:payment_id/status', requireAuth, paymentController.updatePaymentStatus);

module.exports = router;