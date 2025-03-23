import { useState } from "react";
import { Modal, Button, Form, Input, Upload, notification, Card, Image } from "antd";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlogList from "./BlogList";

const sampleBlogs = [
    {
        id: 1,
        title: "The Importance of Childhood Vaccination",
        content: [
            {
                type: "text",
                value: "Vaccines are essential in protecting children from life-threatening diseases...",
                images: ["https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/PAP_02151_e4ca7d1e57.jpg"]
            }
        ]
    },
    {
        id: 2,
        title: "Common Myths About Vaccination – Debunked!",
        content: [
            {
                type: "text",
                value: "There are many myths about vaccines, such as the claim that they cause autism...",
                images: ["https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/tiem_cum_va_nao_mo_cau_cung_luc_duoc_khong_quy_trinh_tiem_phong_cum_va_nao_mo_cau_2_9dc1d097de.jpg"]
            }
        ]
    },
    {
        id: 3,
        title: "Recommended Vaccines for Children Under 5",
        content: [
            {
                type: "text",
                value: "Children under 5 should receive vaccines such as DTaP, MMR, and polio...",
                images: ["https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/tiem_cum_va_nao_mo_cau_cung_luc_duoc_khong_quy_trinh_tiem_phong_cum_va_nao_mo_cau_3_790243f65b.jpg"]
            }
        ]
    },
    {
        id: 4,
        title: "How to Prepare Your Child for Vaccination",
        content: [
            {
                type: "text",
                value: "To help your child feel comfortable during vaccination, talk to them about the process...",
                images: ["https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/tiem_vac_xin_soi_o_dau_tai_huyen_hoc_mon_dia_chi_gia_tiem_phong_nhu_the_nao_3_46f20421d7.jpg"]
            }
        ]
    },
    {
        id: 5,
        title: "What to Do After Your Child Gets Vaccinated?",
        content: [
            {
                type: "text",
                value: "Mild fever or soreness is normal after vaccination. Ensure your child stays hydrated...",
                images: ["https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/tiem_vac_xin_soi_o_dau_tai_quan_8_dia_chi_gia_tiem_phong_2_3661376e1a.png"]
            }
        ]
    }
];

const BlogManagement = () => {
    const [blogs, setBlogs] = useState<any>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [contentBlocks, setContentBlocks] = useState<any>([]);

    const addContentBlock = () => {
        setContentBlocks([...contentBlocks, { type: "text", value: "", images: [] }]);
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

    const handleCreateBlog = () => {
        form.validateFields().then((values) => {
            const newBlog = { id: Date.now(), title: values.title, content: contentBlocks };
            setBlogs([...blogs, newBlog]);
            notification.success({ message: "Blog created successfully!" });
            setIsModalOpen(false);
            form.resetFields();
            setContentBlocks([]);
        });
    };

    const handleDeleteImage = (blockIndex: number, imageIndex: number) => {
        const newBlocks = [...contentBlocks];
        newBlocks[blockIndex].images.splice(imageIndex, 1);
        setContentBlocks(newBlocks);
    };

    return (
        <div>
            <div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "30px", marginTop: "30px", marginBottom: "16px" }}>
                    <Button type="primary" onClick={() => setIsModalOpen(true)}>
                        Create New Blog
                    </Button>
                </div>
                <BlogList blogs={sampleBlogs} />
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
