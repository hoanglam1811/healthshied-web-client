import { useEffect, useState } from "react";
import { Layout, Menu, Table, Button, Tag, Card, Typography, Modal, Form, Input, notification, Tabs, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "@/services/ApiServices/userService";
import { getChildrenByCustomerId } from "@/services/ApiServices/childService";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface Child {
    id: string;
    userId: string;
    fullName: string;
    birthday: string;
    gender: string;
}

export default function CustomerManagement() {
    const [collapsed, setCollapsed] = useState(false);
    const [customers, setCustomers] = useState<any>(null);
    const navigate = useNavigate();
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("0");
    const [children, setChildren] = useState<any[]>([]);

    const fetchCustomers = async () => {
        try {
            const response = await getAllUsers();
            setCustomers(response.users.filter((user: any) => user.role.toLowerCase() === "client"));
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to fetch customers.",
            });
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const openChildModal = async (userId: string) => {
        try {
            const response = await getChildrenByCustomerId(userId);
            if (response.children.length > 0) {
                setChildren(response.children);
                setActiveTab("0");
                setModalVisible(true);
            } else {
                notification.warning({
                    message: "No Child Found",
                    description: "This customer does not have any registered children.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to fetch child information.",
            });
        }
    };

    return (
        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Customer Management</Title>
            </Header>

            <Content style={{ padding: "24px" }}>
                <Card title="Customers List"
                    style={{ marginTop: 24 }}>
                    <Table
                        dataSource={customers?.map((user: any) => ({
                            ...user,
                            action: (<>
                                <Button type="primary" onClick={() => openChildModal(user.id)}>
                                    Child Information
                                </Button>
                            </>)
                        }))}
                        columns={[
                            { title: "Id", dataIndex: "id", key: "id" },
                            { title: "Name", dataIndex: "fullName", key: "fullName" },
                            { title: "Email", dataIndex: "email", key: "email" },
                            { title: "Phone", dataIndex: "phone", key: "phone" },
                            {
                                title: "Status", dataIndex: "status", key: "status", render: (text: any) => (
                                    <Tag color={text === "Active" ? "green" : text === "Inactive" ? "red" : "blue"}>{text}</Tag>
                                )
                            },
                            { title: "Child", dataIndex: "action", key: "action" },
                        ]}
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
            </Content>

            <Modal
                title="Child Information"
                open={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                width={600}
                centered
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                    {children.map((child, index) => (
                        <Tabs.TabPane tab={<b>{child.fullName}</b>} key={String(index)}>
                            <Card style={{ background: "#f9f9f9", borderRadius: 8, padding: "16px" }}>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Child Id">
                                            <Input value={child.id} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Status">
                                            <Input value={child.status} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Name">
                                            <Input value={child.fullName} disabled style={{color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Birthday">
                                            <Input value={child.birthday} disabled style={{color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Gender">
                                            <Input value={child.gender} disabled style={{color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </Modal>
        </Layout>
    );
}
