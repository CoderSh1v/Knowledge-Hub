'use client';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { ResourceProps } from './NoteView';
import { useState, Dispatch, SetStateAction } from 'react';

export function FileView({ resource, isEditing, setIsEditing }: { resource: ResourceProps['resource'], isEditing: boolean, setIsEditing: Dispatch<SetStateAction<boolean>> }) {
    
    return (
        <div className=" bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        {resource.type === "IMAGE" && resource.file?.fileURL ? (
                            <>
                                <div className="relative w-full h-96">
                                    <Image src={resource.file?.fileURL} alt={resource.displayName} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" loading="eager" />
                                </div>
                                <div className="w-full p-4 bg-white border-t border-gray-200 flex items-center justify-center">
                                    <Button asChild size="sm">
                                        <a href={resource.file?.fileURL} target="_blank" rel="noopener noreferrer">
                                            <Download className="w-4 h-4 mr-2" /> Download
                                        </a>
                                    </Button>
                                </div>
                            </>
                        ) : resource.type === "PDF" && resource.file?.fileURL ? (
                            <>
                                <Button asChild size="sm">
                                    <a href={resource.file.fileURL} target="_blank" rel="noopener noreferrer">
                                        Open PDF
                                    </a>
                                </Button>
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">📄</div>
                                <p className="text-gray-600">No File uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
