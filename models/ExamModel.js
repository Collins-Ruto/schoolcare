import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  name: String,
  slug: String,
  term: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  results: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Result",
    },
  ],
  examDate: String,
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const Exam = mongoose.model("Exam", examSchema, "Exam");
export default Exam;
