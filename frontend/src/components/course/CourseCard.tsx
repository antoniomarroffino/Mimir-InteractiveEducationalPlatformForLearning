import {CourseDTO} from '@dti-isin/backend-api-client';
import {Link} from 'react-router-dom';
import {FiBookOpen, FiChevronRight, FiEdit3, FiFolder, FiUserCheck, FiUserPlus} from 'react-icons/fi';
import {useState} from 'react';

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
    const [localError, setLocalError] = useState<string | null>(null);

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
            className={`
                group relative 
                bg-white 
                rounded-xl 
                p-6 
                shadow-sm 
                hover:shadow-md 
                transition-all 
                duration-300 
                border 
                border-base-200 
                hover:border-primary/20 
                ${className}
            `}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <FiBookOpen className="text-2xl"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-base-content">
                            {course.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="mb-4 text-sm">
                {course.description ? (
                    <div className="text-base-content/70 line-clamp-2">
                        <FiEdit3 className="inline-block mr-2 text-base-content/50"/>
                        {course.description}
                    </div>
                ) : (
                    <p className="italic text-base-content/40">
                        No description
                    </p>
                )}
            </div>

            {/* Sezione di assegnazione */}
            {showAssignButton && (
                <div className="mb-4">
                    <div className="flex flex-col gap-2">
                        {(assignError || localError) && (
                            <div className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg">
                                {assignError?.message || localError}
                            </div>
                        )}

                        {isAssigned ? (
                            <button
                                className="
                                    w-full
                                    py-2
                                    px-4
                                    rounded-lg
                                    bg-emerald-50
                                    text-emerald-700
                                    border
                                    border-emerald-100
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    cursor-default
                                "
                            >
                                <FiUserCheck className="text-lg"/>
                                <span className="font-medium">Assigned to you</span>
                            </button>
                        ) : (
                            <button
                                className={`
                                    w-full 
                                    py-2 
                                    px-4 
                                    rounded-lg 
                                    bg-gradient-to-r 
                                    from-primary/90 
                                    to-secondary/90 
                                    text-white 
                                    hover:shadow-lg 
                                    transition-all 
                                    duration-200 
                                    flex 
                                    items-center 
                                    justify-center 
                                    gap-2
                                    ${isAssigning ? 'opacity-75 cursor-wait' : 'hover:-translate-y-0.5'}
                                `}
                                onClick={handleAssign}
                                disabled={isAssigning}
                            >
                                {isAssigning ? (
                                    <>
                                        <div className="h-5 w-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin"/>
                                        <span>Assigning...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiUserPlus className="text-lg"/>
                                        <span>Assign Course</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!showAssignButton && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-base-content/60">
                            <FiFolder/>
                            <span>{course.folders?.length || 0} Folders</span>
                        </div>
                        <Link
                            to={`/courses/${course.id}`}
                            className="
                                flex
                                items-center
                                gap-1
                                text-primary
                                hover:text-primary/80
                                transition-colors
                                group-hover:translate-x-1
                                transition-transform
                            "
                        >
                            <span className="font-medium">View Details</span>
                            <FiChevronRight className="mt-0.5 transform group-hover:translate-x-0.5 transition-transform"/>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};