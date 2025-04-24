import { useState, useEffect } from "react";
import { Card, Table, Tag, Button, Modal, Typography, Input, Space, List, DatePicker, notification } from "antd";
import { SearchOutlined, CalendarOutlined, EyeOutlined, CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deleteAppointment, getAppointmentByClientId } from "@/services/ApiServices/appoinmentService";
type RangeValue = [Dayjs, Dayjs] | null;
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import { Calendar, Badge } from "antd";
import { getChildById } from "@/services/ApiServices/childService";
import { getVaccinePackageById } from "@/services/ApiServices/vaccinePackageService";
import { getVaccineRecordByAppointmentId } from "@/services/ApiServices/vaccineRecordService";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const getStatusColor = (status: string) => {
    switch (status) {
        case "ACCEPTED":
        case "DONE":
            return "green";
        case "PENDING":
            return "blue";
        case "REJECTED":
            return "red";
        default:
            return "default";
    }
};

const AccountAppointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [searchText, setSearchText] = useState("");
    const [filteredDates, setFilteredDates] = useState<RangeValue>(null);
    const userToken = useSelector((state: RootState) => state.token.user);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [children, setChildren] = useState<any[]>([]);
    const [selectedPackageDetail, setSelectedPackageDetail] = useState<any>(null);
    const [vaccinationRecord, setVaccinationRecord] = useState<any>(null);
    const [isRecordModalVisible, setIsRecordModalVisible] = useState(false);

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

    const showDetails = (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsModalVisible(true);
    };

    console.log(userToken)

    useEffect(() => {
        if (!userToken?.id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAppointmentByClientId(userToken.id);
                const appointments = res.appointments || [];
                const uniqueChildIds = [...new Set(appointments.map((a: any) => a.childId))];

                const childrenPromises = uniqueChildIds.map(async (id) => {
                    try {
                        const child = await getChildById(id);
                        return { id, name: child.fullName };
                    } catch (err) {
                        console.error("Failed to fetch child", id, err);
                        return { id, name: "Undefined" };
                    }
                });

                const childrenList = await Promise.all(childrenPromises);
                console.log(childrenList)
                setChildren(childrenList);

                const mapped = appointments.map((a: any) => {
                    const parsedDate = dayjs(a.appointmentDate, "MM/DD/YYYY HH:mm:ss");

                    const childInfo = childrenList.find((c) => c.id === a.childId);
                    const childName = childInfo?.name || "Không rõ"; a

                    return {
                        ...a,
                        appointmentDateObj: parsedDate,
                        date: parsedDate.format("YYYY-MM-DD"),
                        time: parsedDate.format("hh:mm A"),
                        doctor: a.assignedStaffId ? `Staff #${a.assignedStaffId}` : "Chưa phân công",
                        vaccines: [],
                        vaccinePackages: [],
                        totalPrice: a.price || 0,
                        childName: childName
                    };
                });

                setAppointments(mapped);
            } catch (error) {
                console.error("Failed to load appointments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userToken]);

    const viewVaccinationRecord = async (appointment: any) => {
        if (appointment.status !== "DONE") return;

        try {
            const data = await getVaccineRecordByAppointmentId(appointment.id);
            if (!data) {
                notification.error({
                    message: "No Vaccination Record",
                    description: "There are currently no recorded vaccination results for this appointment.",
                });
            } else {
                setVaccinationRecord(data);
                setIsRecordModalVisible(true);
            }
        } catch (err) {
            console.error("Error fetching vaccination record", err);
            notification.error({
                message: "Error",
                description: "Vaccination record could not be loaded. Please try again later.",
            });
        }
    };

    const handleCancelAppointment = (id: number) => {
        Modal.confirm({
            title: "Cancel Appointment",
            content: "Are you sure you want to cancel this appointment?",
            okText: "Yes",
            cancelText: "No",
            onOk: async () => {
                try {
                    await deleteAppointment(id);
                    notification.success({
                        message: "Appointment Cancelled",
                        description: "The appointment was cancelled successfully.",
                    });
                    setAppointments((prev) =>
                        prev.filter((a) => a.id !== id)
                    );
                } catch (error) {
                    notification.error({
                        message: "Cancellation Failed",
                        description: "There was an error cancelling the appointment. Please try again.",
                    });
                }
            },
        });
    };

    const columns: ColumnsType<any> = [
        {
            title: "#",
            dataIndex: "index",
            render: (_: any, __: any, index: number) => index + 1,
            width: 50,
        },
        {
            title: "Child Name",
            dataIndex: "childName",
        },
        {
            title: "Date & Time",
            dataIndex: "appointmentDateObj",
            render: (date: dayjs.Dayjs) => <Text>{date?.format("YYYY-MM-DD HH:mm")}</Text>,
            sorter: (a, b) => a.appointmentDateObj.unix() - b.appointmentDateObj.unix(),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: "Actions",
            render: (record: any) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => showDetails(record)}>View</Button>
                    {record.status === "DONE" && (
                        <Button icon={<FileTextOutlined />} onClick={() => viewVaccinationRecord(record)}>
                            Record
                        </Button>
                    )}
                    {record.status === "PENDING" && (
                        <Button danger icon={<CloseOutlined />} onClick={() => handleCancelAppointment(record.id)}>Cancel</Button>
                    )}
                </Space>
            ),
        },
    ];

    const filteredData = appointments.filter((a: any) => {
        const matchesSearch = a.doctor?.toLowerCase().includes(searchText.toLowerCase());
        const appointmentDate = dayjs(a.appointmentDate);

        const matchesRange = !filteredDates || (
            appointmentDate.isValid() &&
            appointmentDate.isSameOrAfter(filteredDates[0], "day") &&
            appointmentDate.isSameOrBefore(filteredDates[1], "day")
        );

        const matchesSelected = !selectedDate || appointmentDate.isSame(selectedDate, "day");

        return matchesSearch && matchesRange && matchesSelected;
    });

    const dateCellRender = (value: Dayjs) => {
        const hasAppointment = appointments.some(
            (a) => dayjs(a.appointmentDateObj).isSame(value, "day")
        );

        return hasAppointment ? (
            <div
                className="!w-full !h-full"
                style={{
                    backgroundColor: "#bae7ff",
                    border: "2px solid #1890ff",
                    borderRadius: "6px",
                }}
            />
        ) : null;
    };

    return (
        <>
            <div className="!w-full !flex !justify-center">
                <div className="!w-7xl !mx-auto !bg-gray-100 !rounded-lg !flex !flex-col lg:!flex-row !gap-6">
                    <div className="lg:!w-1/3 !w-full !bg-white !p-4 !rounded !shadow">
                        <Calendar
                            fullscreen={false}
                            dateCellRender={dateCellRender}
                            onSelect={(date) => setSelectedDate(date)}
                            className="!bg-white !rounded-md !shadow"
                        />
                    </div>

                    <div className="lg:!w-2/3 !w-full">
                        <Card
                            title={<Title className="!mt-6 !mb-6" level={3}><CalendarOutlined /> My Appointments</Title>}
                            className="w-full shadow-lg rounded-lg p-6 bg-white"
                        >
                            <Space style={{ marginBottom: 16 }} direction="vertical" className="w-full">
                                <RangePicker
                                    onChange={(range: any) => setFilteredDates(range)}
                                    className="w-full"
                                />
                            </Space>

                            <Table
                                columns={columns}
                                dataSource={filteredData}
                                rowKey="id"
                                loading={loading}
                            />
                        </Card>

                        <Modal
                            title="Vaccination Record"
                            open={isRecordModalVisible}
                            onCancel={() => setIsRecordModalVisible(false)}
                            footer={null}
                        >
                            {vaccinationRecord ? (
                                <>
                                    <Text strong>Reaction Notes:</Text>{" "}
                                    <Text>{vaccinationRecord.reactionNotes || "No note"}</Text>
                                </>
                            ) : (
                                <Text>No recorded data found.</Text>
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
                                    <Tag color={getStatusColor(selectedAppointment.status)}>
                                        {selectedAppointment.status}
                                    </Tag>

                                    <br />
                                    <Text strong>Description:</Text>{" "}
                                    <Text>{selectedAppointment.description}</Text>
                                    <br />
                                    <Text strong>Package:</Text>{" "}
                                    <Text>
                                        {selectedPackageDetail
                                            ? `${selectedPackageDetail.name} (${selectedPackageDetail.vaccines?.map((v: any) => v.name).join(", ")})`
                                            : selectedAppointment?.packageId || "None"}
                                    </Text>

                                    <br />
                                    <Text strong>Total Price:</Text>{" "}
                                    <Text strong style={{ color: "#1890ff" }}>
                                        ${selectedAppointment.price.toFixed(2)}
                                    </Text>
                                </>
                            )}
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountAppointments;
