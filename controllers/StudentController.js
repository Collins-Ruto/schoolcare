import Student from "../models/StudentModel.js";
// import mongodb from "mongodb";

export const getAllStudents = async () => {
  try {
      const students = await Student.find();
      
      console.log(students);

    return students;
  } catch (error) {
    return { message: error.message };
  }
};
