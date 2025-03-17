// CourseList.tsx
import { useCourse } from "../../hooks/useCourse.ts";
import { CourseCard } from './CourseCard';
import { SkeletonLoader } from '../common/SkeletonLoader';

export const CourseList = () => {
    const { courses, isLoadingCourses, errorCourses } = useCourse();

    if (errorCourses) {
        return (
            <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 className="font-bold">Error loading courses!</h3>
                    <div className="text-xs">{errorCourses.message}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {isLoadingCourses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonLoader key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            ) : (
                <>
                    {courses.length === 0 ? (
                        <div className="text-center p-8 rounded-2xl bg-base-200/50">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
                            <p className="text-base-content/70">Get started by creating your first course</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};