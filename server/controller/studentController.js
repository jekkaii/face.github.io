import { StudentModel } from "../model/Student.js";
import { ClassModel } from "../model/Class.js";
import { UserModel } from "../model/User.js";

// import * as xlsx from 'xlsx';
//import multer from 'multer';

export const addStudent = async (req, res) => {
  try {
    const { idNumber, name, course, year } = req.body;
    const { classCode } = req.params;

    if (!idNumber || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingTeacher = await UserModel.findById(req.userId).populate(
      "classes"
    );

    if (!existingTeacher || existingTeacher.role !== "Teacher") {
      return res
        .status(403)
        .json({ message: "User is not a teacher or not found" });
    }

    // Find the class by classCode
    const classDoc = await ClassModel.findOne({ classCode }); // Find class by classCode
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    let student = await StudentModel.findOne({ idNumber });
    if (!student) {
      student = new StudentModel({
        idNumber,
        name,
        course,
        year,
      });
      await student.save(); // Save the new student
    }

    if (classDoc.students.includes(student._id)) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in this class" });
    }

    // Add the student to the class's students array
    classDoc.students.push(student._id);
    await classDoc.save(); // Save the updated class

    if (!student.classes) {
      student.classes = [];
    }
    if (!student.classes.includes(classDoc._id.toString())) {
      student.classes.push(classDoc._id);
      await student.save(); // Save the updated student
    }

    res
      .status(200)
      .json({ message: "Student added to class successfully", student });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const classCode = req.params.id;
    const foundClass = await ClassModel.findOne({ classCode }).populate(
      "students"
    );

    if (!foundClass) {
      return res.status(404).json({
        success: false,
        message: "No class found",
      });
    }

    const students = foundClass.students;

    if (!students) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.find();

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching all students:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const countStudents = async (req, res) => {
  try {
    const classCode = req.params.id;
    const foundClass = await ClassModel.findOne({ classCode }).populate(
      "students"
    );
    const count = foundClass.students.length;

    if (!count) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { idNumber, password } = req.body;
    if (!idNumber || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await StudentModel.findOne({ idNumber });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const hashedPassword = bycrpt.hashSync(password, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const updateStudent = async (req, res) => {
  try {
    const { idNumber, name } = req.body;
    if (!idNumber || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await StudentModel.findOne({ idNumber });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    existingUser.name = name;
    await existingUser.save();
    return res.status(200).json({ success: true, message: "Student updated" });
  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { idNumber, status } = req.body;
    if (!idNumber || !status) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await StudentModel.findOne({ idNumber });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    existingUser.status = status;
    await existingUser.save();
    return res.status(200).json({ success: true, message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { classCode, idNumber } = req.body;

    const classToUpdate = await ClassModel.findOne({ classCode });

    const studentToDelete = await StudentModel.findOne({ idNumber });

    await ClassModel.updateOne(
      { _id: classToUpdate._id },
      { $pull: { students: studentToDelete._id } }
    );

    res.status(200).json({ message: "Student removed from class successfully!" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteMultipleStudents = async (req, res) => {
  try {
    const { classCode, idNumbers } = req.body;

    const classToUpdate = await ClassModel.findOne({ classCode });

    const studentsToDelete = await StudentModel.find({ idNumber: { $in: idNumbers } });

    await ClassModel.updateOne(
      { _id: classToUpdate._id },
      { $pull: { students: { $in: studentsToDelete.map(student => student._id) } } } // Extract student IDs
    );

    res.status(200).json({ message: "Students removed from class successfully!" });
  } catch (error) {
    console.error("Error deleting students:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};


export const importFile = async (req, res) => {
  const file = req.files ? req.files.file : undefined;
  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    const workbook = xlsx.readFile(file.tempFilePath);
    const worksheet = workbook.Sheets["Sheet1"];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const existingIds = await StudentModel.distinct("idNumber");
    const duplicateIds = data.filter((item) =>
      existingIds.includes(item.idNumber)
    );
    if (duplicateIds.length) {
      return res.status(400).json({
        success: false,
        message: `The following idNumbers are already in the database: ${duplicateIds
          .map((item) => item.idNumber)
          .join(", ")}`,
      });
    }

    await StudentModel.insertMany(data);
    return res
      .status(200)
      .json({ success: true, message: "File imported successfully" });
  } catch (error) {
    console.error("Error importing file:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
