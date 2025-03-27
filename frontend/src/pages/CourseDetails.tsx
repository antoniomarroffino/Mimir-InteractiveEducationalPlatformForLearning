import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {BsChevronRight, BsPencil, BsTrash} from 'react-icons/bs';
import {FolderList} from "../components/folder/FolderList.tsx";
import {CreateFolderForm} from "../components/folder/CreateFolderForm.tsx";
import {useCourseList} from "../hooks/course/useCourseList.ts";
import {useCourseSelection} from "../hooks/course/useCourseSelection.ts";
import {useCourseCRUD} from "../hooks/course/useCourseCRUD.ts";

const CourseDetails = () => {
    const {courseId} = useParams();
    const navigate = useNavigate();
    const {courses, isLoadingCourses, errorCourses} = useCourseList();
    const {setSelectedCourseId, setSelectedCourse, selectedCourse} = useCourseSelection();
    const {updateCourse, deleteCourse} = useCourseCRUD();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    useEffect(() => {
        if (courseId) {
            const course = courses.find(course => course.id === courseId);
            if (course) {
                setSelectedCourseId(courseId);
                setSelectedCourse(course);
                setEditedName(course.name);
                setEditedDescription(course.description || '');
            }
        }
    }, [courseId, courses, setSelectedCourseId, setSelectedCourse]);

    const handleSaveEdit = async () => {
        if (selectedCourse) {
            try {
                await updateCourse(
                    selectedCourse.id!,
                    editedName,
                    editedDescription || undefined
                );
                setIsEditing(false);
            } catch (error) {
                console.error('Failed to update course', error);
            }
        }
    };

    const handleDeleteCourse = () => {
        const modal = document.getElementById('delete_course_modal') as HTMLDialogElement;
        if (modal) modal.showModal();
    };

    const confirmDeleteCourse = async () => {
        if (selectedCourse) {
            try {
                await deleteCourse(selectedCourse.id!);
                navigate('/courses');
            } catch (error) {
                console.error('Failed to delete course', error);
            }
        }
    };

    if (isLoadingCourses) {
        return (
            <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (errorCourses) {
        return (
            <div className="alert alert-error flex justify-between items-center">
                <span>Error loading courses: {errorCourses.message}</span>
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate('/')}
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    if (!courseId || !selectedCourse) {
        return (
            <div className="alert alert-warning flex justify-between items-center">
                <span>Course not found.</span>
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate('/')}
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="mb-8 flex justify-between items-center">
                <ul className="flex items-center gap-2 text-sm">
                    <li>
                        <Link
                            to="/"
                            className="text-primary hover:text-primary-focus"
                            onClick={() => setSelectedCourseId(null)}
                        >
                            Home
                        </Link>
                    </li>
                    <BsChevronRight className="text-gray-400"/>
                    <li>
                        <span className="font-semibold">{selectedCourse.name}</span>
                    </li>
                </ul>
                <div className="flex gap-2">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : <BsPencil/>}
                    </button>
                    <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={handleDeleteCourse}
                    >
                        <BsTrash/>
                    </button>
                </div>
            </div>

            {/* Course Title and Info */}
            <div className="bg-base-100 rounded-lg p-6 shadow-lg mb-8">
                {isEditing ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Course Name"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="textarea textarea-bordered w-full"
                            placeholder="Course Description (Optional)"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="btn btn-primary"
                                onClick={handleSaveEdit}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-2">{selectedCourse.name}</h1>
                        <p className="text-base-content/70 mb-2">
                            {selectedCourse.description || 'No description'}
                        </p>
                        <p className="text-base-content/70">
                            {selectedCourse.folders?.length || 0} folders
                        </p>
                    </>
                )}
            </div>

            <CreateFolderForm/>

            {/* Folders Section */}
            <div className="bg-base-100 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Folders</h2>

                <FolderList courseId={courseId}/>
            </div>

            {/* Delete Confirmation Modal */}
            <dialog id="delete_course_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Course</h3>
                    <p className="py-4">
                        Are you sure you want to delete this course?
                        This action cannot be undone and will remove all associated folders and content.
                    </p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    const modal = document.getElementById('delete_course_modal') as HTMLDialogElement;
                                    if (modal) modal.close();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={confirmDeleteCourse}
                            >
                                Delete Course
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default CourseDetails;