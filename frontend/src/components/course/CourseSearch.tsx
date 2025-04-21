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
        if (!searchTerm.trim()) return allCourses.slice(0, 6);
        const searchLower = searchTerm.toLowerCase();
        return allCourses.filter(course =>
            searchType === 'name'
                ? course.name.toLowerCase().includes(searchLower)
                : course.id?.toLowerCase() === searchLower
        );
    }, [allCourses, searchTerm, searchType]);

    const handleAssign = async (courseId: string) => {
        try {
            await assignCourse(courseId);
        } catch (err) {
            console.error('Assignment error:', err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowFilterDropdown(false);
            }
        };
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
        <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow-xl space-y-8">
            {errorAssignCourse && (
                <div className="alert alert-error shadow-lg">
                    <span className="font-bold">Assignment Error:</span> {errorAssignCourse.message}
                </div>
            )}

            {/* Search bar */}
            <div className="relative w-full">
                <input
                    type="text"
                    className="input input-bordered w-full pl-10 pr-12"
                    placeholder={searchType === 'name' ? "Search courses by name..." : "Search courses by ID..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"/>
                {searchTerm && (
                    <button
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-error"
                        onClick={() => setSearchTerm('')}
                    >
                        <FiX />
                    </button>
                )}
                {/* Filter Button */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={dropdownRef}>
                    <button
                        className="btn btn-ghost btn-xs btn-square"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        title="Filter"
                    >
                        <FiFilter className="text-lg" />
                    </button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                            <ul className="menu p-2 text-sm">
                                <li>
                                    <button
                                        onClick={() => {
                                            setSearchType('name');
                                            setShowFilterDropdown(false);
                                        }}
                                        className={searchType === 'name' ? 'text-primary font-semibold' : ''}
                                    >
                                        Search by Name
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            setSearchType('id');
                                            setShowFilterDropdown(false);
                                        }}
                                        className={searchType === 'id' ? 'text-primary font-semibold' : ''}
                                    >
                                        Search by ID
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Results */}
            {isLoadingAllCourses ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonLoader key={i} className="h-48 rounded-xl"/>
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12 px-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-base-content mb-2">
                        {searchTerm ? "No Matching Courses Found" : "No Courses Available"}
                    </h3>
                    <p className="text-base-content/70 max-w-md mx-auto">
                        {searchTerm
                            ? "Try adjusting your search criteria"
                            : "Create a new course or check back later"}
                    </p>
                </div>
            ) : (
                <>
                    {searchTerm && (
                        <p className="text-sm text-base-content/60">
                            Showing <strong>{filteredCourses.length}</strong> result{filteredCourses.length > 1 && 's'} for "<em>{searchTerm}</em>"
                        </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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
        </div>
    );
};
