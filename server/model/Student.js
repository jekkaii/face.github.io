import mongoose from "mongoose";
import { ClassModel } from "./Class.js";

const StudentSchema = new mongoose.Schema(
  {
    idNumber: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },
    absencesDates: [
      {
        date: {
          type: [Date],
        },
      },
    ],
  },
  { timestamps: true }
);

// Pre-hook to handle cascade deletion
StudentSchema.pre("findOneAndDelete", async function (next) {
  try {
    const student = await this.model.findOne(this.getFilter());

    // If student is found, remove them from all classes they are part of
    if (student) {
      await ClassModel.updateMany(
        { students: student._id }, // Find all classes containing the student
        { $pull: { students: student._id } } // Remove the student's ObjectId from students array
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

export const StudentModel = mongoose.model("Student", StudentSchema);
