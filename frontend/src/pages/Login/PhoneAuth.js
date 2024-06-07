import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import twitterImg from '../../assets/images/twitter.jpeg'
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneInput from "react-phone-number-input";
import { useUserAuth } from "../../context/UserAuthContext";
import "./Login.css"

const PhoneAuth = () => {
    const [error, setError] = useState("");
    const [number, setNumber] = useState("");
    const [flag, setFlag] = useState(false);
    const [otp, setOtp] = useState("");
    const [result, setResult] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");
    const [verificationMessage, setVerificationMessage] = useState("");
    const { setUpRecaptha } = useUserAuth();
    const navigate = useNavigate();

    const getOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (number === "" || number === undefined)
            return setError("Please enter a valid phone number!");
        try {
            const response = await setUpRecaptha(number);
            setResult(response);
            setFlag(true);
            setVerificationStatus(""); // Reset verification status
            setVerificationMessage(""); // Reset verification message
        } catch (err) {
            setError(err.message);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (otp === "" || otp === null) return;
        try {
            await result.confirm(otp);
            setVerificationStatus("success"); // Set verification status to success
            setVerificationMessage("Verification successful!"); // Set success message
        } catch (err) {
            setVerificationStatus("error"); // Set verification status to error
            setVerificationMessage("Verification failed!"); // Set error message
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const user = {
                phoneNumber: number
            }

            fetch(`http://localhost:5000/register`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(user),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.acknowledged) {
                        console.log(data)
                        navigate('/')
                    }
                })

        } catch (err) {
            setError(err.message);
            window.alert(err.message);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="image-container">
                    <img className="image" src={twitterImg} alt="twitterImage" />
                </div>

                <div className="form-container">
                    <div className="">
                        <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
                        <h2 className="heading">Happening now</h2>
                        <div className="d-flex align-items-sm-center">
                            <h3 className="heading1"> Join Twitter today </h3>
                        </div>

                        {error && <p className="errorMessage">{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: !flag ? "block" : "none" }}>
                                <Form.Group controlId="formBasicEmail">
                                    <PhoneInput
                                        className="display-name"
                                        defaultCountry="IN"
                                        value={number}
                                        onChange={setNumber}
                                        placeholder="Enter Phone Number"
                                    />
                                    <div id="recaptcha-container"></div>
                                </Form.Group>
                                <div className="button-right">
                                    <Link to="/signup">
                                        <Button variant="secondary">Cancel</Button>
                                    </Link>
                                    &nbsp;
                                    <Button type="submit" variant="primary" className="phone-button" onClick={getOtp}>
                                        Send OTP
                                    </Button>
                                </div>
                            </div>

                            <div style={{ display: flag ? "block" : "none" }}>
                                <Form.Group controlId="formBasicOtp">
                                    <Form.Control
                                        className="display-name"
                                        type="otp"
                                        placeholder="Enter OTP"
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="button-right">
                                    <Link to="/signup">
                                        <Button variant="secondary">Cancel</Button>
                                    </Link>
                                    &nbsp;
                                    <Button type="submit" variant="primary" onClick={verifyOtp}>
                                        Verify
                                    </Button>
                                </div>
                            </div>

                            {/* Display verification status and message */}
                            {verificationStatus && (
                                <p style={{ color: verificationStatus === "success" ? "green" : "red" }}>
                                    {verificationMessage}
                                </p>
                            )}

                            <div className="btn-login">
                                <button type="submit" className="btn">
                                    Sign Up
                                </button>
                            </div>
                        </form>


                        <hr />
                        <div>
                            Already have an account?
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: 'none',
                                    color: 'var(--twitter-color)',
                                    fontWeight: '600',
                                    marginLeft: '5px'
                                }}
                            >
                                Log In
                            </Link>
                        </div>
                        <div>
                            Don't have an account?
                            <Link
                                to="/signup"
                                style={{
                                    textDecoration: 'none',
                                    color: 'var(--twitter-color)',
                                    fontWeight: '600',
                                    marginLeft: '5px'
                                }}
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PhoneAuth;

