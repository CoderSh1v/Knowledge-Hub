'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import { toast } from 'sonner'
import { NoteView, ResourceProps } from '@/components/resources/single resource UI/NoteView'
import { LinkView } from '@/components/resources/single resource UI/LinkView'
import { redirect } from 'next/navigation'
import DeleteResourceButton from '@/components/resources/deleteResource'
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button'
import ShowAndEditTags from '@/components/resources/ShowAndEditTags'

const SingleResource = () => {
  const params = useParams<{ id: string }>()
  const [resource, setResource] = useState<ResourceProps["resource"] | null>(null)
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { getSingleResource() }, [])
  async function getSingleResource() {
    const response = await fetch(`/api/resources/${params.id}`)
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.message)
      return
    }
    setResource(data.resource)
  }

  if (!resource) return (<><Navbar />Loading...</>)
  if (resource.deletedAt) redirect(`/dashboard`)

  let whichResourceToShow;
  switch (resource.type) {
    case "NOTE":
      whichResourceToShow = <NoteView resource={resource} key={resource.id} isEditing={isEditing} setIsEditing={setIsEditing} />
      break;

    case "LINK":
      whichResourceToShow = <LinkView resource={resource} key={resource.id} isEditing={isEditing} setIsEditing={setIsEditing} />
      break;

    case "PDF":
      {/* whichResourceToShow = <NoteView resource={resource} key={resource.id} /> */ }
      break;

    case "IMAGE":
      {/* whichResourceToShow =<NoteView resource={resource} key={resource.id} /> */ }
      break;

    default:
      whichResourceToShow = <div className="text-center p-8">Unknown resource type</div>
      break;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Name with Edit and Delete Button*/}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-4xl font-bold text-gray-900">{resource.displayName}</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIsEditing(!isEditing) }}>
                  <Pencil className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                <DeleteResourceButton id={resource.id} projectId={resource.projectId} />
              </div>
            </div>
          </div>

          {whichResourceToShow}

          {/* Description */}
          {(!isEditing && resource.type !== "NOTE") && (
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {resource.description || 'No description provided.'}
              </p>
            </div>
          )}

          {/* Tags */}
          <ShowAndEditTags resource={resource} />
        </div>
      </div>
    </>
  )
}

export default SingleResource