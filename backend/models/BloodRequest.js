const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema({
  patientName: { type: String },
  hospitalName: { type: String, required: true },
  department: { type: String },
  bloodGroup: { 
    type: String, 
    enum: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    required: true
  },
  componentType: { type: String, default: 'Whole Blood' },
  unitsNeeded: { type: Number, required: true, min: 1 },
  unitsSecured: { type: Number, default: 0 },
  triageLevel: { 
    type: String, 
    enum: ['Code Red', 'High Priority', 'Critical', 'Scheduled', 'Matched'],
    default: 'High Priority'
  },
  reason: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Arranged', 'Completed'],
    default: 'Pending'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  matchedDonors: [{
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Alerted', 'En Route', 'Arrived', 'Donated'] }
  }]
}, { timestamps: true });

BloodRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
