import {PageInfoAlert} from "../common/PageInfoAlert";
import {AcademicCapIcon} from "@heroicons/react/24/solid";

export const CoursesInfoAlert = () => (
    <PageInfoAlert
        icon={<AcademicCapIcon className="w-5 h-5" />}
        title="Manage Your Courses"
        message="Create new learning spaces for your students, organize educational content, and track your teaching impact. Each course you create is a new opportunity to spark engagement and foster growth."
        colorFrom="from-indigo-50"
        colorTo="to-purple-50"
        iconColor="text-indigo-600"
    />
);
