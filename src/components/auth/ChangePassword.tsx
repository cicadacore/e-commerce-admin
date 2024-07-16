import { Form, Input, Button, Card, message } from 'antd';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import BasePageContainer from '../layout/PageContainer';
import { BreadcrumbProps } from 'antd/lib';
import { webRoutes } from '../../routes/web';
import { changePassword } from '../../redux/actions/user';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import { handleErrorResponse } from '../../utils';
import { logoutSuccess } from '../../redux/reducers/userReducer';

const ChangePasswordForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const breadcrumb: BreadcrumbProps = {
    items: [
      {
        key: webRoutes.dashboard,
        title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
      },
      {
        key: webRoutes.changePassword,
        title: <Link to={webRoutes.changePassword}>Change Password</Link>,
      },
    ],
  };

  const logoutAdmin = () => {
    http
      .get(apiRoutes.logout)
      .then(() => {
        dispatch(logoutSuccess());
        navigate(webRoutes.login, {
          replace: true,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('persist:E-commerce');
      })
      .catch((error) => {
        handleErrorResponse(error);
      });
  };

  const handleSubmit = async (values: any) => {
    try {
      changePassword(values)
        .then(() => {
          form.resetFields();
          logoutAdmin();
          toast.success('Your password is updated successfully', {
            duration: 3000,
          });
        })
        .catch((error: any) => {
          toast.error(error.statusText, {
            description: error.data.msg,
            duration: 3000,
          });
        });
    } catch (error: any) {
      // message.error(error.response.data.message);
      message.error('Failed to change password. Please try again.');
    }
  };

  return (
    <BasePageContainer breadcrumb={breadcrumb}>
      <div className="flex items-center justify-center min-h-screen ">
        <Card
          style={{
            borderRadius: '12px',
            borderColor: 'rgba(207, 216, 220, 0.7)',
            boxShadow: 'rgba(99, 99, 99, 0.1) 0px 1px 5px 0px',
            maxWidth: '400px', // Add maxWidth to control the card's width
            width: '100%', // Ensure the card takes full width up to the maxWidth
          }}
          title="Change Password"
          className="change-password-card"
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            scrollToFirstError
            layout="vertical"
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: 'Please enter your current password',
                },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              style={{ textAlign: 'left' }}
              rules={[
                {
                  required: true,
                  message: 'Please enter your password',
                },
                {
                  min: 8,
                  message: 'Password must be at least 8 characters',
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
                  message: `Password must contain at least one uppercase letter, one lowercase letter,
            one number, and one special character`,
                },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              style={{ textAlign: 'left' }}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords do not match');
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" block>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </BasePageContainer>
  );
};

export default ChangePasswordForm;
