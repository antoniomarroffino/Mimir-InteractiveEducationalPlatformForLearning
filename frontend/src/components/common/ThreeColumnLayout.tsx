import React from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { BsLayoutSidebar, BsListUl } from "react-icons/bs";

const colSpanMap: Record<string, string> = {
    "1": "lg:col-span-1",
    "2": "lg:col-span-2",
    "3": "lg:col-span-3",
    "4": "lg:col-span-4",
    "5": "lg:col-span-5",
    "6": "lg:col-span-6",
    "7": "lg:col-span-7",
    "8": "lg:col-span-8",
    "9": "lg:col-span-9",
    "10": "lg:col-span-10",
    "11": "lg:col-span-11",
    "12": "lg:col-span-12",
};

interface ThreeColumnLayoutProps {
    sidebarContent: React.ReactNode;
    mainContent: React.ReactNode;
    rightContent: React.ReactNode;
    isSidebarOpen: boolean;
    onSidebarToggle: () => void;
    onSidebarClose: () => void;
    lgSidebarCols?: number;
    lgMainCols?: number;
    lgRightCols?: number;
    sidebarTitle?: string;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
                                                                        sidebarContent,
                                                                        mainContent,
                                                                        rightContent,
                                                                        isSidebarOpen,
                                                                        onSidebarToggle,
                                                                        onSidebarClose,
                                                                        lgSidebarCols = 4,
                                                                        lgMainCols = 5,
                                                                        lgRightCols = 3,
                                                                    }) => {
    const sidebarClass = colSpanMap[lgSidebarCols] ?? "lg:col-span-4";
    const mainClass = colSpanMap[lgMainCols] ?? "lg:col-span-5";
    const rightClass = colSpanMap[lgRightCols] ?? "lg:col-span-3";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
            <div className="lg:hidden absolute top-0 right-0 z-50">
                <button className="btn btn-ghost" onClick={onSidebarToggle}>
                    {isSidebarOpen ? <BsLayoutSidebar /> : <BsListUl />}
                </button>
            </div>

            <div
                className={`
          ${sidebarClass} 
          fixed lg:static 
          top-0 left-0 
          w-full h-full lg:w-auto lg:h-auto 
          z-40 
          transform transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          bg-base-100/95 backdrop-blur-sm lg:bg-transparent 
          overflow-y-auto px-0 py-0
        `}
            >
                <div className="bg-base-100 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            className="btn btn-circle btn-sm lg:hidden"
                            onClick={onSidebarClose}
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                    {sidebarContent}
                </div>
            </div>

            <div className={`${mainClass} order-first lg:order-none`}>
                {mainContent}
            </div>

            <div className={rightClass}>
                {rightContent}
            </div>
        </div>
    );
};
