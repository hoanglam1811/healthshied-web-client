import { useEffect, useState } from "react";
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
} from "@ant-design/icons";
import logo from "../../../assets/logo.png";
import { CardContent } from "../../../components/ui/card";
import { FaUserTie, FaSyringe, FaUserFriends, FaBaby, FaComments, FaPlus } from "react-icons/fa";
import RouteNames from "../../../constants/routeNames";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers } from "@/services/ApiServices/userService";
import { deleteVaccine, getAllVaccines } from "@/services/ApiServices/vaccineService";
import CreateVaccineDialog from "./CreateVaccineDialog";
import ConfirmDeleteVaccineModal from "./ConfirmDeleteVaccineDialog";


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


export default function VaccineManagement() {
    const [collapsed, setCollapsed] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [deletingVaccineId, setDeletingVaccineId] = useState<any>(null);
    const [vaccines, setVaccines] = useState<any>(null);
    const navigate = useNavigate();

    const fetchVaccines= async () => {
      try
      {
        const response = await getAllVaccines();
        setVaccines(response.vaccines);
      }
      catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    }

    const deleteVaccine = async (id: number) => {
      try
      {
        await deleteVaccine(id);
      }
      catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    }

    const showModal = () => {
      setIsCreateModalOpen(true);
    };
    
    useEffect(() => {
        fetchVaccines();
    }, []);

    return (
    <Layout>
      <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>Quản lý vaccine</Title>
      </Header>

      <CreateVaccineDialog
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        fetchVaccines={fetchVaccines}
      />

      <ConfirmDeleteVaccineModal
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        onConfirm={deleteVaccine}
        deletingVaccineId={deletingVaccineId}
        fetchVaccines={fetchVaccines}
      />

      <Content style={{ padding: "24px" }}>
        <Card title="Danh sách vaccine"
          extra={<Button type="primary" onClick={showModal}>
            <FaPlus />
            <span>Thêm vaccine</span>
          </Button>}
          style={{ marginTop: 24 }}>
          <Table
            dataSource={vaccines?.map((order:any) => ({ 
              ...order,
              price: order.price.toLocaleString("en-US", { style: "currency", currency: "USD" }),
              action: (<>
                <Link to={`${RouteNames.VACCINE_DETAIL.slice(0, RouteNames.VACCINE_DETAIL.lastIndexOf('/'))}/${order.id}`}>
                  <Button type="primary">Xem</Button> 
                </Link>
                <Button onClick={() => {
                  setDeletingVaccineId(order.id)
                  setIsDeleteModalOpen(true)
                }} style={{ background: "red", color: "white", marginLeft: "5px" }}>Xóa</Button> 
              </>)
            }))}
            columns={[
              { title: "Id", dataIndex: "id", key: "id" },
              { title: "Tên", dataIndex: "name", key: "name" },
              { title: "Mô tả", dataIndex: "description", key: "description" },
              { title: "Độ tuổi khuyến nghị", dataIndex: "recommendedAgeRange", key: "recommendedAgeRange" },
              { title: "Chống chỉ định", dataIndex: "contraindications", key: "contraindications" },
              { title: "Giá tiền", dataIndex: "price", key: "price" },
              { title: "Thao tác", dataIndex: "action", key: "action" },
            ]}
            pagination={{ pageSize: 5 }}
          />
        </Card>

      </Content>
    </Layout>
    );
}
