import { useEffect, useState } from "react";
import { Card, Descriptions, Layout, Button, Form, Input, Spin, notification, Select, Typography, InputNumber } from "antd";
import { getVaccinePackageById, updateVaccinePackage } from "@/services/ApiServices/vaccinePackageService";
import { getAllVaccines } from "@/services/ApiServices/vaccineService";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined, CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import RouteNames from "@/constants/routeNames";

const { Title } = Typography;
const { Option } = Select;

const VaccinePackageDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vaccinePackage, setVaccinePackage] = useState<any>(null);
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    const fetchVaccinePackage = async () => {
        try {
            if (!id) return;
            setLoading(true);
            const data = await getVaccinePackageById(id);
            console.log(data)
            setVaccinePackage(data);
            form.setFieldsValue({ ...data, vaccineIds: data.vaccines.map((v: any) => v.id) });
        } catch (error) {
            console.error("Error fetching vaccine package:", error);
            notification.error({ message: "Failed to load vaccine package data!" });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllVaccines = async () => {
        try {
            const data = await getAllVaccines();
            setVaccines(data.vaccines);
        } catch (error) {
            console.error("Error fetching vaccines:", error);
        }
    };

    const handleUpdate = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                request: {
                    id,
                    name: values.name,
                    description: values.description,
                    price: values.price
                },
                vaccineIds: values.vaccineIds
            };

            await updateVaccinePackage(id, payload);
            notification.success({ message: "Vaccine package updated successfully!" });

            setIsEditing(false);
            setVaccinePackage({
                ...vaccinePackage,
                ...values,
                vaccines: vaccines.filter(v => values.vaccineIds.includes(v.id))
            });
        } catch (error) {
            console.error("Error updating vaccine package:", error);
            notification.error({ message: "Failed to update vaccine package!" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaccinePackage();
        fetchAllVaccines();
    }, []);

    return (
        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Vaccine Package Management</Title>
            </Header>

            <Content style={{ padding: "24px" }}>
                <div className="flex">
                    <Button type="primary" icon={<LeftOutlined />} onClick={() => navigate(RouteNames.VACCINE_PACKAGE_MANAGEMENT)} style={{ marginBottom: 16 }}>
                        Back to List
                    </Button>
                </div>

                {loading ? (
                    <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
                ) : (
                    <Card title={`Details of ${vaccinePackage?.name}`} extra={!isEditing && (
                        <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                    )} style={{ maxWidth: 600, margin: "20px auto" }}>

                        {isEditing ? (
                            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                                <Form.Item label="Package Name" name="name" rules={[{ required: true, message: "Please enter the package name!" }]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label="Description" name="description">
                                    <Input.TextArea />
                                </Form.Item>

                                <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter the price!" }]}>
                                    <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>

                                <Form.Item label="Select Vaccines" name="vaccineIds" rules={[{ required: true, message: "Please select at least one vaccine!" }]}>
                                    <Select mode="multiple" placeholder="Select vaccines">
                                        {vaccines.map(vaccine => (
                                            <Option key={vaccine.id} value={vaccine.id}>{vaccine.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Save</Button>
                                    <Button onClick={() => setIsEditing(false)} icon={<CloseOutlined />}>Cancel</Button>
                                </div>
                            </Form>
                        ) : (
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="Name">{vaccinePackage?.name}</Descriptions.Item>
                                <Descriptions.Item label="Description">{vaccinePackage?.description}</Descriptions.Item>
                                <Descriptions.Item label="Price">{vaccinePackage?.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Descriptions.Item>
                                <Descriptions.Item label="Vaccines">
                                    {vaccinePackage?.vaccines.map((v: any) => v.name).join(", ")}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                    </Card>
                )}
            </Content>
        </Layout>
    );
};

export default VaccinePackageDetailView;
