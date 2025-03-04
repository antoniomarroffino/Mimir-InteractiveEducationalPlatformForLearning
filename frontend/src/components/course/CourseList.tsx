import { useCourses } from '../../hooks/useCourses';
import CourseCard from './CourseCard';
import CreateCourseForm from './CreateCourseForm';

const CourseList = () => {
    const { data: courses, isLoading, error } = useCourses();

    if (isLoading) return <div className="loading loading-spinner loading-lg"></div>;
    if (error) return <div className="alert alert-error">Error loading courses</div>;

    return (
        <div className="space-y-6">
            <CreateCourseForm />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CourseList;