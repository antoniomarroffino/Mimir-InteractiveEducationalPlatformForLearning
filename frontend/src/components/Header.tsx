import '../App.css';
import LoginButton from "../auth/LoginButton";
import {AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import LogoutButton from "../auth/LogoutButton";
import { useState } from "react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="navbar bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
            {/* Logo e Brand */}
            <div className="navbar-start">
                <a href="/" className="px-2">
                    <img
                        src="/supsi-logo.png"
                        alt="SUPSI logo"
                        className="h-8 w-auto"
                    />
                </a>
            </div>

            {/* Menu centrale */}
            <div className="navbar-center">
                {/* Menu mobile */}
                <div className="lg:hidden">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </button>
                    {isOpen && (
                        <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 absolute top-full left-0">
                            <li><a href="/" className="text-base-content">Home</a></li>
                            <li className="lg:hidden">
                                <UnauthenticatedTemplate>
                                    <LoginButton />
                                </UnauthenticatedTemplate>
                                <AuthenticatedTemplate>
                                    <LogoutButton />
                                </AuthenticatedTemplate>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Menu desktop */}
                <ul className="menu menu-horizontal px-1 hidden lg:flex">
                    <li><a href="/" className="text-primary-content hover:bg-primary/20">Home</a></li>
                </ul>
            </div>

            {/* Auth buttons (desktop) */}
            <div className="navbar-end">
                <div className="hidden lg:block">
                    <UnauthenticatedTemplate>
                        <LoginButton />
                    </UnauthenticatedTemplate>
                    <AuthenticatedTemplate>
                        <LogoutButton />
                    </AuthenticatedTemplate>
                </div>
            </div>
        </div>
    );
};

export default Header;