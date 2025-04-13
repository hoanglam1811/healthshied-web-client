import { useEffect, useState } from "react";
import { Card, Descriptions, Layout, Button, Form, Input, Spin, notification, Select, Typography, InputNumber, Col, Row, Image, Upload, Tag } from "antd";
import { getVaccinePackageById, updateVaccinePackage } from "@/services/ApiServices/vaccinePackageService";
import { getAllVaccines } from "@/services/ApiServices/vaccineService";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined, CloseOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
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
    const [minAge, setMinAge] = useState<any>(null);
    const [maxAge, setMaxAge] = useState<any>(null);

    const fetchVaccinePackage = async () => {
        try {
            if (!id) return;
            setLoading(true);
            const data = await getVaccinePackageById(id);

            let min = null;
            let max = null;
            if (data.recommendedAgeRange) {
                const [minStr, maxStr] = data.recommendedAgeRange.split("-").map((s: string) => parseInt(s.trim()));
                min = minStr;
                max = maxStr;
            }

            setMinAge(min);
            setMaxAge(max);

            form.setFieldsValue({
                ...data,
                vaccineIds: data.vaccines.map((v: any) => v.id),
                minAge: min,
                maxAge: max
            });

            setVaccinePackage(data);
        } catch (error) {
            console.error("Error fetching vaccine package:", error);
            notification.error({ message: "Failed to load vaccine package data!" });
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

    const fetchAllVaccines = async () => {
        try {
            const data = await getAllVaccines();
            setVaccines(data.vaccines);
        } catch (error) {
            console.error("Error fetching vaccines:", error);
        }
    };

    const handleVaccineSelectionChange = (selectedIds: any[]) => {
        const selectedVaccines = vaccines.filter(v => selectedIds.includes(v.id));
        const total = selectedVaccines.reduce((sum, v) => sum + v.price, 0);
        form.setFieldsValue({ price: total });
    };

    const handleUpdate = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                request: {
                    id,
                    name: values.name,
                    description: values.description,
                    price: values.price,
                    recommendedAgeRange: `${minAge}-${maxAge}`
                },
                vaccineIds: values.vaccineIds
            };

            await updateVaccinePackage(id, payload);
            notification.success({ message: "Vaccine package updated successfully!" });

            setIsEditing(false);
            setVaccinePackage({
                ...vaccinePackage,
                ...values,
                recommendedAgeRange: `${minAge}-${maxAge}`,
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
                    )} style={{ maxWidth: "100%", width: "100%", margin: "0 auto" }}>

                        {isEditing ? (
                            <Form form={form} layout="vertical" onFinish={handleUpdate}>
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Package Name"
                                            name="name"
                                            rules={[{ required: true, message: "Please enter the package name!" }]}
                                        >
                                            <Input placeholder="Enter package name" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            label="Status"
                                            name="status"
                                            rules={[{ required: true, message: "Please select status!" }]}
                                        >
                                            <Select placeholder="Select status">
                                                <Option value="Active">Active</Option>
                                                <Option value="Inactive">Inactive</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            label="Select Vaccines"
                                            name="vaccineIds"
                                            rules={[{ required: true, message: "Please select at least one vaccine!" }]}
                                        >
                                            <Select mode="multiple" placeholder="Select vaccines" onChange={handleVaccineSelectionChange}>
                                                {vaccines.map((vaccine) => (
                                                    <Option key={vaccine.id} value={vaccine.id}>
                                                        {vaccine.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item
                                            label="Price"
                                            name="price"
                                            rules={[{ required: true, message: "Please enter the price!" }]}
                                        >
                                            <InputNumber
                                                disabled
                                                min={0}
                                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                                                style={{ width: "100%" }}
                                                placeholder="Auto-calculated price"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item label="Description" name="description">
                                            <Input.TextArea placeholder="Enter package description" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item label="Recommended Age Range" required>
                                            <Input.Group compact>
                                                <Form.Item
                                                    name="minAge"
                                                    noStyle
                                                    rules={[{ required: true, message: "Select min age" }]}
                                                >
                                                    <Select placeholder="Min Age" style={{ width: "48%" }} onChange={setMinAge}>
                                                        {generateAgeOptions()}
                                                    </Select>
                                                </Form.Item>
                                                <span style={{ width: "4%", textAlign: "center" }}>-</span>
                                                <Form.Item
                                                    name="maxAge"
                                                    noStyle
                                                    rules={[
                                                        { required: true, message: "Select max age" },
                                                        () => ({
                                                            validator(_, value) {
                                                                if (!value || minAge === null || value > minAge) return Promise.resolve();
                                                                return Promise.reject("Max age must be greater than min age!");
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="Max Age"
                                                        disabled={minAge === null}
                                                        style={{ width: "48%" }}
                                                        onChange={setMaxAge}
                                                    >
                                                        {generateAgeOptions().filter((opt: any) => opt.props.value > minAge)}
                                                    </Select>
                                                </Form.Item>
                                            </Input.Group>
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item
                                            label="Upload Images"
                                            name="images"
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                        >
                                            <Upload
                                                listType="picture-card"
                                                multiple
                                                beforeUpload={() => false}
                                                maxCount={5}
                                            >
                                                <div>
                                                    <PlusOutlined />
                                                    <div style={{ marginTop: 8 }}>Upload</div>
                                                </div>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                    <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                                        Save
                                    </Button>
                                </div>
                            </Form>

                        ) : (
                            <Descriptions className="text-left" column={1} bordered>
                                <Descriptions.Item label="Name">{vaccinePackage?.name}</Descriptions.Item>
                                <Descriptions.Item label="Description">{vaccinePackage?.description}</Descriptions.Item>
                                <Descriptions.Item label="Vaccines">
                                    {vaccinePackage?.vaccines.map((v: any) => v.name).join(", ")}
                                </Descriptions.Item>
                                <Descriptions.Item label="Price"> {vaccinePackage?.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Tag color={vaccinePackage?.status === "Active" ? "green" : "red"}>
                                        {vaccinePackage?.status}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Images" span={2}>
                                    {vaccinePackage?.imageUrl?.length > 0 ? (
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            {vaccinePackage.images.map((imgUrl: string, index: number) => (
                                                <Image
                                                    key={index}
                                                    src={imgUrl}
                                                    width={80}
                                                    height={80}
                                                    style={{ objectFit: "cover", borderRadius: 4 }}
                                                    alt={`vaccine-img-${index}`}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <span>No images</span>
                                    )}
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
