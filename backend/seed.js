require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blooddonorfinder';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB...');

    // Clear existing
    await User.deleteMany();
    await BloodRequest.deleteMany();

    // Create passwords
    const salt = await bcrypt.genSalt(10);
    const userHash = await bcrypt.hash('11111', salt);
    const hospitalHash = await bcrypt.hash('22222', salt);

    // Create Demo Users
    const hospitalAdmin = await User.create({
      name: 'GSVM Medical College (Admin)',
      phone: '9999999991',
      email: 'hospital@demo.com',
      password: hospitalHash,
      role: 'hospital',
      city: 'Kanpur',
      location: { type: 'Point', coordinates: [80.3092968, 26.4787938] }
    });

    const donorUser = await User.create({
      name: 'John Doe',
      phone: '9999999992',
      email: 'user@demo.com',
      password: userHash,
      role: 'donor',
      bloodGroup: 'O-',
      city: 'Kanpur',
      location: { type: 'Point', coordinates: [80.3319, 26.4499] },
      availabilityStatus: 'Available Now'
    });

    // Create More Donors around Kanpur
    await User.insertMany([
      { name: 'Alice Smith', phone: '9999999993', email: 'alice@demo.com', password: userHash, role: 'donor', bloodGroup: 'B+', city: 'Kanpur', location: { type: 'Point', coordinates: [80.340, 26.455] }, availabilityStatus: 'Available Now' },
      { name: 'Bob Johnson', phone: '9999999994', email: 'bob@demo.com', password: userHash, role: 'donor', bloodGroup: 'O-', city: 'Kanpur', location: { type: 'Point', coordinates: [80.310, 26.470] }, availabilityStatus: 'Available Now' },
      { name: 'Ravi Kumar', phone: '9999999995', email: 'ravi@demo.com', password: userHash, role: 'donor', bloodGroup: 'A-', city: 'Kanpur', location: { type: 'Point', coordinates: [80.3015634, 26.4793574] }, availabilityStatus: 'Available Now' },
    ]);

    // Create Requests
    await BloodRequest.create({
      patientName: 'Jane Smith',
      hospitalName: 'GSVM Medical College (LLR Hospital)',
      department: 'Trauma Bay 4 • Swaroop Nagar',
      bloodGroup: 'O-',
      unitsNeeded: 4,
      unitsSecured: 1,
      triageLevel: 'Code Red',
      location: { type: 'Point', coordinates: [80.3092968, 26.4787938] },
      createdBy: hospitalAdmin._id,
      matchedDonors: [{ donorId: donorUser._id, status: 'Alerted' }]
    });

    await BloodRequest.create({
      patientName: 'Mike Tyson',
      hospitalName: 'Regency Hospital Ltd.',
      department: 'OR Suite 3 • Sarvodaya Nagar',
      bloodGroup: 'A-',
      unitsNeeded: 2,
      unitsSecured: 0,
      triageLevel: 'High Priority',
      location: { type: 'Point', coordinates: [80.3015634, 26.4793574] },
      createdBy: hospitalAdmin._id
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
