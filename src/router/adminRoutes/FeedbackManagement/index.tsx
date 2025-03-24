import { useEffect, useState } from "react";
import { Layout, Table, Button, Card, Typography, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

const mockFeedbacks = [
    {
        id: 1,
        appointmentId: "APT-20240301",
        staffName: "Dr. Emily Johnson",
        rating: 5,
        comment: "Great service! The staff was very professional.",
        feedbackDate: "2025-03-18",
    },
    {
        id: 2,
        appointmentId: "APT-20240302",
        staffName: "Dr. Michael Smith",
        rating: 4,
        comment: "Good experience, but the waiting time was a bit long.",
        feedbackDate: "2025-03-19",
    },
    {
        id: 3,
        appointmentId: "APT-20240303",
        staffName: "Dr. Sarah Lee",
        rating: 3,
        comment: "Average service. The doctor was nice but a bit rushed.",
        feedbackDate: "2025-03-20",
    },
    {
        id: 4,
        appointmentId: "APT-20240304",
        staffName: "Dr. Daniel Brown",
        rating: 5,
        comment: "Excellent care! My child felt comfortable.",
        feedbackDate: "2025-03-21",
    },
    {
        id: 5,
        appointmentId: "APT-20240305",
        staffName: "Dr. Olivia Martinez",
        rating: 2,
        comment: "Not satisfied. The staff was not very friendly.",
        feedbackDate: "2025-03-22",
    },
];

export default function FeedbackManagement() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            //const response = await getAllFeedbacks();
            setFeedbacks(mockFeedbacks);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Feedback Management</Title>
            </Header>

            <Content style={{ padding: "24px" }}>
                <Card title="Feedback List" style={{ marginTop: 24 }}>
                    <Table
                        dataSource={feedbacks?.map((fb: any) => ({
                            key: fb.id,
                            id: fb.id,
                            appointmentId: fb.appointmentId,
                            staffName: fb.staffName,
                            rating: fb.rating,
                            comment: fb.comment,
                            feedbackDate: fb.feedbackDate,
                        }))}
                        columns={[
                            { title: "ID", dataIndex: "id", key: "id" },
                            { title: "Appointment ID", dataIndex: "appointmentId", key: "appointmentId" },
                            { title: "Staff", dataIndex: "staffName", key: "staffName" },
                            {
                                title: "Rating",
                                dataIndex: "rating",
                                key: "rating",
                                render: (rating: number) => (
                                    <span>
                                        {Array.from({ length: rating }, (_, i) => (
                                            <StarFilled key={i} style={{ color: "gold", marginRight: 2 }} />
                                        ))}
                                    </span>
                                )
                            },
                            { title: "Comment", dataIndex: "comment", key: "comment" },
                            { title: "Date", dataIndex: "feedbackDate", key: "feedbackDate" },
                        ]}
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
            </Content>
        </Layout>
    );
}
