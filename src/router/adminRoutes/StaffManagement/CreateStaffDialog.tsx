import { useState } from "react";
import { Modal, Button, Form, Input, Select, notification } from "antd";
import { createUser } from "@/services/ApiServices/userService";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

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
        notification.error({ message: "Add staff successfully!" })
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
        title="Add new Staff"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleCreate}
        okText="Add"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Staff name"
            name="fullName"
            rules={[{ required: true, message: "Please enter name!" }]}
          >
            <Input placeholder="Enter staff name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email!" },
              { type: "email", message: "Email is not valid!" },
            ]}
          >
            <Input placeholder="Enter staff email" />
          </Form.Item>

          <Form.Item
            label="Phone number"
            name="phone"
            rules={[
              { required: true, message: "Please enter phone number!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Phone number must be 10 numbers!",
              },
            ]}
          >
            <Input placeholder="Enter staff phone number" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                style={{ flex: 1 }}
              />
              <Button
                type="link"
                onClick={() => setShowPassword(!showPassword)}
                icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateStaffDialog;

