import { Folder } from '../../api/generated';
import { BsFolder2Open } from 'react-icons/bs';
import { Link } from 'react-router-dom';

interface FolderCardProps {
    folder: Folder;
    courseId: string;
}

const FolderCard = ({ folder, courseId }: FolderCardProps) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body">
                <div className="flex items-center gap-3">
                    <BsFolder2Open className="text-2xl text-primary" />
                    <h3 className="card-title">{folder.name}</h3>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link
                        to={`/courses/${courseId}/folders/${folder.id}`}
                        className="btn btn-primary btn-sm"
                    >
                        Open Folder
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FolderCard;