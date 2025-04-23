import { deleteStaffSchedule, getAllStaffSchedule } from "@/services/ApiServices/staffScheduleService";
import { CalendarOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Calendar, Card, DatePicker, Layout, message, Modal, Popconfirm, Select, Table, Tabs, Typography } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const VaccineSchedule = () => {

  const [staffSchedules, setStaffSchedules] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [filteredRange, setFilteredRange] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [staffDetails, setStaffDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dateCellRender = (date: any) => {
    const count = staffSchedules.filter((item) =>
      item.shiftDateObj.isSame(date, "day")
    ).length;
    return count > 0 ? (
      <div className="text-center text-blue-500 font-semibold">{count}</div>
    ) : null;
  };

  const showStaffModal = async (staff: any) => {
        try {
            setStaffDetails(staff);

            // const allergyData = await getAllergyByChildId(childId);
            // setAllergies(allergyData.allergies);

            setModalVisible(true);
        } catch (error) {
            console.error("Failed to fetch child or allergy details", error);
        }
    };

  const fetchStaffSchedules = async () => {
        setLoading(true);
        try {
            const response = await getAllStaffSchedule();
            const data = response.schedules || [];
            const mapped = data.map((item: any) => ({
                ...item,
                shiftDateObj: dayjs(item.shiftDate),
            }));
            setStaffSchedules(mapped);
        } catch (err) {
            message.error("Failed to fetch staff schedules");
        } finally {
            setLoading(false);
        }
    };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Staff Name",
      dataIndex: "staffId",
      key: "staffName",
      render: (_: any, record: any) => {
        return (
          <Button onClick={() => showStaffModal(record?.staff)} type="link">
            {record?.staff?.fullName}
          </Button>
        );
      },
    },
    {
      title: "Shift Date",
      dataIndex: "shiftDate",
      key: "shiftDate",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Shift Time",
      dataIndex: "shiftTime",
      key: "shiftTime",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Button onClick={() => {}}>Detail</Button>
          <Popconfirm
            title="Are you sure to delete this appointment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: any) => {
        try {
            await deleteStaffSchedule(id);
            message.success(`Staff Schedule ${id} deleted`);
            fetchStaffSchedules();
        } catch (error) {
            message.error("Failed to delete staff schedule");
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


  useEffect(() => {
    fetchStaffSchedules();
  }, [])

  return (
    <Layout>
      <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
          <Title level={3} style={{ color: "white", margin: 0 }}>Schedule Management</Title>
      </Header>
      
      <Content className="!w-full !flex !justify-center">
        <div className="!w-7xl !mx-auto !bg-gray-100 !rounded-lg !flex !flex-col lg:!flex-row !gap-6 !p-6">
          <div className="lg:!w-1/3 !w-full !bg-white !p-4 !rounded !shadow">
            <Calendar
              fullscreen={false}
              dateCellRender={dateCellRender}
              onSelect={(date) => {
                setSelectedDate(date);
                setFilteredRange(null);
              }}
              className="!bg-white !rounded-md !shadow"
            />
          </div>

          <div className="lg:!w-2/3 !w-full">
            <Card
              title={
                <Title className="!mt-6 !mb-6 !ml-12" level={3}>
                  <CalendarOutlined /> STAFF SCHEDULES
                </Title>
              }
              extra={
                <div className="!flex !flex-col !justify-center !gap-3 !mt-3">
                  <Button icon={<ReloadOutlined />} onClick={fetchStaffSchedules}>
                    Refresh
                  </Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={fetchStaffSchedules}>
                    Add Schedule
                  </Button>
                </div>
              }
              className="!shadow-lg !rounded-lg !bg-white"
            >
              <RangePicker
                className="!mb-4 w-full"
                onChange={(range: any) => {
                  setFilteredRange(range);
                  setSelectedDate(null);
                }}
              />

              <div style={{ overflowX: "auto" }}>
                <Tabs
                  className="!mt-3 !text-center !w-fit"
                  defaultActiveKey="1"
                  type="card"
                  centered
                  style={{ border: "1px solid #e8e8e8", borderRadius: "8px" }}
                >
                  <TabPane tab="All" key="all">
                    <Table
                      columns={columns}
                      dataSource={filteredData(null)}
                      rowKey="id"
                      loading={loading}
                      pagination={{ pageSize: 6 }}
                      className="!rounded-lg !shadow-lg"
                    />
                  </TabPane>
                  <TabPane tab="Morning" key="morning">
                    <Table
                      columns={columns}
                      dataSource={filteredData("Morning")}
                      rowKey="id"
                      loading={loading}
                      pagination={{ pageSize: 6 }}
                      className="!rounded-lg !shadow-lg"
                    />
                  </TabPane>
                  <TabPane tab="Afternoon" key="afternoon">
                    <Table
                      columns={columns}
                      dataSource={filteredData("Afternoon")}
                      rowKey="id"
                      loading={loading}
                      pagination={{ pageSize: 6 }}
                      className="!rounded-lg !shadow-lg"
                    />
                  </TabPane>
                  <TabPane tab="Evening" key="evening">
                    <Table
                      columns={columns}
                      dataSource={filteredData("Evening")}
                      rowKey="id"
                      loading={loading}
                      pagination={{ pageSize: 6 }}
                      className="!rounded-lg !shadow-lg"
                    />
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>

        <Modal
          title="Staff Details"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          {staffDetails && (
            <div>
              <p><strong>- Full Name:</strong> {staffDetails.fullName}</p>
              <p><strong>- Email:</strong> {staffDetails.email}</p>
              <p><strong>- Phone:</strong> {staffDetails.phone}</p>
              <p><strong>- Status:</strong> {staffDetails.status}</p>

              {/*<h3 className="">- Allergies:</h3>
              <ul>
                {allergies.map((allergy: any) => (
                  <li key={allergy.id}>
                    <strong>+ {allergy.name}</strong>: {allergy.description}
                  </li>
                ))}
              </ul>*/}
            </div>
          )}
        </Modal>

      </Content>


    </Layout>


  )
}
export default VaccineSchedule;
