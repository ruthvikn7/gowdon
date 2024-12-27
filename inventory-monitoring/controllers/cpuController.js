// cpuController.js
import CPUData from '../Model/cpuDataSchema.js';

/**
 * tags:
 *   name: CPU
 *   description: API endpoints for managing CPU data
 */

/**
 * components:
 *   schemas:
 *     CPUData:
 *       type: object
 *       properties:
 *         productID:
 *           type: string
 *           description: The ID of the CPU product
 *         cost:
 *           type: number
 *           description: The cost of the CPU
 *         dailyPerformance:
 *           type: array
 *           description: Array of daily performance data
 *           items:
 *             type: object
 *             properties:
 *               lastRunDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the last performance run
 *               ramUsageInPercentage:
 *                 type: number
 *                 description: RAM usage in percentage during the performance run
 *               cpuPerformanceRank:
 *                 type: number
 *                 description: CPU performance rank during the performance run
 *         motherboard:
 *           type: string
 *           description: The motherboard associated with the CPU
 */

/**
 * /cpu:
 *   post:
 *     summary: Save CPU performance data to database
 *     description: Saves CPU performance data to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CPUData'
 *     responses:
 *       200:
 *         description: Success message
 *       400:
 *         description: Bad request, validation error
 *       500:
 *         description: Internal server error
 */

export const saveCPUDataToDatabase = async (performance) => {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  let currentDay = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  try {
    const existingCPUData = await CPUData.findOne({ productID: performance.productID });

    if (existingCPUData) {
      const lastEntry = existingCPUData.dailyPerformance[existingCPUData.dailyPerformance.length - 1];
      const lastRunDateAsString = lastEntry.lastRunDate.toISOString().split('T')[0];

      if (lastEntry && lastRunDateAsString === currentDay) {
        await CPUData.updateOne(
          {
            productID: performance.productID,
            'dailyPerformance.lastRunDate': lastEntry.lastRunDate,
          },
          {
            $set: {
              'dailyPerformance.$.ramUsageInPercentage': performance[currentDay].ramUsageInPercentage,
            },
          }
        );

        // Update motherboard outside $set
        await CPUData.updateOne(
          { productID: performance.productID },
          {
            $set: {
              motherboard: performance.motherboard,
            },
          }
        );
      } else {
        await CPUData.updateOne(
          { productID: performance.productID },
          {
            $push: {
              dailyPerformance: {
                lastRunDate: currentDate,
                ramUsageInPercentage: performance[currentDay].ramUsageInPercentage,
                cpuPerformanceRank: performance[currentDay].cpuPerformanceRank,
              },
            },
            $set: {
              motherboard: performance.motherboard,
            },
          }
        );
      }
    } else {
      const newCPUData = new CPUData({
        productID: performance.productID,
        cost: performance.cost,
        dailyPerformance: [{
          lastRunDate: currentDate,
          ramUsageInPercentage: performance[currentDay].ramUsageInPercentage,
          cpuPerformanceRank: performance[currentDay].cpuPerformanceRank,
        }],
        motherboard: performance.motherboard,
      });

      await newCPUData.save();
    }
  } catch (error) {
    console.error('Error saving CPU data to database:', error);
    throw error;
  }
};



/**
 * /cpu:
 *   get:
 *     summary: Retrieve CPU data
 *     description: Retrieves CPU data from the database.
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to filter CPU data by productID
 *     responses:
 *       200:
 *         description: A list of CPU data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CPUData'
 *       500:
 *         description: Internal server error
 */
export const getCpuData = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm; // Get the search term from the query parameters
    let query = {}; // Define an empty query object

    // If there's a search term, update the query to match the productID
    if (searchTerm) {
      query = { productID: { $regex: new RegExp(searchTerm, 'i') } };
    }

    const result = await CPUData.find(query);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * /cpu/{id}:
 *   get:
 *     summary: Retrieve CPU data by ID
 *     description: Retrieves CPU data from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the CPU data to retrieve
 *     responses:
 *       200:
 *         description: CPU data found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CPUData'
 *       404:
 *         description: CPU data not found
 *       500:
 *         description: Internal server error
 */
export const getSingleCpuData = async (req, res) => {
  try {
    const cpuId = req.params.id;
    const result = await CPUData.findById(cpuId);

    if (!result) {
      return res.status(404).json({ error: 'CPU data not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching CPU data by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






export const savetheCPUDataToDatabase = async (req, res) => {
  const performance = req.body;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const currentDay = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

  if (!performance[currentDay]) {
    return res.status(400).send(`Performance data for ${currentDay} is missing.`);
  }

  try {
    const existingCPUData = await CPUData.findOne({ productID: performance.productID });

    if (existingCPUData) {
      const lastEntry = existingCPUData.dailyPerformance[existingCPUData.dailyPerformance.length - 1];
      const lastRunDateAsString = lastEntry ? lastEntry.lastRunDate.toISOString().split('T')[0] : null;


      if (lastEntry && lastRunDateAsString === currentDay) {
        console.log('Updating existing entry for today',performance.productID);
        await CPUData.updateOne(
          {
            productID: performance.productID,
            'dailyPerformance.lastRunDate': lastEntry.lastRunDate,
          },
          {
            $set: {
              'dailyPerformance.$.ramUsageInPercentage': performance[currentDay].ramUsageInPercentage,
              'dailyPerformance.$.cpuPerformanceRank': performance[currentDay].cpuPerformanceRank,
              motherboard: performance.motherboard,
            },
          }
        );
      } else {
        console.log('Adding new entry for today',performance.productID);
        await CPUData.updateOne(
          { productID: performance.productID },
          {
            $push: {
              dailyPerformance: {
                lastRunDate: currentDate,
                ramUsageInPercentage: performance[currentDay].ramUsageInPercentage,
                cpuPerformanceRank: performance[currentDay].cpuPerformanceRank,
              },
            },
            $set: {
              motherboard: performance.motherboard,
            },
          }
        );
      }
    } else {
      const newCPUData = new CPUData({
        productID: performance.productID,
        cost: performance.cost,
        dailyPerformance: [{
          lastRunDate: currentDate,
          ramUsageInPercentage: performance[currentDay].ramUsageInPercentage,
          cpuPerformanceRank: performance[currentDay].cpuPerformanceRank,
        }],
        motherboard: performance.motherboard,
      });

      await newCPUData.save();
    }

    res.status(200).send('CPU data saved successfully');
  } catch (error) {
    console.error('Error saving CPU data to database:', error);
    res.status(500).send('Error saving CPU data');
  }
};

// export const savetheCPUDataToDatabase = async (req, res) => {
//   const performance = req.body;
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth() + 1;
//   const day = currentDate.getDate();
//   const currentDay = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

//   if (!performance[currentDay]) {
//     return res.status(400).send(`Performance data for ${currentDay} is missing.`);
//   }

//   try {
//     const existingCPUData = await CPUData.findOne({ productID: performance.productID });

//     if (existingCPUData) {
//       const lastEntry = existingCPUData.dailyPerformance[existingCPUData.dailyPerformance.length - 1];
//       const lastRunDateAsString = lastEntry.lastRunDate.toISOString().split('T')[0];

//       if (lastEntry && lastRunDateAsString === currentDay) {
//         await CPUData.updateOne(
//           {
//             productID: performance.productID,
//             'dailyPerformance.lastRunDate': lastEntry.lastRunDate,
//           },
//           {
//             $set: {
//               'dailyPerformance.$.ramUsageInPercentage': performance[currentDay].ramUsageInPercentage,
//               'dailyPerformance.$.cpuPerformanceRank': performance[currentDay].cpuPerformanceRank,
//             },
//           }
//         );

//         // Update motherboard outside $set
//         await CPUData.updateOne(
//           { productID: performance.productID },
//           {
//             $set: {
//               motherboard: performance.motherboard,
//             },
//           }
//         );
//       } else {
//         await CPUData.updateOne(
//           { productID: performance.productID },
//           {
//             $push: {
//               dailyPerformance: {
//                 lastRunDate: currentDate,
//                 ramUsageInPercentage: performance[currentDay].ramUsageInPercentage,
//                 cpuPerformanceRank: performance[currentDay].cpuPerformanceRank,
//               },
//             },
//             $set: {
//               motherboard: performance.motherboard,
//             },
//           }
//         );
//       } 
//     } else {
//       const newCPUData = new CPUData({
//         productID: performance.productID,
//         cost: performance.cost,
//         dailyPerformance: [{
//           lastRunDate: currentDate,
//           ramUsageInPercentage: performance[currentDay].ramUsageInPercentage,
//           cpuPerformanceRank: performance[currentDay].cpuPerformanceRank,
//         }],
//         motherboard: performance.motherboard,
//       });

//       await newCPUData.save();
//     }

//     res.status(200).send('CPU data saved successfully');
//   } catch (error) {
//     console.error('Error saving CPU data to database:', error);
//     res.status(500).send('Error saving CPU data');
//   }
// };