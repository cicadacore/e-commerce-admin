import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { Dropdown } from 'antd';
import { ProLayout, ProLayoutProps } from '@ant-design/pro-components';
import { CiUser } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { memo } from 'react';
import { sidebar } from './sidebar';
import { apiRoutes } from '../../routes/api';
import http from '../../utils/http';
import { handleErrorResponse } from '../../utils';
import { RiShieldUserFill } from 'react-icons/ri';
import { TbPassword } from 'react-icons/tb';
import { logoutSuccess } from '../../redux/reducers/userReducer';
import { toast } from 'sonner';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const defaultProps: ProLayoutProps = {
    title: CONFIG.appName,
    logo: '/icon.svg',
    fixedHeader: true,
    fixSiderbar: true,
    layout: CONFIG.theme.sidebarLayout,
    route: {
      routes: sidebar,
    },
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
        toast.success('Logged out successfully', {
          duration: 3000,
        });
      })
      .catch((error) => {
        localStorage.removeItem('token');
        localStorage.removeItem('persist:E-commerce');
        handleErrorResponse(error);
      });
  };

  const menuClick = (url: string) => {
    navigate(url);
  };

  const handleItemClick = (url: string) => {
    if (url !== location.pathname) navigate(url); // Update the URL
  };

  return (
    <div className="h-screen">
      <ProLayout
        {...defaultProps}
        token={{
          sider: {
            colorMenuBackground: 'white',
          },
        }}
        location={location}
        onMenuHeaderClick={() => navigate(webRoutes.dashboard)}
        menuItemRender={(item, dom) => (
          <Link
            onClick={(e) => {
              e.preventDefault();
              item.path && handleItemClick(item.path);
            }}
            to={item.path || webRoutes.dashboard}
          >
            {dom}
          </Link>
        )}
        avatarProps={{
          icon: (
            <RiShieldUserFill
              style={{
                height: '100%',
                margin: 'auto',
              }}
            />
          ),
          className: 'bg-primary bg-opacity-20 text-primary text-opacity-90',
          size: 'small',
          shape: 'square',
          title: 'Admin',
          render: (_, dom) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'profile',
                        icon: <CiUser />,
                        label: 'My Profile',
                        onClick: () => {
                          menuClick('/profile');
                        },
                      },
                      {
                        key: 'changePassword',
                        icon: <TbPassword />,
                        label: 'Change Password',
                        onClick: () => {
                          menuClick('/changePassword');
                        },
                      },
                      {
                        type: 'divider',
                      },
                      {
                        key: 'logout',
                        icon: <RiLogoutCircleRLine />,
                        label: 'Logout',
                        onClick: () => {
                          logoutAdmin();
                        },
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              </div>
            );
          },
        }}
      >
        <Outlet />
      </ProLayout>
    </div>
  );
};

export default memo(Layout);
