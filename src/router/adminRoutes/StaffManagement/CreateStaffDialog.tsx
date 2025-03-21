import { useState } from "react";
import { Modal, Button, Form, Input, Select, notification } from "antd";
import { createUser } from "@/services/ApiServices/userService";

const { Option } = Select;

const CreateStaffDialog = ({
  isModalOpen,
  setIsModalOpen,
  fetchStaffs
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchStaffs: any;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Đóng Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields(); // Reset form sau khi đóng
  };

  // Xử lý khi nhấn "Tạo nhân viên"
  const handleCreate = async () => {
    form
      .validateFields()
      .then(async (values: any) => {
        setLoading(true);
        console.log("Dữ liệu nhân viên:", values);
        await createUser({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: "Staff",
        })
        setIsModalOpen(false);
        form.resetFields();
        setLoading(false);
        await fetchStaffs();
      })
      .catch((info: any) => {
        console.log("Lỗi khi nhập dữ liệu:", info);
        notification.error({ message: info })
      });
  };

  return (
    <>
      <Modal
        title="Tạo nhân viên mới"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleCreate}
        okText="Tạo nhân viên"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên nhân viên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
          >
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải có 10-11 chữ số!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập mật khẩu" />
          </Form.Item>

          {/*<Form.Item
            label="Chức vụ"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn chức vụ!" }]}
          >
            <Select placeholder="Chọn chức vụ">
              <Option value="developer">Lập trình viên</Option>
              <Option value="designer">Thiết kế</Option>
              <Option value="manager">Quản lý</Option>
            </Select>
          </Form.Item>*/}
        </Form>
      </Modal>
    </>
  );
};

export default CreateStaffDialog;

