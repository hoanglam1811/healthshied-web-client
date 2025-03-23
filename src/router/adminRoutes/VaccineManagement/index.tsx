import { useEffect, useState } from "react";
import { Layout, Menu, Table, Button, Tag, Card, Typography, Statistic, Tooltip } from "antd";
import { FaPlus } from "react-icons/fa";
import RouteNames from "../../../constants/routeNames";
import { Link, useNavigate } from "react-router-dom";
import { deleteVaccine, getAllVaccines } from "@/services/ApiServices/vaccineService";
import CreateVaccineDialog from "./CreateVaccineDialog";
import ConfirmDeleteVaccineModal from "./ConfirmDeleteVaccineDialog";


const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function VaccineManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deletingVaccineId, setDeletingVaccineId] = useState<any>(null);
  const [vaccines, setVaccines] = useState<any>(null);
  const navigate = useNavigate();

  const fetchVaccines = async () => {
    try {
      const response = await getAllVaccines();
      setVaccines(response.vaccines);
    }
    catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  const vaccineDelete = async (id: number) => {
    try {
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
        <Title level={3} style={{ color: "white", margin: 0 }}>Vaccines Management</Title>
      </Header>

      <CreateVaccineDialog
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        fetchVaccines={fetchVaccines}
      />

      <ConfirmDeleteVaccineModal
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
        onConfirm={vaccineDelete}
        deletingVaccineId={deletingVaccineId}
        fetchVaccines={fetchVaccines}
      />

      <Content style={{ padding: "24px" }}>
        <Card title="Vaccines List"
          extra={<Button type="primary" onClick={showModal}>
            <FaPlus />
            <span>Add vaccine</span>
          </Button>}
          style={{ marginTop: 24 }}>
          <Table
            dataSource={vaccines?.map((order: any) => ({
              ...order,
              price: order.price.toLocaleString("en-US", { style: "currency", currency: "USD" }),
            }))}
            columns={[
              { title: "ID", dataIndex: "id", key: "id" },
              { title: "Name", dataIndex: "name", key: "name" },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
                render: (text: string) => (
                  text.length > 60 ? (
                    <Tooltip title={text}>
                      <span>{text.substring(0, 60)}...</span>
                    </Tooltip>
                  ) : (
                    text
                  )
                ),
              },
              { title: "Age Range", dataIndex: "recommendedAgeRange", key: "recommendedAgeRange" },
              { title: "Contraindication", dataIndex: "contraindications", key: "contraindications" },
              { title: "Price", dataIndex: "price", key: "price" },
              {
                title: "Action",
                dataIndex: "action",
                key: "action",
                render: (_: any, order: any) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Link
                      to={`${RouteNames.VACCINE_DETAIL.slice(0, RouteNames.VACCINE_DETAIL.lastIndexOf('/'))}/${order.id}`}
                    >
                      <Button type="primary" block>Details</Button>
                    </Link>
                    <Button
                      onClick={() => {
                        setDeletingVaccineId(order.id);
                        setIsDeleteModalOpen(true);
                      }}
                      style={{ background: "red", color: "white" }}
                      block
                    >
                      Delete
                    </Button>
                  </div>
                ),
              }
            ]}
            pagination={{ pageSize: 5 }}
          />
        </Card>

      </Content>
    </Layout>
  );
}
