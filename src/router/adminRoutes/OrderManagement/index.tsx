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
import { CardContent } from "../../../components/ui/card";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const orders = [
    { id: "#001", customer: "Nguyễn Văn A", status: "Đang xử lý", date: "2025-03-18", payment: "Cash" },
    { id: "#002", customer: "Trần Thị B", status: "Đã tiêm", date: "2025-03-19", payment: "Cash" },
    { id: "#003", customer: "Lê Văn C", status: "Đã hủy", date: "2025-03-17", payment: "Cash" },
    { id: "#004", customer: "Phạm Văn D", status: "Đang xử lý", date: "2025-03-20", payment: "VNPAY" },
    { id: "#005", customer: "Hoàng Thị E", status: "Đã tiêm", date: "2025-03-21", payment: "VNPAY" },
    { id: "#006", customer: "Bùi Minh F", status: "Đã hủy", date: "2025-03-22", payment: "VNPAY" },
    { id: "#007", customer: "Ngô Thị G", status: "Đang xử lý", date: "2025-03-23", payment: "Cash" },
    { id: "#008", customer: "Đặng Hữu H", status: "Đã tiêm", date: "2025-03-24", payment: "Cash" },
    { id: "#009", customer: "Lý Thanh I", status: "Đã hủy", date: "2025-03-25", payment: "Cash" },
    { id: "#010", customer: "Vũ Hoài J", status: "Đang xử lý", date: "2025-03-26", payment: "VNPAY" },
];

const packageVaccineData = [
    { package: "Gói cơ bản", quantity: 50 },
    { package: "Gói nâng cao", quantity: 80 },
    { package: "Gói cao cấp", quantity: 40 },
];

export default function AdminOrderManagement() {
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();
    const totalOrders = orders.length;
    const paymentStats = orders.reduce((acc, order) => {
        acc[order.payment] = (acc[order.payment] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const customerData = Object.keys(paymentStats).map((key) => ({
        name: key,
        value: parseFloat(((paymentStats[key] / totalOrders) * 100).toFixed(2)),
    }));

    return (
        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Admin Dashboard</Title>
            </Header>

            <div className="flex gap-4 w-full">
                <Card className="shadow-md rounded-lg flex items-center justify-center flex-1">
                    <div className="flex items-center gap-4">
                        <FaShoppingCart className="text-blue-500 text-3xl" />
                        <Statistic title="Total orders" value={orders.length} />
                    </div>
                </Card>
            </div>

            <Content style={{ padding: "24px" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Revenue statistics" style={{ textAlign: "center" }}>
                        <LineChart width={400} height={300} data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#1890ff" />
                        </LineChart>
                    </Card>

                    <Card title="Payment method statistics" style={{ textAlign: "center" }}>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={customerData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#faad14"
                                label={({ name, value }) => `${name}: ${value}%`}
                            />
                            <Tooltip formatter={(value: any) => `${value}%`} />
                        </PieChart>
                    </Card>

                    <Card>
                        <CardContent>
                            <h2 className="text-xl font-bold">Vaccine Package</h2>
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

                <Card title="Orders List" style={{ marginTop: 24 }}>
                    <Table
                        dataSource={orders}
                        columns={[
                            { title: "ID", dataIndex: "id", key: "id" },
                            { title: "Customer", dataIndex: "customer", key: "customer" },
                            {
                                title: "Status", dataIndex: "status", key: "status", render: (text) => (
                                    <Tag color={text === "Đã tiêm" ? "green" : text === "Đã hủy" ? "red" : "blue"}>{text}</Tag>
                                )
                            },
                            { title: "Order date", dataIndex: "date", key: "date" },
                            { title: "Payment method", dataIndex: "payment", key: "payment" },
                        ]}
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
            </Content>
        </Layout>
    );
}
