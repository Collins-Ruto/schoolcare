import Student from "../models/StudentModel.js";
import prisma from "../prisma/index.js";
import { redis } from "../lib/redis.js";

export const getAllStudents = async () => {
  try {
    const cachedValue = await redis.get("allStudents");

    if (cachedValue) return JSON.parse(cachedValue);
    // const students = await Student.find()
    const students = await prisma.student.findMany({
      include: {
        stream: true,
        exams: true,
        fees: true,
      },
    });

    if (!students) throw new Error("allStudents not found");

    await redis.set("allStudents", JSON.stringify(students));

    console.log("db students", students);

    return students;
  } catch (error) {
    return { message: error.message };
  }
};
