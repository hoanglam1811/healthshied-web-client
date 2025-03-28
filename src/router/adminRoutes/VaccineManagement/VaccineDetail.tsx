import { useEffect, useState } from "react";
import { Card, Descriptions, Layout, Button, Form, Input, Spin, notification, Select, Typography } from "antd";
import { getVaccineById, updateVaccine } from "@/services/ApiServices/vaccineService";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined, CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import RouteNames from "@/constants/routeNames";

const { Title } = Typography;

const { Option } = Select;

const VaccineDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaccine, setVaccine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [minAge, setMinAge] = useState<any | null>(null);
  const [maxAge, setMaxAge] = useState<any | null>(null);

  const fetchVaccine = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await getVaccineById(id);
      setVaccine(data);
      form.setFieldsValue({ ...data, minAge: parseInt(data.recommendedAgeRange.split("-")[0]), maxAge: parseInt(data.recommendedAgeRange.split("-")[1]) });
      setMinAge(parseInt(data.recommendedAgeRange.split("-")[0]));
      setMaxAge(parseInt(data.recommendedAgeRange.split("-")[1]));
    } catch (error) {
      console.error("Error fetching vaccine data:", error);
      notification.error({ message: "Failed to load vaccine data!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccine();
  }, []);

  const handleUpdate = async (values: any) => {
    try {
      setLoading(true);
      await updateVaccine(id, { ...values, recommendedAgeRange: `${minAge}-${maxAge}` });
      notification.success({ message: "Vaccine updated successfully!" });
      setIsEditing(false);
      fetchVaccine();
    } catch (error) {
      console.error("Error updating vaccine:", error);
      notification.error({ message: "Failed to update vaccine!" });
    } finally {
      setLoading(false);
    }
  };

  const generateAgeOptions = () => {
    return Array.from({ length: 101 }, (_, i) => (
      <Option key={i} value={i}>
        {i} years
      </Option>
    ));
  };

  return (
    <Layout>
      <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>Vaccine Management</Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        <div className="flex">
          <Button type="primary" icon={<LeftOutlined />} onClick={() => navigate(RouteNames.VACCINE_MANAGEMENT)} style={{ marginBottom: 16 }}>Back to List</Button>
        </div>
        {loading ? (
          <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
        ) : (
          <Card title={`Details of ${vaccine?.name}`} extra={!isEditing && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )} style={{ maxWidth: 600, margin: "20px auto" }}>
            {isEditing ? (
              <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Form.Item label="Vaccine Name" name="name" rules={[{ required: true, message: "Please enter the vaccine name!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="Recommended Age Range" required>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Form.Item name="minAge" rules={[{ required: true, message: "Select min age" }]} style={{ flex: 1, marginBottom: 0 }}>
                      <Select placeholder="Min Age" onChange={(value) => setMinAge(value)}>
                        {generateAgeOptions()}
                      </Select>
                    </Form.Item>
                    <span>-</span>
                    <Form.Item name="maxAge" rules={[
                      { required: true, message: "Select max age" },
                      () => ({
                        validator(_, value) {
                          if (!value || minAge === null || value > minAge) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Max age must be greater than min age!"));
                        },
                      }),
                    ]} style={{ flex: 1, marginBottom: 0 }}>
                      <Select placeholder="Max Age" onChange={(value) => setMaxAge(value)} disabled={minAge === null}>
                        {generateAgeOptions().filter((option: any) => option.props.value > minAge)}
                      </Select>
                    </Form.Item>
                  </div>
                </Form.Item>
                <Form.Item label="Contraindications" name="contraindications">
                  <Input />
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price!" }]}>
                  <Input type="number" />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Save</Button>
                  <Button onClick={() => setIsEditing(false)} icon={<CloseOutlined />}>Cancel</Button>
                </div>
              </Form>
            ) : (
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Name">{vaccine?.name}</Descriptions.Item>
                <Descriptions.Item label="Description">{vaccine?.description}</Descriptions.Item>
                <Descriptions.Item label="Recommended Age Range">{vaccine?.recommendedAgeRange}</Descriptions.Item>
                <Descriptions.Item label="Contraindications">{vaccine?.contraindications}</Descriptions.Item>
                <Descriptions.Item label="Price">
                  {vaccine?.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default VaccineDetailView;