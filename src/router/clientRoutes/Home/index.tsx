import { AndroidOutlined, EnvironmentOutlined, LeftCircleOutlined, LeftOutlined, MailOutlined, PhoneOutlined, RightCircleOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Carousel, DatePicker, Form, Input, Radio, Select, Spin, theme, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import logo from "@/assets/logo.png";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getChildrenByCustomerId } from "@/services/ApiServices/childService";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getUserById } from "@/services/ApiServices/userService";

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
  const [isForRelative, setIsForRelative] = useState(false);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<any>(null);

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <img src={logo} alt="Logo" />
              What vaccine should I get
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Blogs
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Blogs
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
            <Card>
              <img src={logo} alt="Logo" />
              Vaccine List
            </Card>
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

            <div className="container mx-auto py-8">
              <div className="grid grid-cols-4 gap-6 text-center">
                {["An toàn GSP", "Đội ngũ chuyên gia", "Nguồn gốc rõ ràng", "Dịch vụ tận tâm"].map((title, index) => (
                  <div key={index} className="border-r last:border-r-0 pr-4">
                    <img src={logo} alt="Icon" className="mx-auto w-12 mb-2" />
                    <div className="font-semibold">{title}</div>
                  </div>
                ))}
              </div>

              <Title level={2} className="!mt-15 text-center">Register & schedule vaccination</Title>
              <Text className="block text-center mb-6 text-gray-600">
                Please register your vaccination information to save time when coming to the center.
              </Text>

              <div className="!mt-10 w-full flex justify-center !mb-10">
                <div className="w-5xl mx-auto bg-gray-100 rounded-lg shadow-md flex gap-8">
                  <Card className="w-full shadow-lg rounded-lg p-6 bg-white">
                    <Form layout="vertical">
                      {/* Registration Information */}
                      <div className="bg-white p-6 !mt-6">
                        <Title className="text-left" level={4}>
                          <UserOutlined /> Registration Information
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

                      </div>

                      {/* Vaccination for */}
                      <Form.Item label="Vaccination for:">
                        {loading ? (
                          <Spin size="small" />
                        ) : (
                          <Radio.Group onChange={(e) => handleChildSelect(e.target.value)} value={selectedChild?.id}>
                            {children?.map((child: any) => (
                              <Radio key={child.id} value={child.id}>
                                {child.fullName}
                              </Radio>
                            ))}
                          </Radio.Group>
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


                      {/* Select Vaccination Center */}
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

                      {/* Submit Button */}
                      <Form.Item className="text-center mt-4">
                        <Button type="primary" size="large">Register Now</Button>
                      </Form.Item>
                    </Form>
                  </Card>

                </div>
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

        <Card className="!px-[10%]">
          Bảo vệ bản thân khỏi sốt xuất huyết Dengue thế nào?
          Bảo vệ bản thân khỏi sốt xuất huyết Dengue thế nào?
          Sốt xuất huyết Dengue là bệnh truyền nhiễm cấp tính do virus Dengue gây ra, lây truyền qua vết đốt của muỗi vằn Aedes. Bệnh có thể gây sốt cao, đau đầu, đau cơ, buồn nôn, nôn, phát ban và có thể dẫn đến các biến chứng nguy hiểm như xuất huyết, sốc, suy tạng, thậm chí tử vong. Hiện nay, vắc xin Qdenga là loại vắc xin sống, giảm độc lực được sử dụng để phòng ngừa bệnh sốt xuất huyết, dành cho trẻ từ 4 tuổi và người lớn. Tiêm phòng vắc xin là biện pháp hiệu quả giúp bảo vệ sức khỏe cho bạn và cộng đồng.
        </Card>
      </div>
    </Content>
  )
}

export default Home;
