import { AndroidOutlined, ArrowRightOutlined, CalendarOutlined, ClockCircleOutlined, CloseOutlined, EnvironmentOutlined, LeftCircleOutlined, LeftOutlined, MailOutlined, PhoneOutlined, RightCircleOutlined, RightOutlined, SearchOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Carousel, Checkbox, DatePicker, Form, Input, Modal, notification, Radio, Select, Spin, Table, Tabs, theme, TimePicker, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import logo from "@/assets/logo.png";
import home1 from "@/assets/home1.png";
import home2 from "@/assets/home2.png";
import home3 from "@/assets/home3.png";
import home4 from "@/assets/home4.png";
import home5 from "@/assets/home5.png";
import { HeartIcon, LightbulbIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getChildrenByCustomerId } from "@/services/ApiServices/childService";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getUserById } from "@/services/ApiServices/userService";
import { getAllVaccinePackages, getVaccinePackageById } from "@/services/ApiServices/vaccinePackageService";
import { Link } from "react-router-dom";
import RouteNames from "@/constants/routeNames";
import { IoCloseCircleOutline, IoWarningOutline, IoPersonOutline, IoCalendarOutline, IoDocumentText } from "react-icons/io5";
import doctor from "../../../assets/doctor.png";

const { Title, Text } = Typography;
const { Option } = Select;

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
      className={className}
      style={{
        ...style,
        fontSize: "24px",
        color: "black",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2
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
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [selectedVaccines, setSelectedVaccines] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [packages, setPackages] = useState<any>([]);
  const [selectionType, setSelectionType] = useState<"consultation" | "injection">(
    "consultation"
  );
  const [appointmentDate, setAppointmentDate] = useState<any>(null);
  const [appointmentTime, setAppointmentTime] = useState<any>(null);
  const [isModalSelectVisible, setIsModalSelectVisible] = useState(false);

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

  const handlePackageSelect = async (id: any) => {
    setLoading(true);
    try {
      const data = await getVaccinePackageById(id);
      setPackages((prev: any) =>
        prev.map((pkg: any) =>
          pkg.id === id ? { ...pkg, vaccines: data.vaccines } : pkg
        )
      );
      setSelectedPackage(id);
    } catch (error) {
      console.error("Failed to fetch vaccine package details:", error);
    }
    setLoading(false);
  };

  const handleVaccineToggle = (vaccineId: any) => {
    setSelectedVaccines((prev: any) =>
      prev.includes(vaccineId)
        ? prev.filter((id: any) => id !== vaccineId)
        : [...prev, vaccineId]
    );
  };

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!isChecked) {
      notification.error({
        message: 'Please check again',
        description: 'You need to agree to the terms and conditions to proceed.',
      });
      return;
    }
    notification.success({
      message: 'Registration Successful',
      description: 'Your vaccination appointment has been successfully registered.',
    });
    setIsModalVisible(false);
  };

  const onChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Recommended Age Range",
      dataIndex: "recommendedAgeRange",
      key: "recommendedAgeRange",
    },
    {
      title: "Contraindications",
      dataIndex: "contraindications",
      key: "contraindications",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    },
  ];

  const fetchPackages = async () => {
    try {
      const response = await getAllVaccinePackages();
      setPackages(response.packages)
    }
    catch (err) {
      console.log(err);
      notification.error({ message: "Something went wrong. Please try again later." })
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
              <Card className="!h-[fit-content]" styles={{ body: { display: "flex", justifyContent: "center", alignItems: "center" }}}>
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

          <div style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            <div className="grid grid-cols-6 gap-4 items-center !mt-3">
              <div className="col-span-4 h-[300px]" style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                border: "1px solid #f0f0f0",
              }}>
                <Carousel style={{ height: "100%" }} arrows
                  prevArrow={<CustomArrow direction="left" />}
                  nextArrow={<CustomArrow direction="right" />}
                  autoplay={{ dotDuration: true }}
                  dots={{ className: "custom-dots" }}
                >
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo" className="max-h-[300px]" />
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo" className="max-h-[300px]" />
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo" className="max-h-[300px]" />
                  </div>
                  <div className="!flex justify-center w-full">
                    <img src={logo} alt="Logo" className="max-h-[300px]" />
                  </div>
                </Carousel>
              </div>
              <Card className="col-span-2 h-[300px]">
                <img src={logo} alt="Logo" className="max-h-[200px]" />
                Vaccine List
              </Card>
            </div>

            <div className="container mx-auto !py-8">
              <div className="grid grid-cols-4 !gap-6 text-center">
                {["An toàn GSP", "Đội ngũ chuyên gia", "Nguồn gốc rõ ràng", "Dịch vụ tận tâm"].map((title, index) => (
                  <div key={index} className="border-r last:border-r-0 pr-4">
                    <img src={logo} alt="Icon" className="mx-auto w-12 mb-2" />
                    <div className="font-semibold">{title}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div style={{ marginTop: "20px", background: colorBgContainer, borderRadius: borderRadiusLG }}>
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

              <div className="!mt-10 w-full flex justify-center !mb-10">
                <div className="w-6xl mx-auto bg-gray-100 rounded-lg shadow-md flex !gap-8">
                  <Card className="w-full shadow-lg rounded-lg !p-6 bg-white">
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
                                  <Radio key={child.id} value={child.id}>
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

                        {/* Selection Type */}
                        <div className="!mb-4">
                          <Radio.Group
                            onChange={(e) => setSelectionType(e.target.value)}
                            value={selectionType}
                            className="!flex !gap-4"
                          >
                            <Radio value="consultation">Vaccines for Consultation</Radio>
                            <Radio value="injection">Vaccines for Injection</Radio>
                          </Radio.Group>
                        </div>

                        {selectionType === "injection" && (
                          <>
                            <div className="!grid !grid-cols-7 !gap-4 !mb-4">
                              <div className="!col-span-3">
                                <Select
                                  mode="multiple"
                                  placeholder="Select vaccines"
                                  onClick={() => setIsModalSelectVisible(true)}
                                  className="!w-full !border !border-gray-300 !rounded-lg !shadow-sm"
                                  notFoundContent={""}
                                />
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
                                />
                              </div>
                            </div>

                            <div className="!border !p-4 !rounded-lg !bg-gray-50">
                              {selectedVaccines.length > 0 ? (
                                <div className="!flex !flex-wrap !gap-2">
                                  {selectedVaccines.map((vaccineId) => {
                                    const vaccine = packages
                                      .flatMap((pkg: any) => pkg.vaccines || [])
                                      .find((v: any) => v.id === vaccineId);
                                    return vaccine ? (
                                      <div
                                        key={vaccine.id}
                                        className="!bg-gray-200 !px-3 !py-1 !rounded-lg !flex !items-center"
                                      >
                                        {vaccine.name}
                                        <CloseOutlined
                                          className="!ml-2 !cursor-pointer"
                                          onClick={() => handleVaccineToggle(vaccine.id)}
                                        />
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              ) : (
                                <p className="!text-gray-500">No vaccines selected.</p>
                              )}
                            </div>

                            <Modal
                              title="Select Vaccines"
                              open={isModalSelectVisible}
                              onCancel={() => setIsModalSelectVisible(false)}
                              footer={[
                                <Button key="save" type="primary" onClick={() => setIsModalSelectVisible(false)}>
                                  Save
                                </Button>,
                              ]}
                            >
                              <div className="!mb-4">
                                <Input
                                  placeholder="Search by disease or vaccine package"
                                  prefix={<SearchOutlined className="!text-gray-400" />}
                                  value={searchText}
                                  onChange={(e) => setSearchText(e.target.value)}
                                  className="!py-2 !px-4 !w-full !border !border-gray-300 !rounded-lg !shadow-sm"
                                />
                              </div>

                              <div className="!flex !gap-3 !mb-4">
                                <Button
                                  type={!selectedPackage ? "primary" : "default"}
                                  onClick={() => setSelectedPackage(null)}
                                  className="!px-4 !py-2 !rounded-lg"
                                >
                                  All
                                </Button>

                                {packages?.map((pkg: any) => (
                                  <Button
                                    key={pkg.id}
                                    type={selectedPackage === pkg.id ? "primary" : "default"}
                                    onClick={() => handlePackageSelect(pkg.id)}
                                    className="!px-4 !py-2 !rounded-lg"
                                  >
                                    {pkg.name}
                                  </Button>
                                ))}
                              </div>

                              <div className="!border !p-4 !rounded-lg !max-h-60 !overflow-y-auto !bg-gray-50">
                                {loading ? (
                                  <div className="!flex !justify-center !items-center !h-32">
                                    <Spin />
                                  </div>
                                ) : (() => {
                                  // Lấy danh sách vaccine theo package được chọn hoặc tất cả
                                  const allVaccines = selectedPackage
                                    ? packages.find((pkg: any) => pkg.id === selectedPackage)?.vaccines || []
                                    : packages?.flatMap((pkg: any) => pkg.vaccines) || [];

                                  // Lọc trùng tên vaccine
                                  const uniqueVaccinesMap = new Map();
                                  allVaccines.forEach((vaccine: any) => {
                                    const lowerName = vaccine.name.toLowerCase();
                                    if (!uniqueVaccinesMap.has(lowerName)) {
                                      uniqueVaccinesMap.set(lowerName, vaccine);
                                    }
                                  });

                                  // Lọc theo từ khoá tìm kiếm
                                  const filteredVaccines = Array.from(uniqueVaccinesMap.values()).filter((vaccine: any) =>
                                    vaccine.name.toLowerCase().includes(searchText.toLowerCase())
                                  );

                                  // Hiển thị danh sách
                                  return filteredVaccines.length > 0 ? (
                                    filteredVaccines.map((vaccine: any) => (
                                      <div key={vaccine.id} className="!flex !items-center !space-x-2 !mb-2">
                                        <Checkbox
                                          checked={selectedVaccines.includes(vaccine.id)}
                                          onChange={() => handleVaccineToggle(vaccine.id)}
                                        />
                                        <span className="!text-gray-700">{vaccine.name}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="!text-gray-500">No vaccines found.</p>
                                  );
                                })()}
                              </div>
                            </Modal>

                          </>
                        )}

                        {/* Notes */}
                        <div className="!mt-4">
                          <Input.TextArea
                            placeholder="Notes (Optional)"
                            rows={2}
                            className="!w-full !border-gray-300 !rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Select Vaccination Center */}
                      <div className="!bg-white !p-6 !mt-6 !shadow-md !rounded-lg !mb-6">
                        <Title className="text-left" level={4}>
                          <EnvironmentOutlined /> Vaccination Center
                        </Title>
                        {vaccinationCenters.map((center) => (
                          <Card key={center.id} className="!mb-4 text-left border rounded-lg">
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
                          </Card>
                        ))}
                      </div>

                      <Form.Item className="text-center mt-4">
                        <Button type="primary" size="large" onClick={showModal}>Register Now</Button>
                      </Form.Item>
                    </Form>
                  </Card>

                  <VaccinationModal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} handleOk={handleOk} onChange={onChange} isChecked={isChecked} />
                </div>
              </div>
              
            </div>

        </div>
      </div>

      <div>
        <h3 className="!text-3xl !font-bold !text-black !mb-3">
          What vaccine should I get
          <span className="!text-3xl !font-bold !text-orange-500 underline !ml-2">this season
          </span>
          <HeartIcon className="!text-3xl !inline-block !text-orange-500 !ml-2" />
        </h3>

        <Card className="!px-[10%] !w-full !flex !justify-center">
          <Tabs className="!max-w-[1200px]" defaultActiveKey="1" items={
            [
              {
                key: '1',
                label: 'Sốt xuất huyết',
                children: <div className="!text-left">
                  <div className="!text-lg !font-bold !mb-3">Bảo vệ bản thân khỏi sốt xuất huyết Dengue thế nào?</div>
                  <p className="!text-md !font-thin">Sốt xuất huyết Dengue là bệnh truyền nhiễm cấp tính do virus Dengue gây ra, lây truyền qua vết đốt của muỗi vằn Aedes. Bệnh có thể gây sốt cao, đau đầu, đau cơ, buồn nôn, nôn, phát ban và có thể dẫn đến các biến chứng nguy hiểm như xuất huyết, sốc, suy tạng, thậm chí tử vong. Hiện nay, vắc xin Qdenga là loại vắc xin sống, giảm độc lực được sử dụng để phòng ngừa bệnh sốt xuất huyết, dành cho trẻ từ 4 tuổi và người lớn. Tiêm phòng vắc xin là biện pháp hiệu quả giúp bảo vệ sức khỏe cho bạn và cộng đồng.</p>
                </div>,
              },
              {
                key: '2',
                label: 'Viêm não mô cầu ACYW',
                children: <div className="!text-left">
                  <div className="!text-lg !font-bold !mb-3">Viêm màng não do não mô cầu ACYW nguy hiểm thế nào?</div>
                  <p className="!text-md !font-thin">Viêm màng não do não mô cầu ACYW là bệnh nhiễm trùng nguy hiểm do vi khuẩn Neisseria meningitidis gây ra, có thể dẫn đến viêm màng não, nhiễm trùng máu, thậm chí tử vong, đặc biệt nguy hiểm ở trẻ nhỏ. Chủ động tiêm vắc xin phòng bệnh là cách để bảo vệ bản thân và gia đình, giúp ngăn ngừa nguy cơ mắc bệnh và biến chứng nghiêm trọng.</p>
                </div>,
              },
              {
                key: '3',
                label: 'Viêm não mô cầu B',
                children: <div className="!text-left">
                  <div className="!text-lg !font-bold !mb-3">Làm sao để bảo vệ bản thân khỏi viêm màng não do não mô cầu B?</div>
                  <p className="!text-md !font-thin">Viêm màng não do não mô cầu B là một bệnh nhiễm trùng nguy hiểm do vi khuẩn Neisseria meningitidis nhóm B gây ra. Bệnh có thể gây viêm màng não, nhiễm trùng máu và dẫn đến tử vong, đặc biệt nguy hiểm ở trẻ nhỏ. Để chủ động phòng ngừa bệnh, nên tiêm vắc xin Bexsero, loại vắc xin tái tổ hợp dành cho trẻ từ 2 tháng tuổi đến người lớn tròn 50 tuổi.</p>
                </div>,
              },
            ]
          } />
        </Card>

      </div>

      <div className="!bg-[#08293E] !py-3 !text-white">
        <h3 className="!mb-3 !flex !items-center !justify-center">
          <StarOutlined className="!text-3xl !inline-block !text-[#2CD1D1] !mr-2" />
          <span className="underline !text-3xl !font-bold !text-[#2CD1D1]">Vaccination Packages</span>
          <span className="!text-3xl !font-bold !text-white !ml-2">for overall protection
          </span>
        </h3>

        <div className="!flex !items-center !justify-center !text-white">
          <Card className="!w-[70%]">
            <Tabs
              defaultActiveKey="1"
              tabPosition={"left"}
              style={{ height: 500 }}
              items={packages.length > 0 ? packages.map((pkg: any, i: number) => {
                const id = String(i);
                return {
                  label: <div>{`${pkg.name}`}</div>,
                  key: id,
                  disabled: i === 28,
                  children:
                    <div className="!h-[500px]">
                      <div className="!text-xl !font-bold">{`${pkg.name}`}</div>
                      <Table className="!h-[70%] !overflow-y-scroll" dataSource={pkg.vaccines}
                        columns={columns}
                        pagination={{ pageSize: 5 }} />
                      <div className="!flex !text-left !mt-5">
                        <div className="!w-[70%]">
                          <Button
                            className="!rounded-[35px] !h-[48px] !text-white !bg-[#01A9A8] !mr-2"
                            icon={
                              <PhoneOutlined />
                            }>
                            Call advisor now
                          </Button>
                          <Button
                            className="!rounded-[35px] !h-[48px] !text-[#01A9A8] !bg-[#E6F7FA] !mb-3"
                          >
                            See package details
                            <ArrowRightOutlined />
                          </Button>
                          <p className="!text-md !font-thin">
                            <LightbulbIcon className="!mr-2 !inline" />{`${pkg.description}`}
                          </p>
                        </div>
                        <p className="!w-[30%] !flex !items-center !justify-center !text-xl !font-bold">
                          {`${pkg.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}`}
                        </p>
                      </div>
                    </div>,
                };
              }) : []}
            />
          </Card>
        </div>
      </div>
    </Content>
  )
}

const VaccinationModal = ({ isOpen, onClose, handleOk, onChange, isChecked }: { isOpen: boolean, onClose: () => void, handleOk: any, onChange: any, isChecked: any }) => {

  return (
    <div
      className={`fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className="bg-white w-[90%] md:w-[60%] rounded-lg shadow-xl !p-6 relative transform transition-all scale-95 hover:scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center !mb-6">
          <h2 className="!text-2xl font-semibold text-blue-600 flex items-center !gap-2">
            <IoDocumentText className="!text-3xl text-blue-500" />
            Confirm Vaccine Registration
          </h2>
          <IoCloseCircleOutline
            className="!text-2xl cursor-pointer text-gray-600 hover:text-red-500 transition-all"
            onClick={onClose}
          />
        </div>

        <div className="border-b !pb-4 !mb-4 text-gray-700 leading-relaxed">

          <ul className="list-disc list-inside !mt-3 !space-y-3">
            <li className="flex items-start !gap-2">
              <IoWarningOutline className="!text-red-500 !mt-1" />
              Eat a full meal before the vaccination.
            </li>
            <li className="flex items-start !gap-2">
              <IoWarningOutline className="text-red-500 !mt-1" />
              Please arrive on time; otherwise, your appointment will be canceled and no refund will be provided.
            </li>
            <li className="flex items-start !gap-2">
              <IoWarningOutline className="!text-red-500 !mt-1" />
              You must notify us at least 24 hours in advance if you need to reschedule your appointment.
            </li>
            <li className="flex items-start !gap-2">
              <IoCalendarOutline className="!text-purple-500 !mt-1" />
              The terms may change depending on the circumstances at the vaccination center.
            </li>
          </ul>
        </div>

        <div className="flex justify-between items-center !mt-6">
          <label className="flex items-center !gap-2 ">
            <input
              type="checkbox"
              className="checkbox"
              checked={isChecked}
              onChange={onChange}
            />
            I agree to the terms and conditions
          </label>


          <div className="flex justify-end !space-x-4">
            <button
              onClick={onClose}
              className="!bg-gray-300 text-gray-800 !px-5 !py-2 rounded-lg hover:bg-gray-400 transition flex items-center !gap-2"
            >
              Close
            </button>
            <button
              onClick={() => { handleOk() }}
              className="!bg-green-500 text-white !px-5 !py-2 rounded-lg hover:bg-green-600 transition flex items-center !gap-2"
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
