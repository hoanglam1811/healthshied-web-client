import { useState } from "react";
import { Modal, Button, Form, Input, InputNumber, notification } from "antd";
import { createVaccine } from "@/services/ApiServices/vaccineService";

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

  // Đóng Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Xử lý khi nhấn "Tạo vaccine"
  const handleCreate = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        console.log("Dữ liệu vaccine:", values);
        await createVaccine(values);
        setIsModalOpen(false);
        form.resetFields();
        setLoading(false);
        await fetchVaccines();
      })
      .catch((info) => {
        console.log("Lỗi khi nhập dữ liệu:", info);
        notification.error({ message: "Vui lòng kiểm tra lại thông tin!" });
      });
  };

  return (
    <Modal
      title="Thêm Vaccine Mới"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleCreate}
      okText="Tạo Vaccine"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên Vaccine"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên vaccine!" }]}
        >
          <Input placeholder="Nhập tên vaccine" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          label="Độ tuổi khuyến nghị"
          name="recommendedAgeRange"
          rules={[{ required: true, message: "Vui lòng nhập độ tuổi khuyến nghị!" }]}
        >
          <Input placeholder="Nhập độ tuổi khuyến nghị" />
        </Form.Item>

        <Form.Item
          label="Chống chỉ định"
          name="contraindications"
          rules={[{ required: true, message: "Vui lòng nhập chống chỉ định!" }]}
        >
          <Input placeholder="Nhập chống chỉ định" />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá vaccine!" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Nhập giá vaccine" min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVaccineDialog;

