import { Link } from 'react-router-dom';
import { FiHome, FiMenu, FiUser, FiX, FiBook, FiDatabase, FiLayout } from 'react-icons/fi';
import LogoutButton from "../../auth/LogoutButton";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "@dti-isin/backend-api-client";
import LoginButton from "../../auth/LoginButton";
import mimirLogo from '../../assets/mimir-logo.png';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user } = useAuth();

    const navigationLinks = [
        { name: 'Home', path: '/', icon: <FiHome className="text-xl" />, roles: [Role.Admin, Role.Teacher, Role.Student] },
        { name: 'Admin', path: '/admin', icon: <FiLayout className="text-xl" />, roles: [Role.Admin] },
        { name: 'Courses', path: '/courses', icon: <FiBook className="text-xl" />, roles: [Role.Teacher] },
        { name: 'Question Bank', path: '/question_banks', icon: <FiDatabase className="text-xl" />, roles: [Role.Teacher] },
        { name: 'Dashboard', path: '/dashboard', icon: <FiLayout className="text-xl" />, roles: [Role.Student] },
    ];

    const filteredLinks = navigationLinks.filter(link =>
        !link.roles || (user?.role && link.roles.includes(user.role))
    );

    return (
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-base-100/80 border-b border-base-200">
            <div className="container mx-auto">
                <nav className="navbar px-4 h-16">
                    <div className="navbar-start">
                        <Link
                            to="/"
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={mimirLogo}
                                alt="Mimir logo"
                                className="h-8 w-auto"
                            />
                            <span className="text-xl font-bold hidden md:block">
                                Mimir
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-center lg:hidden">
                        <button
                            className="btn btn-ghost btn-circle"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </button>
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal gap-2">
                            {filteredLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="px-4 py-2 rounded-lg hover:bg-base-200 transition-colors flex items-center gap-2 font-medium"
                                    >
                                        {link.icon}
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="navbar-end">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <button
                                    className="btn btn-ghost btn-circle"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center"> {/* Cambiato qui */}
                                        <FiUser className="w-5 h-5" />
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <ul className="dropdown-content menu p-2 mt-2 bg-base-100 rounded-box shadow-xl w-48">
                                        <li>
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-2 px-4 py-2"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <FiUser className="w-4 h-4" />
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <LogoutButton className="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10" />
                                        </li>
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <LoginButton className="btn btn-primary btn-sm" />
                        )}
                    </div>
                </nav>

                {isOpen && (
                    <div className="lg:hidden">
                        <ul className="menu bg-base-100 w-full p-4 rounded-b-box shadow-lg">
                            {filteredLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2 px-4 py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;