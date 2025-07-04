import { db } from "@/lib/db";
import { Category, Chapter, Course } from "@prisma/client"
import { getProgress } from "./get-progress";



type CoursesWithProgressWithCategory = Course & {
    category: Category;
    chapters: Chapter[];
    progress: number | null;
}


type DashboardCourses = {
    completedCourses: CoursesWithProgressWithCategory[];
    coursesInProgress: CoursesWithProgressWithCategory[];
}



export async function getDashboardCourses(userId:string):Promise<DashboardCourses>{
    try {
        const purchasedCourses = await db.purchase.findMany({
            where:{
                userId
            },
            select:{
                course:{
                    include:{
                        category:true,
                        chapters:{
                            where:{
                                isPublished:true
                            }
                        }
                    }
                }
            }
        })

        const courses = await purchasedCourses.map((purchase)=>purchase.course) as CoursesWithProgressWithCategory[];

        for(let course of courses){
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter(course=>course.progress === 100);
        const coursesInProgress = courses.filter(course=>(course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress
        };

    } catch (error) {
        console.log("[GET_DASHBOARD_COURSE]",error);
        return {
            completedCourses: [],
            coursesInProgress: [],
        };
    }
}