import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Tag } from 'antd';
import { getProfile } from '../../redux/actions/user';
import { webRoutes } from '../../routes/web';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch<any>(getProfile())
        .then((profile: any) => {
          // console.log(profile, '.profile');
        })
        .catch((err: any) => {
          localStorage.removeItem('token');
          navigate(webRoutes.login, { replace: true });
        });
    }
  }, []);

  const recordId = user?.uniqueId;
  const capitalizeFirstLetter = (str: string) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  };
  const handleUpdate = async () => {
    navigate(`${webRoutes.editProfile}`, { state: { recordId } });
  };
  return (
    <>
      <Card
        style={{
          borderRadius: '12px',
          borderColor: 'rgba(207, 216, 220, 0.7)',
          boxShadow: 'rgba(99, 99, 99, 0.1) 0px 1px 5px 0px',
        }}
      >
        <div className="myprofile_block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="title text-lg font-bold">My Profile Details</h3>
            <Button onClick={handleUpdate}>Edit My Profile</Button>
          </div>

          <Row className="item_wrapper" gutter={30}>
            <Col className="item" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="item">
                <label className="font-bold">Full Name</label>
                <div className="value">{user?.name}</div>
              </div>
            </Col>
            <Col className="item" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="item">
                <label className="font-bold">Email</label>
                <div className="emailValue">{user?.email?.toLowerCase()}</div>
              </div>
            </Col>
          </Row>
          <Row className="item_wrapper" gutter={30}>
            <Col className="item" xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="item">
                <label className="font-bold">Role</label>
                <div className="value">
                  <Tag color={'green'}>
                    {capitalizeFirstLetter(user?.role?.name)}
                  </Tag>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default Profile;
