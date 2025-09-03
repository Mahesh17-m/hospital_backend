const Patient = require('../models/Patient');

const getPatients = async (req, res, next) => {
  try {
    const {
      ipNumber,
      patientName,
      place,
      phoneNumber,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'registrationDate',
      sortOrder = 'desc'
    } = req.query;

    let filter = {};
    
    if (ipNumber) {
      filter.ipNumber = { $regex: ipNumber, $options: 'i' };
    }
    
    if (patientName) {
      filter.patientName = { $regex: patientName, $options: 'i' };
    }
    
    if (place) {
      filter.place = { $regex: place, $options: 'i' };
    }
    
    if (phoneNumber) {
      filter.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    }
    
    if (startDate || endDate) {
      filter.registrationDate = {};
      if (startDate) {
        filter.registrationDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.registrationDate.$lte = end;
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const patients = await Patient.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalCount = await Patient.countDocuments(filter);

    res.json({
      success: true,
      patients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
};
const getTodayPatientCount = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const count = await Patient.countDocuments({
      registrationDate: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    next(error);
  }
};
const registerPatient = async (req, res, next) => {
  try {
    const {
      ipNumber,
      serialNumber,
      patientName,
      age,
      place,
      phoneNumber,
      referral
    } = req.body;

    if (!ipNumber || !serialNumber || !patientName || !age || !place) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ipNumber, serialNumber, patientName, age, and place are required'
      });
    }

    const existingIP = await Patient.findOne({ ipNumber });
    const existingSerial = await Patient.findOne({ serialNumber });
    
    if (existingIP) {
      return res.status(400).json({ 
        success: false, 
        message: 'IP number already exists' 
      });
    }
    
    if (existingSerial) {
      return res.status(400).json({ 
        success: false, 
        message: 'Serial number already exists' 
      });
    }

    const newPatient = new Patient({
      ipNumber,
      serialNumber,
      patientName,
      age: parseInt(age),
      place,
      phoneNumber: phoneNumber || '',
      referral: referral || ''
    });

    await newPatient.save();

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: newPatient
    });
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      patient
    });
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const {
      patientName,
      age,
      place,
      phoneNumber,
      referral
    } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        patientName,
        age: parseInt(age),
        place,
        phoneNumber,
        referral
      },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!deletedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  registerPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  getTodayPatientCount 
};