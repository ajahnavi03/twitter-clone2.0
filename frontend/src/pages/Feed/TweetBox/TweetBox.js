import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import './TweetBox.css';

function TweetBox() {
    const [post, setPost] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(null); // Make name optional
    const [username, setUsername] = useState(null); // Make username optional
    const [loggedInUser, , isDataFetched] = useLoggedInUser();
    const { user } = useUserAuth();
    const email = user?.email;
    const phoneNumber = user?.phoneNumber;

    const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

    useEffect(() => {
        if (isDataFetched) {
            // Data is fetched, set name and username accordingly
            if (user?.providerData[0]?.providerId === 'password') {
                fetch(`http://localhost:5000/loggedInUser?email=${email}`)
                    .then(res => res.json())
                    .then(data => {
                        setName(data[0]?.name);
                        setUsername(data[0]?.username);
                    })
                    .catch(error => {
                        console.error('Error fetching user data:', error);
                    });
            } else {
                setName(user?.displayName);
                setUsername(email?.split('@')[0]);
            }
        }
    }, [isDataFetched, email, user]);

    const handleUploadImage = e => {
        setIsLoading(true);
        const image = e.target.files[0];

        const formData = new FormData();
        formData.set('image', image);

        axios.post("https://api.imgbb.com/1/upload?key=64586e3ed66776c9e64cc4634d3b78bd", formData)
            .then(res => {
                setImageURL(res.data.data.display_url);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleTweet = (e) => {
        e.preventDefault();

        if (isDataFetched) {
            const userPost = {
                profilePhoto: userProfilePic,
                post: post,
                photo: imageURL,
                ...(name && { name: name }), // Include name if available
                ...(username && { username: username }), // Include username if available
                ...(email && { email: email }),
                ...(phoneNumber && { phoneNumber: phoneNumber }),
            };
            console.log(userPost);
            setPost('');
            setImageURL('');
            fetch(`http://localhost:5000/post`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userPost),
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error submitting tweet:', error);
                });
        } else {
            console.error('User data not yet fetched.');
        }
    };

    return (
        <div className="tweetBox">
            <form onSubmit={handleTweet}>
                <div className="tweetBox_input">
                    <Avatar src={userProfilePic} />
                    <input
                        type="text"
                        placeholder="What's happening?"
                        onChange={(e) => setPost(e.target.value)}
                        value={post}
                        required
                    />
                </div>
                <div className="imageIcon_tweetButton">
                    <label htmlFor='image' className="imageIcon">
                        {
                            isLoading ? <p>Uploading Image</p> : <p>{imageURL ? 'Image Uploaded' : <AddPhotoAlternateOutlinedIcon />}</p>
                        }
                    </label>
                    <input
                        type="file"
                        id='image'
                        className="imageInput"
                        onChange={handleUploadImage}
                    />
                    <Button className="tweetBox_tweetButton" type="submit">Tweet</Button>
                </div>
            </form>
        </div>
    );
}

export default TweetBox;
