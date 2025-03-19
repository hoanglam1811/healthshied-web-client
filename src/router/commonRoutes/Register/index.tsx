import React, { useState, useEffect } from 'react';
import LoginImage from "../../../assets/Login.png";
import LoginnImage from "../../../assets/Loginn.png";
import { Link, useNavigate } from 'react-router-dom';
import RegisterType from './data';
import { notification } from 'antd';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { register } from '../../../services/ApiServices/authenticationService';

const Register = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [registerData, setRegisterData] = useState<RegisterType>(
        { fullName: "", email: "", password: "", phone: "", confirmPassword: "" }
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const images = [LoginImage, LoginnImage];
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleRegisterSubmit = async () => {
        console.log(registerData);
    
        if (!registerData.fullName.trim()) {
            notification.error({ message: "Full Name is required!" });
            return;
        }
        if (!registerData.email.trim()) {
            notification.error({ message: "Email is required!" });
            return;
        }
        if (!registerData.phone.trim()) {
            notification.error({ message: "Phone Number is required!" });
            return;
        }
        if (!registerData.password.trim()) {
            notification.error({ message: "Password is required!" });
            return;
        }
        if (!registerData.confirmPassword?.trim()) {
            notification.error({ message: "Confirm Password is required!" });
            return;
        }
    
        if (registerData.password !== registerData.confirmPassword) {
            notification.error({ message: "Password does not match!" });
            return;
        }
    
        setIsLoading(true);
        try {
            const user = await register(
                registerData.fullName,
                registerData.email,
                registerData.phone,
                registerData.password
            );
            setIsLoading(false);
    
            if (user.code === 0) {
                notification.success({ message: "Register successfully!." });
                navigate("/login");
            }
        } catch (error: any) {
            setIsLoading(false);
            if (error.response?.data?.message) {
                if (error.response.data.message === "User Existed") {
                    notification.error({ message: "User Existed!" });
                } else if (error.response.data.message === "Invalid key") {
                    notification.error({ message: "Password must be >8 characters!" });
                } else {
                    notification.error({ message: "Error. Please try again!" });
                }
            } else {
                notification.error({ message: "Error connection! Please check your connection." });
            }
        }
    };
    

    return (
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
                        Register to Health Shield
                    </h1>

                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <div style={{ width: "100%" }}>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                onChange={(e) =>
                                    setRegisterData((prev) => ({ ...prev, fullName: e.target.value }))
                                }
                                style={{
                                    width: "80%",
                                    padding: "12px 20px",
                                    marginBottom: "20px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    fontSize: "16px",
                                    transition: "all 0.3s",
                                    outline: "none",
                                    color: "black",
                                    backgroundColor: "white",
                                }}

                            />
                        </div>

                        <div style={{ width: "100%" }}>
                            <input
                                type="number"
                                placeholder="Enter your phone number"
                                onChange={(e) =>
                                    setRegisterData((prev) => ({ ...prev, phone: e.target.value }))
                                } style={{
                                    width: "80%",
                                    padding: "12px 20px",
                                    marginBottom: "20px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    fontSize: "16px",
                                    transition: "all 0.3s",
                                    outline: "none",
                                    color: "black",
                                    backgroundColor: "white",
                                }}
                            />
                        </div>

                        <div style={{ width: "100%" }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) =>
                                    setRegisterData((prev) => ({ ...prev, email: e.target.value }))
                                } style={{
                                    width: "80%",
                                    padding: "12px 20px",
                                    marginBottom: "20px",
                                    borderRadius: "10px",
                                    border: "0px solid rgba(255, 255, 255, 0.5)",
                                    fontSize: "16px",
                                    transition: "all 0.3s",
                                    outline: "none",
                                    color: "black",
                                    backgroundColor: "white",
                                }}
                            />
                        </div>

                        <div style={{ position: "relative", width: "100%" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                onChange={(e) =>
                                    setRegisterData((prev) => ({ ...prev, password: e.target.value }))
                                } style={{
                                    width: "80%",
                                    padding: "12px 20px",
                                    marginBottom: "20px",
                                    paddingRight: "20px",
                                    borderRadius: "10px",
                                    border: "0px solid rgba(255, 255, 255, 0.5)",
                                    fontSize: "16px",
                                    transition: "all 0.3s",
                                    outline: "none",
                                    color: "black",
                                    backgroundColor: "white",
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

                        <div style={{ position: "relative", width: "100%" }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                onChange={(e) =>
                                    setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                } style={{
                                    width: "80%",
                                    padding: "12px 20px",
                                    paddingRight: "20px",
                                    borderRadius: "10px",
                                    border: "0px solid rgba(255, 255, 255, 0.5)",
                                    fontSize: "16px",
                                    transition: "all 0.3s",
                                    outline: "none",
                                    color: "black",
                                    backgroundColor: "white",
                                }}
                            />
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: "absolute",
                                    right: "40px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "black",
                                }}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                        onClick={handleRegisterSubmit}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#21618c")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#578a3f")}
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>

                    <p className='font-bold' style={{ fontSize: "14px", color: "#555" }}>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            style={{ color: "#578a3f", textDecoration: "none" }}
                        >
                            Login
                        </Link>
                    </p>

                    <div
                        style={{
                            position: "absolute",
                            top: "15px",
                            left: "15px",
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#f39c12",
                            borderRadius: "50%",
                            opacity: 0.2,
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "15px",
                            right: "15px",
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#3498db",
                            borderRadius: "50%",
                            opacity: 0.2,
                        }}
                    ></div>

                </div>
            </div>
        </div>
    );
};


export default Register;
