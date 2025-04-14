import { Breadcrumb, Button, Card, Col, Divider, Dropdown, Form, Input, Layout, Menu, Modal, notification, Row, Space, theme, Tooltip, Typography } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from "@/assets/logo.png";
import { EnvironmentOutlined, FacebookOutlined, InstagramOutlined, LogoutOutlined, MailOutlined, PhoneOutlined, SearchOutlined, TwitterOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import RouteNames from '@/constants/routeNames';
import { removeToken } from '@/reducers/tokenSlice';
import { useEffect, useRef, useState } from 'react';
import { getAllVaccines } from '@/services/ApiServices/vaccineService';
import vaccineImg from '@/assets/vaccine.jpg';

const { Footer } = Layout;
const { Title, Text } = Typography;

const CustomerLayout = () => {
  const token = useSelector((state: RootState) => state.token.token);
  const user = useSelector((state: RootState) => state.token.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [vaccines, setVaccines] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const prompts = [
    "What vaccine do I need",
    "Which center is near me",
    "You need advices from doctor"
  ];

  const handleLogout = () => {
    dispatch(removeToken());
    navigate(RouteNames.HOME);
  };

  const fetchVaccines = async () => {
    try {
      const response = await getAllVaccines();
      setVaccines(response.vaccines);
    } catch (error) {
      console.log(error);
      notification.error({ message: "Something went wrong. Please try again later." });
    }
  }

  const userDropdown = [
    {
      key: "1",
      label: (
        <Link to={RouteNames.ACCOUNT}>
          Profile
        </Link>
      ),
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: (
        <a onClick={handleLogout}>Logout</a>
      ),
      icon: <LogoutOutlined />
    },
  ]

  useEffect(() => {
    fetchVaccines()
  }, [])

  useEffect(() => {
    const currentPrompt = prompts[index];
    let timeout: any;

    if (deleting) {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, 50);
      } else {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % prompts.length);
      }
    } else {
      if (charIndex < currentPrompt.length) {
        timeout = setTimeout(() => {
          setText((prev) => prev + currentPrompt[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 100);
      } else {
        setTimeout(() => setDeleting(true), 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index]);


  const [hovered, setHovered] = useState<"login" | "register" | null>(null);

  return (
    <div onClick={() => setIsFocused(false)}>
      {isFocused && <div className="!absolute !top-0 !left-0 !w-full !h-full !bg-[rgba(0,0,0,0.5)] !z-50">
      </div>}
      <Header className="!fixed !top-0 !w-full !left-0 !flex !flex-wrap !min-h-[fit-content] !justify-between !items-center !px-0 xl:!px-[10%] !z-60" style={{ display: 'flex', alignItems: 'center', pointerEvents: "auto" }}>
        <div className="!w-full lg:!w-1/2 !flex !items-center !gap-3">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "50px" }}
          />
          <Form className="w-[500px] !relative" onClick={(e) => {
            e.stopPropagation();
            setIsFocused(true);
          }}>
            <Input
              placeholder={text}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="w-full !rounded-[35px] !pr-[2px]" suffix={
                <Tooltip title="Search">
                  <Button type="primary" shape="circle"
                    style={{ background: "rgb(50, 80, 120)" }}
                    icon={<SearchOutlined />} />
                </Tooltip>
              } />
            {isFocused &&
              <Card className="!absolute !w-full !max-h-[500px] !overflow-y-scroll">
                <div className="!text-left">
                  <div className="!text-xl !font-bold">Top vaccine list</div>
                  {vaccines?.map((vaccine: any) => (
                    <Card
                      hoverable
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/vaccine-detail/${vaccine.id}`)
                        setIsFocused(false);
                      }}
                      styles={{ body: { display: "flex" } }} key={vaccine.id}>
                      <div className="!w-[30%]">
                        <img src={vaccineImg} alt="Vaccine" style={{ width: "100px", height: "100px" }} />
                      </div>
                      <div className="!w-[70%]">
                        <div className="!text-gray-500 !text-sm !font-semibold">{vaccine.contraindications}</div>
                        <div className="hover:!underline">{vaccine.name}</div>
                        <div className="!text-orange-500">{vaccine.price.toLocaleString("en-US",
                          { style: "currency", currency: "USD" })}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            }

          </Form>
        </div>
        <div className="!w-full lg:!w-1/2 !flex !items-center lg:!justify-end !gap-3">
          <div>
            <Button className="!rounded-[35px] !h-[40px] !bg-[rgb(30, 50, 80)]"
              style={{ background: "rgb(50, 80, 120)" }}
              type="primary"
              icon={
                <PhoneOutlined />
              }
            >
              <span className="">Call Hotline: +84 999 999</span>
            </Button>
          </div>

          <div>
            <Button
              className="!rounded-[35px] !h-[40px] !font-semibold !text-white"
              style={{
                background: 'linear-gradient(to right, #ff9900, #ff6600)',
                border: 'none',
              }}
              onClick={() => {
                navigate('/home', { state: { scrollTo: 'register' } });
              }}
            >
              Register for Vaccination
            </Button>
          </div>

          <div>
            {!token ? (
              <Link to={hovered === "register" ? RouteNames.REGISTER : RouteNames.LOGIN}>
                <Button
                  className="!rounded-[35px] !h-[40px]"
                  style={{ background: "rgb(255,49,49)" }}
                  type="primary"
                  icon={<UserOutlined />}
                >
                  <span
                    onMouseEnter={() => setHovered("login")}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      textDecoration: hovered === "login" ? "underline" : "none",
                      cursor: "pointer",
                      marginRight: 4,
                    }}
                  >
                    Login
                  </span>
                  /
                  <span
                    onMouseEnter={() => setHovered("register")}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      textDecoration: hovered === "register" ? "underline" : "none",
                      cursor: "pointer",
                      marginLeft: 4,
                    }}
                  >
                    Register
                  </span>
                </Button>
              </Link>
            ) : (
              <Dropdown menu={{ items: userDropdown }}>
                <Button
                  className="!rounded-[35px] !h-[40px]"
                  style={{ background: "rgb(255,49,49)" }}
                  type="primary"
                  icon={<UserOutlined />}
                >
                  {user?.fullName}
                </Button>
              </Dropdown>
            )}
          </div>


        </div>
      </Header>
      <div className="!mt-[64px]">
        <Outlet />
      </div>

      <Footer style={{ background: "#f0f2f5", padding: "40px 60px", marginTop: 80 }}>
        <Row gutter={[32, 32]} justify="space-between">
          <Col xs={24} md={8}>
            <Title level={4}>About Healthshield</Title>
            <Text>
              Healthshield is dedicated to protecting your child’s health through safe and timely vaccinations.
              We provide professional services, friendly care, and accurate vaccination tracking.
            </Text>
          </Col>

          <Col xs={24} md={6}>
            <Title level={4}>Quick Links</Title>
            <Space direction="vertical">
              <Link to="/about">About Us</Link>
              <Link to="/vaccine-package">Vaccine Packages</Link>
              <Link to="/appointment">Book Appointment</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Title level={4}>Contact Us</Title>
            <Space direction="vertical">
              <Text><MailOutlined /> support@healthshield.com</Text>
              <Text><PhoneOutlined /> +1 (234) 567-890</Text>
              <Text><EnvironmentOutlined /> 123 Immunity St, Wellness City</Text>
            </Space>
          </Col>

          <Col xs={24} md={4}>
            <Title level={4}>Follow Us</Title>
            <Space size="large">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookOutlined style={{ fontSize: 24 }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterOutlined style={{ fontSize: 24 }} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramOutlined style={{ fontSize: 24 }} />
              </a>
            </Space>
          </Col>
        </Row>

        <Divider style={{ marginTop: 40 }} />

        <Row justify="center">
          <Text type="secondary">
            © {new Date().getFullYear()} Healthshield. All rights reserved. Designed with care by Tri Lam.
          </Text>
        </Row>
      </Footer>
    </div>);
};

export default CustomerLayout;
