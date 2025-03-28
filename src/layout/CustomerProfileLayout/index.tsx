import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, CalendarOutlined } from '@ant-design/icons';
import logo from '@/assets/logo.png';
import RouteNames from '@/constants/routeNames';

const { Sider, Content, Header } = Layout;

const ProfileLayout = ({ children }: { children?: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="dark"
                style={{
                    position: 'sticky',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1,
                    overflow: 'auto',
                }}
            >
                <div style={{ textAlign: 'center', padding: collapsed ? '10px' : '20px' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: collapsed ? '50px' : '80%', transition: '0.3s' }}
                    />
                </div>

                <Menu theme="dark" mode="inline" defaultSelectedKeys={['profile']}>
                    <Menu.Item
                        onClick={() => navigate(RouteNames.ACCOUNT)}
                        key="profile"
                        icon={<UserOutlined />}
                    >
                        Profile
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => navigate(RouteNames.ACCOUNT_CHANGE_PASSWORD)}
                        key="change-password"
                        icon={<LockOutlined />}
                    >
                        Change Password
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => navigate(RouteNames.ACCOUNT_APPOINTMENTS)}
                        key="appointments"
                        icon={<CalendarOutlined />}
                    >
                        Appointments
                    </Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header style={{ background: "#fff", padding: 0 }}>User Profile</Header>
                <Content style={{ margin: "16px" }}>
                    {children || <Outlet />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProfileLayout;
