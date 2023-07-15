import prisma from '../prisma/index.js'

export const getAllExams = async () => {
  try {
      const exams = await prisma.exam.findMany();
      
    //   console.log(exams);

    return exams;
  } catch (error) {
    return { message: error.message };
  }
};
