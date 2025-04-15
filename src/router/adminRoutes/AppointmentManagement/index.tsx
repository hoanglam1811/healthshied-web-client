import {
    Calendar,
    Card,
    DatePicker,
    Layout,
    Modal,
    Popconfirm,
    Select,
    Spin,
    Table,
    Tag,
    Typography,
    message,
    Button,
    notification,
    Tabs,
} from "antd";
import {
    ReloadOutlined,
    DeleteOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { deleteAppointment, getAllAppointments, getAppointmentById, updateAppointment } from "@/services/ApiServices/appoinmentService";
import { getChildById } from "@/services/ApiServices/childService";
import { getAllergyByChildId } from "@/services/ApiServices/allergyService";


const { Content, Header } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const statusColors: Record<string, string> = {
    PENDING: "orange",
    ACCEPTED: "blue",
    REJECTED: "red",
    DONE: "green",
};

export default function PendingAppointmentManagement() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [filteredRange, setFilteredRange] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [childDetails, setChildDetails] = useState<any>(null);
    const [allergies, setAllergies] = useState<any>([]);
    const [childNames, setChildNames] = useState<{ [key: number]: string }>({});

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await getAllAppointments();
            const data = response.appointments || [];
            const mapped = data.map((item: any) => ({
                ...item,
                appointmentDateObj: dayjs(item.appointmentDate),
            }));
            setAppointments(mapped);
        } catch (err) {
            message.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const filteredData = (status: any) =>
        appointments.filter((item) => {
            if (status && item.status !== status) return false;
            if (selectedDate) {
                return item.appointmentDateObj.isSame(selectedDate, "day");
            }
            if (filteredRange && filteredRange.length === 2) {
                return (
                    item.appointmentDateObj.isAfter(filteredRange[0], "day") &&
                    item.appointmentDateObj.isBefore(filteredRange[1], "day")
                );
            }
            return true;
        });

    const showModal = async (id: any) => {
        try {
            const detail = await getAppointmentById(id);
            setSelectedAppointment({
                ...detail,
                appointmentDateObj: dayjs(detail.appointmentDate),
            });
            setIsModalVisible(true);
        } catch {
            message.error("Failed to load appointment details");
        }
    };

    const showChildModal = async (childId: any) => {
        try {
            // Lấy thông tin trẻ theo childId
            const childData = await getChildById(childId);
            setChildDetails(childData);

            // Lấy thông tin dị ứng của trẻ
            const allergyData = await getAllergyByChildId(childId);
            setAllergies(allergyData.allergies);

            setModalVisible(true);
        } catch (error) {
            console.error("Failed to fetch child or allergy details", error);
        }
    };

    const handleUpdateStatus = async (id: any, newStatus: any) => {
        const current = appointments.find((a) => a.id === id);
        if (current?.status === newStatus) {
            message.info("Status is already set to this value.");
            return;
        }

        Modal.confirm({
            title: `Confirm status update`,
            content: `Are you sure you want to change status to "${newStatus.toUpperCase()}"?`,
            okText: "Yes",
            cancelText: "No",
            onOk: async () => {
                try {
                    const detail = await getAppointmentById(id);
                    await updateAppointment(id, { ...detail, status: newStatus.toUpperCase() });

                    notification.success({
                        message: "Status Updated",
                        description: `Appointment status updated to "${newStatus}".`,
                        placement: "topRight",
                    });

                    fetchAppointments();
                } catch (error) {
                    notification.error({
                        message: "Update Failed",
                        description: "Something went wrong while updating status.",
                    });
                }
            },
        });
    };

    const handleDelete = async (id: any) => {
        try {
            await deleteAppointment(id);
            message.success(`Appointment ${id} deleted`);
            fetchAppointments();
        } catch (error) {
            message.error("Failed to delete appointment");
        }
    };

    const dateCellRender = (date: any) => {
        const count = appointments.filter((item) =>
            item.appointmentDateObj.isSame(date, "day")
        ).length;
        return count > 0 ? (
            <div className="text-center text-blue-500 font-semibold">{count}</div>
        ) : null;
    };

    const getChildName = async (childId: number) => {
        if (childNames[childId]) {
            return childNames[childId];
        }
        try {
            const child = await getChildById(childId);
            setChildNames(prev => ({ ...prev, [childId]: child.fullName }));
            return child.fullName;
        } catch (error) {
            console.error("Failed to fetch child name", error);
            return "Unknown";
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Child Name",
            dataIndex: "childId",
            key: "childName",
            render: (childId: number) => {
                const childName = childNames[childId];
                if (childName) {
                    return <Button onClick={() => showChildModal(childId)} type="link">{childName}</Button>;
                }
                return <Button type="link" disabled>Loading...</Button>;
            },
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
            title: "Appointment Date",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={statusColors[status.toUpperCase()] || "default"}>{status}</Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <div className="flex items-center gap-2">
                    <Select
                        defaultValue={record.status}
                        style={{ width: 120 }}
                        onChange={(value) => handleUpdateStatus(record.id, value)}
                    >
                        <Option value="pending">PENDING</Option>
                        <Option value="accepted">ACCEPTED</Option>
                        <Option value="rejected">REJECTED</Option>
                        <Option value="done">DONE</Option>
                    </Select>
                    <Button onClick={() => showModal(record.id)}>Detail</Button>
                    <Popconfirm
                        title="Are you sure to delete this appointment?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        const fetchMissingChildNames = async () => {
            const missingChildIds = appointments
                .map(item => item.childId)
                .filter(childId => !childNames[childId]);

            for (const childId of missingChildIds) {
                await getChildName(childId);
            }
        };

        fetchMissingChildNames();
    }, [appointments]);


    return (
        <Layout>
            <Header
                style={{
                    background: "#001529",
                    padding: "0 16px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Title level={3} style={{ color: "white", margin: 0 }}>
                    Appointment Management
                </Title>
            </Header>

            <Content className="!w-full !flex !justify-center">
                <div className="!w-7xl !mx-auto !bg-gray-100 !rounded-lg !flex !flex-col lg:!flex-row !gap-6 !p-6">
                    <div className="lg:!w-1/3 !w-full !bg-white !p-4 !rounded !shadow">
                        <Calendar
                            fullscreen={false}
                            dateCellRender={dateCellRender}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                setFilteredRange(null);
                            }}
                            className="!bg-white !rounded-md !shadow"
                        />
                    </div>

                    <div className="lg:!w-2/3 !w-full">
                        <Card
                            title={
                                <Title className="!mt-6 !mb-6 !ml-12" level={3}>
                                    <CalendarOutlined /> APPOINTMENTS
                                </Title>
                            }
                            extra={
                                <Button icon={<ReloadOutlined />} onClick={fetchAppointments}>
                                    Refresh
                                </Button>
                            }
                            className="!shadow-lg !rounded-lg !bg-white"
                        >
                            <RangePicker
                                className="!mb-4 w-full"
                                onChange={(range: any) => {
                                    setFilteredRange(range);
                                    setSelectedDate(null);
                                }}
                            />

                            <div style={{ overflowX: "auto" }}>
                                <Tabs
                                    className="!mt-3 !text-center"
                                    defaultActiveKey="1"
                                    type="card"
                                    centered
                                    style={{ border: "1px solid #e8e8e8", borderRadius: "8px" }}
                                >
                                    <TabPane tab="All" key="all">
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData(null)}
                                            rowKey="id"
                                            loading={loading}
                                            pagination={{ pageSize: 6 }}
                                            className="!rounded-lg !shadow-lg"
                                        />
                                    </TabPane>
                                    <TabPane tab="Pending" key="pending">
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData("PENDING")}
                                            rowKey="id"
                                            loading={loading}
                                            pagination={{ pageSize: 6 }}
                                            className="!rounded-lg !shadow-lg"
                                        />
                                    </TabPane>
                                    <TabPane tab="Accepted" key="accepted">
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData("ACCEPTED")}
                                            rowKey="id"
                                            loading={loading}
                                            pagination={{ pageSize: 6 }}
                                            className="!rounded-lg !shadow-lg"
                                        />
                                    </TabPane>
                                    <TabPane tab="Rejected" key="rejected">
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData("REJECTED")}
                                            rowKey="id"
                                            loading={loading}
                                            pagination={{ pageSize: 6 }}
                                            className="!rounded-lg !shadow-lg"
                                        />
                                    </TabPane>
                                    <TabPane tab="Done" key="done">
                                        <Table
                                            columns={columns}
                                            dataSource={filteredData("DONE")}
                                            rowKey="id"
                                            loading={loading}
                                            pagination={{ pageSize: 6 }}
                                            className="!rounded-lg !shadow-lg"
                                        />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Card>
                    </div>
                </div>

                <Modal
                    title="Child Details"
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                >
                    {childDetails && (
                        <div>
                            <p><strong>- Full Name:</strong> {childDetails.fullName}</p>
                            <p><strong>- Birthday:</strong> {childDetails.birthday}</p>
                            <p><strong>- Gender:</strong> {childDetails.gender}</p>
                            <p><strong>- Status:</strong> {childDetails.status}</p>

                            <h3 className="!mt-3">- Allergies</h3>
                            <ul>
                                {allergies.map((allergy: any) => (
                                    <li key={allergy.id}>
                                        <strong>+ {allergy.name}</strong>: {allergy.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Modal>

                <Modal
                    title="Appointment Details"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    {selectedAppointment && (
                        <>
                            <Text strong>Date & Time:</Text>{" "}
                            <Text>{selectedAppointment.appointmentDateObj.format("YYYY-MM-DD HH:mm")}</Text>
                            <br />
                            <Text strong>Status:</Text>{" "}
                            <Tag>{selectedAppointment.status}</Tag>
                            <br />
                            <Text strong>Description:</Text>{" "}
                            <Text>{selectedAppointment.description}</Text>
                            <br />
                            <Text strong>Vaccine ID:</Text>{" "}
                            <Text>{selectedAppointment.vaccineId || "None"}</Text>
                            <br />
                            <Text strong>Package ID:</Text>{" "}
                            <Text>{selectedAppointment.packageId || "None"}</Text>
                            <br />
                            <Text strong>Child ID:</Text>{" "}
                            <Text>{selectedAppointment.childId}</Text>
                            <br />
                            <Text strong>Total Price:</Text>{" "}
                            <Text style={{ color: "#1890ff" }}>
                                ${selectedAppointment.price?.toFixed(2)}
                            </Text>
                        </>
                    )}
                </Modal>
            </Content>
        </Layout>
    );
}
