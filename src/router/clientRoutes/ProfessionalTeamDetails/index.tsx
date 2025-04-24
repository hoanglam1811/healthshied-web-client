import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, Card, Divider, Spin, Typography } from "antd";
import { getUserById } from "@/services/ApiServices/userService";

const { Title, Text, Paragraph } = Typography;

const ProfessionalTeamDetails = () => {
    const { id } = useParams();
    const [staff, setStaff] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const fetchStaffDetail = async () => {
            setLoading(true);
            try {
                const res = await getUserById(id);
                setStaff(res);
            } catch (error) {
                console.error("Failed to fetch staff detail", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStaffDetail();
    }, [id]);

    if (loading || !staff) {
        return (
            <div className="!w-full !flex !justify-center !items-center !min-h-[300px]">
                <Spin />
            </div>
        );
    }

    return (
        <div className="fit-content !pb-6 !pt-5 !bg-gray-200">
            <div className="!p-4 !max-w-6xl !mx-auto !bg-white !rounded-2xl !shadow-md">
                <div className="!flex !gap-8 !flex-col md:!flex-row">
                    <div className="!flex !flex-col !items-center md:!items-start !text-center md:!text-left">
                        <Avatar size={120} src={staff.avatar || `https://github.com/shadcn.png`} className="!border !border-gray-300" />
                        <div className="!mt-4">
                            <Text type="secondary" className="!text-gray-500 ">{staff.position}</Text>
                            <Title level={3} className="!mt-1 !mb-1">{staff.fullName}</Title>
                        </div>
                    </div>

                    <div className="!flex-1 !text-left">
                    <Card title="Experience" className="!bg-blue-50 !border-none !rounded-xl !shadow-sm">
    <Paragraph
        className="!text-base !text-gray-700"
        style={{ whiteSpace: 'pre-line' }}
    >
        {staff.experience || "No experience information."}
    </Paragraph>
</Card>

<Divider className="!my-6" />

<div>
    <Title level={4} className="!mb-3">Work process:</Title>
    <Paragraph
        className="!text-base !text-gray-700"
        style={{ whiteSpace: 'pre-line' }}
    >
        {staff.workProcess || "No work process information."}
    </Paragraph>
</div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalTeamDetails;
