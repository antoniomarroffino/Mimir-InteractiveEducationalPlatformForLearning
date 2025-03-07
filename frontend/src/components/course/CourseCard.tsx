import { Course } from '../../api/generated';
import { BsFolder2, BsChevronRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface CourseCardProps {
    course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BsFolder2 className="text-2xl text-primary" />
                        <h3 className="card-title">{course.name}</h3>
                    </div>
                    <div className="text-base-content/70">
                        {course.folders?.length || 0} folders
                    </div>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link
                        to={`/courses/${course.id}`}
                        className="btn btn-primary btn-sm"
                    >
                        View Course
                        <BsChevronRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};