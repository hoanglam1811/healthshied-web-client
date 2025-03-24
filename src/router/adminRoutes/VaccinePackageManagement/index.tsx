import { useEffect, useState } from "react";
import { Layout, Table, Button, Card, Typography, Tooltip } from "antd";
import { FaPlus } from "react-icons/fa";
import RouteNames from "../../../constants/routeNames";
import { Link } from "react-router-dom";
import CreateVaccinePackageDialog from "./CreateVaccinePackage";
import ConfirmDeleteVaccinePackageModal from "./ConfirmDeleteVaccinePackageDialog";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function VaccinePackageManagement() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingPackageId, setDeletingPackageId] = useState<any>(null);
    const [vaccinePackages, setVaccinePackages] = useState<any>(null);

    const fetchVaccinePackages = async () => {
        try {
            //const response = await getAllVaccinePackages();
            //setVaccinePackages(response.packages);
        } catch (error) {
            console.error("Fetching vaccine packages failed:", error);
        }
    };

    const vaccinePackageDelete = async (id: number) => {
        try {
            //await deleteVaccinePackage(id);
            fetchVaccinePackages();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const showModal = () => {
        setIsCreateModalOpen(true);
    };

    useEffect(() => {
        fetchVaccinePackages();
    }, []);

    return (
        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Vaccine Package Management</Title>
            </Header>

            <CreateVaccinePackageDialog
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
                fetchVaccinePackages={fetchVaccinePackages}
            />

            <ConfirmDeleteVaccinePackageModal
                isModalOpen={isDeleteModalOpen}
                setIsModalOpen={setIsDeleteModalOpen}
                onConfirm={vaccinePackageDelete}
                deletingPackageId={deletingPackageId}
                fetchVaccinePackages={fetchVaccinePackages}
            />

            <Content style={{ padding: "24px" }}>
                <Card title="Vaccine Packages List"
                    extra={<Button type="primary" onClick={showModal}>
                        <FaPlus />
                        <span>Add Package</span>
                    </Button>}
                    style={{ marginTop: 24 }}>
                    <Table
                        dataSource={vaccinePackages?.map((pkg: any) => ({
                            ...pkg,
                            price: pkg.price.toLocaleString("en-US", { style: "currency", currency: "USD" }),
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
                            {
                                title: "Vaccines",
                                dataIndex: "vaccines",
                                key: "vaccines",
                                render: (vaccines: any[]) => vaccines.map(v => v.name).join(", "),
                            },
                            { title: "Price", dataIndex: "price", key: "price" },
                            {
                                title: "Action",
                                dataIndex: "action",
                                key: "action",
                                render: (_: any, pkg: any) => (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <Link
                                            to={`${RouteNames.VACCINE_PACKAGE_DETAIL}/${pkg.id}`}
                                        >
                                            <Button type="primary" block>Details</Button>
                                        </Link>
                                        <Button
                                            onClick={() => {
                                                setDeletingPackageId(pkg.id);
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
