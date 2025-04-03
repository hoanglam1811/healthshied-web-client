import { useEffect, useState } from "react";
import { Card, Avatar, Typography, Button, List, Modal, Form, Input, Select, Divider, notification, Tabs } from "antd";
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { createChild, deleteChild, getChildrenByCustomerId, updateChild } from "@/services/ApiServices/childService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import dayjs from "dayjs";
import { createAllergy, deleteAllergy, getAllergyByChildId, updateAllergy } from "@/services/ApiServices/allergyService";
import { createChildAllergy } from "@/services/ApiServices/childAllergyService";

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerProfile = () => {
    const userToken = useSelector((state: RootState) => state.token.user);
    const [user, setUser] = useState<any>(null);
    const [children, setChildren] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState<string>("0");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingChild, setEditingChild] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingChild, setDeletingChild] = useState<any>(null);

    console.log(userToken)

    const fetchChildren = async (userId: any) => {
        try {
            const response = await getChildrenByCustomerId(userId);
            console.log(response)
            const childrenWithAllergies = await Promise.all(
                response.children.map(async (child: any) => {
                    try {
                        const allergyResponse = await getAllergyByChildId(child.id);
                        return { ...child, allergies: allergyResponse.allergies || [] };
                    } catch (error) {
                        console.error("Failed to fetch allergies for child:", child.id, error);
                        return { ...child, allergies: [] };
                    }
                })
            );
            console.log(childrenWithAllergies)
            setChildren(childrenWithAllergies);
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to fetch child information." });
        }
    };


    const handleAddChild = async (values: any) => {
        try {
            const response = await createChild({ ...values, userId: user.id });
            const childId = response.id;

            if (values.allergies && values.allergies.length > 0) {
                for (const allergy of values.allergies) {
                    const newAllergy = await createAllergy({
                        name: allergy.name,
                        description: allergy.description,
                    });

                    await createChildAllergy({
                        childId,
                        allergyId: newAllergy.id,
                        status: "Active"
                    });
                }
            }
            notification.success({ message: "Success", description: "Child added successfully!" });
            setChildren([...children, response]);
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to add child and allergies." });
        }
    };

    const handleEditChild = (child: any) => {
        setEditingChild(child);
        form.setFieldsValue({
            fullName: child.fullName,
            birthday: dayjs(child.birthday).format("YYYY-MM-DD"),
            gender: child.gender,
            allergies: child.allergies.map((allergy: any) => ({
                id: allergy.id,
                name: allergy.name,
                description: allergy.description,
            }))
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateChild = async (values: any) => {
        if (!editingChild) return;

        try {
            await updateChild(editingChild.id, {
                id: editingChild.id,
                fullName: values.fullName,
                birthday: values.birthday,
                gender: values.gender,
            });

            const existingAllergyResponse = await getAllergyByChildId(editingChild.id);
            const existingAllergies = existingAllergyResponse.allergies || [];

            const newAllergies = values.allergies || [];
            const allergiesToDelete = existingAllergies.filter(
                (ea: any) => !newAllergies.some((na: any) => na.id === ea.id)
            );
            const allergiesToUpdate = newAllergies.filter(
                (na: any) => existingAllergies.some((ea: any) => ea.id === na.id)
            );
            const allergiesToCreate = newAllergies.filter(
                (na: any) => !existingAllergies.some((ea: any) => ea.id === na.id)
            );

            for (const allergy of allergiesToDelete) {
                await deleteAllergy(allergy.id);
            }

            for (const allergy of allergiesToUpdate) {
                await updateAllergy(allergy.id, {
                    id: allergy.id,
                    name: allergy.name,
                    description: allergy.description,
                    status: allergy.status || "Active",
                });
            }

            for (const allergy of allergiesToCreate) {
                const newAllergy = await createAllergy({
                    name: allergy.name,
                    description: allergy.description,
                });

                await createChildAllergy({
                    childId: editingChild.id,
                    allergyId: newAllergy.id,
                    status: "Active",
                });
            }

            fetchChildren(user.id);
            setIsEditModalOpen(false);
            notification.success({ message: "Success", description: "Child updated successfully!" });
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to update child and allergies." });
        }
    };

    const showDeleteConfirm = (child: any) => {
        setDeletingChild(child);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteChild = async () => {
        if (!deletingChild) return;

        try {
            const allergyResponse = await getAllergyByChildId(deletingChild.id);
            for (const allergy of allergyResponse.allergies) {
                await deleteAllergy(allergy.id);
            }

            await deleteChild(deletingChild.id);
            setChildren(children.filter((child: any) => child.id !== deletingChild.id));

            notification.success({ message: "Success", description: "Child deleted successfully!" });
            setIsDeleteModalOpen(false);
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
                <div className="w-5xl mx-auto bg-gray-100 rounded-lg shadow-md p-6">
                    <Card className="w-full shadow-lg rounded-lg p-6 bg-white">
                        {/* User Information */}
                        <div className="flex items-center gap-4">
                            <Avatar size={80} icon={<UserOutlined />} className="bg-blue-500" />
                            <div className="text-left !ml-3">
                                <Title level={3} className="text-gray-700">{user?.fullName}</Title>
                                <Text>Email: {user?.email}</Text><br />
                                <Text>Status: {user?.status}</Text>
                            </div>
                        </div>

                        {/* Children List */}
                        <div className="flex justify-between items-center !mt-12 !mb-4">
                            <Title level={3} className="text-gray-800">Children List</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Add Child</Button>
                        </div>

                        {children.length > 0 ? (
                            <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                                {children.map((child: any, index: any) => (
                                    <Tabs.TabPane tab={<b>{child.fullName}</b>} key={String(index)}>
                                        <div className="flex gap-6 !mb-6">
                                            {/* Cụm A: Thông tin cá nhân (30%) */}
                                            <div className="w-1/3 bg-gray-50 p-4 rounded-lg shadow-md text-left">
                                                <div className="!ml-5 !mb-3">
                                                    <Title className="!mt-4 !mb-4" level={3}>Information</Title>
                                                    <Text>- Name: {child.fullName}</Text>
                                                    <br />
                                                    <Text>- Birthday: {dayjs(child.birthday).format("MM/DD/YYYY")}</Text>
                                                    <br />
                                                    <Text className="!mb-4">- Gender: {child.gender}</Text>
                                                </div>
                                            </div>

                                            {/* Cụm B: Danh sách dị ứng (70%) */}
                                            <div className="w-2/3 bg-gray-50 p-4 rounded-lg shadow-md text-left">
                                                <div className="!ml-5">
                                                    <Title className="!mt-4 !mb-4" level={3}>Allergies</Title>
                                                    {child?.allergies.length > 0 ? (
                                                        <List
                                                            className="text-left"
                                                            size="small"
                                                            dataSource={child.allergies}
                                                            renderItem={(allergy: any) => (
                                                                <List.Item>
                                                                    <Text>- {allergy.name}: {allergy.description || "No details"}</Text>
                                                                </List.Item>
                                                            )}
                                                        />
                                                    ) : (
                                                        <Text>No known allergies</Text>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button icon={<EditOutlined />} onClick={() => handleEditChild(child)}>Edit</Button>
                                            <Button danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(child)}>Delete</Button>
                                        </div>
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
                                    <Button onClick={() => add()} block>Add Allergy</Button>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit Child"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleUpdateChild}>
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
                                            <Form.Item {...restField} name={[name, "id"]} hidden>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "name"]}>
                                                <Input placeholder="Allergy Name" />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, "description"]}>
                                                <Input placeholder="Description" />
                                            </Form.Item>
                                            <Button onClick={() => remove(name)} danger>X</Button>
                                        </div>
                                    ))}
                                    <Button onClick={() => add()} block>Add Allergy</Button>
                                </div>
                            )}
                        </Form.List>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Confirm Deletion"
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onOk={handleDeleteChild}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
            >
                <Text>Are you sure you want to delete {deletingChild?.fullName} in your life?</Text>
            </Modal>
        </>
    );
};

export default CustomerProfile;
