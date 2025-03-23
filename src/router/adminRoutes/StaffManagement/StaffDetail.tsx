import { useEffect, useState } from "react";
import { Card, Descriptions, Layout, Typography, Button, Form, Input, Spin, notification } from "antd";
import { getUserById, updateUser } from "@/services/ApiServices/userService";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined, CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import RouteNames from "@/constants/routeNames";

const { Title } = Typography;

const StaffDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Fetch staff details
  const fetchStaff = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await getUserById(id);
      setStaff(data);
      form.setFieldsValue(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
      notification.error({ message: "Không thể tải dữ liệu nhân viên!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle staff update
  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);
      console.log("Dữ liệu nhân viên:", values);
      // return;
      
      await updateUser(id, values);
      notification.success({ message: "Cập nhật nhân viên thành công!" });
      setIsEditing(false);
      fetchStaff();
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      notification.error({ message: "Không thể cập nhật nhân viên!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>Quản lý nhân viên</Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        <div className="flex">
          <Button
            type="primary"
            icon={<LeftOutlined />}
            onClick={() => navigate(RouteNames.STAFF_MANAGEMENT)}
            style={{ marginBottom: 16 }}
          >
            Quay lại danh sách
          </Button>
        </div>
        {loading ? (
          <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
        ) : (
          <Card title={`Chi tiết Nhân viên: ${staff?.fullName}`} extra={
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
                <Form.Item label="Họ và Tên" name="fullName" rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>                    
                  <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>                    
                  <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>                    
                  <Input />
                </Form.Item>
                {/*<Form.Item label="Vai trò" name="role">                    
                  <Input />
                </Form.Item>*/}
                <Form.Item label="Trạng thái" name="status">                    
                  <Input />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Lưu</Button>
                  <Button onClick={() => setIsEditing(false)} icon={<CloseOutlined />}>Hủy</Button>
                </div>
              </Form>
            ) : (
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Họ và Tên">{staff?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{staff?.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{staff?.phone}</Descriptions.Item>
                <Descriptions.Item label="Vai trò">{staff?.role}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{staff?.status}</Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default StaffDetailView;
