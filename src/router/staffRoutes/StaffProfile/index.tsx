import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Button, Card, Form, Input, Layout, Typography, notification, Calendar, Spin, Row, Col, Select } from "antd";
import { getUserById, updateUser } from "@/services/ApiServices/userService";
import { RootState } from "@/store/store";

const { Header, Content } = Layout;
const { Title } = Typography;

const StaffProfile = () => {
    const userToken = useSelector((state: RootState) => state.token.user);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState<any>(null);
    const [updating, setUpdating] = useState(false);
    const [selectedDate, setSelectedDate] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userToken?.id) return;
            setLoading(true);
            try {
                const res = await getUserById(userToken.id);
                setStaff(res);
                form.setFieldsValue(res);
            } catch (error) {
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch profile',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userToken?.id, form]);

    const onFinish = async (values: any) => {
        if (!userToken) return;

        const requiredFields = ['experience', 'workProcess', 'position'];
        for (let field of requiredFields) {
            if (!values[field] || values[field].trim() === '') {
                notification.warning({
                    message: 'Missing Information',
                    description: `Please fill in the "${field}" field before submitting.`,
                });
                return;
            }
            values[field] = values[field].trim();
        }

        setUpdating(true);
        try {
            await updateUser(userToken.id, {
                ...values,
                id: userToken.id,
                role: "Staff",
            });

            notification.success({
                message: 'Success',
                description: 'Profile updated successfully',
            });
        } catch (err: any) {
            console.error("Update error:", err);
            notification.error({
                message: 'Error',
                description: err?.response?.data?.message || 'Failed to update profile',
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !staff) {
        return (
            <div className="!w-full !flex !justify-center !items-center !min-h-[300px]">
                <Spin />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Staff Profile</Title>
            </Header>
            <Content style={{ padding: "24px" }}>
                <Card className="!bg-gray-200" title="My Profile" style={{ marginBottom: 16, borderRadius: 8 }} headStyle={{ color: "black" }}>
                    <div className="!flex !flex-col md:!flex-row !items-center md:!items-start !gap-6">
                        <Avatar
                            size={120}
                            src={staff.avatar || `https://github.com/shadcn.png`}
                            className="!border !border-gray-300"
                        />
                        <div className="!flex-1">
                            <Form form={form} layout="vertical" onFinish={onFinish} className="!w-full">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                                            <Input className="!h-10" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
                                            <Input disabled className="!h-10" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="phone" label="Phone Number">
                                            <Input className="!h-10" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="position"
                                            label="Position"
                                            rules={[{ required: true, message: "Please select your position" }]}
                                        >
                                            <Select className="!h-10" placeholder="Select your position">
                                                <Select.Option value="Doctor">Doctor</Select.Option>
                                                <Select.Option value="SpecialistDoctor">Specialist Doctor</Select.Option>
                                                <Select.Option value="GeneralPractitioner">General Practitioner</Select.Option>
                                                <Select.Option value="Surgeon">Surgeon</Select.Option>
                                                <Select.Option value="Pediatrician">Pediatrician</Select.Option>
                                                <Select.Option value="OrthopedicSurgeon">Orthopedic Surgeon</Select.Option>
                                                <Select.Option value="Neurologist">Neurologist</Select.Option>
                                                <Select.Option value="Anesthesiologist">Anesthesiologist</Select.Option>
                                                <Select.Option value="MedicalDirector">Medical Director</Select.Option>
                                                <Select.Option value="NursePractitioner">Nurse Practitioner</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                </Row>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="experience"
                                            label="Experience"
                                            rules={[{ required: true, message: "Please enter your experience" }]}
                                        >
                                            <Input.TextArea rows={8} placeholder="E.g., 5 years in pediatrics, worked at ABC Hospital..." />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="workProcess"
                                            label="Work Process"
                                            rules={[{ required: true, message: "Please describe your work process" }]}
                                        >
                                            <Input.TextArea rows={8} placeholder="E.g., Step-by-step vaccination procedure..." />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Typography.Text type="secondary">
                                    Please make sure all fields are filled out before updating your profile.
                                </Typography.Text>


                                <Form.Item className="!mt-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={updating}
                                        className="!bg-blue-500 hover:!bg-blue-600 !rounded-xl !px-6"
                                    >
                                        Update Profile
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default StaffProfile;
