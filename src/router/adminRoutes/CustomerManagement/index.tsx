import { useEffect, useState } from "react";
import { Layout, Menu, Table, Button, Tag, Card, Typography, Modal, Form, Input, notification, Tabs, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "@/services/ApiServices/userService";
import { getChildrenByCustomerId } from "@/services/ApiServices/childService";
import { getAllergyByChildId } from "@/services/ApiServices/allergyService";

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
    const [allergies, setAllergies] = useState<any[]>([]);

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
            const childList = response.children;
            console.log(childList)

            if (childList.length > 0) {
                const childrenWithAllergies = await Promise.all(
                    childList.map(async (child: Child) => {
                        try {
                            const allergyRes = await getAllergyByChildId(child.id);
                            console.log(allergyRes)
                            return {
                                ...child,
                                allergies: allergyRes.allergies || [],
                            };
                        } catch (error) {
                            console.error(`Failed to fetch allergies for child ${child.fullName}`, error);
                            return {
                                ...child,
                                allergies: [],
                            };
                        }
                    })
                );

                setChildren(childrenWithAllergies);
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
                                            <Input value={child.fullName} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Birthday">
                                            <Input value={child.birthday} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Gender">
                                            <Input value={child.gender} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Form.Item label="Allergies">
                                            <div
                                                style={{
                                                    background: "#f5f5f5",
                                                    border: "1px solid #d9d9d9",
                                                    borderRadius: 4,
                                                    padding: "8px",
                                                    color: "rgba(0, 0, 0, 0.65)",
                                                    cursor: "not-allowed",
                                                    minHeight: "40px"
                                                }}
                                            >
                                                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                                    {child.allergies && child.allergies.length > 0 ? (
                                                        child.allergies.map((allergy: any) => (
                                                            <li key={allergy.id}>
                                                                <strong>{allergy.name}</strong>: {allergy.description}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No allergy recorded.</li>
                                                    )}
                                                </ul>
                                            </div>
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
