import { useEffect, useState } from "react";
import { Layout, Table, Button, Card, Typography } from "antd";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteVaccineCategory, getAllVaccineCategories } from "@/services/ApiServices/vaccineCategoryService";
import CreateVaccineCategoryDialog from "./CreateVaccineCategoryDialog";
import ConfirmDeleteVaccineCategoryModal from "./ConfirmDeleteVaccineCategoryDialog";


const { Header, Content } = Layout;
const { Title } = Typography;

export default function VaccineCategoryManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [deletingVaccineCategoryId, setDeletingVaccineCategoryId] = useState<any>(null);
    const [vaccineCategories, setVaccineCategories] = useState<any>(null);
    const navigate = useNavigate();

    const fetchVaccineCategories = async () => {
        try {
          const response = await getAllVaccineCategories();
          const sortedCategories = response.vaccineCategories.sort((a: any, b: any) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setVaccineCategories(sortedCategories);
        } catch (error) {
          console.error("Fetching vaccine categories failed:", error);
        }
      };
      

    const vaccineCategoryDelete = async (id: number) => {
        try {
            await deleteVaccineCategory(id);
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
        fetchVaccineCategories();
    }, []);

    return (
        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Vaccines Category Management</Title>
            </Header>

            <CreateVaccineCategoryDialog
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                fetchVaccineCategories={fetchVaccineCategories}
            />

            <ConfirmDeleteVaccineCategoryModal
                isModalOpen={isDeleteModalOpen}
                setIsModalOpen={setIsDeleteModalOpen}
                onConfirm={vaccineCategoryDelete}
                deletingVaccineCategoryId={deletingVaccineCategoryId}
                fetchVaccineCategories={fetchVaccineCategories}
            />

            <Content style={{ padding: "24px" }}>
                <Card
                    title="Vaccine Categories List"
                    extra={
                        <Button type="primary" onClick={showModal}>
                            <FaPlus />
                            <span>Add vaccine category</span>
                        </Button>
                    }
                    style={{ marginTop: 24 }}
                >
                    <div style={{ overflowX: "auto" }}>
                        <Table
                            scroll={{ x: "max-content" }}
                            dataSource={vaccineCategories?.map((order: any) => ({
                                ...order,
                            }))}
                            columns={[
                                { title: "ID", dataIndex: "id", key: "id" },
                                { title: "Name", dataIndex: "name", key: "name" },
                                {
                                    title: "Created At",
                                    dataIndex: "createdAt",
                                    key: "createdAt",
                                    render: (value: string) => value.split(" ")[0],
                                  },
                                  {
                                    title: "Updated At",
                                    dataIndex: "updatedAt",
                                    key: "updatedAt",
                                    render: (value: string) => value.split(" ")[0],
                                  },
                                {
                                    title: "Action",
                                    dataIndex: "action",
                                    key: "action",
                                    render: (_: any, order: any) => (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            <Button
                                                onClick={() => {
                                                    setDeletingVaccineCategoryId(order.id);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                style={{ background: "red", color: "white" }}
                                                block
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}
                            pagination={{ pageSize: 5 }}
                        />
                    </div>
                </Card>
            </Content>

        </Layout>
    );
}
