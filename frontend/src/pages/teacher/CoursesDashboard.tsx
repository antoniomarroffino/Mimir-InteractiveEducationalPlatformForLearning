import {motion} from 'framer-motion';
import {CreateCourseForm} from "../../components/course/CreateCourseForm.tsx";
import {CourseList} from "../../components/course/CourseList.tsx";
import {CourseSearch} from "../../components/course/CourseSearch.tsx";
import {LightBulbIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {CoursesPageHeader} from "../../components/course/CoursesPageHeader.tsx";

export const CoursesDashboard = () => {
    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <CoursesPageHeader />
                <div className="grid md:grid-cols-5 gap-8">
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="md:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-indigo-100"
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-indigo-900">
                            <PlusCircleIcon className="w-6 h-6"/>
                            Create New Course
                        </h2>
                        <p className="text-sm text-base-content/70 mb-4">
                            Transform your knowledge into an interactive journey for your students.
                        </p>
                        <CreateCourseForm/>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="md:col-span-3 bg-secondary/10 rounded-2xl p-6 shadow-xl"
                    >
                        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-secondary">
                            <LightBulbIcon className="w-6 h-6"/>
                            Your Teaching Impact
                        </h2>
                        <p className="text-sm text-base-content/70 mb-4">
                            Every course is an opportunity to spark curiosity and growth.
                        </p>
                        <CourseList/>
                    </motion.div>
                </div>

                <motion.div
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="bg-white shadow-lg rounded-2xl mt-12 p-6 border border-purple-100"
                >
                    <h3 className="text-xl font-bold text-purple-800 mb-6">Explore Your Courses</h3>
                    <CourseSearch/>
                </motion.div>
            </div>
        </motion.section>
    );
};
