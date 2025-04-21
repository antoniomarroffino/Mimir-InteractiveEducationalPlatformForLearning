import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export interface Crumb {
    label: string;
    to?: string;
    icon?: React.ReactNode;
}

interface BaseBreadcrumbProps {
    crumbs: Crumb[];
}

export const BaseBreadcrumb: React.FC<BaseBreadcrumbProps> = ({ crumbs }) => {
    return (
        <nav className="mb-8">
            <ul className="flex flex-wrap items-center gap-2 text-sm bg-base-200 px-4 py-2 rounded-full">
                {crumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <FiChevronRight className="text-base-content/40" />}
                        <li>
                            {crumb.to ? (
                                <Link
                                    to={crumb.to}
                                    className="flex items-center text-primary hover:text-primary-focus transition-colors"
                                >
                                    {crumb.icon && <span className="mr-1.5">{crumb.icon}</span>}
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-primary flex items-center">
                                    {crumb.icon && <span className="mr-1.5">{crumb.icon}</span>}
                                    {crumb.label}
                                </span>
                            )}
                        </li>
                    </React.Fragment>
                ))}
            </ul>
        </nav>
    );
};
