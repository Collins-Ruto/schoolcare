import Exam from "../models/ExamModel.js";
// import mongodb from "mongodb";

export const getAllExams = async () => {
  try {
      const exams = await Exam.find();
      
      console.log(exams);

    return exams;
  } catch (error) {
    return { message: error.message };
  }
};
