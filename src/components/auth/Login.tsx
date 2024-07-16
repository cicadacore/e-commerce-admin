import { App, Button, Checkbox, Form, Input, Space, Alert } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { apiRoutes } from '../../routes/api';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import {
  handleErrorResponse,
  setPageTitle,
  showNotification,
} from '../../utils';
import { Admin } from '../../interfaces/models/admin';
import { defaultHttp } from '../../utils/http';
import { loginSuccess } from '../../redux/reducers/userReducer';
import { login } from '../../redux/actions/user';
import { toast } from 'sonner';

const { Item } = Form;

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || webRoutes.dashboard;
  const { user } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const { message } = App.useApp();

  useEffect(() => {
    setPageTitle('Admin Login');
  }, []);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    dispatch<any>(login(values.email, values.password))
      .then(() => {
        setLoading(false);
        toast.success('Logged in successfully', {
          duration: 2000,
        });
      })
      .catch((error: any) => {
        setLoading(false);
        toast.error(error.statusText, {
          description: error.data.msg,
          duration: 3000,
        });
      });
  };

  return (
    <Fragment>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-left text-opacity-30 tracking-wide">
        Admin Login
      </h1>
      <Form
        className="space-y-4 md:space-y-6"
        form={form}
        name="login"
        onFinish={onSubmit}
        layout={'vertical'}
        requiredMark={false}
        // initialValues={
        //   import.meta.env.VITE_DEMO_MODE === 'true'
        //     ? {
        //         email: 'eve.holt@reqres.in',
        //         password: 'password',
        //       }
        //     : {}
        // }
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
            ]}
          >
            <Input
              placeholder="name@example.com"
              className="bg-gray-50 text-gray-900 sm:text-sm py-1.5"
            />
          </Form.Item>
        </div>
        <div>
          <Form.Item
            name="password"
            label={
              <p className="block text-sm font-medium text-gray-900">
                Password
              </p>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
              visibilityToggle={true}
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
            Login
          </Button>
        </div>
        {/* <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Link to={webRoutes.forgotPassword}>Forgot password?</Link>
        </div> */}
      </Form>
    </Fragment>
  );
};

export default Login;
