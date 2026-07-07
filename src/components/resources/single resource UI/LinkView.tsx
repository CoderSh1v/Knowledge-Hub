'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink } from 'lucide-react';
import { ResourceProps } from './NoteView';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function LinkView({ resource, isEditing, setIsEditing }: { resource: ResourceProps['resource'], isEditing: boolean, setIsEditing: Dispatch<SetStateAction<boolean>> }) {
    const [editTitle, setEditTitle] = useState(resource.displayName);
    const [editDescription, setEditDescription] = useState(resource.description || '');
    const [editUrl, setEditUrl] = useState(resource.externalLink || '');
    const router = useRouter();

    const handleSave = async () => {
        const response = await fetch(`/api/resources/${resource.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                body: {
                    title: editTitle.toLowerCase().trim(),
                    displayName: editTitle.trim(),
                    description: editDescription,
                    externalLink: editUrl
                }
            })
        })
        const data = await response.json()
        console.log(data)
        if (!response.ok) {
            toast.error(data.message)
            return
        }
        router.refresh()
        setIsEditing(false);
    };

    return (
        <>
            {resource.externalLink && (
                <a href={resource.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 underline text-sm">
                    {resource.externalLink}
                    <ExternalLink className="w-4 h-4" />
                </a>
            )}
            {/* Edit Form */}
            {isEditing && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Link title" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">URL</label>
                            <Input type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="Enter description" />
                        </div>
                        <Button onClick={handleSave} className="w-full">
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </>


    );
}
