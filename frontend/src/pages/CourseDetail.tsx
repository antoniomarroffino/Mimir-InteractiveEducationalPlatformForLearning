import { useParams } from 'react-router-dom';
import { useCourse } from '../hooks/useCourses';
import FolderList from '../components/folder/FolderList';
import CreateFolderForm from '../components/folder/CreateFolderForm';
import { BsFolder, BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { data: course, isLoading } = useCourse(courseId!);

    if (isLoading) return <div className="loading loading-spinner loading-lg"></div>;

    return (
        <div className="min-h-screen bg-base-200 p-6">
            {/* Header con breadcrumb */}
            <div className="text-sm breadcrumbs mb-6">
                <ul>
                    <li><Link to="/" className="flex items-center gap-2">
                        <BsArrowLeft /> Home
                    </Link></li>
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
            <div className="mb-8">
                <CreateFolderForm courseId={courseId!} />
            </div>

            {/* Folders Grid */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Folders</h2>
                <FolderList courseId={courseId!} />
            </div>
        </div>
    );
};

export default CourseDetail;