import { useCourseContext } from '../../contexts/CourseContext';
import { CourseCard } from './CourseCard';
import CreateCourseForm from './CreateCourseForm';

export const CourseList = () => {
    const { courses, isLoading, error } = useCourseContext();

    if (isLoading) {
        return <div className="loading loading-spinner loading-lg"></div>;
    }

    if (error) {
        return <div className="alert alert-error">Error: {error.message}</div>;
    }

    return (
        <div>
            <CreateCourseForm />
            {!courses.length ? (
                <div className="text-center text-base-content/70 py-8">
                    No courses yet. Create your first course!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};