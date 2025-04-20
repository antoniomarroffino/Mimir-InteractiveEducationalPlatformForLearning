import { Link, useLocation } from 'react-router-dom';
import { FiBook, FiDatabase, FiHome, FiLayout, FiMenu, FiUser, FiX, FiAward } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LogoutButton from "../../auth/LogoutButton";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "@dti-isin/backend-api-client";
import LoginButton from "../../auth/LoginButton";
import mimirLogo from '../../assets/mimir-logo.png';
import {FaClipboardList} from "react-icons/fa";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        setIsOpen(false);
        setIsDropdownOpen(false);
    }, [location]);

    const navigationLinks = [
        { name: 'Home', path: '/', icon: <FiHome className="text-xl" />, roles: [Role.Admin, Role.Teacher, Role.Student] },
        { name: 'Admin', path: '/admin', icon: <FiLayout className="text-xl" />, roles: [Role.Admin] },
        { name: 'Courses', path: '/courses', icon: <FiBook className="text-xl" />, roles: [Role.Teacher] },
        { name: 'Question Bank', path: '/question_banks', icon: <FiDatabase className="text-xl" />, roles: [Role.Teacher] },
        { name: 'Quiz Review', path: '/quiz-review', icon: <FaClipboardList className="text-xl" />, roles: [Role.Student, Role.Teacher] },
        { name: 'Badges', path: '/badges', icon: <FiAward className="text-xl" />, roles: [Role.Student, Role.Teacher] }
    ];

    const filteredLinks = navigationLinks.filter(link =>
        !link.roles || (user?.role && link.roles.includes(user.role))
    );

    return (
        <motion.header
            className="sticky top-0 z-50 bg-base-100/95 backdrop-blur-md border-b border-base-200 shadow-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="container mx-auto">
                <nav className="navbar px-4 h-16">
                    <div className="navbar-start">
                        <Link
                            to="/"
                            className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group"
                        >
                            <motion.img
                                src={mimirLogo}
                                alt="Mimir logo"
                                className="h-8 w-auto"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            />
                            <motion.span
                                className="text-xl font-bold hidden md:block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Mimir
                            </motion.span>
                        </Link>
                    </div>

                    <div className="navbar-center lg:hidden">
                        <motion.button
                            className="btn btn-ghost btn-circle"
                            onClick={() => setIsOpen(!isOpen)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </motion.button>
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal gap-2">
                            {filteredLinks.map((link) => (
                                <motion.li
                                    key={link.name}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to={link.path}
                                        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium
                                                  ${location.pathname === link.path
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-base-200'}`}
                                    >
                                        {link.icon}
                                        <span>{link.name}</span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="navbar-end">
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <motion.button
                                    className="btn btn-ghost btn-circle"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 grid place-items-center">
                                        <FiUser className="w-5 h-5 text-primary" />
                                    </div>
                                </motion.button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.ul
                                            className="dropdown-content menu p-2 mt-2 bg-base-100 rounded-box shadow-xl w-48"
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            <li>
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 transition-colors duration-300"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <FiUser className="w-4 h-4" />
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <LogoutButton className="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10 transition-colors duration-300" />
                                            </li>
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LoginButton className="btn btn-primary btn-sm" />
                            </motion.div>
                        )}
                    </div>
                </nav>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="lg:hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                            <ul className="menu bg-base-100 w-full p-4 rounded-b-box shadow-lg">
                                {filteredLinks.map((link) => (
                                    <motion.li
                                        key={link.name}
                                        whileHover={{ x: 10 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    >
                                        <Link
                                            to={link.path}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300
                                                      ${location.pathname === link.path
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-base-200'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.icon}
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default Header;