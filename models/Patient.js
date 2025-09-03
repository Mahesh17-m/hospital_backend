const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  ipNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  serialNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  patientName: { 
    type: String, 
    required: true,
    trim: true
  },
  age: { 
    type: Number, 
    required: true,
    min: 0,
    max: 120
  },
  place: { 
    type: String, 
    required: true,
    trim: true
  },
  phoneNumber: { 
    type: String, 
    default: '',
    trim: true
  },
  referral: { 
    type: String, 
    default: '',
    trim: true
  },
  registrationDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

patientSchema.index({ ipNumber: 1 });
patientSchema.index({ serialNumber: 1 });
patientSchema.index({ patientName: 1 });
patientSchema.index({ registrationDate: -1 });

patientSchema.pre('save', function(next) {
  if (this.ipNumber) this.ipNumber = this.ipNumber.trim();
  if (this.serialNumber) this.serialNumber = this.serialNumber.trim();
  if (this.patientName) this.patientName = this.patientName.trim();
  if (this.place) this.place = this.place.trim();
  if (this.phoneNumber) this.phoneNumber = this.phoneNumber.trim();
  if (this.referral) this.referral = this.referral.trim();
  
  next();
});

module.exports = mongoose.model('Patient', patientSchema);