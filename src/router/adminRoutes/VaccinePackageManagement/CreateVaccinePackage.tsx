import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, InputNumber, notification, Select } from "antd";

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

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                //const response = await getAllVaccines();
                //setVaccines(response.vaccines);
            } catch (error) {
                console.error("Failed to fetch vaccines:", error);
            }
        };
        fetchVaccines();
    }, []);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCreate = async () => {
        form
            .validateFields()
            .then(async (values) => {
                setLoading(true);
                try {
                    //await createVaccinePackage(values);
                    notification.success({
                        message: "Vaccine Package Created Successfully",
                        description: `The package "${values.name}" has been added.`,
                    });
                    setIsModalOpen(false);
                    form.resetFields();
                    await fetchVaccinePackages();
                } catch (error) {
                    notification.error({
                        message: "Failed to Create Vaccine Package",
                        description: "An error occurred while adding the package. Please try again.",
                    });
                }
                setLoading(false);
            })
            .catch(() => {
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
        >
            <Form form={form} layout="vertical">
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

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter the package price!" }]}
                >
                    <InputNumber style={{ width: "100%" }} placeholder="Enter package price" min={0} />
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
            </Form>
        </Modal>
    );
};

export default CreateVaccinePackageDialog;
