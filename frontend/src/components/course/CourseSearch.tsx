import {useState} from 'react';
import {FiFilter, FiSearch} from 'react-icons/fi';
import {CourseCard} from './CourseCard';
import {SkeletonLoader} from '../common/SkeletonLoader';
import {useCourseList} from "../../hooks/course/useCourseList";

export const CourseSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const {courses, isLoadingCourses, errorCourses} = useCourseList();

    if (errorCourses) {
        return (
            <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                    <h3 className="font-bold">Error Loading Courses</h3>
                    <div className="text-xs">{errorCourses.message}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="input input-bordered w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"/>
                </div>
                <button className="btn btn-ghost btn-square">
                    <FiFilter className="text-xl"/>
                </button>
            </div>

            {/* Course List */}
            <div className="space-y-8">
                {isLoadingCourses ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <SkeletonLoader key={i} className="h-48 rounded-xl"/>
                        ))}
                    </div>
                ) : (
                    <>
                        {courses.length === 0 ? (
                            <div
                                className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold mb-2 text-base-content">
                                    No Courses Found
                                </h3>
                                <p className="text-base-content/70 max-w-md mx-auto">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                {courses.map(course => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        className="hover:scale-105 transition-transform duration-300"
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};