import { Layout, Menu, Typography } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from "@/assets/logo.png";
import RouteNames from '@/constants/routeNames';
import { CalendarOutlined, DashboardOutlined, ShoppingCartOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;


const StaffLayout = () => {
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
                <Menu className='!text-left' theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
                    <Menu.Item onClick={() => navigate(RouteNames.STAFF_DASHBOARD)} key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.STAFF_SHIFT_PAGE)} key="shift" icon={<SolutionOutlined />}>Shift</Menu.Item>
                    <Menu.Item onClick={() => navigate(RouteNames.STAFF_PROFILE)} key="profile" icon={<UserOutlined />}>Profile</Menu.Item>
                </Menu>
            </Sider>
            <Outlet />
        </Layout>
    );
};

export default StaffLayout;