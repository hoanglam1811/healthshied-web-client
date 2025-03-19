import React, { useState, useEffect } from 'react';
import LoginImage from "../../../assets/Login.png";
import LoginnImage from "../../../assets/Loginn.png";
import { Link, useNavigate } from 'react-router-dom';
import { Input, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../../reducers/tokenSlice';
import parseJwt from '../../../services/parseJwt';
import RouteNames from '../../../constants/routeNames';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Box, Button, Flex, IconButton, Image, InputGroup, Text, VStack } from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../../../services/ApiServices/authenticationService';

const Login = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [LoginImage, LoginnImage];
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [securePassword, setSecurePassword] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleLoginSubmit = async () => {
        // Kiểm tra nếu email hoặc password trống
        if (!email.trim()) {
            notification.error({ message: "Email is required!" });
            return;
        }
        if (!password.trim()) {
            notification.error({ message: "Password is required!" });
            return;
        }
    
        setIsLoading(true);
        try {
            const user = await login(email, password);
            setIsLoading(false);
    
            dispatch(setToken(user.result.token));
            const userInfo = parseJwt(user.result.token);
            dispatch(setUser(userInfo));
    
            notification.success({ message: "Login successfully!" });
    
            // Điều hướng theo role
            if (userInfo.role.toUpperCase() === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (userInfo.role.toUpperCase() === "STAFF") {
                navigate("/staff/products-management");
            } else {
                navigate("/");
            }
        } catch (error: any) {
            setIsLoading(false);
            if (error.response?.data?.message) {
                switch (error.response.data.message) {
                    case "Email not found":
                        notification.error({ message: "Email not found!" });
                        break;
                    case "Wrong password":
                        notification.error({ message: "Wrong password!" });
                        break;
                    case "User Not Existed":
                        notification.error({ message: "User Not Existed!" });
                        break;
                    case "Email is not verified":
                        notification.error({ message: "Email is not verified!" });
                        break;
                    default:
                        notification.error({ message: "Error. Please try again!" });
                }
            } else {
                notification.error({ message: "Error connection! Please check your connection." });
            }
        }
    };    

    return (
        <>
            <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
                <div
                    style={{
                        width: "70%",
                        height: "100vh",
                        backgroundImage: `url(${images[currentImageIndex]})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "background-image 1s ease-in-out",
                        boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.3)",
                    }}
                ></div>

                <div
                    style={{
                        minWidth: "500px",
                        width: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f1f1f1",
                        padding: "20px",
                        height: "100%"
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "380px",
                            borderRadius: "12px",
                            padding: "30px",
                            textAlign: "center",
                            position: "relative",
                            animation: "fadeIn 1s ease-in-out",
                        }}
                    >
                        <h1 className='font-bold' style={{ color: "#578a3f", marginBottom: "40px" }}>
                            Welcome to Health Shield
                        </h1>

                        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                            <div style={{ width: "100%" }}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e: any) => setEmail(e.target.value)}
                                    style={{
                                        width: "80%",
                                        padding: "12px 20px",
                                        marginBottom: "20px",
                                        borderRadius: "10px",
                                        border: "0px solid rgba(255, 255, 255, 0.5)",
                                        fontSize: "16px",
                                        transition: "all 0.3s",
                                        outline: "none",
                                        color: "black",
                                        backgroundColor: "white"
                                    }}
                                />
                            </div>

                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: "80%",
                                        padding: "12px 20px",
                                        paddingRight: "20px",
                                        borderRadius: "10px",
                                        border: "0px solid rgba(16, 15, 15, 0.5)",
                                        fontSize: "16px",
                                        transition: "all 0.3s",
                                        outline: "none",
                                        color: "black",
                                        backgroundColor: "white"
                                    }}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "40px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "black",
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button
                            style={{
                                width: "60%",
                                padding: "12px 20px",
                                backgroundColor: "#578a3f",
                                color: "#fff",
                                borderRadius: "10px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "600",
                                transition: "background-color 0.3s ease",
                                marginBottom: "15px",
                                marginTop: "25px"
                            }}
                            onClick={handleLoginSubmit}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#21618c")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#578a3f")}
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                        <p className='font-bold' style={{ fontSize: "14px", color: "#555" }}>
                            You don't have an account?{" "}
                            <Link
                                to="/register"
                                style={{ color: "#578a3f", textDecoration: "none" }}
                            >
                                Register now
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Login;
