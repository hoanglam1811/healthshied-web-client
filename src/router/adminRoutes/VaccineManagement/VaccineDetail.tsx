import { useEffect, useState } from "react";
import { Card, Descriptions, Layout, Button, Form, Input, Spin, notification, Select, Typography, InputNumber, Tooltip, Upload, Image, Tag, Col, Row } from "antd";
import { getVaccineById, updateVaccine } from "@/services/ApiServices/vaccineService";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined, CloseOutlined, LeftOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
          )} style={{ maxWidth: "100%", width: "100%", margin: "0 auto" }}>
            {isEditing ? (
              <Form form={form} layout="vertical" onFinish={handleUpdate}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Vaccine Name"
                      name="name"
                      rules={[{ required: true, message: "Please enter the vaccine name!" }]}
                    >
                      <Input placeholder="Enter vaccine name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Producer" name="producer">
                      <Input placeholder="Enter producer name" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Description" name="description">
                      <Input.TextArea rows={4} placeholder="Enter vaccine description" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Usage Instructions" name="usageInstructions">
                      <Input.TextArea rows={4} placeholder="Enter usage instructions" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Quantity"
                      name="quantity"
                      rules={[{ required: true, message: "Please enter quantity!" }]}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter quantity" />
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

                  <Col span={12}>
                    <Form.Item label="Contraindications" name="contraindications">
                      <Input placeholder="Enter contraindications" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Price"
                      name="price"
                      rules={[{ required: true, message: "Please enter the price!" }]}
                    >
                      <InputNumber
                        min={0}
                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                        style={{ width: "100%" }}
                        placeholder="Enter price"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Dose"
                      name="dose"
                      rules={[{ required: true, message: "Please enter dose!" }]}
                    >
                      <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter dose" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Target Disease" name="targetDisease">
                      <Input placeholder="Enter target disease" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label={
                        <span>
                          Unit Type&nbsp;
                          <Tooltip title="Vial: small bottle, Ampoule: sealed glass container">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </span>
                      }
                      name="unit"
                      rules={[{ required: true, message: "Please select unit type!" }]}
                    >
                      <Select placeholder="Select unit type">
                        <Option value="Vial">Vial</Option>
                        <Option value="Ampoule">Ampoule</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Country" name="country">
                      <Input placeholder="Enter country of origin" />
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            ) : (
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Name">{vaccine?.name}</Descriptions.Item>
                <Descriptions.Item label="Producer">{vaccine?.producer}</Descriptions.Item>

                <Descriptions.Item label="Description" span={2}>
                  {vaccine?.description}
                </Descriptions.Item>
                <Descriptions.Item label="Usage Instructions" span={2}>
                  {vaccine?.usageInstructions}
                </Descriptions.Item>

                <Descriptions.Item label="Recommended Age Range">{vaccine?.recommendedAgeRange}</Descriptions.Item>
                <Descriptions.Item label="Contraindications">{vaccine?.contraindications}</Descriptions.Item>

                <Descriptions.Item label="Price">
                  {vaccine?.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={vaccine?.status === "Active" ? "green" : "red"}>
                    {vaccine?.status}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Dose">{vaccine?.dose}</Descriptions.Item>
                <Descriptions.Item label="Target Disease">{vaccine?.targetDisease}</Descriptions.Item>

                <Descriptions.Item label="Unit Type">{vaccine?.unit}</Descriptions.Item>
                <Descriptions.Item label="Country">{vaccine?.country}</Descriptions.Item>

                <Descriptions.Item label="Quantity">{vaccine?.quantity}</Descriptions.Item>


                <Descriptions.Item label="Images" span={2}>
                  {vaccine?.images?.length > 0 ? (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {vaccine.images.map((imgUrl: string, index: number) => (
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

export default VaccineDetailView;