import prisma from '../prisma/index.js'

export const getAllStudents = async () => {
  try {
      const students = await prisma.student.findMany({
        include: {
          stream: true,
          exams: true,
          fees: true,
        },
      });
      
    //   console.log(students);

    return students;
  } catch (error) {
    return { message: error.message };
  }
};
