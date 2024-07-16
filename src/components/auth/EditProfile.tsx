import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import BasePageContainer from '../layout/PageContainer';
import { webRoutes } from '../../routes/web';
import { Button, Form, Input, Select } from 'antd';
import { NotificationType, showNotification } from '../../utils';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<any>();
  const { user } = useSelector((state: any) => state.user);

  const { Option } = Select;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        roleId: user?.role?.id,
      });
    }
  }, [user]);

  const breadcrumb = {
    items: [
      {
        key: webRoutes.dashboard,
        title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
      },
      {
        key: webRoutes.profile,
        title: <Link to={webRoutes.profile}>Profile</Link>,
      },
    ],
  };

  const handleSubmit = async (values: any) => {
    try {
      // Simulate API call or perform actual HTTP POST request with formData
      await http.put(`${apiRoutes.editUser}/${user.uniqueId}`, values);

      showNotification(
        'Success',
        NotificationType.SUCCESS,
        'Profile updated successfully'
      );
      navigate(`${webRoutes.profile}`, { replace: true });
    } catch (err: any) {
      // handleErrorResponse(err);
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response.data.errors[0]
      );
    }
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <h2 className="text-xl font-bold mt-2 mb-4">Edit Profile</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={profile}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="roleId"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select a role">
            <Option value={1}>Super Admin</Option>
            <Option value={2}>User</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </BasePageContainer>
  );
};

export default EditProfile;
