"use Client"
export interface Project {
    name: string;
    id: string;
    description?: string;
    status: 'ACTIVE' | 'ARCHIVED';
}

const ProjectCard = ({ name, id, description, status }: Project) => {
    const statusConfig = {
        ACTIVE: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            label: 'Active',
        },
        ARCHIVED: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            label: 'Archived',
        },
    };

    const config = statusConfig[status];
    return (
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white mt-2.5 mb-2.5">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-sm font-medium">{name}</h3>
                </div>
                <span className={`${config.bg} ${config.text} border-0 ml-2 whitespace-nowrap`}>
                    {config.label}
                </span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
    )
}

export default ProjectCard
