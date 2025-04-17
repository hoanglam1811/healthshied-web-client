import { useState } from "react";
import { Modal, Form, Input, notification } from "antd";
import { createVaccineCategory } from "@/services/ApiServices/vaccineCategoryService";

const CreateVaccineCategoryDialog = ({
  isModalOpen,
  setIsModalOpen,
  fetchVaccineCategories
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchVaccineCategories: any;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCreate = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        console.log("Vaccine Category Data:", values);

        try {
          await createVaccineCategory({
            name: values.name,
          });

          notification.success({
            message: "Vaccine Category Created Successfully",
            description: `The vaccine category "${values.name}" has been added.`,
          });

          setIsModalOpen(false);
          form.resetFields();
          await fetchVaccineCategories();
        } catch (error) {
          notification.error({
            message: "Failed to Create Vaccine Category",
            description: "An error occurred while adding the vaccine Category. Please try again.",
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
      title="Add New Vaccine Category"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleCreate}
      okText="Create Vaccine Category"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols gap-6">
          <div className="flex flex-col gap-4">
            <Form.Item
              label="Category Name"
              name="name"
              rules={[{ required: true, message: "Please enter the category name!" }]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>
          </div>
        </div>
      </Form>

    </Modal>
  );
};

export default CreateVaccineCategoryDialog;
