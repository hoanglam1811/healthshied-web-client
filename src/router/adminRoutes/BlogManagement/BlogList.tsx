import { Card, Button, Col, Row, Image, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const BlogList = ({ blogs }: { blogs: any[] }) => {
    return (
        <div style={{ padding: "40px", background: "#f8f9fa" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "30px", color: "#333", fontWeight: "bold" }}>
                Latest Vaccine Blogs
            </Title>
            <Row gutter={[24, 24]} justify="center">
                {blogs.map((blog) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={blog.id}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: "12px",
                                overflow: "hidden",
                                transition: "all 0.3s ease",
                                boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                            }}
                            bodyStyle={{ padding: "16px" }}
                            cover={
                                blog.content.some((block: any) => block.images.length) ? (
                                    <Image
                                        src={blog.content.find((block: any) => block.images.length)?.images[0]}
                                        alt="Blog Thumbnail"
                                        width="100%"
                                        height={180}
                                        style={{ objectFit: "cover", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                                    />
                                ) : (
                                    <div style={{
                                        height: 180,
                                        background: "#e0e0e0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderTopLeftRadius: "12px",
                                        borderTopRightRadius: "12px"
                                    }}>
                                        <Paragraph>No Image</Paragraph>
                                    </div>
                                )
                            }
                        >
                            <Title level={4} style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "bold" }}>
                                {blog.title}
                            </Title>
                            <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: "14px", color: "#555" }}>
                                {blog.content[0]?.value || "No content available."}
                            </Paragraph>
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                block
                                style={{
                                    marginTop: "12px",
                                    fontWeight: "bold",
                                    background: "#1890ff",
                                    borderRadius: "6px",
                                    border: "none"
                                }}
                            >
                                Read More
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default BlogList;
