import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import Sidebar from "./Sidebar/Sidebar";
import Widgets from "./Widgets/Widgets";
import Notifications from "./Notifications";


const Home = () => {
    const { logOut, user } = useUserAuth();
    const { notifications } = useUserAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/login");
        } catch (error) {
            console.log(error.message);
        }
    };
    return (
        <div className="app">
            <Sidebar handleLogout={handleLogout} user={user} />
            <Outlet />
            <Widgets />
            <div className="notifications">
                {notifications.map((notification, index) => (
                    <Notifications
                        key={index}
                        type={notification.type}
                        username={notification.username}
                        content={notification.content}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;