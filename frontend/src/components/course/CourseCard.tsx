import {CourseDTO} from '@dti-isin/backend-api-client';
import {Link} from 'react-router-dom';
import {FiBookOpen, FiChevronRight, FiEdit3, FiFolder} from 'react-icons/fi';

interface CourseCardProps {
    course: CourseDTO;
    className?: string;
}

export const CourseCard = ({course, className = ''}: CourseCardProps) => {
    return (
        <div
            className={`
                group relative 
                bg-white 
                rounded-xl 
                p-6 
                shadow-sm 
                hover:shadow-md 
                transition-all 
                duration-300 
                border 
                border-base-200 
                hover:border-primary/20 
                ${className}
            `}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <FiBookOpen className="text-2xl"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-base-content">
                            {course.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            {course.description && (
                <div className="mb-4 text-base-content/70 text-sm line-clamp-2">
                    <FiEdit3 className="inline-block mr-2 text-base-content/50"/>
                    {course.description}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <FiFolder className="text-base-content/70"/>
                        <span className="text-base-content/70">
                            {course.folders?.length || 0} Folders
                        </span>
                    </div>
                    <Link
                        to={`/courses/${course.id}`}
                        className="
                            btn
                            btn-sm
                            btn-ghost
                            hover:bg-primary/10
                            hover:text-primary
                            group-hover:translate-x-1
                            transition-transform
                        "
                    >
                        View Details
                        <FiChevronRight className="ml-1 group-hover:translate-x-0.5 transition-transform"/>
                    </Link>
                </div>
            </div>
        </div>
    );
};