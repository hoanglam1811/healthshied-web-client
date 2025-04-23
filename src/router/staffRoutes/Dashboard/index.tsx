import { useEffect, useState } from "react";
import { Layout, Menu, Typography, Card, Table, Button, Badge, Calendar, Modal, Form, Input, Select, Tag, Checkbox, Row, Col, message, notification, Popconfirm } from "antd";
import dayjs from "dayjs";
import { getAllAppointments, getAppointmentById, updateAppointment } from "@/services/ApiServices/appoinmentService";
import { getChildById } from "@/services/ApiServices/childService";
import { getAllergyByChildId } from "@/services/ApiServices/allergyService";
import { getVaccinePackageById } from "@/services/ApiServices/vaccinePackageService";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { createVaccineRecord, getVaccineRecordByAppointmentId, getVaccineRecordById, updateVaccineRecord } from "@/services/ApiServices/vaccineRecordService";
import { getAllStaffSchedule } from "@/services/ApiServices/staffScheduleService";

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
    const [recordLoading, setRecordLoading] = useState<boolean>(false);
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
    const user = useSelector((state: any) => state.token.user);
    const [form] = Form.useForm();
    const [vaccineRecord, setVaccineRecord] = useState<any>(null);
    const [shifts, setShifts] = useState<any[]>([]);
    const [staffSchedules, setStaffSchedules] = useState<any[]>([]);

    const compareAppointmentWithStaffSchedule = (appointmentDate: string, shiftTime: string) => {
        const shiftTimeParts = shiftTime.split(" - ");

        if (shiftTimeParts.length !== 3) {
            console.warn("Shift time format is invalid:", shiftTime);
            return false;
        }

        const shiftDateTimeStr = shiftTimeParts[1]; // e.g., "04/23/2025 08:00"
        const shiftEndTimeStr = shiftTimeParts[2]; // e.g., "12:00"

        const shiftStartTime = dayjs(shiftDateTimeStr, "MM/DD/YYYY HH:mm");
        const shiftEndTime = dayjs(shiftEndTimeStr, "HH:mm")
            .set("year", shiftStartTime.year())
            .set("month", shiftStartTime.month())
            .set("date", shiftStartTime.date());

        const appointment = dayjs(appointmentDate);

        const isAfterStart = appointment.isSameOrAfter(shiftStartTime);
        const isBeforeEnd = appointment.isBefore(shiftEndTime);
        const inRange = isAfterStart && isBeforeEnd;

        console.log(`=== Checking Appointment Schedule ===`);
        console.log(`Appointment Time   : ${appointment.format("YYYY-MM-DD HH:mm:ss")}`);
        console.log(`Shift Start Time   : ${shiftStartTime.format("YYYY-MM-DD HH:mm:ss")}`);
        console.log(`Shift End Time     : ${shiftEndTime.format("YYYY-MM-DD HH:mm:ss")}`);
        console.log(`In Range Condition : ${isAfterStart} && ${isBeforeEnd}`);
        console.log(`=> Appointment is in range: ${inRange}`);
        console.log(`====================================`);

        return inRange;
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await getAllAppointments();
            const data = response.appointments || [];

            // Chỉ lấy các cuộc hẹn đã được chấp nhận hoặc hoàn thành
            const acceptedAppointments = data.filter(
                (item: any) => item.status === "ACCEPTED" || item.status === "DONE"
            );

            // Áp dụng dayjs để tạo đối tượng ngày cho mỗi cuộc hẹn
            const mapped = acceptedAppointments.map((item: any) => ({
                ...item,
                appointmentDateObj: dayjs(item.appointmentDate),
            }));

            // Lấy dữ liệu lịch làm việc của nhân viên
            const responseStaffSchedules = await getAllStaffSchedule();
            setStaffSchedules(responseStaffSchedules.schedules || []);

            // Cập nhật danh sách cuộc hẹn
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

            setIsChildModalVisible(true);
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

    const handleSubmitVaccineRecord = async () => {
        try {
            const values = await form.validateFields();
            await createVaccineRecord({
                appointmentId: selectedAppointment?.id,
                reactionNotes: values.reactionNotes,
            });

            notification.success({ message: "Vaccine record created successfully!" });
            setIsRecordModalVisible(false);
            fetchAppointments();
        } catch (error) {
            console.error(error);
            notification.error({ message: "Failed to create vaccine record." });
        }
    };

    const handleUpdateVaccineRecord = async () => {
        try {
            const values = await form.validateFields();
            await updateVaccineRecord(vaccineRecord.id, {
                ...vaccineRecord,
                reactionNotes: values.reactionNotes,
            });

            message.success("Vaccine record updated successfully!");
            setIsRecordModalVisible(false);
            fetchAppointments();
        } catch (error) {
            console.error(error);
            message.error("Failed to update vaccine record.");
        }
    };

    const dateCellRender = (date: any) => {
        const appointmentsForThisDay = appointments.filter((item) => {
            // Kiểm tra đúng ngày
            const isSameDay = item.appointmentDateObj.isSame(date, "day");

            if (!isSameDay) return false;

            // Kiểm tra có shift phù hợp không
            const hasValidShift = staffSchedules.some((shift) => {
                // Sử dụng hàm compareAppointmentWithStaffSchedule
                return compareAppointmentWithStaffSchedule(item.appointmentDate, shift.startTime + " - " + shift.endTime);
            });

            return hasValidShift;
        });

        if (appointmentsForThisDay.length === 0) return null;

        const hasAccepted = appointmentsForThisDay.some(item => item.status === "ACCEPTED");
        const hasDone = appointmentsForThisDay.some(item => item.status === "DONE");

        let textColor = "text-gray-500";
        if (hasAccepted && hasDone) {
            textColor = "text-purple-500";
        } else if (hasAccepted) {
            textColor = "text-yellow-500";
        } else if (hasDone) {
            textColor = "text-green-500";
        }

        return (
            <div className={`text-center font-semibold ${textColor}`}>
                {appointmentsForThisDay.length} appointment{appointmentsForThisDay.length > 1 ? "s" : ""}
            </div>
        );
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
        setRecordLoading(true);
        setSelectedAppointment(appointment);
        setIsRecordModalVisible(true);
        form.resetFields();

        if (appointment.packageId) {
            try {
                const res = await getVaccinePackageById(appointment.packageId);
                setPackageDetail(res);
            } catch (e) {
                console.error(e);
                setPackageDetail(null);
                notification.warning({
                    message: "Load Package Failed",
                    description: "Unable to load package detail. Please try again.",
                    placement: "topRight",
                });
            }
        } else {
            setPackageDetail(null);
        }

        try {
            const record = await getVaccineRecordByAppointmentId(appointment.id);
            setVaccineRecord(record);

            form.setFieldsValue({
                reactionNotes: record.reactionNotes,
            });

            notification.info({
                message: "Existing Record Found",
                description: "This appointment already has a vaccination record.",
                placement: "topRight",
            });
        } catch (error) {
            setVaccineRecord(null);
            form.setFieldsValue({ reactionNotes: "" });

            notification.info({
                message: "Create New Record",
                description: "No vaccination record found. You can create a new one.",
                placement: "topRight",
            });
        }
        finally{
            setRecordLoading(false);
        }
    };

    useEffect(() => {
        const fetchPackageDetail = async () => {
            if (selectedAppointment?.packageId) {
                try {
                    const data = await getVaccinePackageById(selectedAppointment.packageId);
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
                        open={isChildModalVisible}
                        onCancel={() => setIsChildModalVisible(false)}
                        footer={null}
                    >
                        {childDetails && (
                            <div>
                                <p><strong>- Full Name:</strong> {childDetails.fullName}</p>
                                <p><strong>- Birthday:</strong> {dayjs(childDetails.birthday).format("MM/DD/YYYY")}</p>
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
                        onOk={handleSubmitVaccineRecord}
                        onCancel={() => setIsRecordModalVisible(false)}
                        width={700}
                        centered
                        footer={[
                            vaccineRecord ? (
                                <Button loading={recordLoading} key="update" type="primary" onClick={handleUpdateVaccineRecord}>
                                    Update Record
                                </Button>
                            ) : (
                                <Button loading={recordLoading} key="submit" type="primary" onClick={handleSubmitVaccineRecord}>
                                    Submit Record
                                </Button>
                            ),
                            <Button key="cancel" onClick={() => setIsRecordModalVisible(false)}>Cancel</Button>
                        ]}
                    >
                        <Card style={{ background: "#f9f9f9", borderRadius: 8, padding: "16px" }}>
                            <Form layout="vertical" form={form}>
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

                                <Form.Item
                                    name="reactionNotes"
                                    label="Post-vaccination Reactions"
                                    rules={[{ required: true, message: "Please enter notes or 'No reaction'" }]}
                                >
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
