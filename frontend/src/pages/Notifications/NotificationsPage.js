import React from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import Notifications from '../Notifications';

const NotificationsPage = () => {
    const { notifications } = useUserAuth();

    return (
        <div>
            <h1>Notifications</h1>
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

export default NotificationsPage;
