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
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';


interface ImageFormProps {
    initalData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    }),
})


const ImageForm = ({ initalData, courseId }: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const toggleIsEdit = () => setIsEditing(prev => !prev);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initalData.imageUrl || ""
        }
    });

    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log('Here are values--->>', values);
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
                Course image
                <Button onClick={toggleIsEdit} variant={"ghost"}  >
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initalData.imageUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add image
                        </>
                    )}
                    {!isEditing && initalData.imageUrl && (
                        <>
                            <Pencil className='h-4 w-4 mr-2 ' />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (!initalData.imageUrl ? (
                <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md' >
                    <ImageIcon className='h-10 w-10 text-slate-500' />
                </div>
            ) : (
                <div className='relative aspect-video mt-2 ' >
                    <Image
                        alt="Upload"
                        fill
                        src={initalData.imageUrl}
                        className='object-cover rounded-md'
                    />
                </div>
            ))}
            {isEditing && (
                <div>
                    <FileUpload
                        onChange={(url) => {
                            onSubmit({ imageUrl: url as string })
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4' >
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageForm;
