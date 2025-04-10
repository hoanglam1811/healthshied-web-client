// ProfessionalTeam.tsx

import React, { useEffect, useState } from 'react';
import { Breadcrumb, Tag, Avatar } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import home1 from "@/assets/benhvien.png";
import home2 from "@/assets/bg2.png";
import { getAllUsers } from '@/services/ApiServices/userService';

const mockStaffs = [
    {
        name: 'Nguyễn Minh Hồng',
        title: 'Thạc sĩ – Bác sĩ',
        department: 'Y tế công cộng',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
        name: 'Nguyễn Anh Tuấn',
        title: 'Bác sĩ Chuyên khoa 1',
        department: 'Chẩn đoán hình ảnh',
        avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    },
    {
        name: 'Lê Thị Quyên',
        title: 'Bác sĩ',
        department: 'Nội – Hồi sức tim',
        avatar: 'https://randomuser.me/api/portraits/women/77.jpg',
    },
    {
        name: 'Nguyễn Lê Băng Giang',
        title: 'Bác sĩ',
        department: 'Y học cổ truyền',
        avatar: 'https://randomuser.me/api/portraits/women/78.jpg',
    },
    {
        name: 'Nguyễn Văn My',
        title: 'Bác sĩ',
        department: 'Truyền nhiễm',
        avatar: 'https://randomuser.me/api/portraits/men/79.jpg',
    },
    {
        name: 'Nguyễn Văn Tường',
        title: 'Bác sĩ',
        department: 'Đa khoa',
        avatar: 'https://randomuser.me/api/portraits/men/80.jpg',
    },
];

const ProfessionalTeam = () => {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await getAllUsers();
                const staffOnly = res.users.filter((u: any) => u.role === "Staff");
                setStaffList(staffOnly);
            } catch (error) {
                console.error("Failed to load staff", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    return (
        <div className="!min-h-screen !bg-[#f7fafd]">
            <div className="!w-full !flex !rounded-xl !overflow-hidden">
                <div
                    className="!w-full !grid !grid-cols-6 !bg-cover !bg-center"
                    style={{ backgroundImage: `url(${home2})`, backgroundSize: '100% 100%' }}
                >
                    <div></div>
                    <div className="!col-span-2 !mt-4 !mx-auto !mb-10 !px-4 !text-left">
                        <Breadcrumb className="!mb-2">
                            <Breadcrumb.Item href="/">
                                <HomeOutlined />
                                <span>Home</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Our Professional Team</Breadcrumb.Item>
                        </Breadcrumb>

                        <h1 className="!text-3xl !mt-17 !font-bold !text-black">
                            HealthShield Professional Team
                        </h1>
                        <p className="!text-md !text-gray-600 !mt-6">
                            Our team of experienced doctors and pharmacists are highly trained both locally and internationally.
                        </p>
                    </div>
                    <div></div>
                    <div
                        className="!col-span-1 !bg-cover !bg-center !py-16"
                        style={{ backgroundImage: `url(${home1})`, backgroundSize: '100% 100%' }}
                    >
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="!bg-white !py-10">
                <div className="!max-w-7xl !mx-auto !px-4 !grid md:grid-cols-3 !gap-6 !text-left">
                    {/* Box 1 */}
                    <div className="!flex !items-center !gap-6">
                        <img
                            src="https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_59c5ff874f.png"
                            className="!w-12 !h-12 !object-contain"
                            alt="icon"
                        />
                        <div>
                            <h3 className="!text-md !text-black !font-semibold">Experienced Medical Team</h3>
                            <p className="!text-gray-500 !text-sm">Veterans in the field with training both domestically and abroad.</p>
                        </div>
                    </div>

                    {/* Box 2 */}
                    <div className="!flex !items-start !gap-6">
                        <img
                            src="https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_1_5923799673.png"
                            className="!w-12 !h-12 !object-contain"
                            alt="icon"
                        />
                        <div>
                            <h3 className="!text-md !text-black !font-semibold">High Professional Expertise</h3>
                            <p className="!text-gray-500 !text-sm">Our doctors are currently practicing and teaching at top hospitals in the country.</p>
                        </div>
                    </div>

                    {/* Box 3 */}
                    <div className="!flex !items-start !gap-6">
                        <img
                            src="https://cdn.tiemchunglongchau.com.vn/unsafe/64x0/filters:quality(90)/ic_usp_3_626c50da92.png"
                            className="!w-12 !h-12 !object-contain"
                            alt="icon"
                        />
                        <div>
                            <h3 className="!text-md !text-black !font-semibold">Dedicated & Compassionate</h3>
                            <p className="!text-gray-500 !text-sm">Ready to provide health care with dedication and compassion.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="!max-w-7xl !mx-auto !px-4 !pb-20 !mt-10">
                <div className="!grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 !gap-6 !text-left">
                    {staffList.map((staff, index) => (
                        <div
                            key={index}
                            className="!bg-white !p-4 !rounded-xl !shadow-sm !flex !items-center !gap-4 hover:!shadow-md !transition-all !duration-300"
                        >
                            <Avatar size={64} src={`https://github.com/shadcn.png`} />
                            <div>
                                <Tag className="!mb-1" color="blue">{staff.title || "Unknown"}</Tag>
                                <h4 className="!text-md !text-black !font-semibold">{staff.fullName}</h4>
                                <p className="!text-gray-500">{staff.department || "Unknown"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalTeam;
