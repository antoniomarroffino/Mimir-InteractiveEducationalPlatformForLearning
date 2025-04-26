import React from 'react';
import {FiShield} from 'react-icons/fi';
import {BasePageHeader} from "../../components/common/BasePageHeader.tsx";

interface AdminDashboardHeaderProps {
    onToggleInfo: () => void;
    showInfoToggle?: boolean;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
                                                                              onToggleInfo,
                                                                              showInfoToggle = false
                                                                          }) => (
    <BasePageHeader
        title="Administration Panel"
        subtitle="Manage user roles and view registered educators with confidence."
        icon={<FiShield className="w-10 h-10 text-white" />}
        gradientFrom="from-gray-600"
        gradientTo="to-zinc-600"
        showInfoToggle={showInfoToggle}
        onToggleInfo={onToggleInfo}
    />
);