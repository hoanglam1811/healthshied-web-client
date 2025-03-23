import { Breadcrumb, Button, Dropdown, Form, Input, Layout, Menu, theme, Tooltip } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from "@/assets/logo.png";
import { LogoutOutlined, PhoneOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import RouteNames from '@/constants/routeNames';
import { removeToken } from '@/reducers/tokenSlice';

const CustomerLayout = () => {
    const token = useSelector((state: RootState) => state.token.token);
    const user = useSelector((state: RootState) => state.token.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const items = [
      {
        key: '1',
        label: 'Home',
      },
      {
        key: '2',
        label: 'List',
      },
      {
        key: '3',
        label: 'App',
      },
    ]

    const handleLogout = () => {
      dispatch(removeToken());
      navigate(RouteNames.HOME);
    };

    const userDropdown = [
      {
        key: '1',
        label: 'Profile',
        icon: <UserOutlined />
      },
      {
        key: '2',
        label: (
          <a onClick={handleLogout}>Logout</a>
        ),
        icon: <LogoutOutlined />
      },
    ]

    

    return (
    <div>
      <Header className="flex flex-wrap min-h-[fit-content] justify-between items-center !px-0 xl:!px-[10%]" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="w-full lg:w-1/2 flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "50px" }}
          />
          <Form className="w-[500px]">
            <Input className="w-full !rounded-[35px] !pr-[2px]" placeholder="Search" suffix={
              <Tooltip title="Search">
                <Button type="primary" shape="circle"
                  style={{ background: "rgb(50, 80, 120)" }} 
                  icon={<SearchOutlined />} />
              </Tooltip>
            } />
          </Form>
        </div>
        <div className="w-full lg:w-1/2 min-w-[fit-content] flex items-center lg:justify-end gap-3">
          <div>
            <Button className="!rounded-[35px] !h-[40px] !bg-[rgb(30, 50, 80)]" 
              style={{ background: "rgb(50, 80, 120)" }} 
              type="primary"
              icon={
              <PhoneOutlined />
              }
            >
              <span className="">Call Hotline: +84 999 999 999</span>
            </Button>
          </div>
          <div>
            {!token && <Link to={RouteNames.LOGIN}>
              <Button className="!rounded-[35px] !h-[40px]" 
                style={{ background: "rgb(255,49,49)" }}
                type="primary" 
                icon={<UserOutlined />}>
                Login / Register
              </Button>
            </Link>}
            {token && 
            <Dropdown menu={{ items: userDropdown }}>
              <Button className="!rounded-[35px] !h-[40px]" 
                style={{ background: "rgb(255,49,49)" }}
                type="primary" 
                icon={<UserOutlined />}>
                {user?.fullName}
              </Button>
            </Dropdown>
            }
          </div>
        </div>
        {/*<Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />*/}
      </Header>
        <Outlet />
      <Footer style={{ textAlign: 'center' }}>
        Healthshield ©{new Date().getFullYear()} Created by Tri Lam
      </Footer>
    </div>);
};

export default CustomerLayout;
