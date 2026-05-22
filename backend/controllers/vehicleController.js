const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    const filters = { type, status, search };
    
    const vehicles = await Vehicle.getAll(filters);
    
    // Transform for frontend compatibility
    const transformedVehicles = vehicles.map(v => ({
      id: v.id,
      name: v.type === 'Vélo électrique' ? `E-${v.code}` : 
            v.type === 'Scooter électrique' ? `Scooter ${v.code}` : `Vélo ${v.code}`,
      type: v.type,
      price: parseFloat(v.price),
      autonomy: v.type === 'Vélo électrique' ? '40-60 km' : 
                v.type === 'Scooter électrique' ? '60-80 km' : '∞',
      battery: v.battery_level,
      station: v.station_name || `Station #${v.station_id}`,
      available: v.status === 'available',
      rating: 4.5, // Default rating, could come from a reviews table
      code: v.code,
      status: v.status,
      station_id: v.station_id,
      latitude: v.latitude,
      longitude: v.longitude
    }));
    
    res.json({
      success: true,
      vehicles: transformedVehicles
    });
  } catch (err) {
    console.error('Get vehicles error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.getById(id);
    
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    const transformedVehicle = {
      id: vehicle.id,
      name: vehicle.type === 'Vélo électrique' ? `E-${vehicle.code}` : 
            vehicle.type === 'Scooter électrique' ? `Scooter ${vehicle.code}` : `Vélo ${vehicle.code}`,
      type: vehicle.type,
      price: parseFloat(vehicle.price),
      autonomy: vehicle.type === 'Vélo électrique' ? '40-60 km' : 
                vehicle.type === 'Scooter électrique' ? '60-80 km' : '∞',
      battery: vehicle.battery_level,
      station: vehicle.station_name || `Station #${vehicle.station_id}`,
      station_address: vehicle.station_address,
      available: vehicle.status === 'available',
      status: vehicle.status,
      code: vehicle.code,
      station_id: vehicle.station_id,
      latitude: vehicle.latitude,
      longitude: vehicle.longitude
    };
    
    res.json({
      success: true,
      vehicle: transformedVehicle
    });
  } catch (err) {
    console.error('Get vehicle by id error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createVehicle = async (req, res) => {
  try {
    const { code, type, price, station_id, battery_level, status, latitude, longitude } = req.body;
    
    // Validation
    if (!code || !type || !price || !station_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const vehicle = await Vehicle.create({
      code, type, price, station_id, battery_level, status, latitude, longitude
    });
    
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      vehicle
    });
  } catch (err) {
    console.error('Create vehicle error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const vehicle = await Vehicle.update(id, updates);
    
    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      vehicle
    });
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vehicle.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    
    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};