import React, { useState, useEffect } from 'react';
import LoginImage from "../../../assets/Login.png";
import LoginnImage from "../../../assets/Loginn.png";
import { Link, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../../reducers/tokenSlice';
import parseJwt from '../../../services/parseJwt';
import RouteNames from '../../../constants/routeNames';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Box, Button, Flex, IconButton, Image, Input, InputGroup, Text, VStack } from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';

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

    // const handleLoginSubmit = async () => {
    //     setIsLoading(true);
    //     setError("");
    //     try {
    //         const user = await login(username, password);
    //         setIsLoading(false);
    //         dispatch(setToken(user.result.token));
    //         const userInfo = parseJwt(user.result.token);
    //         dispatch(setUser(userInfo));
    //         notification.success({ message: "Đăng nhập thành công!" });

    //         if (userInfo.role.toUpperCase() == "ADMIN") {
    //             navigate("/admin/dashboard");
    //         } else if (userInfo.role.toUpperCase() == "STAFF") {
    //             navigate("/staff/products-management")
    //         }
    //         else {
    //             navigate("/");
    //         }

    //     } catch (error: any) {
    //         setIsLoading(false);
    //         if (error.response?.data?.message) {
    //             if (error.response.data.message === "Email not found") {
    //                 notification.error({ message: "Email không tồn tại!" });
    //             } else if (error.response.data.message === "Wrong password") {
    //                 notification.error({ message: "Sai mật khẩu!" });
    //             } else if (error.response.data.message === "User Not Existed") {
    //                 notification.error({ message: "Người dùng không tồn tại!" });
    //             } else if (error.response.data.message === "Email is not verified") {
    //                 notification.error({ message: "Email chưa được xác thực!" });
    //             }
    //             else {
    //                 notification.error({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!" });
    //             }
    //         } else {
    //             setError("Lỗi kết nối! Hãy kiểm tra lại đường truyền.");
    //         }
    //     }
    // };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <div
                style={{
                    width: "70%",
                    height: "100%",
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
                    backgroundColor: "#f9f9f9",
                    padding: "20px",
                    height: "100%"
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "380px",
                        borderRadius: "12px",
                        padding: "40px",
                        textAlign: "center",
                        position: "relative",
                        animation: "fadeIn 1s ease-in-out",
                    }}
                >
                    <h1 className='font-bold' style={{ color: "#578a3f", marginBottom: "50px" }}>
                        Welcome to Health Shield
                    </h1>

                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "80%",
                                padding: "12px 20px",
                                marginBottom: "20px",
                                borderRadius: "10px",
                                border: "1px solid rgba(255, 255, 255, 0.5)",
                                fontSize: "16px",
                                backgroundColor: "transparent",
                                color: "#fff",
                                transition: "all 0.3s",
                                outline: "none",
                                marginLeft: "17px"
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#578a3f")}
                            onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.5)")}
                        />

                        <div style={{ position: "relative", width: "100%" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: "80%",
                                    padding: "12px 20px",
                                    paddingRight: "40px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    fontSize: "16px",
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                    transition: "all 0.3s",
                                    outline: "none",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#578a3f")}
                                onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.5)")}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "40px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#fff",
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
                        //onClick={handleRegisterSubmit}
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
    );
};

export default Login;
