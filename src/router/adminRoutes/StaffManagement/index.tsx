import { useEffect, useState } from "react";
import { Layout, Menu, Table, Button, Tag, Card, Typography } from "antd";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers } from "@/services/ApiServices/userService";
import CreateStaffDialog from "./CreateStaffDialog";
import ConfirmDeleteStaffModal from "./ConfirmDeleteStaffDialog";
import RouteNames from "@/constants/routeNames";


const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function StaffManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deletingStaffId, setDeletingStaffId] = useState<any>(null);
  const [staffs, setStaffs] = useState<any>(null);
  const navigate = useNavigate();

  const fetchStaffs = async () => {
    try {
      const response = await getAllUsers();
      setStaffs(response.users.filter((user: any) => user.role.toLowerCase() === "staff"));
    }
    catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  const deleteStaffs = async (id: number) => {
    try {
      await deleteUser(id);
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
    fetchStaffs();
  }, []);

  return (
    <Layout>
      <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>Staff Management</Title>
      </Header>

      <CreateStaffDialog
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        fetchStaffs={fetchStaffs}
      />

      <ConfirmDeleteStaffModal
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        onConfirm={deleteStaffs}
        deletingStaffId={deletingStaffId}
        fetchStaffs={fetchStaffs}
      />

      <Content style={{ padding: "24px" }}>
        <Card title="Staffs List"
          extra={<Button type="primary" onClick={showModal}>
            <FaPlus />
            <span>Add staff</span>
          </Button>}
          style={{ marginTop: 24 }}>
          <Table
            dataSource={staffs?.map((order: any) => ({
              ...order,
              action: (<>
                <Link to={`${RouteNames.STAFF_DETAIL.slice(0, RouteNames.STAFF_DETAIL.lastIndexOf('/'))}/${order.id}`}>
                  <Button type="primary">Details</Button> 
                </Link>
                <Button onClick={() => {
                  setDeletingStaffId(order.id)
                  setIsDeleteModalOpen(true)
                }} style={{ background: "red", color: "white", marginLeft: "5px" }}>Delete</Button>
              </>)
            }))}
            columns={[
              { title: "Id", dataIndex: "id", key: "id" },
              { title: "Name", dataIndex: "fullName", key: "fullName" },
              { title: "Email", dataIndex: "email", key: "email" },
              { title: "Phone", dataIndex: "phone", key: "phone" },
              {
                title: "Status", dataIndex: "status", key: "status", render: (text: any) => (
                  <Tag color={text === "Active" ? "green" : text === "Inactive" ? "red" : "blue"}>{text}</Tag>
                )
              },
              { title: "Create Date", dataIndex: "createdDate", key: "createdDate" },
              { title: "Action", dataIndex: "action", key: "action" },
            ]}
            pagination={{ pageSize: 5 }}
          />
        </Card>

      </Content>
    </Layout>
  );
}
