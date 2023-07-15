import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
  dateOfBirth: {
    type: String,
  },
  name: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  parent: {
    type: String,
  },
  gender: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  admissionId: {
    type: String,
    unique: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
    },
  ],
  fees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fee",
    },
  ],
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stream",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Student = mongoose.model("Student", studentSchema, "Student");
export default Student;
