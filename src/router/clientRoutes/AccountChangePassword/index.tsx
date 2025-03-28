import { useState } from "react";
import { Card, Form, Input, Button, notification } from "antd";
import { LockOutlined } from "@ant-design/icons";
import ProfileLayout from "@/layout/CustomerProfileLayout";

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [errorCount, setErrorCount] = useState(0);

    const handleChangePassword = async (values: any) => {
        if (errorCount >= 3) {
            notification.error({ message: "Too many failed attempts. Try again later!" });
            return;
        }

        setLoading(true);
        try {
            await new Promise((resolve, reject) => setTimeout(() => {
                if (values.oldPassword !== "correctOldPassword") {
                    reject(new Error("Old password is incorrect!"));
                } else {
                    resolve("Password changed successfully!");
                }
            }, 1000));

            notification.success({ message: "Password changed successfully!" });
            setErrorCount(0);
        } catch (error: any) {
            setErrorCount(prev => prev + 1);
            notification.error({ message: "Error", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-3">
                <div></div>

                <div className="flex items-center justify-center">
                    <Card title="Change Password" className="max-w-2xl mx-auto mt-8 shadow-lg">
                        <Form layout="vertical" onFinish={handleChangePassword}>
                            <Form.Item
                                label="Old Password"
                                name="oldPassword"
                                rules={[{ required: true, message: "Please enter your old password!" }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Enter old password" />
                            </Form.Item>

                            <Form.Item
                                label="New Password"
                                name="newPassword"
                                rules={[{ required: true, message: "Please enter a new password!" }, { min: 6, message: "Password must be at least 6 characters!" }]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
                            </Form.Item>

                            <Form.Item
                                label="Confirm New Password"
                                name="confirmPassword"
                                dependencies={["newPassword"]}
                                rules={[{ required: true, message: "Please confirm your new password!" }, ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                })]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    Change Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <div></div>
            </div>

        </>
    );
};

export default ChangePassword;
