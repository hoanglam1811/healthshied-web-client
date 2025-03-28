import { useState, useEffect } from "react";
import { Card, Table, Tag, Button, Modal, Typography, Input, Space } from "antd";
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
    },
    {
        id: 2,
        date: "2025-04-05",
        time: "02:30 PM",
        doctor: "Dr. Emily Johnson",
        status: "Pending",
        description: "Follow-up appointment for allergy testing.",
    },
    {
        id: 3,
        date: "2025-04-10",
        time: "09:00 AM",
        doctor: "Dr. Michael Lee",
        status: "Cancelled",
        description: "Vaccination booster shot appointment.",
    },
    {
        id: 4,
        date: "2025-04-15",
        time: "01:15 PM",
        doctor: "Dr. Sarah Wilson",
        status: "Confirmed",
        description: "Routine health check-up for your child.",
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
            <Card title={<Title level={3}><CalendarOutlined /> My Appointments</Title>} className="max-w-5xl mx-auto mt-8 shadow-lg">
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
                    </>
                )}
            </Modal>
        </>
    );
};

export default AccountAppointments;
