import { useState, useEffect } from "react";
import { Card, Table, Tag, Button, Modal, Typography, Input, Space, List, DatePicker } from "antd";
import { SearchOutlined, CalendarOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getAppointmentByClientId } from "@/services/ApiServices/appoinmentService";
type RangeValue = [Dayjs, Dayjs] | null;
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import { Calendar, Badge } from "antd";
import { getChildById } from "@/services/ApiServices/childService";


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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


    const handleCancelAppointment = (id: number) => {
        Modal.confirm({
            title: "Cancel Appointment",
            content: "Are you sure you want to cancel this appointment?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                setAppointments((prev) => prev.map(a => a.id === id ? { ...a, status: "Cancelled" } : a));
            },
        });
    };
    //     {
    //         title: "Date & Time",
    //         dataIndex: "date",
    //         render: (_: any, record: any) => (
    //             <Text>{`${record.date} ${record.time}`}</Text>
    //         ),
    //     },
    //     {
    //         title: "Doctor",
    //         dataIndex: "doctor",
    //         render: (text: any) => <Text strong>{text}</Text>,
    //     },
    //     {
    //         title: "Status",
    //         dataIndex: "status",
    //         render: (status: any) => {
    //             const color = status === "Confirmed" ? "green" : status === "Pending" ? "blue" : "red";
    //             return <Tag color={color}>{status}</Tag>;
    //         },
    //     },
    //     {
    //         title: "Total Price",
    //         dataIndex: "totalPrice",
    //         render: (price: number) => <Text strong>${price.toFixed(2)}</Text>,
    //     },
    //     {
    //         title: "Actions",
    //         render: (record: any) => (
    //             <Space>
    //                 <Button icon={<EyeOutlined />} onClick={() => showDetails(record)}>View</Button>
    //                 {record.status === "Pending" && (
    //                     <Button danger icon={<CloseOutlined />} onClick={() => handleCancelAppointment(record.id)}>Cancel</Button>
    //                 )}
    //             </Space>
    //         ),
    //     },
    // ];

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
            render: (status: string) => {
                const color = status === "CONFIRMED" ? "green" : status === "PENDING" ? "blue" : "red";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Actions",
            render: (record: any) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => showDetails(record)}>View</Button>
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
