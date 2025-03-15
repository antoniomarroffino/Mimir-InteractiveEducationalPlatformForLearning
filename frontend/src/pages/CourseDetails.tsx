import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCourse } from '../hooks/useCourse';
import { BsChevronRight } from 'react-icons/bs';
import { FolderList } from "../components/folder/FolderList.tsx";
import CreateFolderForm from "../components/folder/CreateFolderForm.tsx";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { courses, setSelectedCourseId } = useCourse();

    useEffect(() => {
        if (courseId) {
            setSelectedCourseId(courseId);
        }
    }, [courseId, setSelectedCourseId]);

    const currentCourse = courses.find(course => course.id === courseId);

    if (!courseId || !currentCourse) {
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
            <div className="mb-8">
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
                        <span className="font-semibold">{currentCourse.name}</span>
                    </li>
                </ul>
            </div>

            {/* Course Title and Info */}
            <div className="bg-base-100 rounded-lg p-6 shadow-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">{currentCourse.name}</h1>
                <p className="text-base-content/70">
                    {currentCourse.folders?.length || 0} folders
                </p>
            </div>

            <CreateFolderForm/>

            {/* Folders Section */}
            <div className="bg-base-100 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Folders</h2>
                <FolderList
                    folders={currentCourse.folders || []}
                    courseId={courseId}
                />
            </div>
        </div>
    );
};

export default CourseDetails;