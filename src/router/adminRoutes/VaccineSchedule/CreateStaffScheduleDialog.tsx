import { useState } from "react";
import { Modal, Button, Form, Input, Select, notification, DatePicker } from "antd";
import { createUser, getAllUsers } from "@/services/ApiServices/userService";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateStaffScheduleDialog = ({
  isModalOpen,
  setIsModalOpen,
  fetchStaffSchedules
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchStaffSchedules: any;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [staffs, setStaffs] = useState<any>([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const fetchStaffs = async () => {
    try{
      let response = await getAllUsers();
      response = response.users.filter((item: any) => item.role === "Staff");
      setStaffs(response);
    }
    catch(error: any){
      notification.error({ message: error });
    }
    finally{
      
    }
  }

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
        notification.success({ message: "Add schdule successfully!" })
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
        title="Add new Staff Schedule"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleCreate}
        okText="Add"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="Shift Date"
            name="shiftDate"
            rules={[
              { required: true, message: "Please enter shift date!" },
              { type: "date", message: "Shift date is not valid!" },
            ]}
          >
            <DatePicker />
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
            label="Staff"
            name="staff"
            rules={[
              { required: true, message: "Please select a staff!" },
            ]}>
            <Select options={staffs.map((staff: any) => ({ value: staff.id, label: staff.fullName }))}>
            </Select>
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

export default CreateStaffScheduleDialog;

