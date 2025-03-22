import { useEffect, useState } from "react";
import { Card, Descriptions, Layout, Menu, Typography, Button, Form, Input, Spin, notification } from "antd";
import { getVaccineById, updateVaccine } from "@/services/ApiServices/vaccineService";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarOutlined, DashboardOutlined, ShoppingCartOutlined, UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, LeftOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import RouteNames from "@/constants/routeNames";
import logo from "@/assets/logo.png";

const { Title } = Typography;

const VaccineDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [vaccine, setVaccine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Fetch vaccine details
  const fetchVaccine = async () => {
    try {
      if(!id) return
      setLoading(true);
      const data = await getVaccineById(id);
      setVaccine(data);
      form.setFieldsValue(data); // Load dữ liệu vào form khi có vaccine
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu vaccine:", error);
      notification.error({ message: "Không thể tải dữ liệu vaccine!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccine();
  }, []);

  // Xử lý cập nhật vaccine
  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);
      await updateVaccine(id, values);
      notification.success({ message: "Cập nhật vaccine thành công!" });
      setIsEditing(false);
      fetchVaccine(); // Load lại dữ liệu sau khi cập nhật
    } catch (error) {
      console.error("Lỗi khi cập nhật vaccine:", error);
      notification.error({ message: "Không thể cập nhật vaccine!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div style={{ textAlign: "center", padding: collapsed ? "10px" : "20px" }}>
          <img src={logo} alt="Logo" style={{ width: collapsed ? "50px" : "80%", transition: "0.3s" }} />
          <Title level={4} style={{ color: "white", fontWeight: "bold", marginTop: 10 }}>Health Shield</Title>
        </div>

        <Menu theme="dark" mode="inline" defaultSelectedKeys={["vaccine-management"]}>
          <Menu.Item onClick={() => navigate(RouteNames.ADMIN_DASHBOARD)} key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item onClick={() => navigate(RouteNames.STAFF_MANAGEMENT)} key="staff-management" icon={<DashboardOutlined />}>Quản lý nhân viên</Menu.Item>
          <Menu.Item onClick={() => navigate(RouteNames.VACCINE_MANAGEMENT)} key="vaccine-management" icon={<DashboardOutlined />}>Quản lý vaccine</Menu.Item>
          <Menu.Item onClick={() => navigate(RouteNames.PACKAGE_MANAGEMENT)} key="package-management" icon={<DashboardOutlined />}>Quản lý gói</Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>Đơn hàng</Menu.Item>
          <Menu.Item key="vaccine-schedule" icon={<CalendarOutlined />}>Lịch tiêm chủng</Menu.Item>
          <Menu.Item key="customers" icon={<UserOutlined />}>Khách hàng</Menu.Item>
        </Menu>
      </Sider>

      {/* Content */}
      <Layout>
        <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Title level={3} style={{ color: "white", margin: 0 }}>Quản lý vaccine</Title>
          
        </Header>

        <Content style={{ padding: "24px" }}>
          <div className="flex">
            <Button
              type="primary"
              icon={<LeftOutlined />}
              onClick={() => navigate(RouteNames.VACCINE_MANAGEMENT)}
              style={{ marginBottom: 16 }}
            >
              Quay lại danh sách
            </Button>
          </div>
          {loading ? (
            <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
          ) : (
            <Card title={`Chi tiết Vaccine: ${vaccine?.name}`} extra={
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
            } style={{ maxWidth: 600, margin: "20px auto" }}>
              {isEditing ? (
                <Form form={form} layout="vertical" onFinish={handleUpdate}>
                  <Form.Item label="Tên Vaccine" name="name" rules={[{ required: true, message: "Vui lòng nhập tên vaccine!" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Mô tả" name="description">
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item label="Độ tuổi khuyến nghị" name="recommendedAgeRange">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Chống chỉ định" name="contraindications">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
                    <Input type="number" />
                  </Form.Item>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Lưu</Button>
                    <Button onClick={() => setIsEditing(false)} icon={<CloseOutlined />}>Hủy</Button>
                  </div>
                </Form>
              ) : (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Tên">{vaccine?.name}</Descriptions.Item>
                  <Descriptions.Item label="Mô tả">{vaccine?.description}</Descriptions.Item>
                  <Descriptions.Item label="Độ tuổi khuyến nghị">{vaccine?.recommendedAgeRange}</Descriptions.Item>
                  <Descriptions.Item label="Chống chỉ định">{vaccine?.contraindications}</Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    {vaccine?.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default VaccineDetailView;

