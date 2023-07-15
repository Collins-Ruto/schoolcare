import prisma from '../prisma/index.js'

export const getAllLessons = async () => {
  try {
      const lessons = await prisma.lesson.findMany();
      
    //   console.log(lessons);

    return lessons;
  } catch (error) {
    return { message: error.message };
  }
};
