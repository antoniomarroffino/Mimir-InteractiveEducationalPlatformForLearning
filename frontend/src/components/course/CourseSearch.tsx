import {useEffect, useMemo, useRef, useState} from 'react';
import {FiFilter, FiSearch, FiX} from 'react-icons/fi';
import {CourseCard} from './CourseCard';
import {SkeletonLoader} from '../common/SkeletonLoader';
import {useCourseList} from "../../hooks/course/useCourseList";
import {useCourseCRUD} from "../../hooks/course/useCourseCRUD.ts";

type SearchType = 'name' | 'id';

export const CourseSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('name');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const {allCourses, isLoadingAllCourses, errorAllCourses, teacherCourses} = useCourseList();
    const {assignCourse, isAssigningCourse, errorAssignCourse} = useCourseCRUD();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredCourses = useMemo(() => {
        if (!searchTerm.trim()) {
            return allCourses.slice(0, 6);
        }

        const searchLower = searchTerm.toLowerCase().trim();
        return allCourses.filter(course => {
            if (searchType === 'name') {
                return course.name.toLowerCase().includes(searchLower);
            }
            return course.id?.toLowerCase() === searchLower;
        });
    }, [allCourses, searchTerm, searchType]);

    const handleAssign = async (courseId: string) => {
        try {
            await assignCourse(courseId);
        } catch (err) {
            console.error('Assignment error:', err);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowFilterDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (errorAllCourses) {
        return (
            <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                    <h3 className="font-bold">Error Loading Courses</h3>
                    <div className="text-xs">{errorAllCourses.message}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {errorAssignCourse && (
                <div className="alert alert-error shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                        <h3 className="font-bold">Assignment Error</h3>
                        <div className="text-xs">{errorAssignCourse.message}</div>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder={searchType === 'name'
                            ? "Search courses by name..."
                            : "Search courses by ID..."}
                        className="input input-bordered w-full pl-10 pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"/>
                    {searchTerm && (
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-error"
                            onClick={() => setSearchTerm('')}
                        >
                            <FiX className="text-base-content/50 hover:text-error"/>
                        </button>
                    )}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        className="btn btn-ghost btn-square relative"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                        <FiFilter className="text-xl"/>
                    </button>

                    {showFilterDropdown && (
                        <div
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-base-200 z-50">
                            <div className="p-2 space-y-1">
                                <button
                                    className={`w-full px-4 py-2 text-sm text-left rounded-md flex items-center gap-2 ${
                                        searchType === 'name'
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-base-200'
                                    }`}
                                    onClick={() => {
                                        setSearchType('name');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                    Search by Name
                                </button>
                                <button
                                    className={`w-full px-4 py-2 text-sm text-left rounded-md flex items-center gap-2 ${
                                        searchType === 'id'
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-base-200'
                                    }`}
                                    onClick={() => {
                                        setSearchType('id');
                                        setShowFilterDropdown(false);
                                    }}
                                >
                                    Search by ID
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Course List */}
            <div className="space-y-8">
                {isLoadingAllCourses ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <SkeletonLoader key={i} className="h-48 rounded-xl"/>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredCourses.length === 0 ? (
                            <div
                                className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold mb-2 text-base-content">
                                    {searchTerm ? "No Matching Courses Found" : "No Courses Available"}
                                </h3>
                                <p className="text-base-content/70 max-w-md mx-auto">
                                    {searchTerm ?
                                        "Try adjusting your search criteria" :
                                        "Create a new course or check back later"}
                                </p>
                            </div>
                        ) : (
                            <>
                                {searchTerm && (
                                    <div className="text-sm text-base-content/60">
                                        Showing {filteredCourses.length} results for "{searchTerm}"
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                    {filteredCourses.map(course => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            showAssignButton
                                            isAssigned={teacherCourses.some(tc => tc.id === course.id)}
                                            onAssign={handleAssign}
                                            isAssigning={isAssigningCourse}
                                            assignError={errorAssignCourse}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};