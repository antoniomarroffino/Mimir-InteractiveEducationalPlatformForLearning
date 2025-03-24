import {CreateCourseForm} from "../../components/course/CreateCourseForm.tsx";
import {CourseList} from "../../components/course/CourseList.tsx";
import {AcademicCapIcon, LightBulbIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {CourseSearch} from "../../components/course/CourseSearch.tsx";

export const TeacherDashboard = () => {
    return (
        <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-primary mb-4 flex items-center justify-center gap-3">
                        <AcademicCapIcon className="w-10 h-10 text-primary"/>
                        Your Learning Playground
                    </h2>
                    <p className="text-xl text-base-content/80 max-w-2xl mx-auto">
                        Craft engaging learning experiences that inspire and transform
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Course Creation Card - Reduced to 2 columns */}
                    <div
                        className="md:col-span-2 card bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10">
                        <div className="card-body">
                            <h3 className="card-title text-xl text-primary flex items-center gap-3">
                                <PlusCircleIcon className="w-6 h-6"/>
                                Create New Course
                            </h3>
                            <p className="text-base-content/70 mb-2 text-sm">
                                Transform your knowledge into an interactive learning journey
                            </p>
                            <CreateCourseForm/>
                        </div>
                    </div>

                    {/* Inspiration Card - Expanded to 3 columns */}
                    <div
                        className="md:col-span-3 card bg-secondary/10 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="card-body">
                            <h3 className="card-title text-xl text-secondary flex items-center gap-3">
                                <LightBulbIcon className="w-6 h-6"/>
                                Your Teaching Impact
                            </h3>
                            <p className="text-base-content/80 mb-2 text-sm">
                                Every course is an opportunity to spark curiosity and growth
                            </p>
                            <CourseList/>
                        </div>
                    </div>
                </div>

                {/* Full Course List */}
                <div className="card bg-white shadow-lg mt-8">
                    <div className="card-body">
                        <h3 className="card-title text-xl mb-6 text-primary">
                            Search courses
                        </h3>
                        <CourseSearch/>
                    </div>
                </div>
            </div>
        </section>
    );
};