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
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item key="schedule" icon={<CalendarOutlined />}>Lịch làm việc</Menu.Item>
                    <Menu.Item key="tasks" icon={<SolutionOutlined />}>Nhiệm vụ</Menu.Item>
                </Menu>
            </Sider>
            <Outlet/>
        </Layout>
    );
};

export default StaffLayout;