import Documenuments from "../Model/DocumentSchema.js";

export async function CreateDocuments(req, res) {
  try {
    const { folderName, rackNumber, user } = req.body;

    let uploadedFile = null;
    if (req.file) {
      // Check if file is uploaded
      uploadedFile = req.file.buffer; // Access file buffer
    }

    const document = new Documenuments({
      folderName,
      uploadedFile,
      rackNumber,
      user,
    });

    await document.save();
    res.status(201).json({ success: true, data: document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
}

// export async function getAllDocuments(req,res){
//     try{
//         const searchTerm =req.query.searchTerm || '';
//         const query = {
//             folderName: { $regex: new RegExp(searchTerm, 'i') }
//           };
//           const allDocuments = await Documenuments.find(query);
//           res.status(200).json(allDocuments);
//          }catch (error) {
//         console.error('Error fetching items:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
// }

export const getAllDocuments = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const query = {
      folderName: { $regex: new RegExp(searchTerm, "i") },
    };

    if (req.documents && req.documents.length > 0) {
      query._id = { $in: req.documents.map((doc) => doc._id) }; // Filter by accessible documents
    } else {
      return res
        .status(403)
        .json({ error: "Forbidden: No accessible documents found" });
    }

    const allDocuments = await Documenuments.find(query);
    res.status(200).json(allDocuments);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function deleteDocument(req, res) {
  try {
    const deleteDoc = await Documenuments.findByIdAndDelete(req.params.itemId);
    if (!deleteDoc) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const addEmployeeAccess = async (req, res) => {
  const { documentId, employeeId } = req.body;

  try {
    const document = await Documenuments.findByIdAndUpdate(
      documentId,
      { $addToSet: { access: { employeeId } } },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error adding employee access:", error);
    res.status(500).json({ error: "Error adding employee access" });
  }
};

export const removeEmployeeAccess = async (req, res) => {
  const { documentId, employeeId } = req.body;

  try {
    const document = await Documenuments.findByIdAndUpdate(
      documentId,
      { $pull: { access: { employeeId } } },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error removing employee access:", error);
    res.status(500).json({ error: "Error removing employee access" });
  }
};

export const getEmployeeAccess = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Documenuments.findById(documentId).select(
      "access.employeeId"
    );

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const employeeIds = document.access.map((access) => access.employeeId);

    res.status(200).json(employeeIds);
  } catch (error) {
    console.error("Error fetching employee access:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
