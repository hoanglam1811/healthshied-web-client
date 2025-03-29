import { AndroidOutlined, ArrowRightOutlined, EnvironmentOutlined, LeftCircleOutlined, LeftOutlined, MailOutlined, PhoneOutlined, RightCircleOutlined, RightOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Carousel, DatePicker, Form, Input, notification, Radio, Select, Spin, Table, Tabs, theme, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import logo from "@/assets/logo.png";
import { HeartIcon, LightbulbIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getChildrenByCustomerId } from "@/services/ApiServices/childService";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getUserById } from "@/services/ApiServices/userService";
import { getAllVaccinePackages } from "@/services/ApiServices/vaccinePackageService";

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
  const [packages, setPackages] = useState<any>([]);

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
    try{
      const response = await getAllVaccinePackages();
      setPackages(response.packages)
    }
    catch(err){
      console.log(err);
      notification.error({message: "Something went wrong. Please try again later."})
    }
    finally{

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
          }  />        
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
          <Card className="!w-[60%]">
            <Tabs
              defaultActiveKey="1"
              tabPosition={"left"}
              style={{ height: 500}}
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
                        pagination={{ pageSize: 5 }}/>
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
                            <LightbulbIcon className="!mr-2 !inline"/>{`${pkg.description}`}
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

export default Home;
