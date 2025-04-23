import { createStaffSchedule, deleteStaffSchedule, getAllStaffSchedule, updateStaffSchedule } from "@/services/ApiServices/staffScheduleService";
import { getAllUsers } from "@/services/ApiServices/userService";
import { CalendarOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Calendar, Card, DatePicker, Form, Layout, message, Modal, notification, Popconfirm, Select, Table, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const shiftTimeRanges: Record<string, string> = {
  Morning: "(8AM - 12PM)",
  Afternoon: "(12PM - 4PM)",
  Evening: "(4PM - 8PM)"
};

const CreateStaffScheduleDialog = ({
  isModalOpen,
  setIsModalOpen,
  fetchStaffSchedules
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchStaffSchedules: () => void;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedShift(null);
  };

  const fetchStaffs = async () => {
    try {
      let response = await getAllUsers();
      response = response.users.filter((item: any) => item.role === "Staff");
      setStaffs(response);
    } catch (error: any) {
      notification.error({ message: error.message || "Failed to fetch staff" });
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const selectedDate = values.shiftDate;
      const shift = values.shiftTime;

      const shiftTimes: Record<string, { start: string; end: string }> = {
        Morning: { start: "08:00", end: "12:00" },
        Afternoon: { start: "12:00", end: "16:00" },
        Evening: { start: "16:00", end: "20:00" }
      };

      const { start, end } = shiftTimes[shift];
      const formattedDate = selectedDate.format("MM/DD/YYYY");

      const shiftTimeString = `${shift} - ${formattedDate} ${start} - ${end}`;

      const payload = {
        staffId: values.staffId,
        shiftDate: selectedDate.format("YYYY-MM-DD"),
        shiftTime: shiftTimeString
      };

      await createStaffSchedule(payload);
      notification.success({ message: "Staff schedule created successfully!" });

      form.resetFields();
      setIsModalOpen(false);
      setSelectedShift(null);
      fetchStaffSchedules();
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      notification.error({ message: "Error creating schedule!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  return (
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
          rules={[{ required: true, message: "Please select shift date!" }]}
        >
          <DatePicker
            disabledDate={(current) => current && current < dayjs().startOf("day")}
          />
        </Form.Item>

        <Form.Item
          label={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Shift Time</span>
              {selectedShift && (
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {shiftTimeRanges[selectedShift]}
                </Text>
              )}
            </div>
          }
          name="shiftTime"
          rules={[{ required: true, message: "Please select shift time!" }]}
        >
          <Select
            placeholder="Select shift time"
            onChange={(value) => setSelectedShift(value)}
          >
            <Option value="Morning">Morning</Option>
            <Option value="Afternoon">Afternoon</Option>
            <Option value="Evening">Evening</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Staff"
          name="staffId"
          rules={[{ required: true, message: "Please select a staff!" }]}
        >
          <Select
            options={staffs.map((staff) => ({
              value: staff.id,
              label: staff.fullName
            }))}
            showSearch
            placeholder="Select a staff"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const StaffScheduleManagement = () => {
  const [staffSchedules, setStaffSchedules] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [filteredRange, setFilteredRange] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [staffDetails, setStaffDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createScheduleModalVisible, setCreateScheduleModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  const dateCellRender = (date: any) => {
    const count = staffSchedules.filter((item) =>
      item.shiftDateObj.isSame(date, "day")
    ).length;
    return count > 0 ? (
      <div className="text-center text-blue-500 font-semibold">{count}</div>
    ) : null;
  };

  const showStaffModal = (staff: any) => {
    setStaffDetails(staff);
    setModalVisible(true);
  };

  const fetchStaffSchedules = async () => {
    setLoading(true);
    try {
      const response = await getAllStaffSchedule();
      const data = response.schedules || [];

      const sorted = data
        .map((item: any) => ({
          ...item,
          shiftDateObj: dayjs(item.shiftDate)
        }))
        .sort((a: any, b: any) => dayjs(b.shiftDate).valueOf() - dayjs(a.shiftDate).valueOf());

      setStaffSchedules(sorted);
    } catch (err) {
      message.error("Failed to fetch staff schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteStaffSchedule(id);
      message.success(`Staff Schedule ${id} deleted`);
      fetchStaffSchedules();
    } catch (error) {
      message.error("Failed to delete staff schedule");
    }
  };

  const handleCancel = () => {
    setModalUpdateVisible(false);
    form.resetFields();
    setCurrentRecord(null);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const selectedDate = values.shiftDate;
      const shift = values.shiftTime;

      const shiftTimes: Record<string, { start: string; end: string }> = {
        Morning: { start: "08:00", end: "12:00" },
        Afternoon: { start: "12:00", end: "16:00" },
        Evening: { start: "16:00", end: "20:00" }
      };

      const { start, end } = shiftTimes[shift];
      const formattedDate = selectedDate.format("MM/DD/YYYY");

      const shiftTimeString = `${shift} - ${formattedDate} ${start} - ${end}`;

      const payload = {
        id: currentRecord.id,
        staffId: values.staffId,
        shiftDate: selectedDate.format("YYYY-MM-DD"),
        shiftTime: shiftTimeString,
      };

      await updateStaffSchedule(payload.id, payload);
      notification.success({ message: "Staff schedule updated successfully!" });

      form.resetFields();
      setModalUpdateVisible(false);
      setCurrentRecord(null);
      fetchStaffSchedules();
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      notification.error({ message: "Error updating schedule!" });
    } finally {
      setLoading(false);
    }
  };


  const filteredData = (shiftTime: any) =>
    staffSchedules.filter((item) => {
      if (shiftTime && item.shiftTime !== shiftTime) return false;
      if (selectedDate) {
        return item.shiftDateObj.isSame(selectedDate, "day");
      }
      if (filteredRange && filteredRange.length === 2) {
        return (
          item.shiftDateObj.isAfter(filteredRange[0], "day") &&
          item.shiftDateObj.isBefore(filteredRange[1], "day")
        );
      }
      return true;
    });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Staff Name",
      dataIndex: "staffId",
      key: "staffName",
      render: (_: any, record: any) => (
        <Button onClick={() => showStaffModal(record?.staff)} type="link">
          {record?.staff?.fullName}
        </Button>
      )
    },
    {
      title: "Shift Date",
      dataIndex: "shiftDate",
      key: "shiftDate",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD")
    },
    {
      title: "Shift Time",
      dataIndex: "shiftTime",
      key: "shiftTime"
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex items-center !gap-2">
          <Button
            onClick={() => {
              setCurrentRecord(record); // Lưu thông tin lịch làm việc cần cập nhật
              setModalUpdateVisible(true);
            }}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this schedule?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )
    }
  ];

  useEffect(() => {
    fetchStaffSchedules();
  }, []);

  return (
    <Layout>
      <Header style={{ background: "#001529", padding: "0 16px" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Schedule Management
        </Title>
      </Header>

      <Content className="!w-full !flex !justify-center !bg-gray-100">
        <div className="!w-7xl !mx-auto !flex !flex-col lg:!flex-row !gap-6 !p-6">
          <div className="lg:!w-1/3 !bg-white !p-4 !rounded !shadow">
            <Calendar
              fullscreen={false}
              dateCellRender={dateCellRender}
              onSelect={(date) => {
                setSelectedDate(date);
                setFilteredRange(null);
              }}
            />
          </div>

          <div className="lg:!w-2/3">
            <Card
              title={
                <Title className="!mt-6 !mb-6 !ml-18" level={3}>
                  <CalendarOutlined /> STAFF SCHEDULES
                </Title>
              }
              extra={
                <div className="!flex !flex-col !gap-3 !mt-3 !mb-5">
                  <Button icon={<ReloadOutlined />} onClick={fetchStaffSchedules}>
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateScheduleModalVisible(true)}
                  >
                    Add Schedule
                  </Button>
                </div>
              }
              className="!shadow-lg !rounded-lg"
            >
              <RangePicker
                className="!mb-4 w-full"
                onChange={(range: any) => {
                  setFilteredRange(range);
                  setSelectedDate(null);
                }}
              />

              <Tabs defaultActiveKey="all" type="card" centered>
                <TabPane tab="All" key="all">
                  <Table
                    columns={columns}
                    dataSource={filteredData(null)}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                  />
                </TabPane>
                <TabPane tab="Morning" key="Morning">
                  <Table
                    columns={columns}
                    dataSource={filteredData("Morning")}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                  />
                </TabPane>
                <TabPane tab="Afternoon" key="Afternoon">
                  <Table
                    columns={columns}
                    dataSource={filteredData("Afternoon")}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                  />
                </TabPane>
                <TabPane tab="Evening" key="Evening">
                  <Table
                    columns={columns}
                    dataSource={filteredData("Evening")}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>

        <Modal
          title="Staff Details"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          {staffDetails && (
            <div>
              <p>
                <strong>Full Name:</strong> {staffDetails.fullName}
              </p>
              <p>
                <strong>Email:</strong> {staffDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {staffDetails.phone}
              </p>
            </div>
          )}
        </Modal>

        <Modal
          title="Update Staff Schedule"
          open={modalUpdateVisible}
          onCancel={handleCancel}
          onOk={handleUpdate}
          okText="Update"
          cancelText="Cancel"
          confirmLoading={loading}
        >
          <Form
            form={form}
            initialValues={{
              staffId: currentRecord?.staffId,
              shiftDate: dayjs(currentRecord?.shiftDate),
              shiftTime: currentRecord?.shiftTime
            }}
            layout="vertical"
          >
            <Form.Item
              name="staffId"
              label="Staff"
              rules={[{ required: true, message: "Please select staff!" }]}
            >
              <Select
                placeholder="Select staff"
                options={staffSchedules.map((schedule) => ({
                  label: schedule?.staff?.fullName,
                  value: schedule.staffId
                }))}
              />
            </Form.Item>
            <Form.Item
              name="shiftDate"
              label="Shift Date"
              rules={[{ required: true, message: "Please select shift date!" }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="shiftTime"
              label="Shift Time"
              rules={[{ required: true, message: "Please select shift time!" }]}
            >
              <Select>
                <Select.Option value="Morning">Morning</Select.Option>
                <Select.Option value="Afternoon">Afternoon</Select.Option>
                <Select.Option value="Evening">Evening</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <CreateStaffScheduleDialog
          isModalOpen={createScheduleModalVisible}
          setIsModalOpen={setCreateScheduleModalVisible}
          fetchStaffSchedules={fetchStaffSchedules}
        />
      </Content>
    </Layout>
  );
};

export default StaffScheduleManagement;

