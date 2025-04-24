import React from 'react';
import {FiUser} from "react-icons/fi";
import {BasePageHeader} from "../../components/common/BasePageHeader.tsx";

interface UserProfilePageHeaderProps {
    onToggleInfo?: () => void;
    showInfoToggle?: boolean;
}

export const UserProfilePageHeader: React.FC<UserProfilePageHeaderProps> = ({
                                                                                onToggleInfo,
                                                                                showInfoToggle = false
                                                                            }) => (
    <BasePageHeader
        title="Your Profile Overview"
        subtitle="Manage your personal information and account details"
        icon={<FiUser className="w-10 h-10 text-white"/>}
        gradientFrom="from-gray-600"
        gradientTo="to-gray-800"
        showInfoToggle={showInfoToggle}
        onToggleInfo={onToggleInfo}
    />
);
