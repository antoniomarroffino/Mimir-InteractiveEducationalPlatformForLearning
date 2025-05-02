import {CourseDTO} from '@dti-isin/backend-api-client';
import {Link} from 'react-router-dom';
import {FiBookOpen, FiChevronRight, FiFolder, FiUserCheck, FiUserPlus} from 'react-icons/fi';
import {useState} from 'react';
import {useGetFoldersInCourseId} from "../../hooks/folder/useGetFoldersInCourseId.ts";
import {LoadingSpinner} from "../common/LoadingSpinner.tsx";

interface CourseCardProps {
    course: CourseDTO;
    className?: string;

    isAssigned?: boolean;
    onAssign?: (courseId: string) => Promise<void>;
    isAssigning?: boolean;
    assignError?: Error | null;

    showAssignButton?: boolean;
}

export const CourseCard = ({
                               course,
                               className = '',
                               isAssigned = false,
                               onAssign,
                               isAssigning = false,
                               assignError,
                               showAssignButton = false
                           }: CourseCardProps) => {
    const {data: folders, isLoading: isLoadingFolders} = useGetFoldersInCourseId(course.id!);
    const [localError, setLocalError] = useState<string | null>(null);

    if (isLoadingFolders) {
        return <LoadingSpinner fullScreen/>;
    }

    const handleAssign = async () => {
        if (!onAssign) return;

        try {
            setLocalError(null);
            await onAssign(course.id!);
        } catch (err) {
            setLocalError('Failed to assign course. Please try again. Error: ' + err);
        }
    };

    return (
        <div
            className={`group relative bg-gradient-to-br from-white to-indigo-50
                rounded-2xl p-6 shadow-md border border-base-200 hover:shadow-xl
                transition-all duration-300 hover:border-primary/30 ${className}`}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <FiBookOpen className="text-2xl"/>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-base-content">{course.name}</h3>
                    {course.description && (
                        <p className="text-sm text-base-content/60 line-clamp-2 mt-1">{course.description}</p>
                    )}
                </div>
            </div>

            {showAssignButton ? (
                <div className="mt-4 space-y-2">
                    {(assignError || localError) && (
                        <div className="text-sm text-error bg-red-50 px-3 py-2 rounded-lg">
                            {assignError?.message || localError}
                        </div>
                    )}
                    {isAssigned ? (
                        <div
                            className="bg-emerald-50 text-emerald-700 py-2 px-4 rounded-lg text-center flex items-center justify-center gap-2 border border-emerald-200">
                            <FiUserCheck/>
                            Assigned to you
                        </div>
                    ) : (
                        <button
                            className="btn btn-primary w-full flex items-center justify-center gap-2"
                            onClick={handleAssign}
                            disabled={isAssigning}
                        >
                            {isAssigning ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <>
                                    <FiUserPlus/>
                                    Assign Course
                                </>
                            )}
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex justify-between items-center mt-6 text-sm text-base-content/70">
                    <div className="flex items-center gap-2">
                        <FiFolder/>
                        <span>{folders?.length || 0} Folders</span>
                    </div>
                    <Link
                        to={`/courses/${course.id}`}
                        className="text-primary font-medium hover:underline hover:text-primary/80 flex items-center gap-1"
                    >
                        View Details <FiChevronRight className="mt-0.5"/>
                    </Link>
                </div>
            )}
        </div>

    );
};