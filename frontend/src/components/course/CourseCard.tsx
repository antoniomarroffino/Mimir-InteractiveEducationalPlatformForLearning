import {CourseDTO} from '@dti-isin/backend-api-client';
import {Link} from 'react-router-dom';
import {FiChevronRight, FiFolder} from 'react-icons/fi';

interface CourseCardProps {
    course: CourseDTO;
}

export const CourseCard = ({course}: CourseCardProps) => {
    return (
        <div
            className="group relative bg-base-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-base-300 hover:border-primary/20">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <FiFolder className="text-2xl"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{course.name}</h3>
                    </div>
                </div>
            </div>

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
                        className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary"
                    >
                        View Details
                        <FiChevronRight className="ml-1"/>
                    </Link>
                </div>
            </div>
        </div>
    );
};