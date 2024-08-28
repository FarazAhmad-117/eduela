import React from 'react'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { IconBadge } from '@/components/icon-badge';
import { LayoutDashboard } from 'lucide-react';
import TitleForm from './_components/title-form';

const CourseIdPage = async ({
    params
}: {
    params: { courseId: string }
}) => {
    const { userId } = auth();
    if (!userId) {
        redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    })

    if (!course) {
        return redirect("/")
    }

    const requiredFileds = [
        course.title,
        course.description,
        course.imageUrl,
        course.categoryId
    ];

    const totalFileds = requiredFileds.length;
    const completedFields = requiredFileds.filter(Boolean).length;
    const completionText = `(${completedFields} / ${totalFileds})`;

    return (
        <div className='p-6' >
            <div className='flex items-center justify-between' >
                <div className='flex flex-col gap-y-2' >
                    <h1 className='text-2xl font-medium'>
                        Course Setup
                    </h1>
                    <span className='text-sm text-slate-500' >Complete all fields {completionText}</span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16' >
                <div>
                    <div className='flex items-center gap-x-2' >
                        <IconBadge icon={LayoutDashboard} />
                        <h2>Customize your course</h2>
                    </div>
                </div>
                <TitleForm 
                    initalData = {course}
                    courseId={course.id}
                />
            </div>
        </div>
    )
}

export default CourseIdPage