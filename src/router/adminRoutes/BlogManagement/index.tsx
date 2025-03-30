import { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Upload, notification, Card, Image } from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogList from "./BlogList";
import { createBlog, deleteBlog, getAllBlogs } from "@/services/ApiServices/blogService";

const BlogManagement = () => {
    const [blogs, setBlogs] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [form] = Form.useForm();
    const [contentBlocks, setContentBlocks] = useState<any>([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const data = await getAllBlogs();
            setBlogs(data.blogs);
        } catch (error) {
            notification.error({ message: "Failed to load blogs." });
        } finally {
            setLoading(false);
        }
    };

    const addContentBlock = () => {
        setContentBlocks([...contentBlocks, { type: "text", value: "", images: [] }]);
    };

    const handleDeleteImage = (blockIndex: number, imageIndex: number) => {
        const newBlocks = [...contentBlocks];
        newBlocks[blockIndex].images.splice(imageIndex, 1);
        setContentBlocks(newBlocks);
    };

    const handleContentChange = (index: any, value: any) => {
        const updatedBlocks = [...contentBlocks];
        updatedBlocks[index].value = value;
        setContentBlocks(updatedBlocks);
    };

    const handleUpload = (index: any, file: any) => {
        const newBlocks = [...contentBlocks];
        const url = URL.createObjectURL(file);
        newBlocks[index].images.push(url);
        setContentBlocks(newBlocks);
    };

    const handleCreateBlog = async () => {
        try {
            const values = await form.validateFields();
            const formattedContent = contentBlocks.map((block: any) => block.value).join("\n"); // Chỉ lấy phần text

            const newBlog = {
                title: values.title,
                content: formattedContent,
                category: values.category || "General",
                tag: values.tag || "Uncategorized",
                viewCount: 0,
            };

            await createBlog(newBlog);
            notification.success({ message: "Blog created successfully!" });
            setIsModalOpen(false);
            form.resetFields();
            setContentBlocks([]);
            fetchBlogs();
        } catch (error) {
            notification.error({ message: "Failed to create blog." });
        }
    };


    const handleDeleteBlog = async (id: number) => {
        try {
            await deleteBlog(id);
            notification.success({ message: "Blog deleted successfully!" });
            fetchBlogs();
        } catch (error) {
            notification.error({ message: "Failed to delete blog." });
        }
    };

    return (
        <div>
            <div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "30px", marginTop: "30px", marginBottom: "16px" }}>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Create New Blog
                    </Button>
                </div>
                <BlogList blogs={blogs} onDelete={handleDeleteBlog} />
            </div>

            <Modal
                title="Create Blog"
                open={isModalOpen}
                onOk={handleCreateBlog}
                onCancel={() => setIsModalOpen(false)}
                width={1000}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter the title!" }]}>
                        <Input placeholder="Enter blog title" />
                    </Form.Item>
                    {contentBlocks.map((block: any, index: any) => (
                        <Card key={index} style={{ marginBottom: 10 }}>
                            {block.type === "text" ? (
                                <ReactQuill value={block.value} onChange={(value) => handleContentChange(index, value)} theme="snow" />
                            ) : (
                                <img src={block.value} alt="Uploaded" style={{ width: "100%" }} />
                            )}

                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: 10 }}>
                                {block?.images?.map((img: string, imgIndex: number) => (
                                    <div key={imgIndex} style={{ position: "relative", width: "120px", height: "120px" }}>
                                        <Image src={img}
                                            width={120}
                                            height={120}
                                            style={{ borderRadius: "5px", objectFit: "cover" }}
                                        />
                                        <Button
                                            type="text"
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDeleteImage(index, imgIndex)}
                                            style={{ position: "absolute", top: -5, right: -5 }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                <Upload
                                    beforeUpload={(file) => {
                                        handleUpload(index, file);
                                        return false;
                                    }}
                                    multiple
                                    showUploadList={false}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                                </Upload>
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={() => setContentBlocks(contentBlocks.filter((_: any, i: any) => i !== index))}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                    <Button type="dashed" onClick={addContentBlock} block icon={<PlusOutlined />}>
                        Add Content
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogManagement;
