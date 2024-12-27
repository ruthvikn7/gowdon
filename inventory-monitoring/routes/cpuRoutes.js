// cpuRoutes.js
import express from 'express';
import { saveCPUDataToDatabase,getCpuData,getSingleCpuData,savetheCPUDataToDatabase } from '../controllers/cpuController.js';
import { performance, getCurrentRamUsage, calculateCpuPerformanceRank } from '../services/cpuServices.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Calculate CPU performance rank
    const ramUsagePercentage = getCurrentRamUsage().usedMemoryPercentage;
    const cpuPerformanceRank = calculateCpuPerformanceRank(ramUsagePercentage);
    // console.log("ramUsage =", ramUsagePercentage, "%");
    // console.log(performance)

    // Save CPU data to the database
    await saveCPUDataToDatabase(performance, cpuPerformanceRank);

    res.status(200).json({
      success: true,
      message: 'CPU performance data saved to database.',
      data: {
        performance,
        cpuPerformanceRank,
      },
    });
  } catch (error) {
    console.error('Error in /cpu-performance route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

router.post('/save-cpu-data', async (req, res) => {
  // console.log('..............ruthvik............................ruthvik..............') 

  try {
    await savetheCPUDataToDatabase(req, res);
    
  } catch (error) {
    
  }
});

router.get("/",getCpuData)
router.get('/:id', getSingleCpuData);
export default router;
