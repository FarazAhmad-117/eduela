"use client"
import React, { useState } from 'react'
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Attachment, Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';


interface AttachmentFormProps {
    initalData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
})


const AttachmentForm = ({ initalData, courseId }: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleIsEdit = () => setIsEditing(prev => !prev);
    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log('Here are values--->>', values);
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course Updated");
            toggleIsEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted");
            router.refresh();
        } catch (error) {
            toast.error("Someting went wrong");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className='mt-6 bg-slate-100 rounded-md p-4' >
            <div className='font-medium flex items-center justify-between'>
                Course attachments
                <Button onClick={toggleIsEdit} variant={"ghost"}  >
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initalData.attachments.length === 0 && (
                        <p className='text-sm text-slate-500 italic'>No attachments yet</p>
                    )}
                    {initalData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {
                                initalData.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                                    >
                                        <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                        <p className='text-xs line-clamp-1' >{attachment.name}</p>
                                        {deletingId === attachment.id && (
                                            <div>
                                                <Loader2 className='h-4 w-4 animate-spin' />
                                            </div>
                                        )}
                                        {deletingId !== attachment.id && (
                                            <button onClick={() => onDelete(attachment.id)} className='ml-auto hover:opacity-75 transition'>
                                                <X className='h-4 w-4 ' />
                                            </button>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        onChange={(url) => {
                            onSubmit({ url: url as string })
                        }}
                        type='file'
                    />
                    <div className='text-xs text-muted-foreground mt-4' >
                        Add anything your students might need to complete the course.
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm;
