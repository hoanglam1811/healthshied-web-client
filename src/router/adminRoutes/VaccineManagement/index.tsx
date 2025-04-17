import { useEffect, useState } from "react";
import { Layout, Menu, Table, Button, Tag, Card, Typography, Statistic, Tooltip } from "antd";
import { FaPlus } from "react-icons/fa";
import RouteNames from "../../../constants/routeNames";
import { Link, useNavigate } from "react-router-dom";
import { deleteVaccine, getAllVaccines } from "@/services/ApiServices/vaccineService";
import CreateVaccineDialog from "./CreateVaccineDialog";
import ConfirmDeleteVaccineModal from "./ConfirmDeleteVaccineDialog";
import { getAllVaccineCategories } from "@/services/ApiServices/vaccineCategoryService";
import { getCountries } from "@/services/CountriesService";


const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function VaccineManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deletingVaccineId, setDeletingVaccineId] = useState<any>(null);
  const [vaccines, setVaccines] = useState<any>(null);
  const navigate = useNavigate();
  const [vaccineCategories, setVaccineCategories] = useState<any>([]);
  const [countriesList, setCountriesList] = useState<any[]>([]);

  useEffect(() => {
    const countries = getCountries();
    setCountriesList(countries);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllVaccineCategories();
        console.log(categories.vaccineCategories)
        setVaccineCategories(categories.vaccineCategories);
      } catch (error) {
        console.error('Failed to fetch vaccine categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchVaccines = async () => {
    try {
      const response = await getAllVaccines();
      const sortedVaccines = response.vaccines.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setVaccines(sortedVaccines);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

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
        <Card
          title="Vaccines List"
          extra={
            <Button type="primary" onClick={showModal}>
              <FaPlus />
              <span>Add vaccine</span>
            </Button>
          }
          style={{ marginTop: 24 }}
        >
          <div style={{ overflowX: "auto" }}>
            <Table
              scroll={{ x: "max-content" }}
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
                  render: (text: string) =>
                    text.length > 60 ? (
                      <Tooltip title={text}>
                        <span>{text.substring(0, 60)}...</span>
                      </Tooltip>
                    ) : (
                      text
                    ),
                },
                { title: "Age Range", dataIndex: "recommendedAgeRange", key: "recommendedAgeRange" },
                {
                  title: "Vaccine Category",
                  dataIndex: "vaccineCategoryId",
                  key: "vaccineCategoryId",
                  render: (id: number) => {
                    const category = vaccineCategories.find((cat: any) => cat.id === id);
                    return category ? category.name : "N/A";
                  },
                },
                { title: "Contraindication", dataIndex: "contraindications", key: "contraindications" },
                { title: "Usage Instructions", dataIndex: "usageInstructions", key: "usageInstructions" },
                { title: "Dose", dataIndex: "dose", key: "dose" },
                { title: "Target Disease", dataIndex: "targetDisease", key: "targetDisease" },
                { title: "Unit", dataIndex: "unit", key: "unit" },
                {
                  title: "Country",
                  dataIndex: "country",
                  key: "country",
                  render: (countryName: string) => {
                    const country = countriesList.find(c => c.name === countryName);
                    return country ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img
                          src={country.flagUrl}
                          alt={country.name}
                          style={{ width: 24, height: 16, objectFit: "cover", borderRadius: 2 }}
                        />
                        <span>{country.name}</span>
                      </div>
                    ) : (
                      countryName
                    );
                  },
                },
                { title: "Producer", dataIndex: "producer", key: "producer" },
                { title: "Quantity", dataIndex: "quantity", key: "quantity" },
                { title: "Price", dataIndex: "price", key: "price" },
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

                { title: "Status", dataIndex: "status", key: "status" },
                {
                  title: "Action",
                  dataIndex: "action",
                  key: "action",
                  render: (_: any, order: any) => (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <Link
                        to={`${RouteNames.VACCINE_DETAIL_MANAGEMENT.slice(
                          0,
                          RouteNames.VACCINE_DETAIL_MANAGEMENT.lastIndexOf("/")
                        )}/${order.id}`}
                      >
                        <Button type="primary" block>
                          Details
                        </Button>
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
