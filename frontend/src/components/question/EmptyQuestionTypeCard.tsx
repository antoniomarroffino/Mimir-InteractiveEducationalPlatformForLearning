import React from "react";
import {BsQuestionDiamond} from "react-icons/bs";

export const EmptyQuestionTypeCard: React.FC = () => {
    return (
        <div className="bg-base-100 rounded-xl p-6 shadow-xl opacity-50 text-center">
            <BsQuestionDiamond className="text-6xl mx-auto mb-4 text-base-content/30"/>
            <h2 className="text-lg font-semibold mb-3">Question Type</h2>
            <p className="text-base-content/70">
                Select "Create New Question" to start
            </p>
        </div>
    );
};
