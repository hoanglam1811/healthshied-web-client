import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, InputNumber, notification, Select, Upload, Image, Checkbox } from "antd";
import { createVaccinePackage, getAllVaccinePackages } from "@/services/ApiServices/vaccinePackageService";
import { getAllVaccines } from "@/services/ApiServices/vaccineService";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateVaccinePackageDialog = ({
    isModalOpen,
    setIsModalOpen,
    fetchVaccinePackages
}: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    fetchVaccinePackages: any;
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [minAge, setMinAge] = useState<any | null>(null);
    const [maxAge, setMaxAge] = useState<any | null>(null);
    const [noAgeLimit, setNoAgeLimit] = useState(false);

    const handleMinAgeChange = (value: any) => {
        setMinAge(value);
        if (maxAge !== null && value >= maxAge) {
            setMaxAge(null);
            form.setFieldsValue({ maxAge: undefined });
        }
    };

    const handleMaxAgeChange = (value: any) => {
        setMaxAge(value);
    };

    const generateAgeOptions = () => {
        return Array.from({ length: 101 }, (_, i) => (
            <Option key={i} value={i}>
                {i} years
            </Option>
        ));
    };

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const response = await getAllVaccines();
                setVaccines(response.vaccines);
            } catch (error) {
                console.error("Failed to fetch vaccines:", error);
            }
        };
        fetchVaccines();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setMinAge(null);
        setMaxAge(null);
        setNoAgeLimit(false);
    };

    const handleCreate = async () => {
        form
            .validateFields()
            .then(async (values) => {
                setLoading(true);

                const recommendedAgeRange = noAgeLimit
                    ? "No age limit"
                    : `${values.minAge}-${values.maxAge}`;

                try {
                    const payload = {
                        request: {
                            name: values.name,
                            description: values.description,
                            price: values.price,
                            recommendedAgeRange,
                            imageUrl: values.image,
                        },
                        vaccineIds: values.vaccineIds,
                    };

                    await createVaccinePackage(payload);

                    notification.success({
                        message: "Vaccine Package Created Successfully",
                        description: `The package "${values.name}" has been added.`,
                    });

                    setIsModalOpen(false);
                    form.resetFields();
                    setMinAge(null);
                    setMaxAge(null);
                    setNoAgeLimit(false);
                    await fetchVaccinePackages();
                } catch (error) {
                    notification.error({
                        message: "Failed to Create Vaccine Package",
                        description: "An error occurred while adding the package. Please try again.",
                    });
                }

                setLoading(false);
            })
            .catch((info) => {
                console.log("Validation Error:", info);
                notification.warning({ message: "Please check your input and try again!" });
            });
    };

    return (
        <Modal
            title="Add New Vaccine Package"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleCreate}
            okText="Create Package"
            cancelText="Cancel"
            confirmLoading={loading}
            width={700}
        >
            <Form form={form} layout="vertical"
                onValuesChange={(changedValues, allValues) => {
                    if (changedValues.vaccineIds) {
                        const total = changedValues.vaccineIds.reduce((sum: number, id: number) => {
                            const vaccine = vaccines.find((v) => v.id === id);
                            return sum + (vaccine?.price || 0);
                        }, 0);
                        form.setFieldsValue({ price: total });
                    }
                }}
            >
                <Form.Item
                    label="Package Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the package name!" }]}
                >
                    <Input placeholder="Enter package name" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter the description!" }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter detailed description" />
                </Form.Item>

                <Form.Item className="!mb-2">
                    <Checkbox checked={noAgeLimit} onChange={(e) => {
                        setNoAgeLimit(e.target.checked);
                        if (e.target.checked) {
                            setMinAge(null);
                            setMaxAge(null);
                            form.setFieldsValue({ minAge: undefined, maxAge: undefined });
                        }
                    }}>
                        No age limitation
                    </Checkbox>
                </Form.Item>

                <Form.Item label="Recommended Age Range" required>
                    <div className="flex gap-3">
                        <Form.Item
                            name="minAge"
                            rules={noAgeLimit ? [] : [{ required: true, message: "Select min age" }]}
                            className="!mb-0 w-full"
                        >
                            <Select
                                placeholder="Min Age"
                                onChange={handleMinAgeChange}
                                disabled={noAgeLimit}
                            >
                                {generateAgeOptions()}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="maxAge"
                            rules={
                                noAgeLimit
                                    ? []
                                    : [
                                        { required: true, message: "Select max age" },
                                        () => ({
                                            validator(_, value) {
                                                if (!value || minAge === null || value > minAge) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error("Max age must be greater than min age!")
                                                );
                                            },
                                        }),
                                    ]
                            }
                            className="!mb-0 w-full"
                        >
                            <Select
                                placeholder="Max Age"
                                onChange={handleMaxAgeChange}
                                disabled={noAgeLimit || minAge === null}
                            >
                                {generateAgeOptions().filter((option: any) => option.key > minAge)}
                            </Select>
                        </Form.Item>
                    </div>
                </Form.Item>

                <Form.Item
                    label="Select Vaccines"
                    name="vaccineIds"
                    rules={[{ required: true, message: "Please select at least one vaccine!" }]}
                >
                    <Select mode="multiple" placeholder="Select vaccines">
                        {vaccines.map((vaccine) => (
                            <Option key={vaccine.id} value={vaccine.id}>
                                {vaccine.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Price ($)"
                    name="price"
                    rules={[{ required: true, message: "Please enter the package price!" }]}
                >
                    <InputNumber<number>
                        style={{ width: "100%" }}
                        placeholder="Total price"
                        min={0}
                        disabled
                        formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                    />
                </Form.Item>

                <Form.Item
                    label="Image URL"
                    name="image"
                    rules={[{ required: true, message: "Please enter the image URL!" }]}
                >
                    <Input placeholder="Enter image URL" />
                </Form.Item>

                <Form.Item shouldUpdate>
                    {() => {
                        const imageUrl = form.getFieldValue("image");
                        return imageUrl ? (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                                <Image
                                    src={imageUrl}
                                    width={150}
                                    height={150}
                                    style={{ objectFit: "cover", borderRadius: 8 }}
                                    alt="Preview"
                                    fallback="https://via.placeholder.com/150?text=No+Image"
                                />
                            </div>
                        ) : null;
                    }}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateVaccinePackageDialog;
