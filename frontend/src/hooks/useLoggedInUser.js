import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const useLoggedInUser = () => {
    const { user } = useUserAuth();
    const email = user?.email;
    const phoneNumber = user?.phoneNumber;
    const [loggedInUser, setLoggedInUser] = useState({});
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        if (email || phoneNumber) {
            const identifier = email ? `email=${email}` : `phoneNumber=${phoneNumber}`;
            fetch(`https://twitter-clone2-0-hfe5.onrender.com/loggedInUser?${identifier}`)
                .then(res => res.json())
                .then(data => {
                    setLoggedInUser(data);
                    setIsDataFetched(true);
                    // Store user data in localStorage
                    localStorage.setItem('loggedInUser', JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Error fetching logged-in user data:', error);
                });
        }
    }, [email, phoneNumber]);

    return [loggedInUser, setLoggedInUser, isDataFetched];
};

export default useLoggedInUser;
