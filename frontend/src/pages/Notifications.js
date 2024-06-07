import React from 'react';
import './Notifications.css';


const Notifications = ({ type, username, content }) => {
    let message;
    switch (type) {
        case 'tweet':
            message = `${username} tweeted: ${content}`;
            break;
        case 'like':
            message = `${username} liked your tweet: ${content}`;
            break;
        case 'comment':
            message = `${username} commented: ${content}`;
            break;
        default:
            message = 'New notification';
    }

    return (
        <div className="notification">
            <p>{message}</p>
        </div>
    );
};

export default Notifications;
