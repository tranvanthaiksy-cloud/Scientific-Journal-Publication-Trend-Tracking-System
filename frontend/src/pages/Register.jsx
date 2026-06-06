import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Select,
    message,
} from "antd";

import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";

const { Title, Text } = Typography;

function Register() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {

            const requestData = {
                username: values.username,
                email: values.email,
                fullName: values.fullName,
                password: values.password,
                role: values.role,
            };

            await registerApi(requestData);

            message.success("Đăng ký thành công!");

            navigate("/login");
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                "Username hoặc Email đã tồn tại"
            );
        }
    };

    return (
        <div className="auth-page">
            <Card className="auth-card register-card">
                <div className="academic-logo">
                    <div className="logo-circle">🎓</div>

                    <Title level={2}>Academic Forum</Title>

                    <Text>Tạo tài khoản mới</Text>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                min: 6,
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng xác nhận mật khẩu",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(
                                        new Error("Mật khẩu không khớp")
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                {
                                    label: "Researcher",
                                    value: "RESEARCHER",
                                },
                                {
                                    label: "Lecturer",
                                    value: "LECTURER",
                                },
                                {
                                    label: "Student",
                                    value: "STUDENT",
                                },
                            ]}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                    >
                        Đăng ký
                    </Button>

                    <div className="terms">
                        Khi đăng ký tài khoản, bạn đồng ý với
                        <a href="#"> Điều khoản sử dụng </a>
                        và
                        <a href="#"> Chính sách bảo mật</a>.
                    </div>

                    <div className="auth-footer">
                        <span>Đã có tài khoản?</span>
                        <Link to="/login">Đăng nhập</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}

export default Register;