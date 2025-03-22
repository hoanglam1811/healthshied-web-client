import { useState } from "react";
import { Layout, Menu, Typography, Card, Table, Button, Badge, Calendar, Modal, Form, Input, Select, Tag, Checkbox, Row, Col } from "antd";
import dayjs from "dayjs";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

interface Appointment {
    id: string;
    name: string;
    vaccine: string;
    package: string;
    recordId: string;
    date: string;
    status: "Chưa tiêm" | "Đã tiêm" | "Đã hủy";
}

const appointmentsByDate: Record<string, Appointment[]> = {
    "03-22-2025": [
        { id: "P001", name: "Bé Nam", vaccine: "Vaccine A", package: "Gói A", recordId: "R001", date: "03-22-2025", status: "Chưa tiêm" },
        { id: "P002", name: "Bé Mai", vaccine: "Vaccine B", package: "Gói B", recordId: "R002", date: "03-22-2025", status: "Chưa tiêm" },
        { id: "P003", name: "Bé Linh", vaccine: "Vaccine C", package: "Gói C", recordId: "R003", date: "03-22-2025", status: "Chưa tiêm" }
    ],
    "03-25-2025": [
        { id: "P004", name: "Bé Phúc", vaccine: "Vaccine D", package: "Gói D", recordId: "R004", date: "03-25-2025", status: "Chưa tiêm" },
        { id: "P005", name: "Bé Hùng", vaccine: "Vaccine E", package: "Gói E", recordId: "R005", date: "03-25-2025", status: "Chưa tiêm" },
        { id: "P006", name: "Bé Vy", vaccine: "Vaccine F", package: "Gói F", recordId: "R006", date: "03-25-2025", status: "Chưa tiêm" }
    ]
};

const workSchedules = [
    { date: "03-22-2025", shift: "Ca sáng", time: "08:00 - 12:00" },
    { date: "03-25-2025", shift: "Ca chiều", time: "13:00 - 17:00" }
];

export default function StaffDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>();
    const [patients, setPatients] = useState<Appointment[]>(appointmentsByDate[selectedDate.format("MM-DD-YYYY")] || []);


    const dateCellRender = (value: any) => {
        const formattedDate = value.format("MM-DD-YYYY");
        const schedule = workSchedules.find(s => s.date === formattedDate);
        return schedule ? <Tag color="blue">{`${schedule.shift} (${schedule.time})`}</Tag> : null;
    };

    const handleStatusChange = (id: any, checked: any, type: any) => {
        setPatients((prev: any) =>
            prev.map((p: any) => {
                if (p.id === id) {
                    if (type === "approved") return { ...p, status: checked ? "Đã tiêm" : "Chưa tiêm" };
                    if (type === "canceled") return { ...p, status: checked ? "Đã hủy" : "Chưa tiêm" };
                }
                return p;
            })
        );
    };

    const openModal = (patient: any) => {
        setSelectedPatient(patient);
        setModalVisible(true);
    };

    const handleOk = () => {
        setModalVisible(false);
    };

    return (

        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Dashboard Nhân viên</Title>
            </Header>
            <Content style={{ padding: "24px" }}>
                <Card title="Lịch làm việc" style={{ marginBottom: 16, backgroundColor: "#001F3F", borderRadius: 8 }} headStyle={{ color: "white" }}>
                    <Calendar
                        value={selectedDate}
                        onSelect={(date) => {
                            setSelectedDate(date);
                            setPatients(appointmentsByDate[date.format("MM-DD-YYYY")] || []);
                        }}
                        dateCellRender={dateCellRender}
                    />
                </Card>

                <Card
                    title={`Danh sách bệnh nhân (${selectedDate.format("MM-DD-YYYY")})`}
                    style={{ marginTop: 24, backgroundColor: "#001F3F", color: "white", borderRadius: 8 }}
                    headStyle={{ color: "white" }}
                >
                    <Table
                        dataSource={patients}
                        pagination={{ pageSize: 5 }}
                        rowKey="id"
                        columns={[
                            { title: "#", dataIndex: "id", key: "id" },
                            { title: "Tên", dataIndex: "name", key: "name" },
                            { title: "Vaccine", dataIndex: "vaccine", key: "vaccine" },
                            { title: "Gói", dataIndex: "package", key: "package" },
                            {
                                title: "Trạng thái",
                                dataIndex: "status",
                                key: "status",
                                render: (status: string) => (
                                    <Tag color={status === "Đã tiêm" ? "green" : status === "Đã hủy" ? "red" : "orange"}>{status}</Tag>
                                )
                            },
                            {
                                title: "Xác nhận",
                                key: "confirm",
                                render: (_: any, record: Appointment) => (
                                    <>
                                        <Checkbox
                                            checked={record.status === "Đã tiêm"}
                                            onChange={(e) => handleStatusChange(record.id, e.target.checked, "approved")}
                                        >
                                            Đồng ý tiêm
                                        </Checkbox>
                                        <Checkbox
                                            checked={record.status === "Đã hủy"}
                                            onChange={(e) => handleStatusChange(record.id, e.target.checked, "canceled")}
                                        >
                                            Đã hủy
                                        </Checkbox>
                                    </>
                                )
                            },
                            {
                                title: "Thao tác",
                                key: "action",
                                render: (_: any, record: Appointment) => (
                                    <Button onClick={() => openModal(record)} disabled={record.status !== "Đã tiêm"}>
                                        Ghi nhận
                                    </Button>
                                )
                            }
                        ]}
                    />
                    <Modal
                        title="Ghi nhận kết quả tiêm chủng"
                        open={modalVisible}
                        onOk={() => setModalVisible(false)}
                        onCancel={() => setModalVisible(false)}
                        width={700}
                        centered
                    >
                        <Card style={{ background: "#f9f9f9", borderRadius: 8, padding: "16px" }}>
                            <Form layout="vertical">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Mã bệnh nhân">
                                            <Input value={selectedPatient?.id} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Tên bệnh nhân">
                                            <Input value={selectedPatient?.name} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Vaccine">
                                            <Input value={selectedPatient?.vaccine} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Gói tiêm">
                                            <Input value={selectedPatient?.package} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Form.Item label="Người ghi nhận">
                                            <Input value="Bác sĩ A" disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Ngày tiêm">
                                            <Input value={selectedPatient?.vaccinationDate} disabled style={{ color: "#000" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Phản ứng sau tiêm">
                                    <Input.TextArea rows={4} placeholder="Nhập ghi chú về phản ứng sau tiêm..." />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Modal>
                </Card>

            </Content>
        </Layout>
    );
}
