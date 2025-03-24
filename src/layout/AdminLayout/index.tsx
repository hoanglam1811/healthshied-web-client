import { Layout, Menu, Typography } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from "@/assets/logo.png";
import RouteNames from '@/constants/routeNames';
import { CalendarOutlined, DashboardOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { FaBlog, FaBlogger, FaComment, FaFileImage } from 'react-icons/fa';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;


const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
                <div style={{ textAlign: "center", padding: collapsed ? "10px" : "20px" }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: collapsed ? "50px" : "80%", transition: "0.3s" }}
                    />
                </div>

                <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
                    <Menu.Item onClick={() => navigate(RouteNames.ADMIN_DASHBOARD)} key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.STAFF_MANAGEMENT)} key="staff-management" icon={<DashboardOutlined />}>Staffs</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.CUSTOMERS)} key="customers" icon={<UserOutlined />}>Customers</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.VACCINE_MANAGEMENT)} key="vaccine-management" icon={<DashboardOutlined />}>Vaccine</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.VACCINE_PACKAGE)} key="vaccine-package" icon={<CalendarOutlined />}>Vaccine Package</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.VACCINE_SCHEDULE)} key="vaccine-schedule" icon={<CalendarOutlined />}>Vaccine Schedule</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.ORDERS)} key="orders" icon={<ShoppingCartOutlined />}>Orders</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.BLOG_MANAGEMENT)} key="blog" icon={<FaFileImage />}>Blog</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.FEEDBACK_MANAGEMENT)} key="feedback" icon={<FaComment />}>Feedback</Menu.Item>
                </Menu>
            </Sider>
            <Outlet />
        </Layout>
    );
};

export default AdminLayout;
