import { useState } from "react";
import { Layout, Menu, Table, Button, Tag, Card, Typography, Statistic } from "antd";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    DashboardOutlined,
    UserOutlined,
    ShoppingCartOutlined,
    CalendarOutlined,
    TeamOutlined,
    FileTextOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logo.png";
import { CardContent } from "../../../components/ui/card";
import { FaUserTie, FaSyringe, FaUserFriends, FaBaby, FaComments, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RouteNames from "../../../constants/routeNames";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 7000 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 7500 },
    { month: "Jul", revenue: 8200 },
    { month: "Aug", revenue: 9000 },
    { month: "Sep", revenue: 6500 },
    { month: "Oct", revenue: 7200 },
];

const vaccineStockData = [
    { name: "Vaccine A", stock: 100 },
    { name: "Vaccine B", stock: 80 },
    { name: "Vaccine C", stock: 120 },
    { name: "Vaccine D", stock: 60 },
    { name: "Vaccine E", stock: 90 },
    { name: "Vaccine F", stock: 150 },
    { name: "Vaccine G", stock: 110 },
    { name: "Vaccine H", stock: 95 },
    { name: "Vaccine I", stock: 130 },
    { name: "Vaccine J", stock: 85 },
];

const customerData = [
    { name: "Khách hàng mới", value: 150 },
    { name: "Khách hàng cũ", value: 350 },
    { name: "Khách hàng quốc tế", value: 30 },
    { name: "Khách hàng đặc biệt", value: 40 },
];

const orders = [
    { id: "#001", customer: "Nguyễn Văn A", status: "Đang xử lý", date: "2025-03-18", payment: "Tiền mặt" },
    { id: "#002", customer: "Trần Thị B", status: "Đã tiêm", date: "2025-03-19", payment: "Tiền mặt" },
    { id: "#003", customer: "Lê Văn C", status: "Đã hủy", date: "2025-03-17", payment: "Tiền mặt" },
    { id: "#004", customer: "Phạm Văn D", status: "Đang xử lý", date: "2025-03-20", payment: "VNPAY" },
    { id: "#005", customer: "Hoàng Thị E", status: "Đã tiêm", date: "2025-03-21", payment: "VNPAY" },
    { id: "#006", customer: "Bùi Minh F", status: "Đã hủy", date: "2025-03-22", payment: "VNPAY" },
    { id: "#007", customer: "Ngô Thị G", status: "Đang xử lý", date: "2025-03-23", payment: "Tiền mặt" },
    { id: "#008", customer: "Đặng Hữu H", status: "Đã tiêm", date: "2025-03-24", payment: "Tiền mặt" },
    { id: "#009", customer: "Lý Thanh I", status: "Đã hủy", date: "2025-03-25", payment: "Tiền mặt" },
    { id: "#010", customer: "Vũ Hoài J", status: "Đang xử lý", date: "2025-03-26", payment: "VNPAY" },
];

const vaccineSchedules = [
    { id: "#V001", customer: "Nguyễn Văn A", date: "2025-03-22", vaccine: "Pfizer" },
    { id: "#V002", customer: "Trần Thị B", date: "2025-03-25", vaccine: "Moderna" },
    { id: "#V003", customer: "Lê Văn C", date: "2025-03-28", vaccine: "AstraZeneca" },
    { id: "#V004", customer: "Phạm Văn D", date: "2025-03-30", vaccine: "Sinopharm" },
    { id: "#V005", customer: "Hoàng Thị E", date: "2025-04-02", vaccine: "Johnson & Johnson" },
    { id: "#V006", customer: "Bùi Minh F", date: "2025-04-05", vaccine: "Pfizer" },
    { id: "#V007", customer: "Ngô Thị G", date: "2025-04-08", vaccine: "Moderna" },
    { id: "#V008", customer: "Đặng Hữu H", date: "2025-04-12", vaccine: "AstraZeneca" },
    { id: "#V009", customer: "Lý Thanh I", date: "2025-04-15", vaccine: "Sinovac" },
    { id: "#V010", customer: "Vũ Hoài J", date: "2025-04-18", vaccine: "Sputnik V" },
];

const packageVaccineData = [
    { package: "Gói cơ bản", quantity: 50 },
    { package: "Gói nâng cao", quantity: 80 },
    { package: "Gói cao cấp", quantity: 40 },
];

const totalEmployees = 25;
const totalVaccines = 10;
const totalSoldVaccines = 320;
const totalCustomers = 570;
const totalChildren = 680;
const totalFeedbacks = 124;

export default function AdminDashboard() {
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();

    return (
        

            <Layout>
                <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                    <Title level={3} style={{ color: "white", margin: 0 }}>Admin Dashboard</Title>
                </Header>

                <div className="flex gap-4 w-full">
                    <Card bordered={false} className="shadow-md rounded-lg flex items-center justify-center flex-1">
                        <div className="flex items-center gap-4">
                            <FaUserTie className="text-purple-500 text-3xl" />
                            <Statistic title="Tổng Nhân Viên" value={totalEmployees} />
                        </div>
                    </Card>

                    <Card bordered={false} className="shadow-md rounded-lg flex items-center justify-center flex-1">
                        <div className="flex items-center gap-4">
                            <FaSyringe className="text-red-500 text-3xl" />
                            <Statistic title="Tổng Số Vaccine" value={totalVaccines} />
                        </div>
                    </Card>

                    <Card bordered={false} className="shadow-md rounded-lg flex items-center justify-center flex-1">
                        <div className="flex items-center gap-4">
                            <FaSyringe className="text-blue-500 text-3xl" />
                            <Statistic title="Tổng Vaccine Đã Bán" value={totalSoldVaccines} />
                        </div>
                    </Card>

                    <Card bordered={false} className="shadow-md rounded-lg flex items-center justify-center flex-1">
                        <div className="flex items-center gap-4">
                            <FaUserFriends className="text-green-500 text-3xl" />
                            <Statistic title="Tổng Khách Hàng" value={totalCustomers} />
                        </div>
                    </Card>

                    <Card bordered={false} className="shadow-md rounded-lg flex items-center justify-center flex-1">
                        <div className="flex items-center gap-4">
                            <FaBaby className="text-yellow-500 text-3xl" />
                            <Statistic title="Tổng Số Trẻ Em" value={totalChildren} />
                        </div>
                    </Card>

                    <Card bordered={false} className="shadow-md rounded-lg flex items-center justify-center flex-1">
                        <div className="flex items-center gap-4">
                            <FaComments className="text-gray-500 text-3xl" />
                            <Statistic title="Tổng Feedback" value={totalFeedbacks} />
                        </div>
                    </Card>
                </div>

                <Content style={{ padding: "24px" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card title="Thống kê doanh thu" style={{ textAlign: "center" }}>
                            <LineChart width={400} height={300} data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#1890ff" />
                            </LineChart>
                        </Card>

                        <Card title="Số lượng vaccine nhập" style={{ textAlign: "center" }}>
                            <BarChart width={400} height={300} data={vaccineStockData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="stock" fill="#52c41a" />
                            </BarChart>
                        </Card>

                        <Card title="Số lượng khách hàng" style={{ textAlign: "center" }}>
                            <PieChart width={400} height={300}>
                                <Pie data={customerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#faad14" label />
                                <Tooltip />
                            </PieChart>
                        </Card>

                        <Card>
                            <CardContent>
                                <h2 className="text-xl font-bold">Gói vaccine</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={packageVaccineData}>
                                        <XAxis dataKey="package" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="quantity" fill="#FF8042" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                    </div>

                    <Card title="Danh sách đơn hàng" style={{ marginTop: 24 }}>
                        <Table
                            dataSource={orders}
                            columns={[
                                { title: "Mã đơn", dataIndex: "id", key: "id" },
                                { title: "Khách hàng", dataIndex: "customer", key: "customer" },
                                {
                                    title: "Trạng thái", dataIndex: "status", key: "status", render: (text) => (
                                        <Tag color={text === "Đã tiêm" ? "green" : text === "Đã hủy" ? "red" : "blue"}>{text}</Tag>
                                    )
                                },
                                { title: "Ngày đặt hàng", dataIndex: "date", key: "date" },
                                { title: "Thanh toán", dataIndex: "payment", key: "payment" },
                            ]}
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>

                    <Card title="Lịch tiêm chủng" style={{ marginTop: 24 }}>
                        <Table
                            dataSource={vaccineSchedules}
                            columns={[
                                { title: "Mã lịch hẹn", dataIndex: "id", key: "id" },
                                { title: "Khách hàng", dataIndex: "customer", key: "customer" },
                                { title: "Ngày đặt tiêm", dataIndex: "date", key: "date" },
                                { title: "Vaccine", dataIndex: "vaccine", key: "vaccine" },
                            ]}
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Content>
            </Layout>
    );
}
