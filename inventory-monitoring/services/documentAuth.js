import jwt from 'jsonwebtoken';
import Documenuments from '../Model/DocumentSchema.js';
import dotenv from 'dotenv';
dotenv.config();

export const checkEmployeeAccess = async (req, res, next) => {
  let authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const token = authToken.split(' ')[1]; // Extract the token
    const decodedToken = jwt.verify(token, Buffer.from(process.env.JWT_SECRET, 'base64'));
    
    // console.log('Decoded Token:', decodedToken);

    // Extract role from decoded token
    const roles = decodedToken.role || [];
    req.roles = roles; // Store roles in the request object


    if (roles.includes('ROLE_SUPER_ADMIN') || roles.includes('ROLE_ADMIN')) { 
      // Fetch all documents if the roles include 'ROLE_SUPER_ADMIN'
      const allDocuments = await Documenuments.find();
      
      
      req.documents = allDocuments;
    } else {
      // Fetch documents where employeeId has access
      const documents = await Documenuments.find({
        'access.employeeId': decodedToken.role,
      });


      if (!documents || documents.length === 0) {
        return res.status(403).json({ error: 'Forbidden: No accessible documents found' });
      }

      req.documents = documents;
    }
    next();
  } catch (error) {
    console.error('Error checking employee access:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};










// import jwt from 'jsonwebtoken';
// import Documenuments from '../Model/DocumentSchema.js';
// import dotenv from "dotenv";
// dotenv.config();


// export const checkEmployeeAccess = async (req, res, next) => {
//     let authToken = req.headers.authorization;
  
//     if (!authToken) {
//       return res.status(401).json({ error: 'Unauthorized: No token provided' });
//     }
  
//     try {
//         const decodedToken = jwt.verify(
//             authToken.split(" ")[1],
//             Buffer.from(process.env.JWT_SECRET, "base64")
//           ); // Ensure you have JWT_SECRET in your environment variables
//       req.employeeId = decodedToken.role; // Assuming the token contains an `id` field for the employee
//   console.log(req.employeeId)
//       if (req.employeeId === 'ROLE_SUPER_ADMIN') {
//         // Fetch all documents if employeeId is 'ROLE_SUPER_ADMIN'
//         const allDocuments = await Documenuments.find();
//         req.documents = allDocuments;
//       } else {
//         // Fetch documents where employeeId has access
//         const documents = await Documenuments.find({
//           'access.employeeId': req.employeeId,
//         });
  
//       if (!documents || documents.length === 0) {
//         return res.status(403).json({ error: 'Forbidden: No accessible documents found' });
//       }
  
//       req.documents = documents; 
//     }
//       next();
//     } catch (error) {
//       console.error('Error checking employee access:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };
