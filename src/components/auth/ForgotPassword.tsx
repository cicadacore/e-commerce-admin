import { Button, Checkbox, Form, Input, Space } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { apiRoutes } from '../../routes/api';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { handleErrorResponse, setPageTitle } from '../../utils';
import { Admin } from '../../interfaces/models/admin';
import { defaultHttp } from '../../utils/http';

const { Item } = Form;

interface FormValues {
  email: string;
  password: string;
}

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || webRoutes.dashboard;
  const { user } = useSelector((state: any) => state.admin);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setPageTitle('Forgot Password');
  }, []);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user]);

  const onSubmit = (values: FormValues) => {
    setLoading(true);
  };

  return (
    <Fragment>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
        Forgot Password
      </h1>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="login"
        onFinish={onSubmit}
        layout={'vertical'}
        requiredMark={false}
      >
        <div>
          <Form.Item
            name="email"
            label={
              <p className="block text-sm font-medium text-gray-900">Email</p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your email',
              },
              {
                type: 'email',
                message: 'Invalid email address',
              },
            ]}
          >
            <Input
              placeholder="name@example.com"
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>

        <div className="text-center">
          <Button
            className="mt-4 bg-primary"
            block
            loading={loading}
            type="primary"
            size="large"
            htmlType={'submit'}
          >
            Send password reset email
          </Button>
        </div>
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Link to={webRoutes.login}>Already have an account? Sign in</Link>
        </div>
      </Form>
    </Fragment>
  );
};

export default ForgotPassword;
