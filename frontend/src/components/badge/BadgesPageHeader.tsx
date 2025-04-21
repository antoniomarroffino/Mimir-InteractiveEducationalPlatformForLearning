import { BasePageHeader } from "../common/BasePageHeader";
import React from "react";
import {FiAward} from "react-icons/fi";

interface BadgesPageHeaderProps {
    totalBadges: number;
    onToggleInfo: () => void;
    showInfoToggle?: boolean;
}

export const BadgesPageHeader: React.FC<BadgesPageHeaderProps> = ({
                                                                      onToggleInfo,
                                                                      showInfoToggle = true,
                                                                      totalBadges
                                                                  }) => (
    <BasePageHeader
        title="Achievement Gallery"
        subtitle={`Celebrate your milestones and track your progress — ${totalBadges} badge${totalBadges === 1 ? '' : 's'} earned`}
        icon={<FiAward className="w-10 h-10 text-white" />}
        gradientFrom="from-yellow-500"
        gradientTo="to-orange-500"
        showInfoToggle={showInfoToggle}
        onToggleInfo={onToggleInfo}
    />
);
