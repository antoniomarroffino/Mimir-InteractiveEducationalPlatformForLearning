import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../App.css';
import {useState} from "react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light custom-gradient px-3">
            <a className="navbar-brand" href="/">
                <img src="../../public/supsi-logo.png" alt="SUPSI logo" />
            </a>

            {/* Button for toggling the navbar */}
            <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-expanded={isOpen ? "true" : "false"} aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/milestones">Milestones</a>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    <li className="nav-item d-flex flex-column align-items-center">
                        <a href="/login" className="text-decoration-none">
                            <img
                                className="custom-icon mb-1"
                                src="../../public/login-icon.png"
                                alt="Login Icon"
                                style={{ cursor: 'pointer' }}
                            />
                        </a>
                        <a className="nav-link p-0" href="/login">Login</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
