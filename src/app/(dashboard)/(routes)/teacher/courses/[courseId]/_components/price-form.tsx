"use client"
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    Form, FormControl, FormField, FormItem, FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/format';


interface PriceFormProps {
    initalData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number(),
})


const PriceForm = ({ initalData, courseId }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const toggleIsEdit = () => setIsEditing(prev => !prev);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initalData.price || undefined
        }
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
                Course price
                <Button onClick={toggleIsEdit} variant={"ghost"}  >
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2 ' />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initalData.price && "text-slate-500 italic"
                )} >
                    {initalData.price ? formatPrice(initalData.price) : "No price"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4 ' >
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            step={"0.01"}
                                            placeholder="Set a price for your course"
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

export default PriceForm;
