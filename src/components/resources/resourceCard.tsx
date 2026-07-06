'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, FileText, Link as LinkIcon, FileUp, Image as ImageIcon, Pencil, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import DeleteResourceButton from './deleteResource';
import { ResourceProps } from './single resource UI/NoteView';
type Props = ResourceProps["resource"] & {
  projectId: string,
  onDelete: () => Promise<void>
};

export function ResourceCard({ id, type, displayName, description, resourceTags, projectId,onDelete }: Props) {

  const iconMap = {
    NOTE: <FileText className="w-6 h-6 text-blue-500" />,
    LINK: <LinkIcon className="w-6 h-6 text-purple-500" />,
    PDF: <FileUp className="w-6 h-6 text-red-500" />,
    IMAGE: <ImageIcon className="w-6 h-6 text-green-500" />,
  };

  const showEdit = type !== 'NOTE';
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header with icon and menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {iconMap[type]}
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{displayName}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/resources/${id}`} className="flex items-center gap-2 cursor-pointer">
                <ExternalLink className="w-4 h-4" />
                <span>Open</span>
              </Link>
            </DropdownMenuItem>
            {showEdit && (
              <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2 cursor-pointer">
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            )}
            <DeleteResourceButton id={id} projectId={projectId} onDelete={onDelete }>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 cursor-pointer text-red-600">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteResourceButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
      )}

      {resourceTags && resourceTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {resourceTags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
