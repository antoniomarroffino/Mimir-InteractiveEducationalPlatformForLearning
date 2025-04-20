import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {FolderList} from "../components/folder/FolderList.tsx";
import {CreateFolderForm} from "../components/folder/CreateFolderForm.tsx";
import {useCourseList} from "../hooks/course/useCourseList.ts";
import {useCourseCRUD} from "../hooks/course/useCourseCRUD.ts";
import {FiFolder} from "react-icons/fi";
import {BsBoxArrowRight, BsPencil, BsTrash} from "react-icons/bs";
import {BreadcrumbCourses} from "../components/common/BreadcrumbCourses.tsx";
import {useFolderCRUD} from "../hooks/folder/useFolderCRUD.ts";
import {useGetCourseById} from "../hooks/course/useGetCourseById.ts";
import {LoadingSpinner} from "../components/common/LoadingSpinner.tsx";

const CourseDetailsPage = () => {
    const {courseId} = useParams();
    const navigate = useNavigate();
    const {data: selectedCourse, isLoading, error} = useGetCourseById(courseId!);
    const {teacherCourses, isLoadingTeacherCourses, errorTeacherCourses} = useCourseList();
    const {updateCourse, deleteCourse, leftCourse} = useCourseCRUD();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const {deleteFolder, isDeletingFolder, errorDeleteFolder} = useFolderCRUD();

    const toggleSelection = (folderId: string) => {
        setSelectedFolders(prev =>
            prev.includes(folderId)
                ? prev.filter(id => id !== folderId)
                : [...prev, folderId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedFolders.length === selectedCourse?.folders?.length) {
            setSelectedFolders([]);
        } else {
            setSelectedFolders(selectedCourse?.folders?.map(f => f.id!) || []);
        }
    };

    const handleDeleteSelected = async () => {
        for (const folderId of selectedFolders) {
            await deleteFolder(courseId!, folderId);
        }
        setSelectedFolders([]);
    };


    const handleLeaveCourse = async () => {
        if (selectedCourse) {
            try {
                await leftCourse(selectedCourse.id!);
                navigate('/courses');
            } catch (error) {
                console.error('Failed to leave course', error);
            }
        }
    };

    useEffect(() => {
        if (courseId) {
            const course = teacherCourses.find(course => course.id === courseId);
            if (course) {
                setEditedName(course.name);
                setEditedDescription(course.description || '');
            }
        }
    }, [courseId, teacherCourses]);

    const handleSaveEdit = async () => {
        if (selectedCourse) {
            try {
                await updateCourse(
                    selectedCourse.id!,
                    {
                        ...selectedCourse,
                        name: editedName,
                        description: editedDescription || undefined,
                    }
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

    const handleLeaveConfirmation = () => {
        const modal = document.getElementById('leave_course_modal') as HTMLDialogElement;
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

    if (isLoadingTeacherCourses || isLoading) {
        return <LoadingSpinner fullScreen/>;
    }

    if (errorTeacherCourses || error) {
        return (
            <div className="alert alert-error flex justify-between items-center">
                <span>Error loading courses: {errorTeacherCourses?.message}</span>
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
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
            <BreadcrumbCourses course={selectedCourse}/>


            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <div className="flex-1 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="text-3xl font-bold bg-transparent border-b-2 border-primary focus:outline-none"
                                    autoFocus
                                />
                            ) : (
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {selectedCourse.name}
                                </h1>
                            )}

                            {!isEditing && (
                                <div className="text-base-content/60 prose prose-sm italic text-left w-full">
                                    {selectedCourse.description || 'No description provided'}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="btn btn-ghost btn-square hover:bg-transparent"
                                data-tip={isEditing ? "Cancel" : "Edit"}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <BsPencil className="text-xl text-primary"/>
                            </button>
                            <button
                                className="btn btn-ghost btn-square hover:bg-transparent text-error"
                                data-tip="Delete course"
                                onClick={handleDeleteCourse}
                            >
                                <BsTrash className="text-xl"/>
                            </button>
                            <button
                                className="btn btn-outline btn-error"
                                onClick={handleLeaveConfirmation}
                            >
                                Leave Course
                            </button>
                        </div>
                    </div>
                    <div className="mb-8">
                        {isEditing && (
                            <div
                                className="bg-base-100 p-6 rounded-xl shadow-sm border-2 border-dashed border-primary/20">
              <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="textarea textarea-ghost w-full text-lg p-0 border-none focus:outline-none placeholder:text-base-content/40"
                  placeholder="✍️ Type course description here..."
                  rows={3}
              />
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary gap-2"
                                        onClick={handleSaveEdit}
                                    >
                                        <BsPencil/>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="top-8 h-fit">
                        <CreateFolderForm courseId={courseId}/>
                    </div>
                </div>
            </div>


            <div className="space-y-6 w-full">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <FiFolder className="text-primary"/>
                        Course Folders
                    </h2>

                    <div className="flex gap-2 items-center">
                        {selectedFolders.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="btn btn-error btn-sm gap-2"
                                disabled={isDeletingFolder}
                            >
                                <BsTrash/>
                                Delete ({selectedFolders.length})
                            </button>
                        )}
                        <button
                            onClick={toggleSelectAll}
                            className="btn btn-ghost btn-sm"
                        >
                            {selectedCourse.folders!.length > 0 && selectedFolders.length === selectedCourse?.folders?.length ?
                                'Deselect All' : 'Select All'}
                        </button>
                    </div>
                </div>

                {errorDeleteFolder && (
                    <div className="alert alert-error">
                        {errorDeleteFolder.message}
                    </div>
                )}

                <FolderList
                    courseId={courseId}
                    selectedFolders={selectedFolders}
                    onToggleSelect={toggleSelection}
                />
            </div>

            {/* Modal delete migliorato */}
            <dialog id="delete_course_modal" className="modal">
                <div className="modal-box bg-base-100 border border-error/20">
                    <form method="dialog" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-error/10 text-error">
                                <BsTrash className="text-2xl"/>
                            </div>
                            <h3 className="font-bold text-lg">Confirm Deletion</h3>
                        </div>

                        <p className="py-4 text-base-content/80">
                            You're about to permanently delete <strong>{selectedCourse.name}</strong>
                            and all its contents. This action cannot be undone.
                        </p>

                        <div className="modal-action flex justify-end gap-3">
                            <button className="btn btn-ghost">Cancel</button>
                            <button
                                className="btn btn-error gap-2"
                                onClick={confirmDeleteCourse}
                            >
                                <BsTrash/>
                                Delete Permanently
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            <dialog id="leave_course_modal" className="modal">
                <div className="modal-box bg-base-100 border border-error/20">
                    <form method="dialog" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-error/10 text-error">
                                <BsBoxArrowRight className="text-2xl"/>
                            </div>
                            <h3 className="font-bold text-lg">Confirm Leave</h3>
                        </div>

                        <p className="py-4 text-base-content/80">
                            You're about to leave <strong>{selectedCourse.name}</strong>.
                            You'll lose access to all course content until you rejoin.
                        </p>

                        <div className="modal-action flex justify-end gap-3">
                            <button className="btn btn-ghost">Cancel</button>
                            <button
                                className="btn btn-error gap-2"
                                onClick={handleLeaveCourse}
                            >
                                <BsBoxArrowRight/>
                                Confirm Leave
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default CourseDetailsPage;