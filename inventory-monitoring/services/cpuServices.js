//cpuServices.js
import { totalmem, freemem } from 'os';
import {getproductID,getBaseBoard} from './systemInformationGenerator.js';
import { saveCPUDataToDatabase } from '../controllers/cpuController.js';

let n = 1;
let ramUsageCumm = 0;
let currentDate = new Date();
let year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;
let day = currentDate.getDate();
let currentDay = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
let motherboardData
const getBaseBoardData = async()=>{
  motherboardData = await getBaseBoard()
  //  console.log("motherboard",motherboardData);
}


const performance = {
  productID: '', // Will be updated with the actual value later
  motherboard:{},
  cost: 'YOUR_COST',
};
async function main() {
  try {
    performance.productID = await getproductID();
    await getBaseBoardData()
    performance.motherboard=motherboardData
    // console.log('Device ID:', performance.deviceID);
// console.log(performance)

  } catch (error) {
    console.error('Main function error:', error);
  }
}

main();

function getCurrentRamUsage() {
  const totalMemory = totalmem();
  const freeMemory = freemem();
  const usedMemory = totalMemory - freeMemory;
  const usedMemoryInPercentage = (usedMemory / totalMemory) * 100;
  ramUsageCumm += usedMemoryInPercentage;
  let usedMemoryPercentage = ramUsageCumm / n;
  n++;

  return {
    totalMemory,
    freeMemory,
    usedMemory,
    usedMemoryPercentage,
  };
}

const  logRamUsage = async()=> {
  const ramUsageData = await getCurrentRamUsage();
  ramUsageCumm += ramUsageData.usedMemoryPercentage;
  let ramUsageAvg = ramUsageCumm / n;
  n++;
  const cpuPerformanceRank =  await calculateCpuPerformanceRank(ramUsageAvg);

  performance[currentDay] = { ramUsageInPercentage: ramUsageAvg, lastRunDate: currentDay, cpuPerformanceRank };

  // console.log(performance)
  saveCPUDataToDatabase(performance);
}

setInterval(logRamUsage, 10 * 1000);

function calculateCpuPerformanceRank(ramUsagePercentage) {
  // Your existing logic for calculating CPU performance rank
  if (ramUsagePercentage > 85) {
    return 'Danger';
  } else if (ramUsagePercentage >= 75 && ramUsagePercentage <= 85) {
    return 'Super Computer';
  } else if (ramUsagePercentage >= 50 && ramUsagePercentage < 75) {
    return 'Perfectly Used';
  } else if (ramUsagePercentage >= 25 && ramUsagePercentage < 50) {
    return 'Good Use';
  } else {
    return 'Underuse';
  }
}

export {
  performance,
  getCurrentRamUsage,
  calculateCpuPerformanceRank,
};
