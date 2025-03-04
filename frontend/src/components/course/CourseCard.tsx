import { Course } from '../../api/generated';
import { Link } from 'react-router-dom';
import { BsFolder } from 'react-icons/bs';

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
                <div className="flex items-center gap-3">
                    <BsFolder className="text-2xl text-primary" />
                    <h3 className="card-title">{course.name}</h3>
                </div>
                <p className="text-sm opacity-70">
                    {course.folders?.length || 0} folders
                </p>
                <div className="card-actions justify-end mt-4">
                    <Link
                        to={`/courses/${course.id}`}
                        className="btn btn-primary btn-sm"
                    >
                        Open Course
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;