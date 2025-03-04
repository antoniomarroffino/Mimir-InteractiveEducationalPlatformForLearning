import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../App.css';
import {useState} from "react";
import LoginButton from "../auth/LoginButton.tsx";
import {AuthenticatedTemplate, UnauthenticatedTemplate} from "@azure/msal-react";
import LogoutButton from "../auth/LogoutButton.tsx";
import { useState } from "react";
import LoginButton from "../auth/LoginButton";
import { UnauthenticatedTemplate } from "@azure/msal-react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="navbar bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
            <div className="navbar-start">
                {/* Logo */}
                <a href="/" className="px-2">
                    <img
                        src="/supsi-logo.png"
                        alt="SUPSI logo"
                        className="h-8 w-auto"
                    />
                </a>
            </div>

            {/* Mobile menu */}
            <div className="navbar-center lg:hidden">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    {isOpen && (
                        <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a href="/" className="text-base-content">Home</a></li>
                            <li><a href="/folders" className="text-base-content">Folders</a></li>
                        </ul>
                    )}
                </div>
            </div>

            {/* Desktop menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="/" className="text-primary-content hover:bg-primary/20">Home</a></li>
                    <li><a href="/folders" className="text-primary-content hover:bg-primary/20">Folders</a></li>
                </ul>
                <ul className="navbar-nav">
                    <li className="nav-item d-flex flex-column align-items-center">
                        <UnauthenticatedTemplate>
                            <LoginButton />
                        </UnauthenticatedTemplate>
                        <AuthenticatedTemplate>
                            <LogoutButton />
                        </AuthenticatedTemplate>
                    </li>
                </ul>
            </div>

            {/* Login button */}
            <div className="navbar-end">
                <UnauthenticatedTemplate>
                    <LoginButton />
                </UnauthenticatedTemplate>
            </div>
        </div>
    );
};

export default Header;