const Patient = require('../models/Patient');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalPatients = await Patient.countDocuments();
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const todayPatients = await Patient.countDocuments({
      registrationDate: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthEnd = new Date();
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);
    monthEnd.setHours(23, 59, 59, 999);
    
    const monthPatients = await Patient.countDocuments({
      registrationDate: {
        $gte: monthStart,
        $lte: monthEnd
      }
    });

    const recentPatients = await Patient.find()
      .sort({ registrationDate: -1 })
      .limit(5)
      .select('ipNumber patientName age place registrationDate')
      .lean();

    res.json({
      success: true,
      stats: {
        totalPatients,
        todayPatients,
        monthPatients,
        recentPatients
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};