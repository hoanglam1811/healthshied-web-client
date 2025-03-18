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

const Login = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [LoginImage, LoginnImage];
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

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
        <Flex h="100vh" w="100vw" overflow="hidden">
            {/* Left Side - Image with Back Button */}
            <Box w={{ base: "0%", md: "50%" }} h="100vh" position="relative">
                <Image src={images[currentImageIndex]} alt="Login Image" objectFit="cover" w="full" h="full" />
                <Link to="/">
                    <IconButton
                        aria-label="Back"
                        position="absolute"
                        top={4}
                        left={4}
                        bg="whiteAlpha.700"
                        _hover={{ bg: "whiteAlpha.900" }}
                        size="lg"
                    >
                        <ArrowLeftOutlined />
                    </IconButton>

                </Link>
            </Box>

            {/* Right Side - Login Form */}
            <Flex w={{ base: "100%", md: "50%" }} align="center" justify="center" bg="gray.50">
                <VStack gap={6} p={8} boxShadow="xl" borderRadius="xl" bg="white" w={{ base: "90%", md: "60%" }}>
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">Welcome to HealthShield</Text>
                    <Text fontSize="md" color="gray.600" textAlign="center">Protecting your child's health, one vaccine at a time.</Text>

                    {/* Email Input */}
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        borderColor="green.400"
                        size="lg"
                        borderRadius="full"
                    />

<InputGroup>
  <Input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
  />
  {/* <InputRightElement>
    <IconButton
      aria-label="Toggle Password"
      _icon={showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      onClick={togglePasswordVisibility}
      size="sm"
      variant="ghost"
    />
  </InputRightElement> */}
</InputGroup>


                    {/* Login Button */}
                    <Button
                        w="full"
                        colorScheme="green"
                        size="lg"
                        borderRadius="full"
                        loading={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>

                    {/* Links */}
                    <Text fontSize="sm" color="gray.600">
                        Don't have an account? <Link to="/register" style={{ color: "#2F855A", fontWeight: "bold" }}>Sign up now</Link>
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        <Link to="/forgot-password" style={{ color: "#2F855A", fontWeight: "bold" }}>Forgot password?</Link>
                    </Text>
                </VStack>
            </Flex>
        </Flex>
    );
};

export default Login;
