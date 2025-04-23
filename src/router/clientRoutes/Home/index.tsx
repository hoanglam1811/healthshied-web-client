import { ArrowRightOutlined, EnvironmentOutlined, LeftOutlined, MailOutlined, PhoneOutlined, RightOutlined, ScheduleOutlined, StarOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Carousel, DatePicker, Form, Input, Modal, notification, Radio, Select, Spin, Table, Tabs, Tag, theme, TimePicker, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import logo from "@/assets/logo.png";
import home1 from "@/assets/home1.png";
import home2 from "@/assets/home2.png";
import home3 from "@/assets/home3.png";
import home4 from "@/assets/home4.png";
import home5 from "@/assets/home5.png";
import { HeartIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getChildrenByCustomerId } from "@/services/ApiServices/childService";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getAllUsers, getUserById } from "@/services/ApiServices/userService";
import { getAllVaccinePackages } from "@/services/ApiServices/vaccinePackageService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RouteNames from "@/constants/routeNames";
import { IoWarningOutline, IoCalendarOutline, IoDocumentText } from "react-icons/io5";
import doctor from "../../../assets/doctor.png";
import { createAppointment } from "@/services/ApiServices/appoinmentService";
import TabPane from "antd/es/tabs/TabPane";
import { getCountries } from "@/services/CountriesService";

const { Title, Text } = Typography;

const vaccinationCenters = [
  {
    id: 1,
    name: "Tiêm Chủng FPT Long Châu - Hồ Chí Minh",
    address: "Số 151B đường Trần Quang Khải, phường Tân Định, quận 1, TP. Hồ Chí Minh",
    status: "Closed",
    openTime: "07:30"
  }
];

const CustomArrow = ({ className, style, onClick, direction }: any) => {
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 cursor-pointer shadow-md hover:scale-105 transition-all 
        ${direction === "left" ? "left-3" : "right-3"} ${className || ""}`}
      style={{
        ...style,
        fontSize: "20px",
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderRadius: "9999px",
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
      onClick={onClick}
    >
      {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
    </div>
  );
};

const Home = () => {
  const userToken = useSelector((state: RootState) => state.token.user);
  const customerId = userToken?.id;
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedVaccines, setSelectedVaccines] = useState<any[]>([]);
  const [packages, setPackages] = useState<any>([]);

  const [appointmentDate, setAppointmentDate] = useState<any>(null);
  const [appointmentTime, setAppointmentTime] = useState<any>(null);
  const [isModalSelectVisible, setIsModalSelectVisible] = useState(false);
  const [note, setNote] = useState("");
  const [staffList, setStaffList] = useState<any[]>([]);
  const navigate = useNavigate();

  const location = useLocation();
  const registerFormRef = useRef<HTMLDivElement>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [countriesList, setCountriesList] = useState<any[]>([]);

  useEffect(() => {
    const countries = getCountries();
    setCountriesList(countries);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo === 'register' && registerFormRef.current) {
      registerFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await getAllUsers();
        const staffOnly = res.users.filter((u: any) => u.role === "Staff");
        setStaffList(staffOnly);
      } catch (error) {
        console.error("Failed to load staff", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      try {
        const data = await getAllVaccinePackages();
        setPackages(data.packages);
      } catch (error) {
        console.error("Failed to fetch vaccine packages:", error);
      }
      setLoading(false);
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!customerId) return;

    async function fetchChildren() {
      try {
        const data = await getChildrenByCustomerId(customerId);
        setChildren(data.children);
        if (data.children.length > 0) {
          setSelectedChild(data[0]);
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChildren();
  }, [customerId]);

  const handleChildSelect = (childId: number) => {
    const childInfo = children.find((child: any) => child.id === childId);
    setSelectedChild(childInfo);
  };

  const [parentInfo, setParentInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserById(customerId);
        setParentInfo({
          fullName: userData.fullName,
          phone: userData.phone,
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userToken?.id) {
      fetchUserData();
    }
  }, [userToken]);

  const showModal = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsModalVisible(true);
    setTotalPrice(pkg.price);
    console.log(pkg)
  };

  const handleOk = async () => {
    if (!isChecked) {
      notification.error({
        message: "Please check again",
        description: "You need to agree to the terms and conditions to proceed.",
      });
      return;
    }

    try {
      if (!selectedChild) {
        notification.error({
          message: "Missing Information",
          description: "Please select a child.",
        });
        return;
      }

      if (!appointmentDate || !appointmentTime) {
        notification.error({
          message: "Incomplete Appointment",
          description: "Please select both date and time.",
        });
        return;
      }

      const combinedDateTime = dayjs(appointmentDate)
        .hour(dayjs(appointmentTime).hour())
        .minute(dayjs(appointmentTime).minute())
        .second(0)
        .format("YYYY-MM-DD HH:mm:ss");

      const selectedPackageId = typeof selectedPackage === "object" ? selectedPackage : null;

      console.log(selectedPackage)

      if (!selectedPackageId) {
        notification.error({
          message: "Missing Package",
          description: "Please select one vaccination package.",
        });
        return;
      }

      const foundPackage = packages.find((pkg: any) => pkg.id === selectedPackageId.id);

      console.log(packages)

      console.log(foundPackage)

      if (!foundPackage) {
        notification.error({
          message: "Invalid Package",
          description: "The selected package could not be found.",
        });
        return;
      }

      const tempPrice = foundPackage.price || 0;

      setTotalPrice(tempPrice);

      const payload = {
        assignedStaffId: null,
        childId: selectedChild.id,
        packageId: foundPackage.id,
        recordId: 0,
        price: tempPrice,
        appointmentDate: combinedDateTime,
        status: "PENDING",
        description: note.trim(),
      };

      console.log("Final Payload", payload);
      await createAppointment(payload);

      notification.success({
        message: "Registration Successful",
        description: "Your vaccination appointment has been successfully registered.",
      });

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error during appointment creation:", error);
      notification.error({
        message: "Registration Failed",
        description: "There was an error while registering the appointment. Please try again.",
      });
    }
  };


  const onChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const fetchPackages = async () => {
    try {
      const response = await getAllVaccinePackages();
      setPackages(response.packages)
    }
    catch (err) {
      console.log(err);
    }
    finally {

    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])


  return (
    <Content style={{ minHeight: "85vh" }}>
      <div style={{
        background: "url('https://cdn.tiemchunglongchau.com.vn/unsafe/1920x0/filters:quality(90):format(webp)/HEADER_BANNER_f8b8df36f0.png')",
        padding: '0 48px',
        minHeight: "85vh",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 0%"
      }}>

        <div
          style={{
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="grid grid-cols-5 !gap-4">
            <Link to="#">
              <Card className="!h-[fit-content]" styles={{ body: { display: "flex", justifyContent: "center", alignItems: "center" } }}>
                <div>
                  <div className="!w-full !flex !justify-center">
                    <img src={home1} alt="Logo" />
                  </div>
                  What vaccine should I get
                </div>
              </Card>
            </Link>
            <Link to="#">
              <Card className="!h-[fit-content]" styles={{ body: { display: "flex", justifyContent: "center", alignItems: "center" } }}>
                <div>
                  <div className="!w-full !flex !justify-center">
                    <img src={home2} alt="Logo" />
                  </div>
                  Chat with doctor
                </div>
              </Card>
            </Link>
            <Link to={RouteNames.VACCINE_LIST}>
              <Card className="!h-[fit-content]" styles={{ body: { display: "flex", justifyContent: "center", alignItems: "center" } }}>
                <div>
                  <div className="!w-full !flex !justify-center">
                    <img src={home3} alt="Logo" />
                  </div>
                  Vaccine List
                </div>
              </Card>
            </Link>

            <Link to="#">
              <Card className="!h-[fit-content]" styles={{ body: { display: "flex", justifyContent: "center", alignItems: "center" } }}>
                <div>
                  <div className="!w-full !flex !justify-center">
                    <img src={home4} alt="Logo" />
                  </div>
                  Package List
                </div>
              </Card>
            </Link>

            <Link to="#">
              <Card className="!h-[fit-content]" styles={{ body: { display: "flex", justifyContent: "center", alignItems: "center" } }}>
                <div>
                  <div className="!w-full !flex !justify-center">
                    <img src={home5} alt="Logo" />
                  </div>
                  Blogs
                </div>
              </Card>
            </Link>
          </div>

          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="!mt-5"
          >
            <div className="grid grid-cols-6 !gap-4 items-center !mt-3">
              <div
                className="col-span-4 h-[338px] relative overflow-hidden"
                style={{
                  background: colorBgContainer,
                  border: "1px solid #f0f0f0",
                }}
              >
                <Carousel
                  className="h-full"
                  arrows
                  prevArrow={<CustomArrow direction="left" />}
                  nextArrow={<CustomArrow direction="right" />}
                  autoplay
                  dots={{ className: "custom-dots" }}
                >
                  {[
                    "https://cdn.tiemchunglongchau.com.vn/unsafe/1080x0/filters:quality(90)/Trang_chu_pc_2_75bfcd7d2a.png",
                    "https://cdn.tiemchunglongchau.com.vn/unsafe/1080x0/filters:quality(90)/Trang_chu_pc_7ace5696f6.png",
                    "https://cdn.tiemchunglongchau.com.vn/unsafe/1080x0/filters:quality(90)/Trang_chu_pc_1_a298bb7926.png",
                    "https://cdn.tiemchunglongchau.com.vn/unsafe/1080x0/filters:quality(90)/808x298_76e9703d8a.jpg",
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="h-[350px] w-full flex justify-center items-center overflow-hidden relative"
                    >
                      <img
                        src={src}
                        alt={`Banner ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Card section */}
              <div className="!col-span-2 h-[300px] flex justify-center items-center text-center">
                <div className="!w-full !px-4">
                  <div className="!grid !grid-cols-2 !gap-6">
                    {[
                      {
                        title: "GSP standard preservation",
                        img: "https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_59c5ff874f.png",
                      },
                      {
                        title: "Team of experts",
                        img: "https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_1_5923799673.png",
                      },
                      {
                        title: "Clear origin",
                        img: "https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_2_4a1714c1da.png",
                      },
                      {
                        title: "Dedicated service",
                        img: "https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_3_626c50da92.png",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="!flex !flex-col !items-center !text-center !pb-4"
                      >
                        <img src={item.img} alt={`Icon ${index + 1}`} className="!w-12 !mb-2" />
                        <div className="!font-semibold !text-sm">{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="!p-[40px_24px] !bg-white !mt-5 !mb-2 !rounded-[12px]">
            <div className="!flex !justify-between !mb-[24px]">
              <Title level={4} style={{ margin: 0 }}>
                <TeamOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                Professional Team
              </Title>
              <Text
                strong
                style={{ cursor: "pointer", color: "#1677ff" }}
                onClick={() => navigate(RouteNames.PROFESSIONAL_TEAM)}
              >
                View all &gt;
              </Text>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-6">
              {(loading ? Array(4).fill(null) : staffList.slice(0, 4)).map((staff, index) => (
                <div key={index} className="!w-full">
                  <Card
                    className="text-left"
                    loading={loading}
                    bordered={false}
                    hoverable
                    style={{
                      borderRadius: 12,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="!flex !items-center">
                      <div className="!flex-[0_0_30%] !text-center">
                        <Avatar
                          size={80}
                          src={`https://github.com/shadcn.png`}
                          className="!mb-2"
                        />
                      </div>
                      <div className="!flex-1 !pl-4">
                        <Tag className="!mb-1" color="blue">
                          Doctor
                        </Tag>
                        <Title level={5} style={{ margin: 0 }}>
                          {staff?.fullName || "Unknown"}
                        </Title>
                        <Text type="secondary">General Department</Text>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Card className="!px-[10%] !w-full !flex !justify-center !mt-7">
              <h3 className="!text-3xl !font-bold !text-black !mb-3">
                What vaccine should I get
                <span className="!text-3xl !font-bold !text-orange-500 underline !ml-2">this season
                </span>
                <HeartIcon className="!text-3xl !inline-block !text-orange-500 !ml-2" />
              </h3>
              <Tabs className="!max-w-[1200px]" defaultActiveKey="1" items={
                [
                  {
                    key: '1',
                    label: 'Dengue Fever',
                    children: <div className="!text-left">
                      <div className="!text-lg !font-bold !mb-3">How to protect yourself from Dengue Fever?</div>
                      <p className="!text-md !font-thin">Dengue fever is an acute infectious disease caused by the Dengue virus, transmitted through the bite of the Aedes mosquito. The disease can cause high fever, headache, muscle pain, nausea, vomiting, rash, and may lead to serious complications such as bleeding, shock, organ failure, and even death. Currently, Qdenga vaccine is a live, attenuated vaccine used to prevent Dengue fever, for children from 4 years old and adults. Getting vaccinated is an effective way to protect your health and the community.</p>
                    </div>,
                  },
                  {
                    key: '2',
                    label: 'Meningococcal ACYW',
                    children: <div className="!text-left">
                      <div className="!text-lg !font-bold !mb-3">How dangerous is Meningococcal ACYW Meningitis?</div>
                      <p className="!text-md !font-thin">Meningococcal ACYW meningitis is a dangerous infection caused by the Neisseria meningitidis bacteria, which can lead to meningitis, blood infection, and even death, especially dangerous in young children. Proactively getting vaccinated is the best way to protect yourself and your family, preventing the risk of infection and serious complications.</p>
                    </div>,
                  },
                  {
                    key: '3',
                    label: 'Meningococcal B',
                    children: <div className="!text-left">
                      <div className="!text-lg !font-bold !mb-3">How to protect yourself from Meningococcal B Meningitis?</div>
                      <p className="!text-md !font-thin">Meningococcal B meningitis is a dangerous infection caused by the Neisseria meningitidis group B bacteria. The disease can lead to meningitis, blood infection, and death, particularly dangerous in young children. To proactively prevent the disease, it is recommended to get the Bexsero vaccine, a recombinant vaccine for children from 2 months old to adults up to 50 years old.</p>
                    </div>,
                  },
                ]
              } />
            </Card>

          </div>

          <div ref={registerFormRef}>
            <div className="!bg-[#08293E] !py-3 !text-white !mt-8 !rounded-lg">
              <h3 className="!mb-3 !flex !items-center !justify-center">
                <StarOutlined className="!text-3xl !inline-block !text-[#2CD1D1] !mt-3 !mr-2" />
                <span className="underline !mt-4 !text-3xl !font-bold !text-[#2CD1D1]">Vaccination Packages</span>
                <span className="!text-3xl !mt-4 !font-bold !text-white !ml-2">for overall protection
                </span>
              </h3>

              <div className="!py-10 !mt-3 !mb-3">
                <div className="!max-w-7xl !mx-auto !px-4 !grid md:grid-cols-3 !gap-6 !text-left">
                  {/* Box 1 */}
                  <div className="!flex !items-center !gap-6">
                    <img
                      src="https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_59c5ff874f.png"
                      className="!w-12 !h-12 !object-contain"
                      alt="icon"
                    />
                    <div>
                      <h3 className="!text-md !text-white !font-semibold">Free appointment reminders</h3>
                      <p className="!text-gray-300 !text-sm">Accurate and scientific for the whole family</p>
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="!flex !items-start !gap-6">
                    <img
                      src="https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_1_5923799673.png"
                      className="!w-12 !h-12 !object-contain"
                      alt="icon"
                    />
                    <div>
                      <h3 className="!text-md !text-white !font-semibold">Commitment to keep vaccine prices</h3>
                      <p className="!text-gray-300 !text-sm">During the injection period according to the regimen</p>
                    </div>
                  </div>

                  {/* Box 3 */}
                  <div className="!flex !items-start !gap-6">
                    <img
                      src="https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_3_626c50da92.png"
                      className="!w-12 !h-12 !object-contain"
                      alt="icon"
                    />
                    <div>
                      <h3 className="!text-md !text-white !font-semibold">Committed always having enough vaccines</h3>
                      <p className="!text-gray-300 !text-sm">No worries about shortages</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="!flex !items-center !justify-center !text-white">
                <Card className="!w-[95%] !mb-6">
                  <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: "100%" }}>
                    {packages?.length > 0 &&
                      packages.map((pkg: any, i: any) => {
                        const id = String(i);
                        return (
                          <TabPane
                            tab={
                              <div
                                className="!h-[70px] !w-[300px] !flex !items-center !justify-between !bg-[#eaf1fb] hover:!bg-[#dce8f5] !rounded-lg !px-3 !py-2 !mr-4"
                              >
                                <div className="!flex !items-center">
                                  <div className="!bg-[#c7d7f0] !px-2 !py-1 !rounded-l-lg !rounded-tr-[40%] !rounded-br-[40%] !mr-3">
                                    <img
                                      src={
                                        pkg.imageUrl ||
                                        "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/icon_goi_phu_nu_truoc_khi_mang_thai_75358e9a30.png"
                                      }
                                      alt=""
                                      className="!w-8 !h-8"
                                    />
                                  </div>
                                  <div className="!text-[#0050b3] !font-medium !text-md !text-left !break-words !whitespace-normal">
                                    {pkg.name}
                                  </div>
                                </div>
                                <div className="!w-[24px] !h-[24px] !rounded-full !ml-2 !bg-[#0050b3] !flex !items-center !justify-center !text-white !text-sm">
                                  &gt;
                                </div>
                              </div>
                            }
                            key={id}
                          >
                            <div className="!h-[fit-content]">
                              <div className="!flex !justify-between !items-start !mb-3">
                                <div className="!text-left">
                                  <div className="!text-2xl !font-bold !text-[#0c1d3c]">{pkg.name}</div>
                                  <div className="!text-base !text-blue-500 !mt-1">{pkg.description}</div>
                                </div>

                                <div className="!text-right">
                                  <p className="!text-2xl !font-extrabold !text-green-600 !bg-green-100 !px-4 !py-1 !rounded-lg !shadow-md">
                                    {pkg.price.toLocaleString("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="overflow-x-auto">
                                <Table
                                  dataSource={pkg.vaccines}
                                  rowKey="id"
                                  columns={[
                                    { title: "Disease prevention", dataIndex: "targetDisease", key: "targetDisease" },
                                    { title: "Vaccine name", dataIndex: "name", key: "name" },
                                    {
                                      title: "Country",
                                      dataIndex: "country",
                                      key: "country",
                                      render: (countryName: string) => {
                                        const country = countriesList.find(c => c.name === countryName);
                                        return country ? (
                                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <img
                                              src={country.flagUrl}
                                              alt={country.name}
                                              style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 2 }}
                                            />
                                            <span>{country.name}</span>
                                          </div>
                                        ) : (
                                          countryName
                                        );
                                      },
                                    },
                                    { title: "Dose", dataIndex: "dose", key: "dose" },
                                    {
                                      title: "Price ($)",
                                      dataIndex: "price",
                                      key: "price",
                                      render: (price: number) =>
                                        price.toLocaleString("en-US", { style: "currency", currency: "USD" }),
                                    },
                                  ]}
                                  pagination={false}
                                  bordered
                                  className="custom-table"
                                />
                              </div>

                              <div className="!flex !text-left !mt-9">
                                <div className="!ml-60">
                                  <Button
                                    className="!rounded-[35px] !h-[48px] !text-white !bg-[#01A9A8] !mr-2"
                                    icon={<PhoneOutlined />}
                                  >
                                    Call advisor now
                                  </Button>

                                  <Button
                                    className="!rounded-[35px] !h-[48px] !text-[#01A9A8] !bg-[#E6F7FA] !mr-2"
                                  >
                                    See package details
                                    <ArrowRightOutlined />
                                  </Button>

                                  <Button
                                    className="!rounded-[35px] !h-[48px] !text-white !bg-[#52C41A]"
                                    icon={<ScheduleOutlined />}
                                    onClick={() => showModal(pkg)}
                                  >
                                    Book vaccination now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </TabPane>
                        );
                      })}
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>

          <Modal
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={handleOk}
            width={"1000px"}
          >
            <div style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}>
              <Title level={2} className="!pt-10 text-center">Register & schedule vaccination</Title>
              <Text className="block text-center !mb-6 text-gray-600">
                Please register your vaccination information to save time when coming to the center.
              </Text>

              <div className="!flex !justify-center !mb-6">
                <div
                  style={{
                    backgroundImage: `url(${doctor})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '600px',
                    height: '300px',
                  }}
                />
              </div>

              <div className="w-full flex justify-center !mb-10">
                <div className="w-6xl mx-auto bg-gray-100 flex !gap-8">
                  <div className="w-full !p-6 bg-white">
                    <Form layout="vertical">
                      <div className="!bg-white !p-6 !mt-6 !shadow-md !rounded-lg !mb-2">
                        <Title className="text-left !mb-6" level={4}>
                          <UserOutlined /> Parent Information
                        </Title>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <Form.Item label="Full Name" className="col-span-1">
                            <Input
                              value={parentInfo.fullName}
                              disabled
                              style={{ fontWeight: "bold" }}
                              placeholder="Enter full name"
                            />
                          </Form.Item>
                          <Form.Item label="Phone Number" className="col-span-1">
                            <Input
                              value={parentInfo.phone}
                              prefix={<PhoneOutlined />}
                              disabled
                              style={{ fontWeight: "bold" }}
                              placeholder="Enter phone number"
                            />
                          </Form.Item>
                          <Form.Item label="Email" className="col-span-1">
                            <Input
                              value={parentInfo.email}
                              prefix={<MailOutlined />}
                              disabled
                              style={{ fontWeight: "bold" }}
                              placeholder="Enter email"
                            />
                          </Form.Item>
                        </div>
                        {/* Vaccination for */}
                        <Form.Item label="Vaccination for:">
                          {loading ? (
                            <Spin size="small" />
                          ) : (
                            <div className="!mb-2 !mt-4">
                              <Radio.Group
                                onChange={(e) => handleChildSelect(e.target.value)}
                                value={selectedChild?.id}
                                className="!flex !gap-4"
                              >
                                {children?.map((child: any) => (
                                  <Radio
                                    key={child.id}
                                    value={child.id}
                                    className={selectedChild?.id === child.id ? "!border-blue-500  !font-semibold" : ""}
                                  >
                                    {child.fullName}
                                  </Radio>

                                ))}
                              </Radio.Group>
                            </div>
                          )}
                        </Form.Item>

                        {/* Recipient Information */}
                        {selectedChild && (
                          <>
                            <Title className="text-left !mt-6 !mb-6" level={4}>
                              <UserOutlined /> Recipient Information
                            </Title>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                              <Form.Item label="Full Name">
                                <Input style={{ fontWeight: "bold" }} value={selectedChild.fullName} disabled />
                              </Form.Item>
                              <Form.Item label="Date of Birth">
                                <DatePicker style={{ fontWeight: "bold" }} className="w-full" value={selectedChild.birthday ? dayjs(selectedChild.birthday, "MM/DD/YYYY HH:mm:ss") : null} disabled />
                              </Form.Item>
                              <Form.Item label="Gender">
                                <Input style={{ fontWeight: "bold" }} value={selectedChild.gender} disabled />
                              </Form.Item>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="!bg-white !p-6 !mt-6 !shadow-md !rounded-lg !mb-6">
                        <Title className="!text-left !mb-6" level={4}>
                          <UserOutlined /> Select Vaccine Type
                        </Title>

                        <div className="!grid !grid-cols-7 !gap-4 !mb-4">
                          <div className="!col-span-3">
                            <Select
                              placeholder="Select package"
                              className="!w-full !border !border-gray-300 !rounded-lg !shadow-sm"
                              notFoundContent={""}
                              value={selectedPackage ? [`${selectedPackage.name} - $${selectedPackage.price}`] : []}
                              disabled
                            >
                              {selectedPackage ? (
                                <Select.Option key={selectedPackage.name} value={selectedPackage.name} disabled>
                                  {selectedPackage.name}
                                </Select.Option>
                              ) : null}
                            </Select>
                          </div>

                          <div className="!col-span-2">
                            <DatePicker
                              placeholder="Select appointment date"
                              value={appointmentDate}
                              onChange={setAppointmentDate}
                              className="!w-full !border !border-gray-300 !rounded-lg !shadow-sm"
                            />
                          </div>

                          <div className="!col-span-2">
                            <TimePicker
                              placeholder="Select time slot"
                              value={appointmentTime}
                              onChange={setAppointmentTime}
                              className="!w-full !border !border-gray-300 !rounded-lg !shadow-sm"
                              format="HH:mm"
                              hideDisabledOptions
                              showNow={false}
                              minuteStep={15}
                              disabledHours={() =>
                                [...Array(24).keys()].filter((hour) => hour < 8 || hour > 19)
                              }
                            />

                          </div>
                        </div>

                        {/* Notes */}
                        <div className="!mt-4">
                          <Input.TextArea
                            placeholder="Notes (Optional)"
                            rows={2}
                            className="!w-full !border-gray-300 !rounded-lg"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>

                        <div className="!mt-4 !text-right">
                          <Text strong>Total Price: </Text>
                          <Text type="danger">
                            {totalPrice.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            })}
                          </Text>
                        </div>

                      </div>

                      {/* Select Vaccination Center */}
                      <div className="!bg-white !p-6 !mt-6 !shadow-md !rounded-lg !mb-6">
                        <Title className="text-left" level={4}>
                          <EnvironmentOutlined /> Vaccination Center
                        </Title>
                        {vaccinationCenters.map((center) => (
                          <div key={center.id} className="!mb-4 text-left border rounded-lg">
                            <div className="flex items-center justify-between">
                              {/* Phần thông tin (70%) */}
                              <div className="flex-[7]">
                                <Text strong>{center.name}</Text>
                                <br />
                                <Text type="secondary">{center.address}</Text>
                                <br />
                                <Text type="danger">{center.status}</Text> - Opens at {center.openTime}
                              </div>
                              {/* Phần nút View Directions (30%) */}
                              <div className="flex-[3] text-right">
                                <Button
                                  type="primary"
                                  style={{ backgroundColor: "#4da6ff", borderColor: "#4da6ff", color: "white" }}
                                  onClick={() => {
                                    const address = encodeURIComponent("151B Trần Quang Khải, Tân Định, Quận 1, TP. Hồ Chí Minh");
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
                                  }}
                                >
                                  View Directions
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center !mt-6">
                        <label className="!flex !items-start !gap-3 !rounded-xl !p-4 !w-full !hover:shadow-md !transition-shadow !duration-300">
                          <input
                            type="checkbox"
                            className="accent-blue-600 !w-5 !h-5 !mt-1"
                            checked={isChecked}
                            onChange={onChange}
                          />
                          <span className="text-gray-800 !text-[16px] !leading-relaxed">
                            <strong className="text-blue-700">Confirmation:</strong> I have carefully read and fully agree to comply with all the terms and conditions stated below, including any updates that may arise due to the vaccination center’s operational changes.
                          </span>
                        </label>
                      </div>


                      {isChecked && (
                        <div className="!bg-white !p-6 !mt-6 !shadow-md !rounded-lg !mb-6 animate-fade-in">
                          <Title level={4} className="!flex items-center gap-2 text-blue-600">
                            <IoDocumentText className="text-2xl text-blue-500" />
                            Terms & Conditions
                          </Title>

                          <div className="border-b !pb-4 !mb-4 text-gray-700 leading-relaxed">
                            <ul className="list-disc list-inside !mt-3 !space-y-3">
                              <li className="flex items-start !gap-2">
                                <IoWarningOutline className="!text-red-500 !mt-1" />
                                For your safety and to ensure the effectiveness of the vaccine, please make sure to have a complete meal before arriving at the vaccination center.
                              </li>
                              <li className="flex items-start !gap-2">
                                <IoWarningOutline className="text-red-500 !mt-1" />
                                It is crucial that you arrive on time for your scheduled appointment. Failure to do so may result in the automatic cancellation of your booking without any eligibility for a refund.
                              </li>
                              <li className="flex items-start !gap-2">
                                <IoWarningOutline className="!text-red-500 !mt-1" />
                                If you are unable to attend your appointment, please inform us at least 24 hours in advance to facilitate rescheduling and to avoid any inconvenience.
                              </li>
                              <li className="flex items-start !gap-2">
                                <IoCalendarOutline className="!text-purple-500 !mt-1" />
                                Please note that the vaccination center reserves the right to modify the terms and conditions at any time, depending on operational or health-related circumstances.
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                    </Form>
                  </div>

                </div>
              </div>

            </div>
          </Modal>

        </div>
      </div>

    </Content>
  )
};

export default Home;
