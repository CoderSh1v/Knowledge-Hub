'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import { toast } from 'sonner'
import { NoteView, ResourceProps } from '@/components/resources/single resource UI/NoteView'
import { redirect } from 'next/navigation'

const SingleResource = () => {
  const params = useParams<{ id: string }>()
  const [resource, setResource] = useState<ResourceProps["resource"] | null>(null)
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


  switch (resource.type) {
    case "NOTE":
      return (<>
        <Navbar />
        <NoteView resource={resource} key={resource.id} projectId={resource.projectId} />
      </>)

    case "LINK":
      return (<>
        <Navbar />
        {/* <NoteView resource={resource} key={resource.id} /> */}
      </>)

    case "PDF":
      return (<>
        <Navbar />
        {/* <NoteView resource={resource} key={resource.id} /> */}
      </>)

    case "IMAGE":
      return (<>
        <Navbar />
        {/* <NoteView resource={resource} key={resource.id} /> */}
      </>)

    default:
      return (<>
        <Navbar />
        <div className="text-center p-8">Unknown resource type</div>
      </>)
  }
}
export default SingleResource