import {CourseCard} from './CourseCard';
import {SkeletonLoader} from '../common/SkeletonLoader';
import {useCourseList} from "../../hooks/course/useCourseList.ts";
import {BookOpenIcon} from "@heroicons/react/24/outline";
import {motion} from "framer-motion";

export const CourseList = () => {
    const {teacherCourses, isLoadingTeacherCourses, errorTeacherCourses} = useCourseList();

    if (errorTeacherCourses) {
        return (
            <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                    <h3 className="font-bold">Error Loading Courses</h3>
                    <div className="text-xs">{errorTeacherCourses.message}</div>
                </div>
            </div>
        );
    }

    if (isLoadingTeacherCourses) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <SkeletonLoader key={i} className="h-48 rounded-xl" />
                ))}
            </div>
        );
    }

    if (teacherCourses.length === 0) {
        return (
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10"
            >
                <BookOpenIcon className="w-16 h-16 mx-auto text-primary/70 mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-base-content">
                    Your Course Canvas is Empty
                </h3>
                <p className="text-base-content/70 max-w-md mx-auto">
                    Start your teaching journey by creating your first course.
                    Every great learning experience begins with a single step.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {opacity: 0},
                visible: {
                    opacity: 1,
                    transition: {staggerChildren: 0.1}
                }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {teacherCourses.map(course => (
                <motion.div
                    key={course.id}
                    variants={{hidden: {opacity: 0, y: 10}, visible: {opacity: 1, y: 0}}}
                    className="hover:scale-105 transition-transform duration-300"
                >
                    <CourseCard course={course} />
                </motion.div>
            ))}
        </motion.div>
    );
};
