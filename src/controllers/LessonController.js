import prisma from '../../prisma/index.js'
import { redis } from '../lib/redis.js';

export const getAllLessons = async () => {
  try {

    const cachedValue = await redis.get("allLessons");

    if (cachedValue) return JSON.parse(cachedValue);

    const lessons = await prisma.lesson.findMany({
      include: {
        stream: true,
        teacher: true,
      }
    });
    
    if (!lessons) throw new Error("allLessons not found");

    await redis.set("allLessons", JSON.stringify(lessons));

    console.log("db lessons");
      
    //   console.log(lessons);

    return lessons;
  } catch (error) {
    return { message: error.message };
  }
};
