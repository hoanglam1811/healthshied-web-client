import { useState } from "react";
import { Modal, Button, Form, Input, InputNumber, notification, Select } from "antd";
import { createVaccine } from "@/services/ApiServices/vaccineService";

const { Option } = Select;

const CreateVaccineDialog = ({
  isModalOpen,
  setIsModalOpen,
  fetchVaccines
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchVaccines: any;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [minAge, setMinAge] = useState<any | null>(null);
  const [maxAge, setMaxAge] = useState<any | null>(null);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCreate = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        console.log("Vaccine Data:", values);

        const { minAge, maxAge } = values;
        const recommendedAgeRange = `${minAge}-${maxAge}`;

        try {
          await createVaccine({ ...values, recommendedAgeRange });
          notification.success({
            message: "Vaccine Created Successfully",
            description: `The vaccine "${values.name}" has been added.`,
          });
          setIsModalOpen(false);
          form.resetFields();
          await fetchVaccines();
        } catch (error) {
          notification.error({
            message: "Failed to Create Vaccine",
            description: "An error occurred while adding the vaccine. Please try again.",
          });
        }

        setLoading(false);
      })
      .catch((info) => {
        console.log("Validation Error:", info);
        notification.warning({ message: "Please check your input and try again!" });
      });
  };


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

  return (
    <Modal
      title="Add New Vaccine"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleCreate}
      okText="Create Vaccine"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Vaccine Name"
          name="name"
          rules={[{ required: true, message: "Please enter the vaccine name!" }]}
        >
          <Input placeholder="Enter vaccine name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the description!" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter detailed description" />
        </Form.Item>

        <Form.Item label="Recommended Age Range" required>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Form.Item
              name="minAge"
              rules={[{ required: true, message: "Select min age" }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select placeholder="Min Age" onChange={handleMinAgeChange}>
                {generateAgeOptions()}
              </Select>
            </Form.Item>

            <span>-</span>

            <Form.Item
              name="maxAge"
              rules={[
                { required: true, message: "Select max age" },
                () => ({
                  validator(_, value) {
                    if (!value || minAge === null || value > minAge) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Max age must be greater than min age!"));
                  },
                }),
              ]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select placeholder="Max Age" onChange={handleMaxAgeChange} disabled={minAge === null}>
                {generateAgeOptions().filter((option: any) => option.key > minAge)}
              </Select>
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item
          label="Contraindications"
          name="contraindications"
          rules={[{ required: true, message: "Please enter contraindications!" }]}
        >
          <Input placeholder="Enter contraindications" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the vaccine price!" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Enter vaccine price" min={0} />
        </Form.Item>
      </Form>
    </Modal>

  );
};

export default CreateVaccineDialog;
