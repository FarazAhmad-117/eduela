"use client"
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    Form, FormControl, FormField, FormItem, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


interface TitleFormProps {
    initalData: {
        title: string;
    };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    }),
})


const TitleForm = ({ initalData, courseId }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const toggleIsEdit = () => setIsEditing(prev => !prev);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initalData
    });

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Updated");
            toggleIsEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className='mt-6 bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course Title
                <Button onClick={toggleIsEdit} variant={"ghost"}  >
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2 ' />
                            Edit Title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2' >
                    {initalData.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4 ' >
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Advance web development'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2' >
                            <Button
                                disabled={!isValid || isSubmitting}
                                type='submit'
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default TitleForm
