import { useParams } from 'react-router-dom';
import { useCourse } from '../hooks/useCourses';
import FolderList from '../components/folder/FolderList';
import CreateFolderForm from '../components/folder/CreateFolderForm';
import { BsFolder, BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { data: course, isLoading } = useCourse(courseId!);

    if (isLoading) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 p-6">
            {/* Header con breadcrumb */}
            <div className="text-sm breadcrumbs mb-6">
                <ul>
                    <li>
                        <Link to="/" className="flex items-center gap-2">
                            <BsArrowLeft /> Home
                        </Link>
                    </li>
                    <li>{course?.name}</li>
                </ul>
            </div>

            {/* Course Info Card */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <div className="flex items-center gap-4">
                        <BsFolder className="text-4xl text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">{course?.name}</h1>
                            <p className="text-base-content/70">
                                {course?.folders?.length || 0} folders
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Folder Section */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h2 className="card-title mb-4">Create New Folder</h2>
                    <CreateFolderForm courseId={courseId!} />
                </div>
            </div>

            {/* Folders List */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Folders</h2>
                    <FolderList courseId={courseId!} />
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;