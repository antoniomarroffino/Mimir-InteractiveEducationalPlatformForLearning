import FolderList from '../components/FolderList';
import React from "react";
import { BsFolderFill } from 'react-icons/bs';

const Folders: React.FC = () => {
    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="bg-base-100 rounded-box p-6 shadow-lg mb-6">
                <div className="text-sm breadcrumbs mb-4">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li>Folders</li>
                    </ul>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <BsFolderFill className="text-primary text-3xl" />
                    <h1 className="text-3xl font-bold">Folder Management</h1>
                </div>

                <div className="stats shadow w-full">
                    <div className="stat">
                        <div className="stat-title">Total Folders</div>
                        <div className="stat-value text-primary">25</div>
                        <div className="stat-desc">21% more than last month</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Active Folders</div>
                        <div className="stat-value text-secondary">12</div>
                        <div className="stat-desc">↗︎ 40 (2%)</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">New Folders</div>
                        <div className="stat-value">5</div>
                        <div className="stat-desc">↘︎ 90 (14%)</div>
                    </div>
                </div>
            </div>

            <div className="tabs tabs-boxed mb-6">
                <a className="tab tab-active">All Folders</a>
                <a className="tab">Recent</a>
                <a className="tab">Favorites</a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="form-control flex-1">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search folders..."
                            className="input input-bordered w-full"
                        />
                        <button className="btn btn-square btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <select className="select select-bordered w-full sm:w-auto">
                    <option disabled selected>Sort by</option>
                    <option>Name</option>
                    <option>Date Created</option>
                    <option>Last Modified</option>
                </select>
            </div>

            <div className="bg-base-100 rounded-box p-6 shadow-lg">
                <FolderList />
            </div>

            <button className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    );
};

export default Folders;