'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { SubmitHandler, useForm } from 'react-hook-form';
import { newResourceSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { useRouter } from 'next/navigation';

type ResourceType = 'NOTE' | 'PDF' | 'IMAGE' | 'LINK';

export default function CreateResourceDialog({ projectId }: { projectId: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const resourceTypes: { id: ResourceType; label: string; description: string; }[] = [
        { id: 'NOTE', label: 'Note', description: 'Quick text-based notes' },
        { id: 'PDF', label: 'PDF', description: 'Upload PDF documents' },
        { id: 'IMAGE', label: 'Image', description: 'Upload images' },
        { id: 'LINK', label: 'Link', description: 'Save useful links' },
    ];

    const { register, watch, handleSubmit, reset, setValue, formState: { errors } } =
        useForm<z.input<typeof newResourceSchema>, any, z.output<typeof newResourceSchema>
        >({ resolver: zodResolver(newResourceSchema) })
    const resourceType = watch('resourceType')
    const file = watch('file') as FileList | undefined
    const tags = watch("tags") ?? []
    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setValue('tags', [...tags, tagInput.trim()]);;
            setTagInput('');
        }
    };
    const handleRemoveTag = (tagToRemove: string) => {
        setValue('tags', tags.filter(tag => tag !== tagToRemove));
    };

    const onSubmit: SubmitHandler<z.output<typeof newResourceSchema>> = async (formData) => {
        const response = await fetch('/api/resources', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formData, projectId })
        })
        const data = await response.json()
        console.log(data)
        if (!response.ok) {
            toast.error(data.message)
            return
        }
        if (resourceType === 'NOTE') router.push(`/resources/${data.id}`)
        setOpen(false);
        setTagInput('');
        reset()
    };

    const handleClose = () => {
        setOpen(false);
        setTagInput('');
        reset()
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Add Resource</Button>

            <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
                <DialogContent className="max-w-md" aria-describedby={undefined}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Type Selection View */}
                        {!resourceType ? (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Choose Resource Type</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-3">
                                    {resourceTypes.map((type) => (
                                        <button type="button" key={type.id} onClick={() => { setValue('resourceType', type.id); }}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:bg-gray-50 transition text-left">
                                            <div className="font-semibold text-gray-900">{type.label}</div>
                                            <div className="text-xs text-gray-600">{type.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <DialogHeader>
                                    <DialogTitle>
                                        Create {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {/* Title Field - All types */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                                        <Input {...register('title')} placeholder="Enter title" />
                                        {errors.title && (<p className="text-sm text-red-500">  {errors.title.message}</p>)}

                                    </div>

                                    {/* Description - PDF, Image, Link */}
                                    {(resourceType === 'PDF' || resourceType === 'IMAGE' || resourceType === 'LINK') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Description
                                            </label>
                                            <textarea {...register('description')} placeholder="Enter description"
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm" rows={3} />
                                            {errors.description && (<p className="text-sm text-red-500">  {errors.description.message}</p>)}

                                        </div>
                                    )}
                                    <input type="hidden" {...register('resourceType')} />
                                    {/* File Upload - PDF, Image */}
                                    {(resourceType === 'PDF' || resourceType === 'IMAGE') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Upload {resourceType.toUpperCase()}
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                                                <input
                                                    type="file"
                                                    {...register('file')}
                                                    accept={resourceType === 'PDF' ? '.pdf' : 'image/*'}
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer text-sm text-gray-600"
                                                >
                                                    {file?.[0] ? (<span className="text-green-600"> {file[0].name}</span>) :
                                                        (
                                                            <>
                                                                <div>Click to upload or drag and drop</div>
                                                                <div className="text-xs text-gray-500">
                                                                    {resourceType === 'PDF' ? 'PDF only' : 'Images only'}
                                                                </div>
                                                            </>
                                                        )}
                                                </label>
                                                {errors.file && (<p className="text-sm text-red-500">{errors.file?.message?.toString()}</p>)}
                                            </div>
                                        </div>
                                    )}

                                    {/* URL - Link */}
                                    {resourceType === 'LINK' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">URL</label>
                                            <Input {...register('url')} type="url" placeholder="https://example.com" />
                                            {errors.url && (<p className="text-sm text-red-500">{errors.url.message}</p>)}
                                        </div>
                                    )}

                                    {/* Tags - All types */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Tags</label>
                                        <div className="flex gap-2 mb-3">
                                            <Input
                                                placeholder="Add a tag"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddTag();
                                                    }
                                                }}
                                            />
                                            <Button type="button" size="sm" variant="outline" onClick={handleAddTag} className="px-3">+</Button>
                                        </div>
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="flex gap-1 items-center">
                                                        {tag}
                                                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-600">X </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 justify-end pt-4">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline" >Back</Button>
                                    </DialogClose>
                                    <Button type='submit'>Create</Button>
                                </div>
                            </>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}