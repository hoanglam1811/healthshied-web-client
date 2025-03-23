import { Divider, Layout, Menu, Typography } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from "@/assets/logo.png";
import RouteNames from '@/constants/routeNames';
import { CalendarOutlined, DashboardOutlined, LogoutOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { removeToken } from '@/reducers/tokenSlice';
import { FaBlog, FaBlogger, FaFileImage } from 'react-icons/fa';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;


const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogout = () => {
      dispatch(removeToken());
      navigate(RouteNames.HOME);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark"
              style={{
                position: "sticky",
                height: "100vh",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1,
                overflow: "auto",
              }}
            >
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
                    <Divider style={{ background: "rgba(255, 255, 255, 0.2)" }} />

                  {/* Logout Menu Item */}
                  <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu>
            </Sider>
            <Outlet />
        </Layout>
    );
};

export default AdminLayout;
