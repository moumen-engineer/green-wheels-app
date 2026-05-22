const Ride = require('../models/Ride');

// POST /api/rides — Create a reservation (ride) and mark vehicle as reserved
exports.createRide = async (req, res) => {
  try {
    const user_id = req.session?.user?.id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { vehicle_id, start_station_id, started_at, duration_min, base_price, final_price } = req.body;

    if (!vehicle_id || !start_station_id || !started_at) {
      return res.status(400).json({ success: false, message: 'Missing required fields: vehicle_id, start_station_id, started_at' });
    }

    const ride = await Ride.create({
      user_id,
      vehicle_id,
      start_station_id,
      started_at,
      duration_min: duration_min || null,
      base_price: base_price || null,
      final_price: final_price || null,
    });

    return res.status(201).json({ success: true, ride });
  } catch (err) {
    console.error('Create ride error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/rides/me — Get current user's rides
exports.getUserRides = async (req, res) => {
  try {
    const user_id = req.session?.user?.id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const rides = await Ride.getUserRidesLimited(user_id, 10);
    const stats = await Ride.getUserStats(user_id);
    
    return res.status(200).json({ 
      success: true, 
      rides,
      stats: {
        total: stats.total_rides,
        active: stats.active_rides,
        upcoming: stats.upcoming_rides,
        totalSpent: stats.total_spent
      }
    });
  } catch (err) {
    console.error('Get rides error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// NEW: GET /api/rides/:rideId/cancel — Cancel a ride
exports.cancelRide = async (req, res) => {
  try {
    const user_id = req.session?.user?.id;
    const { rideId } = req.params;
    
    if (!user_id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    // Get the ride to check ownership
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    
    if (ride.user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Cancel the ride
    await Ride.cancel(rideId);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Ride cancelled successfully',
      ride_id: rideId
    });
  } catch (err) {
    console.error('Cancel ride error:', err);
    return res.status(500).json({ 
      success: false, 
      message: err.message || 'Server error', 
      error: err.message 
    });
  }
};

// NEW: GET /api/rides/stats — Get user's ride statistics
exports.getRideStats = async (req, res) => {
  try {
    const user_id = req.session?.user?.id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const stats = await Ride.getUserStats(user_id);
    
    return res.status(200).json({ 
      success: true, 
      stats
    });
  } catch (err) {
    console.error('Get ride stats error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};