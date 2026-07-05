'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, X, Plus } from 'lucide-react';
import { ResourceType } from '@/generated/prisma/enums';
interface ResourceTag {
    id: string;
    name: string;
}

export interface ResourceProps {
    resource: {
        id: string;
        displayName: string;
        content: string | null;
        resourceTags: ResourceTag[];
        description: string | null;
        type: ResourceType;
        externalLink: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        file: File | null;
        deletedAt: Date | null;
    }
}

export function NoteView({ resource }: ResourceProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(resource.content || '');
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState<ResourceTag[]>(resource.resourceTags);

    const handleAddTag = () => {
        if (newTag.trim()) {
            // This will be connected to your API
            setTags([...tags, { id: Date.now().toString(), name: newTag }]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagId: string) => {
        // This will be connected to your API
        setTags(tags.filter((tag) => tag.id !== tagId));
    };

    const handleSave = () => {
        // Connect to your API to save the content
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <h1 className="text-4xl font-bold text-gray-900">{resource.displayName}</h1>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                {isEditing ? 'Cancel' : 'Edit'}
                            </Button>
                            <Button variant="destructive" onClick={() => {
                                if (confirm('Are you sure you want to delete this note?')) {
                                    // onDelete(id);
                                }
                            }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Editor/Viewer */}
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

                {/* Tags Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>

                    {/* Add Tag */}
                    <div className="flex gap-2 mb-4">
                        <Input placeholder="Add a new tag" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button type="button" size="sm" variant="outline" onClick={handleAddTag} className="px-3">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Display Tags */}
                    {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag.id} variant="secondary" className="flex gap-2 items-center py-2">
                                    {tag.name}
                                    <button
                                        onClick={() => handleRemoveTag(tag.id)}
                                        className="hover:text-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    ) : (<p className="text-sm text-gray-500">No tags yet</p>)}
                </div>
            </div>
        </div>
    );
}