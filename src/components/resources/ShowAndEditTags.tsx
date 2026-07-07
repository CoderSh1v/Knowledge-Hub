'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { ResourceProps, ResourceTag } from './single resource UI/NoteView';

const ShowAndEditTags = ({ resource }: { resource: ResourceProps['resource'] }) => {

    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState<ResourceTag[]>(resource.resourceTags);

    const handleAddTag = () => {
        
        setNewTag('');
    };

    const handleRemoveTag = (tagId: string) => {
        // This will be connected to your API
        setTags(tags.filter((tag) => tag.id !== tagId));
    };
    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>

                {/* Add Tag */}
                <div className="flex gap-2 mb-4">
                    <Input placeholder="Add a new tag" value={newTag} onChange={(e) => setNewTag(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && handleAddTag()} />
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
                                <button onClick={() => handleRemoveTag(tag.id)} className="hover:text-red-600">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                ) : (<p className="text-sm text-gray-500">No tags yet</p>)}
            </div>
        </>
    )
}

export default ShowAndEditTags
