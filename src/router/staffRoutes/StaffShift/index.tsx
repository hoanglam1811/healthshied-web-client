import React, { useEffect, useState } from 'react';
import { Calendar, Button, DatePicker, Modal, Form, Layout, Typography, Card, Select } from 'antd';
import { createStaffSchedule, getStaffScheduleByStaffId } from '@/services/ApiServices/staffScheduleService';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { RootState } from '@/store/store';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StaffScheduleByStaff = () => {
    const [staffSchedules, setStaffSchedules] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [selectedShift, setSelectedShift] = useState<string>('MORNING');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const user = useSelector((state: RootState) => state.token.user);
    console.log(user);

    useEffect(() => {
        if (user && user.id) {
            getStaffScheduleByStaffId(user.id)
                .then((data) => {
                    if (Array.isArray(data)) {
                        setStaffSchedules(data);
                    } else if (data && Array.isArray(data.staffSchedules)) {
                        setStaffSchedules(data.staffSchedules);
                    } else {
                        console.warn("Unexpected response format:", data);
                        setStaffSchedules([]);
                    }
                })
                .catch((error) => console.error("Error fetching staff schedules:", error));
        }
    }, [user]);

    const handleCreateSchedule = () => {
        if (user && user.id && selectedDate && selectedShift) {
            createStaffSchedule({
                staffId: Number(user.id),
                shiftDate: selectedDate.format('YYYY-MM-DD'),
                shiftTime: selectedShift,
            })
                .then((response) => {
                    setStaffSchedules((prevSchedules) => [
                        ...prevSchedules,
                        response,
                    ]);
                    setIsModalVisible(false);
                })
                .catch((error) => {
                    console.error("Error creating staff schedule:", error);
                });
        }
    };

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
    };

    const handleShiftChange = (value: string) => {
        setSelectedShift(value);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const dateCellRender = (value: any) => {
        const dateStr = value.format('YYYY-MM-DD');
        const schedules = Array.isArray(staffSchedules)
            ? staffSchedules.filter((schedule) => schedule.shiftDate === dateStr)
            : [];

        return (
            <ul>
                {schedules.map((schedule, index) => (
                    <li key={index}>{`Staff ${schedule.staffId} - ${schedule.shiftTime}`}</li>
                ))}
            </ul>
        );
    };

    return (
        <Layout>
            <Header style={{ background: "#001529", padding: "0 16px", display: "flex", alignItems: "center" }}>
                <Title level={3} style={{ color: "white", margin: 0 }}>Staff Shift</Title>
            </Header>

            <Content style={{ padding: "24px" }}>
                <Card title="Work schedule" style={{ marginBottom: 16, backgroundColor: "#001F3F", borderRadius: 8 }} headStyle={{ color: "white" }}>
                    <Calendar
                        value={selectedDate}
                        onSelect={setSelectedDate}
                        dateCellRender={dateCellRender}
                    />
                </Card>

                <Modal
                    title="Create New Schedule"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form layout="vertical">
                        <Form.Item label="Select Date">
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={handleDateChange}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item label="Select Shift">
                            <Select
                                value={selectedShift}
                                onChange={handleShiftChange}
                                style={{ width: '100%' }}
                            >
                                <Option value="MORNING">Morning</Option>
                                <Option value="AFTERNOON">Afternoon</Option>
                                <Option value="EVENING">Evening</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" onClick={handleCreateSchedule}>
                                Create Schedule
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default StaffScheduleByStaff;
