import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {FolderList} from "../components/folder/FolderList.tsx";
import {CreateFolderForm} from "../components/folder/CreateFolderForm.tsx";
import {useCourseList} from "../hooks/course/useCourseList.ts";
import {useCourseCRUD} from "../hooks/course/useCourseCRUD.ts";
import {FiFolder} from "react-icons/fi";
import {BsTrash} from "react-icons/bs";
import {useFolderCRUD} from "../hooks/folder/useFolderCRUD.ts";
import {useGetCourseById} from "../hooks/course/useGetCourseById.ts";
import {LoadingSpinner} from "../components/common/LoadingSpinner.tsx";
import {CourseDetailsHeader} from "../components/folder/CourseDetailsHeader.tsx";
import {motion} from "framer-motion";
import {LeaveCoursePopup} from "../components/course/LeaveCoursePopup.tsx";
import {DeleteCoursePopup} from "../components/course/DeleteCoursePopup.tsx";

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

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showLeavePopup, setShowLeavePopup] = useState(false);

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
        <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                <CourseDetailsHeader
                    course={selectedCourse}
                    isEditing={isEditing}
                    newName={editedName}
                    editedDescription={editedDescription}
                    onEditToggle={() => setIsEditing(!isEditing)}
                    onNameChange={setEditedName}
                    onDescriptionChange={setEditedDescription}
                    onNameSave={handleSaveEdit}
                    onDeleteClick={() => setShowDeletePopup(true)}
                    onLeaveClick={() => setShowLeavePopup(true)}
                    onCancelEdit={() => setIsEditing(false)}
                />

                <div className="grid lg:grid-cols-4 gap-8 items-start">
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2}}
                        className="lg:col-span-1"
                    >
                        <CreateFolderForm courseId={courseId}/>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.3}}
                        className="lg:col-span-3 space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-xl border border-secondary/20">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
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
                    </motion.div>
                </div>

                {showDeletePopup && (
                    <DeleteCoursePopup
                        courseName={selectedCourse.name}
                        onCancel={() => setShowDeletePopup(false)}
                        onConfirm={confirmDeleteCourse}
                    />
                )}

                {showLeavePopup && (
                    <LeaveCoursePopup
                        courseName={selectedCourse.name}
                        onCancel={() => setShowLeavePopup(false)}
                        onConfirm={handleLeaveCourse}
                    />
                )}
            </div>
        </motion.section>
    );
};

export default CourseDetailsPage;
