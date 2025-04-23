import React, { useEffect, useState } from 'react';
import { Calendar, Button, DatePicker, Modal, Form, Layout, Typography, Card, Select } from 'antd';
import { getStaffScheduleByStaffId } from '@/services/ApiServices/staffScheduleService';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '@/store/store';
import dayjs from 'dayjs';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StaffScheduleByStaff = () => {
    const [staffSchedules, setStaffSchedules] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<any>(null);

    const user = useSelector((state: RootState) => state.token.user);
    console.log(user);

    useEffect(() => {
        if (user && user.id) {
            getStaffScheduleByStaffId(user.id)
                .then((data) => {
                    if (Array.isArray(data.schedules)) {
                        const convertedSchedules = data.schedules.map((schedule: any) => ({
                            ...schedule,
                            shiftDate: moment(schedule.shiftDate, "MM/DD/YYYY hh:mm:ss").format('YYYY-MM-DD')
                        }));
                        setStaffSchedules(convertedSchedules);
                    } else {
                        console.warn("Unexpected response format:", data);
                        setStaffSchedules([]);
                    }
                })
                .catch((error) => console.error("Error fetching staff schedules:", error));
        }
    }, [user]);

    const dateCellRender = (value: any) => {
        const dateStr = value.format('YYYY-MM-DD');
        const schedules = Array.isArray(staffSchedules)
            ? staffSchedules.filter((schedule) => {
                const formattedDate = dayjs(schedule.shiftDate, ['MM/DD/YYYY HH:mm:ss', 'YYYY-MM-DD']).format('YYYY-MM-DD');
                return formattedDate === dateStr;
            })
            : [];

        const getTimeRange = (shiftTime: string) => {
            switch (shiftTime.toUpperCase()) {
                case "MORNING":
                    return " (8AM - 12PM)";
                case "AFTERNOON":
                    return " (12PM - 4PM)";
                case "EVENING":
                    return " (4PM - 8PM)";
                default:
                    return "";
            }
        };

        return (
            <ul style={{ paddingLeft: 16 }}>
                {schedules.map((schedule, index) => (
                    <li key={index}>
                        {schedule.shiftTime}
                        {getTimeRange(schedule.shiftTime)}
                    </li>
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
            </Content>
        </Layout>
    );
};

export default StaffScheduleByStaff;
