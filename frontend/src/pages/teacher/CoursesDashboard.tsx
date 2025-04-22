import {motion} from 'framer-motion';
import {useState} from 'react';
import {CreateCourseForm} from "../../components/course/CreateCourseForm.tsx";
import {CourseList} from "../../components/course/CourseList.tsx";
import {CourseSearch} from "../../components/course/CourseSearch.tsx";
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
                {showInfo && <CoursesInfoAlert/>}
                <div className="grid lg:grid-cols-4 gap-8 mt-8 items-start">
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="lg:col-span-1"
                    >
                        <CreateCourseForm/>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="lg:col-span-3 space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary/20">
                            <CourseList/>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary/20">
                            <CourseSearch/>
                        </div>

                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};
