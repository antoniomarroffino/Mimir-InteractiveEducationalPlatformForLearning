import {motion} from 'framer-motion';
import {useState} from 'react';
import {CreateCourseForm} from "../../components/course/CreateCourseForm.tsx";
import {CourseList} from "../../components/course/CourseList.tsx";
import {CourseSearch} from "../../components/course/CourseSearch.tsx";
import {LightBulbIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {CoursesPageHeader} from "../../components/course/CoursesPageHeader.tsx";
import {CoursesInfoAlert} from "../../components/course/CoursesInfoAlert.tsx";

export const CoursesDashboard = () => {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">
                <CoursesPageHeader
                    onToggleInfo={() => setShowInfo(prev => !prev)}
                    showInfoToggle
                />

                {showInfo && <CoursesInfoAlert />}

                <div className="grid lg:grid-cols-4 gap-8 mt-8 items-start">
                    {/* Form: più compatto */}
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100 max-w-sm mx-auto">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-indigo-900">
                                <PlusCircleIcon className="w-5 h-5"/>
                                Create New Course
                            </h2>
                            <p className="text-sm text-base-content/70 mb-4">
                                Transform your knowledge into an interactive journey for your students.
                            </p>
                            <CreateCourseForm/>
                        </div>
                    </motion.div>

                    {/* Contenuto principale: si espande */}
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="lg:col-span-3 space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary/20">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-secondary">
                                <LightBulbIcon className="w-5 h-5"/>
                                Your Teaching Impact
                            </h2>
                            <p className="text-sm text-base-content/70 mb-4">
                                Every course is an opportunity to spark curiosity and growth.
                            </p>
                            <CourseList/>
                        </div>

                        <CourseSearch/>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};
