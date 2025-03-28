import { useEffect, useState } from "react";
import { Card, Avatar, Typography, Button, List, Modal, Form, Input, Select, Divider, notification, Tabs } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { createChild, deleteChild, getChildrenByCustomerId } from "@/services/ApiServices/childService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProfileLayout from "@/layout/CustomerProfileLayout";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerProfile = () => {
    const userToken = useSelector((state: RootState) => state.token.user);
    const [user, setUser] = useState<any>(null);
    const [children, setChildren] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<string>("0");

    console.log(userToken)

    const fetchChildren = async (userId: any) => {
        try {
            const response = await getChildrenByCustomerId(userId);
            setChildren(response.children);
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to fetch child information." });
        }
    };

    const handleAddChild = async (values: any) => {
        try {
            const response = await createChild({ ...values, userId: user.id });
            setChildren([...children, response]);
            notification.success({ message: "Success", description: "Child added successfully!" });
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to add child." });
        }
    };

    const handleDeleteChild = async (childId: any) => {
        try {
            await deleteChild(childId);
            setChildren(children.filter((child: any) => child.id !== childId));
            notification.success({ message: "Success", description: "Child deleted successfully!" });
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to delete child." });
        }
    };

    useEffect(() => {
        if (userToken) {
            setUser(userToken);
            fetchChildren(userToken.id);
        }
    }, [userToken]);

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="w-4xl mx-auto bg-gray-100 rounded-lg shadow-md flex gap-8">
                    <Card className="w-full shadow-lg rounded-lg p-6 bg-white">
                        <div className="flex items-center gap-4 text-left">
                            <Avatar size={80} icon={<UserOutlined />} className="bg-blue-500" />
                            <div>
                                <Title level={3} className="text-gray-700">{user?.fullName}</Title>
                                <Text>Email: {user?.email}</Text><br />
                                <Text>Status: {user?.status}</Text>
                            </div>
                        </div>

                        <div className="flex justify-between items-center !mt-10 mb-4">
                            <Title level={3} className="text-gray-800">Children</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Add Child</Button>
                        </div>

                        {children.length > 0 ? (
                            <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                                {children.map((child: any, index: any) => (
                                    <Tabs.TabPane tab={<b>{child.fullName}</b>} key={String(index)}>
                                        <Card className="shadow-md rounded-lg p-4 bg-gray-50">
                                            <Title level={4}>{child.fullName}</Title>
                                            <Text>Birthday: {dayjs(child.birthday).format("MM/DD/YYYY")}</Text>
                                            <br />
                                            <Text>Gender: {child.gender}</Text>
                                            <Divider />
                                            <Title level={5}>Allergies</Title>
                                            {child?.allergies?.length > 0 ? (
                                                <List
                                                    size="small"
                                                    dataSource={child.allergies}
                                                    renderItem={(allergy: any) => (
                                                        <List.Item>
                                                            <Text strong>{allergy.name}</Text>: {allergy.description || "No details"}
                                                        </List.Item>
                                                    )}
                                                />
                                            ) : (
                                                <Text>No known allergies</Text>
                                            )}
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button icon={<EditOutlined />} onClick={() => { }}>Edit</Button>
                                                <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteChild(child.id)}>Delete</Button>
                                            </div>
                                        </Card>
                                    </Tabs.TabPane>
                                ))}
                            </Tabs>
                        ) : (
                            <Text>No children found</Text>
                        )}
                    </Card>
                </div>
            </div>
            <Modal title="Add New Child" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={handleAddChild}>
                    <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter the child's name" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="birthday" label="Birthday" rules={[{ required: true, message: "Please enter the child's birthday" }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select gender" }]}>
                        <Select>
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="allergies" label="Allergies">
                        <Form.List name="allergies">
                            {(fields, { add, remove }) => (
                                <div>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="flex gap-2 mb-2">
                                            <Form.Item {...restField} name={[name, "name"]}>
                                                <Input placeholder="Allergy Name" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "description"]}>
                                                <Input placeholder="Description" />
                                            </Form.Item>
                                            <Button onClick={() => remove(name)} danger>X</Button>
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => add()} block>Add Allergy</Button>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CustomerProfile;
