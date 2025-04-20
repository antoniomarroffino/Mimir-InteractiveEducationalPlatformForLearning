import {AcademicCapIcon} from '@heroicons/react/24/outline';
import { BasePageHeader } from '../common/BasePageHeader';

export const CoursesPageHeader = () => (
    <BasePageHeader
        title="Your Learning Playground"
        subtitle="Craft engaging learning experiences that inspire and transform"
        icon={<AcademicCapIcon className="w-10 h-10 text-white" />}
        gradientFrom="from-blue-600"
        gradientTo="to-cyan-600"
    />
);
