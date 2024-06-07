import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";
import { auth } from "../firebase.init";
import io from 'socket.io-client';
import socket from "../pages/SocketClient";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState({});
    const [notifications, setNotifications] = useState([]);

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }
    function logOut() {
        return signOut(auth);
    }
    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }
    function setUpRecaptha(number) {
        const recaptchaVerifier = new RecaptchaVerifier(
            auth ,
          "recaptcha-container",
          {}
        );
        recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, number, recaptchaVerifier);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            console.log("Auth", currentuser);
            setUser(currentuser);
        });

        socket.on('newTweet', (data) => {
            setNotifications((prev) => [...prev, { type: 'tweet', ...data }]);
        });

        socket.on('newLike', (data) => {
            setNotifications((prev) => [...prev, { type: 'like', ...data }]);
        });

        socket.on('newComment', (data) => {
            setNotifications((prev) => [...prev, { type: 'comment', ...data }]);
        });

        return () => {
            unsubscribe();
            socket.off('newTweet');
            socket.off('newLike');
            socket.off('newComment');
        };
    }, []);

    return (
        <userAuthContext.Provider
            value={{ user, logIn, signUp, logOut, googleSignIn , setUpRecaptha, notifications }}
        >
            {children}
        </userAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(userAuthContext);
}