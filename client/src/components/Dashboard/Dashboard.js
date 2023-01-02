// import modules
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import icons
import { BiGroup } from "react-icons/bi";
import { FaBars, FaHome, FaUserAlt } from "react-icons/fa";
import { BsBoxArrowLeft } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";

// import dashboard methods
import { defaultProfilePicture, maxPermissionLevel } from '../globalVariables';
import { handleNavigationClick, handleProfileDropdown, handleProfileDropdownItemClick, handleClickOutsideProfileDropdown, handleLogout } from './dashboardMethods';
import { getUserData } from '../../utils/utils';

// import dashboard css
import './Dashboard.css';

const Dashboard = ({ componentToShow }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [permissionLevel, setPermissionLevel] = useState(0);
    const [profilePicture, setProfilePicture] = useState("");

    // get user info from server
    useEffect(() => {
        // define abort controller
        const controller = new AbortController();

        // get user info from server
        getUserData(controller).then((response) => {
            // if user is logged in, set user info
            if (response.status) {
                setUsername(response.data.user.user_name);
                setEmail(response.data.user.user_email);
                setPermissionLevel(response.data.user.user_permissions);
                setProfilePicture(response.data.user.user_avatar_url || defaultProfilePicture);
                return;
            }

            // if user is not logged in, redirect to login page
            return navigate('/');
        });

        // set document title
        document.title = 'Dashboard | Void';

        // cleanup, abort fetch request
        return () => controller.abort();
    }, [navigate]);

    // handle left sidebar click
    useEffect(() => {
        // get navigation item that was clicked
        const componentRef = document.getElementById((componentToShow.type.name).toString()) || document.getElementById("home");

        // add active class to navigation item
        if (componentRef) {
            componentRef.classList.add('active');
        }

        // remove active class from navigation item when component unmounts
        return () => {
            if (componentRef) {
                componentRef.classList.remove('active');
            }
        }
    }, [componentToShow]);

    return (
        <div className="dashboard-container">

            <LeftSideBar permissionLevel={permissionLevel} />

            <TopNavigationBar username={username} email={email} profilePicture={profilePicture} permissionLevel={permissionLevel} />

            <div className='dashboard-content'>
                {componentToShow}
            </div>

        </div>
    );
};

const TopNavigationBar = ({ username, email, profilePicture, permissionLevel }) => {
    const navigate = useNavigate();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    // handle profile dropdown click
    useEffect(() => {
        // check if listener should be added
        if (document.onmousedown !== null) {
            return;
        }

        document.onmousedown = (e) => handleClickOutsideProfileDropdown(e, setProfileDropdownOpen, profileDropdownOpen);

        // remove event listener when component unmounts
        return () => {
            document.onmousedown = null;
        }

    }, [profileDropdownOpen]);

    return (
        <nav className='dashboard-header'>

            <div className='dashboard-header-buttons'>

                {/* PROFILE DROPDOWN */}
                <div className='profile'>
                    <button className="small-profile-info" id="dropdown-title" onClick={() => handleProfileDropdown(profileDropdownOpen, setProfileDropdownOpen)}>
                        <img src={profilePicture} onError={e => { e.currentTarget.src = defaultProfilePicture; e.currentTarget.onerror = null }} alt='profile' />
                        <p>{username}</p>
                        <MdArrowDropDown />
                    </button>

                    {profileDropdownOpen &&
                        <div className='profile-dropdown'>
                            <button className='profile-dropdown-item' onClick={() => handleProfileDropdownItemClick("profile", setProfileDropdownOpen, navigate)}>
                                <FaUserAlt />
                                <p>My profile</p>
                            </button>

                            <div className="profile-dropdown-divider" />

                            <button className='profile-dropdown-item' onClick={() => handleLogout(navigate)}>
                                <BsBoxArrowLeft />
                                <p>Sign Out</p>
                            </button>
                        </div>
                    }
                </div>

                {/* LOGOUT BUTTON */}
                <div className='logout' onClick={() => handleLogout(navigate)}>
                    <BsBoxArrowLeft />
                </div>

            </div>

        </nav>
    );
};

const LeftSideBar = ({ permissionLevel }) => {
    const navigate = useNavigate();

    return (
        <div className='dashboard-left-bar'>
            <div className='dashboard-header-title'>
                <h1>Dashboard</h1>
                <FaBars />
            </div>

            <div className='dashboard-left-bar-item-section'>
                <h2>Navigation</h2>
            </div>

            {/* BAR ITEMS / SECTIONS */}
            <div className='dashboard-left-bar-item' id="home" onClick={(e) => handleNavigationClick(e.target.id, navigate)}>
                <FaHome />
                <p>Home</p>
            </div>

            <div className='dashboard-left-bar-item' id="calendar" onClick={(e) => handleNavigationClick(e.target.id, navigate)}>
                <FaHome />
                <p>Calendar</p>
            </div>


            {
                permissionLevel >= maxPermissionLevel &&
                <div className='dashboard-left-bar-item-section'>
                    <h2>Administration</h2>

                </div>
            }

            {
                permissionLevel >= maxPermissionLevel &&
                <div className='dashboard-left-bar-item' id="UserManagement" onClick={(e) => handleNavigationClick(e.target.id, navigate)}>
                    <BiGroup />
                    <p>Users</p>
                </div>
            }

        </div>
    );
};


export default Dashboard;