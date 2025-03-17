import {Link} from 'react-router-dom';
import {FiHome, FiMenu, FiX} from 'react-icons/fi';
import LoginButton from "../../auth/LoginButton.tsx";
import LogoutButton from "../../auth/LogoutButton.tsx";
import {useState} from "react";
import '../../App.css';
import {useAuth} from "../../hooks/useAuth.ts";
import {Role} from "@dti-isin/backend-api-client";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {user} = useAuth();

    const navigationLinks = [
        {name: 'Home', path: '/', icon: <FiHome/>, roles: [Role.Admin, Role.Teacher, Role.Student]},
        {name: 'Admin', path: '/admin', roles: [Role.Admin]},
        {name: 'Corsi', path: '/courses', roles: [Role.Teacher]},
        {name: 'Dashboard', path: '/dashboard', roles: [Role.Student]},
    ];

    const filteredLinks = navigationLinks.filter(link =>
        !link.roles || (user?.role && link.roles.includes(user.role))
    );

    return (
        <header
            className="navbar bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg px-4 lg:px-8">
            {/* Logo */}
            <div className="navbar-start">
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="/supsi-logo.png"
                        alt="SUPSI logo"
                        className="h-10 w-auto"
                    />
                    <span className="text-xl font-bold hidden md:block">Mimir</span>
                </Link>
            </div>

            {/* Mobile Menu */}
            <div className="navbar-center lg:hidden">
                <button
                    className="btn btn-ghost text-xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX/> : <FiMenu/>}
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 bg-base-100 z-50 shadow-xl">
                        <ul className="menu py-4 px-2">
                            {filteredLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-base-content hover:bg-primary/10"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.icon}
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="mt-4">
                                {user ? (
                                    <LogoutButton className="btn btn-primary w-full"/>
                                ) : (
                                    <LoginButton className="btn btn-outline w-full"/>
                                )}
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Desktop Navigation */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-2 px-1">
                    {filteredLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                className="text-lg font-medium hover:bg-primary/20 rounded-btn"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Desktop Auth */}
            <div className="navbar-end hidden lg:flex gap-2">
                {user ? (
                    <LogoutButton className="btn btn-ghost hover:bg-primary/20"/>
                ) : (
                    <LoginButton className="btn btn-outline"/>
                )}
            </div>
        </header>
    );
};

export default Header;