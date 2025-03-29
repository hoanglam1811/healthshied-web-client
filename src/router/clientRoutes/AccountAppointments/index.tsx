import { useState, useEffect } from "react";
import { Card, Table, Tag, Button, Modal, Typography, Input, Space, List } from "antd";
import { SearchOutlined, CalendarOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons";
import ProfileLayout from "@/layout/CustomerProfileLayout";

const { Title, Text } = Typography;

const data = [
    {
        id: 1,
        date: "2025-04-01",
        time: "10:00 AM",
        doctor: "Dr. John Smith",
        status: "Confirmed",
        description: "Regular vaccination check-up for your child.",
        vaccines: ["Hepatitis B", "Influenza"],
        vaccinePackages: ["Basic Immunization Package"],
        totalPrice: 120.0,
    },
    {
        id: 2,
        date: "2025-04-05",
        time: "02:30 PM",
        doctor: "Dr. Emily Johnson",
        status: "Pending",
        description: "Follow-up appointment for allergy testing.",
        vaccines: ["Measles", "Polio"],
        vaccinePackages: ["Child Safety Package"],
        totalPrice: 150.0,
    },
    {
        id: 3,
        date: "2025-04-10",
        time: "09:00 AM",
        doctor: "Dr. Michael Lee",
        status: "Cancelled",
        description: "Vaccination booster shot appointment.",
        vaccines: [],
        vaccinePackages: [],
        totalPrice: 0,
    },
    {
        id: 4,
        date: "2025-04-15",
        time: "01:15 PM",
        doctor: "Dr. Sarah Wilson",
        status: "Confirmed",
        description: "Routine health check-up for your child.",
        vaccines: ["Tetanus", "Diphtheria"],
        vaccinePackages: ["Full Protection Package"],
        totalPrice: 180.0,
    },
];

const AccountAppointments = () => {
    const [appointments, setAppointments] = useState(data);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [searchText, setSearchText] = useState("");

    const showDetails = (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsModalVisible(true);
    };

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

    const columns = [
        {
            title: "Date & Time",
            dataIndex: "date",
            render: (_: any, record: any) => (
                <Text>{`${record.date} ${record.time}`}</Text>
            ),
        },
        {
            title: "Doctor",
            dataIndex: "doctor",
            render: (text: any) => <Text strong>{text}</Text>,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: any) => {
                const color = status === "Confirmed" ? "green" : status === "Pending" ? "blue" : "red";
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Total Price",
            dataIndex: "totalPrice",
            render: (price: number) => <Text strong>${price.toFixed(2)}</Text>,
        },
        {
            title: "Actions",
            render: (record: any) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => showDetails(record)}>View</Button>
                    {record.status === "Pending" && (
                        <Button danger icon={<CloseOutlined />} onClick={() => handleCancelAppointment(record.id)}>Cancel</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="w-5xl mx-auto bg-gray-100 rounded-lg shadow-md flex gap-8">
                    <Card title={<Title className="!mt-6 !mb-6" level={3}><CalendarOutlined /> My Appointments</Title>} className="w-full shadow-lg rounded-lg p-6 bg-white">
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search appointments..."
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ marginBottom: 16 }}
                        />
                        <Table
                            columns={columns}
                            dataSource={appointments?.filter((a) => a.doctor.toLowerCase().includes(searchText.toLowerCase()))}
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
                                <Text strong>Date & Time:</Text> <Text>{`${selectedAppointment.date} ${selectedAppointment.time}`}</Text>
                                <br />
                                <Text strong>Doctor:</Text> <Text>{selectedAppointment.doctor}</Text>
                                <br />
                                <Text strong>Status:</Text> <Tag>{selectedAppointment.status}</Tag>
                                <br />
                                <Text strong>Description:</Text> <Text>{selectedAppointment.description}</Text>
                                <br />
                                <Text strong>Vaccines:</Text>
                                {selectedAppointment.vaccines.length > 0 ? (
                                    <List
                                        size="small"
                                        dataSource={selectedAppointment.vaccines}
                                        renderItem={(vaccine: any) => <List.Item>- {vaccine}</List.Item>}
                                    />
                                ) : (
                                    <Text> None</Text>
                                )}
                                <br />
                                <Text strong>Vaccine Packages:</Text>
                                {selectedAppointment.vaccinePackages.length > 0 ? (
                                    <List
                                        size="small"
                                        dataSource={selectedAppointment.vaccinePackages}
                                        renderItem={(pkg: any) => <List.Item>- {pkg}</List.Item>}
                                    />
                                ) : (
                                    <Text> None</Text>
                                )}
                                <br />
                                <Text strong>Total Price:</Text> <Text strong style={{ color: "#1890ff" }}>${selectedAppointment.totalPrice.toFixed(2)}</Text>
                            </>
                        )}
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default AccountAppointments;
