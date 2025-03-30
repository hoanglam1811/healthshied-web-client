import { Card, Button, Col, Row, Image, Typography, Popconfirm } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const extractFirstImage = (htmlContent: string) => {
    const match = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/);
    return match ? match[1] : null;
};

const defaultImage = "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/tiem_cum_va_nao_mo_cau_cung_luc_duoc_khong_quy_trinh_tiem_phong_cum_va_nao_mo_cau_3_790243f65b.jpg";

const BlogList = ({ blogs, onDelete }: { blogs: any[]; onDelete: (id: number) => void }) => {
    return (
        <div style={{ padding: "40px", background: "#f8f9fa" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "30px", color: "#333", fontWeight: "bold" }}>
                Latest Vaccine Blogs
            </Title>
            <Row gutter={[24, 24]} justify="center">
                {blogs.map((blog) => {
                    const firstImage = extractFirstImage(blog.content);
                    return (
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
                                    defaultImage ? (
                                        <Image
                                            src={defaultImage}
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
                                {/* Wrapper chứa Title + Content + View Count */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                    gap: "12px"
                                }}>
                                    {/* Nội dung chính (Title + Content) */}
                                    <div style={{ flex: 1, textAlign: "center" }}>
                                        <Title
                                            level={4}
                                            style={{
                                                marginBottom: "4px",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                color: "#333"
                                            }}
                                        >
                                            {blog.title}
                                        </Title>

                                        <div
                                            style={{
                                                fontSize: "14px",
                                                color: "#555",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                lineHeight: "1.6"
                                            }}
                                            dangerouslySetInnerHTML={{ __html: blog.content || "No content available." }}
                                        />
                                    </div>

                                    {/* View count sát bên phải */}
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        color: "#777",
                                        fontSize: "14px"
                                    }}>
                                        <EyeOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
                                        <span>{blog.viewCount || 0} views</span>
                                    </div>
                                </div>



                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                                    <Popconfirm
                                        title="Are you sure to delete this blog?"
                                        onConfirm={() => onDelete(blog.id)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            style={{
                                                fontWeight: "bold",
                                                borderRadius: "6px",
                                                flex: 0.4
                                            }}
                                        />
                                    </Popconfirm>

                                    <Button
                                        type="primary"
                                        icon={<EyeOutlined />}
                                        style={{
                                            fontWeight: "bold",
                                            background: "#1890ff",
                                            borderRadius: "6px",
                                            border: "none",
                                            flex: 1,
                                            marginLeft: "20px"
                                        }}
                                    >
                                        Read More
                                    </Button>
                                </div>

                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
};

export default BlogList;
