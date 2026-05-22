const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const { subscription_id, ride_id, amount, method, status } = req.body;
    
    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }
    if (!method) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }
    if (!status) {
      return res.status(400).json({ success: false, message: 'Payment status is required' });
    }
    
    // Use session user.id for security (don't trust request body)
    const user_id = req.session.user.id;

    const payment = await Payment.create({
      user_id,
      subscription_id,
      ride_id,
      amount,
      method,
      status
    });

    return res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment
    });
  } catch (err) {
    console.error('Create payment error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getUserPayments = async (req, res) => {
  try {
    const user_id = req.session.user.id;
    const payments = await Payment.getUserPayments(user_id);
    
    return res.status(200).json({
      success: true,
      payments
    });
  } catch (err) {
    console.error('Get payments error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const user_id = req.session.user.id;
    
    // Get payment details
    const payment = await Payment.getPaymentById(payment_id);
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    // Verify payment belongs to current user
    if (payment.user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    return res.status(200).json({
      success: true,
      payment
    });
  } catch (err) {
    console.error('Get payment error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    
    await Payment.updateStatus(payment_id, status);
    
    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (err) {
    console.error('Update payment error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};