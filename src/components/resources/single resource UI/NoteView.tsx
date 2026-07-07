'use client'
import { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, X, Plus } from 'lucide-react';
import { ResourceType } from '@/generated/prisma/enums';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface ResourceTag {
    id: string;
    name: string;
}

export interface ResourceProps {
    resource: {
        id: string;
        displayName: string;
        content?: string | null;
        resourceTags: ResourceTag[];
        description?: string | null;
        type: ResourceType;
        externalLink?: string | null;
        createdAt?: Date | null;
        updatedAt?: Date | null;
        file?: File | null;
        deletedAt?: Date | null;
        projectId: string
    }
}

export function NoteView({ resource, isEditing, setIsEditing }: { resource: ResourceProps['resource'], isEditing: boolean, setIsEditing: Dispatch<SetStateAction<boolean>> }) {

    const [editContent, setEditContent] = useState(resource.content || '');


    const handleSave = async () => {
        const response = await fetch(`/api/resources/${resource.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                body: {
                    content: editContent
                }
            })
        })
        const data = await response.json()
        if (!response.ok) {
            toast.error(data.message)
            return
        }
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            {isEditing ? (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Content
                    </label>
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={15}
                        className="w-full border border-gray-300 rounded-lg p-4 font-mono text-sm resize-none"
                        placeholder="Enter your note content..."
                    />
                    <Button onClick={handleSave} className="w-full">
                        Save Changes
                    </Button>
                </div>
            ) : (
                <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {editContent || 'No content yet. Click Edit to add content.'}
                    </p>
                </div>
            )}
        </div>
    );
}
