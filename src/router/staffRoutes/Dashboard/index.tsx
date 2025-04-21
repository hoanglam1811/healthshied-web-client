import { useEffect, useState } from "react";
import { Layout, Menu, Typography, Card, Table, Button, Badge, Calendar, Modal, Form, Input, Select, Tag, Checkbox, Row, Col, message, notification, Popconfirm } from "antd";
import dayjs from "dayjs";
import { getAllAppointments, getAppointmentById, updateAppointment } from "@/services/ApiServices/appoinmentService";
import { getChildById } from "@/services/ApiServices/childService";
import { getAllergyByChildId } from "@/services/ApiServices/allergyService";
import { getVaccinePackageById } from "@/services/ApiServices/vaccinePackageService";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface Appointment {
    id: number;
    assignedStaffId: number | null;
    childId: number;
    packageId: number | null;
    recordId: number;
    price: number;
    appointmentDate: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "DONE";
    description?: string;
}

const statusColors: Record<string, string> = {
    PENDING: "orange",
    ACCEPTED: "blue",
    REJECTED: "red",
    DONE: "green",
};

export default function StaffDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredRange, setFilteredRange] = useState<any>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [childDetails, setChildDetails] = useState<any>(null);
    const [allergies, setAllergies] = useState<any>([]);
    const [packageDetail, setPackageDetail] = useState<any>(null);
    const [childNames, setChildNames] = useState<{ [key: number]: string }>({});
    const [isChildModalVisible, setIsChildModalVisible] = useState(false);
    const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);
    const [selectedPackageDetail, setSelectedPackageDetail] = useState<any>(null);
    const user = useSelector((state: RootState) => state.token.user);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await getAllAppointments();
            console.log(response.appointments);
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

    useEffect(() => {
        fetchAppointments();
    }, []);

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
            const childData = await getChildById(childId);
            setChildDetails(childData);

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

    const dateCellRender = (date: any) => {
        const appointmentsForThisDay = appointments.filter((item) =>
            item.appointmentDateObj.isSame(date, "day")
        );
        return appointmentsForThisDay.length > 0 ? (
            <div className="text-center text-blue-500 font-semibold">
                {appointmentsForThisDay.map((appointment: any) => (
                    <div key={appointment.id}>{childNames[appointment.childId] || appointment.childId}</div>
                ))}
            </div>
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

    const openRecordModal = async (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsRecordModalVisible(true);

        if (appointment.packageId) {
            try {
                const res = await getVaccinePackageById(appointment.packageId);
                console.log(res)
                setPackageDetail(res);
            } catch (e) {
                message.warning("Failed to load package detail");
            }
        } else {
            setPackageDetail(null);
        }
    };

    useEffect(() => {
        const fetchPackageDetail = async () => {
            if (selectedAppointment?.packageId) {
                try {
                    const data = await getVaccinePackageById(selectedAppointment.packageId);
                    console.log(data)
                    setSelectedPackageDetail(data);
                } catch (error) {
                    console.error("Failed to fetch vaccine package details", error);
                    setSelectedPackageDetail(null);
                }
            } else {
                setSelectedPackageDetail(null);
            }
        };

        fetchPackageDetail();
    }, [selectedAppointment]);

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
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Staff Dashboard</Title>
            </Header>
            <Content style={{ padding: "24px" }}>
                <Card title="Work schedule" style={{ marginBottom: 16, backgroundColor: "#001F3F", borderRadius: 8 }} headStyle={{ color: "white" }}>
                    <Calendar
                        value={selectedDate}
                        onSelect={setSelectedDate}
                        dateCellRender={dateCellRender}
                    />
                </Card>

                <Card
                    title={`Patients list (${selectedDate.format("MM-DD-YYYY")})`}
                    style={{ marginTop: 24, backgroundColor: "#001F3F", color: "white", borderRadius: 8 }}
                    headStyle={{ color: "white" }}
                >
                    <Table
                        dataSource={filteredData(null)}
                        pagination={{ pageSize: 5 }}
                        rowKey="id"
                        columns={[
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
                                render: (value: string) => dayjs(value).format("dddd, MMMM D, YYYY - HH:mm"),
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
                                            <Option value="DONE">DONE</Option>
                                            <Option value="CANCELLED">CANCELLED</Option>
                                        </Select>
                                        <Button onClick={() => showModal(record.id)}>Detail</Button>
                                    </div>
                                ),
                            },
                            {
                                title: "",
                                key: "",
                                render: (_: any, record: Appointment) => (
                                    <Button onClick={() => openRecordModal(record)} disabled={record.status !== "DONE"}>
                                        Note
                                    </Button>
                                )
                            }
                        ]}
                    />

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
                                <Text>{selectedAppointment.description || "None"}</Text>
                                <br />
                                <Text strong>Package:</Text>{" "}
                                <Text>
                                    {selectedPackageDetail
                                        ? `${selectedPackageDetail.name} (${selectedPackageDetail.vaccines?.map((v: any) => v.name).join(", ")})`
                                        : selectedAppointment.packageId || "None"}
                                </Text>

                                <br />
                                <Text strong>Total Price:</Text>{" "}
                                <Text style={{ color: "#1890ff" }}>
                                    ${selectedAppointment.price?.toFixed(2)}
                                </Text>
                            </>
                        )}
                    </Modal>

                    <Modal
                        title="Child Details"
                        visible={isChildModalVisible}
                        onCancel={() => setIsChildModalVisible(false)}
                        footer={null}
                    >
                        {childDetails && (
                            <div>
                                <p><strong>- Full Name:</strong> {childDetails.fullName}</p>
                                <p><strong>- Birthday:</strong> {childDetails.birthday}</p>
                                <p><strong>- Gender:</strong> {childDetails.gender}</p>
                                <p><strong>- Status:</strong> {childDetails.status}</p>

                                <h3 className="">- Allergies:</h3>
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
                        title="Vaccination Result Recording"
                        open={isRecordModalVisible}
                        onOk={() => setIsRecordModalVisible(false)}
                        onCancel={() => setIsRecordModalVisible(false)}
                        width={700}
                        centered
                    >
                        <Card style={{ background: "#f9f9f9", borderRadius: 8, padding: "16px" }}>
                            <Form layout="vertical">
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Form.Item label="Package">
                                            <Input
                                                value={
                                                    packageDetail
                                                        ? `${packageDetail.name}: ${packageDetail.vaccines.map((v: any) => v.name).join(", ")}`
                                                        : selectedAppointment?.packageId
                                                            ? `Package ID: ${selectedAppointment.packageId}`
                                                            : "None"
                                                }
                                                disabled
                                                style={{ color: "#000" }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Recorded By">
                                            <Input value={user?.fullName} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Vaccination Date">
                                            <Input value={selectedAppointment?.appointmentDate} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Post-vaccination Reactions">
                                    <Input.TextArea rows={4} placeholder="Enter notes about any post-vaccination reactions..." />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Modal>
                </Card>
            </Content>
        </Layout>
    );
}
