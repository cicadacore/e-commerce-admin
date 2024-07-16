import { useState, useEffect } from 'react';
import {
  Table,
  Modal,
  Switch,
  Drawer,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
  Typography,
  Image,
} from 'antd';
import { Link } from 'react-router-dom';
import { IoCloseCircle } from 'react-icons/io5';
import { MdModeEditOutline } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa';
import LoaderNew from '../loader/loader';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import { NotificationType, showNotification } from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';
import { LuUpload } from 'react-icons/lu';
import { toast } from 'sonner';

const { confirm } = Modal;
const { Option } = Select;
const { Text } = Typography;

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.categories,
      title: <Link to={webRoutes.categories}>Categories</Link>,
    },
  ],
};

const ActionKey = {
  DELETE: 'delete',
  EDIT: 'edit',
  VIEW: 'view',
};

const Categories = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [Draweropen, setDrawerOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<any>({});
  const [formDrawer, setFormDrawer] = useState(false);
  const [formDrawerUpdate, setFormDrawerUpdate] = useState(false);
  const [uniqueId, setUniqueId] = useState('');
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [editData, setEditData] = useState<any>(null); // State to hold data for editing
  const [fileList, setFileList] = useState<any>([]);
  const [editFileList, setEditFileList] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData({ current, pageSize, searchQuery, filterStatus });
  }, [current, pageSize]);

  const fetchData = async (params: any) => {
    setLoading(true);
    try {
      const response = await http.post(apiRoutes.categories, {
        params: {
          page: params.current,
          per_page: params.pageSize,
          search: params.searchQuery, // Pass the search query to the API
          status: filterStatus,
        },
      });
      setData(response.data.data);
      setTotal(response.data.totalCount);
    } catch (err: any) {
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response.data.errors[0]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActionOnSelect = async (action: any, category: any) => {
    if (action === ActionKey.EDIT) {
      try {
        const response = await http.get(
          `${apiRoutes.getCategoryDetail}/${category.uniqueId}`
        );
        const responseData = response.data.data;
        setEditData(responseData);
        setUniqueId(responseData.uniqueId);
        setEditFileList([responseData]);
        formUpdate.setFieldsValue({
          title: responseData.title,
          slug: responseData.slug,
          description: responseData.description,
          status: responseData.status,
          parentCategory: responseData.parentCategory,
          thumbnail: [
            {
              uid: responseData.uniqueId,
              name: 'test',
              url: responseData.thumbnail,
            },
          ], // Clear thumbnail field since editing existing data
        });
        setEditFileList([
          {
            uid: responseData.uniqueId,
            name: 'test',
            url: responseData.thumbnail,
          },
        ]);
        setFormDrawerUpdate(true);
      } catch (err: any) {
        showNotification(
          'Error',
          NotificationType.ERROR,
          err.response.data.errors[0]
        );
      } finally {
        setLoading(false);
      }
    } else if (action === ActionKey.DELETE) {
      showDeleteConfirmation(category);
    }
  };

  const showDeleteConfirmation = (category: any) => {
    Modal.confirm({
      title: 'Are you sure to delete this category?',
      okButtonProps: {
        className: 'bg-primary',
      },
      onOk: async () => {
        try {
          await http.delete(`${apiRoutes.deleteCategory}`, {
            data: { uniqueId: category.uniqueId },
          });
          Modal.success({
            title: 'Success',
            content: 'Category is deleted.',
          });
          fetchData({ current, pageSize });
        } catch (err: any) {
          // console.error(err);
          Modal.error({
            title: 'Error',
            content: err.response?.data?.msg || 'An error occurred',
            okType: 'default',
          });
        }
      },
    });
  };

  const handleStatusChange = async (uniqueId: string, checked: boolean) => {
    const newStatus = checked ? 1 : 0;
    try {
      const apiStatus = await http.post(
        `${apiRoutes.changeCategoryStatus}/${uniqueId}`,
        {
          status: newStatus,
        }
      );
      // console.log(apiStatus, '=-=-=-=-=-');
      if (apiStatus.status === 201) {
        showNotification(
          'Success',
          NotificationType.SUCCESS,
          apiStatus.data.msg
        );
      } else {
        showNotification(
          'Success',
          NotificationType.SUCCESS,
          `Category status is now ${checked ? 'Active' : 'Inactive'}.`
        );
      }

      fetchData({ current, pageSize });
    } catch (err: any) {
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response.data.errors[0]
      );
    }
  };

  const handleDrawerOpen = async (category: any) => {
    try {
      // console.log('category', category);
      const uniqueId = category.uniqueId;
      const res = await http.get(`${apiRoutes.getCategoryDetail}/${uniqueId}`);
      setCategoryData(res.data.data);
      setDrawerOpen(true);
    } catch (err: any) {
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response.data.errors[0]
      );
    }
  };

  const onClose = () => {
    setDrawerOpen(false);
    setFormDrawerUpdate(false);
    setFormDrawer(false);
    setEditData(null);
    setFileList([]);
  };

  const handleSubmitForm = async (values: any) => {
    // console.log(values, 'handleSubmitForm');
    // return;
    try {
      const formData = new FormData();
      if (values.thumbnail && values.thumbnail.length > 0) {
        formData.append('thumbnail', values.thumbnail[0].originFileObj);
      }

      formData.append('title', values.title);
      formData.append('slug', values.slug);
      formData.append('description', values.description);
      formData.append('status', values.status.toString()); // Convert boolean to string if needed
      if (values.parentCategory) {
        formData.append('parentCategory', values.parentCategory);
      }

      // Simulate API call or perform actual HTTP POST request with formData
      await http.post(apiRoutes.addCategory, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      form.resetFields();

      onClose();
      fetchData({ current, pageSize });
      setFileList([]);
      toast.success('Category added successfully!', {
        duration: 1500,
      });
    } catch (err: any) {
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response.data.errors[0]
      );
    }
  };
  const handleUpdateSubmitForm = async (values: any) => {
    try {
      const formData = new FormData();
      if (values.thumbnail && values.thumbnail.length > 0) {
        formData.append('thumbnail', values.thumbnail[0].originFileObj);
      }

      formData.append('title', values.title);
      formData.append('slug', values.slug);
      formData.append('description', values.description);
      formData.append('status', values.status.toString()); // Convert boolean to string if needed
      if (values.parentCategory) {
        formData.append('parentCategory', values.parentCategory);
      }
      // Simulate API call or perform actual HTTP POST request with formData
      await http.put(`${apiRoutes.editCategory}/${uniqueId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      setUniqueId('');
      setEditData(null);
      formUpdate.resetFields();
      onClose();
      fetchData({ current, pageSize });
      toast.success('Category updated successfully!', {
        duration: 1500,
      });
    } catch (err: any) {
      // handleErrorResponse(err);
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response.data.errors[0]
      );
    }
  };

  const dataWithKeys: any = data.map((item: any, index: any) => ({
    ...item,
    customId: index + 1, // Generate a unique key
  }));

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'customId',
      width: '4%',
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '12%',
      align: 'center',
      sorter: (a: any, b: any) => a.title.localeCompare(b.title),
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '34%',
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
      render: (text: any) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      align: 'center',
      width: '14%',
      ellipsis: true,
    },
    {
      title: 'Parent Category',
      dataIndex: 'parentCategoryDetails',
      align: 'center',
      width: '12%',
      ellipsis: true,
      render: (parentCategoryDetails: any) => {
        return parentCategoryDetails ? parentCategoryDetails.title : 'NULL';
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      key: 'status',
      render: (status: any, record: any) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.uniqueId, checked)}
        />
      ),
      // filters: [
      //   {
      //     text: 'Active',
      //     value: '1',
      //   },
      //   {
      //     text: 'Inactive',
      //     value: '0',
      //   },
      // ],
      // onFilter: (value: any, record: any) =>
      //   record.address.startsWith(value as string),
      // filterSearch: false,
    },
    {
      title: 'Action',
      align: 'center',
      width: '14%',
      key: 'option',
      fixed: 'right',
      render: (_: any, row: any) => (
        <Space>
          <Button
            icon={<FaRegEye />}
            onClick={() => handleDrawerOpen(row)}
          ></Button>
          <Button
            icon={<MdModeEditOutline />}
            onClick={() => handleActionOnSelect(ActionKey.EDIT, row)}
          ></Button>
          <Button
            icon={<AiOutlineDelete />}
            onClick={() => handleActionOnSelect(ActionKey.DELETE, row)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleShowForm = () => {
    setFormDrawer(true);
    form.resetFields();
  };

  const handleFormStatusChange = (checked: boolean) => {
    form.setFieldsValue({ status: checked });
  };

  const handleSearch = () => {
    setCurrent(1);
    setPageSize(10);
    fetchData({ current, pageSize, searchQuery });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrent(1);
    setPageSize(10);
    fetchData({ current: 1, pageSize: 10, searchQuery: '' });
  };

  const onTitleChange = (e: any) => {
    const titleValue = e.target.value;
    const slugValue = titleValue.toLowerCase().trim().replace(/\s+/g, '-');
    if (!editData) form.setFieldsValue({ slug: slugValue });
    if (editData) formUpdate.setFieldsValue({ slug: slugValue });
  };

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setCurrent(current);
    setPageSize(pageSize);
  };

  return (
    <>
      {loading && <LoaderNew type="block" />}
      <BasePageContainer breadcrumb={breadcrumb}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Category List</h2>
          <div className="justify-end flex mb-2">
            <Button onClick={handleShowForm}>Add Category</Button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center mb-1">
            <Input
              placeholder="Search categories"
              value={searchQuery}
              onChange={(e) => {
                if (e.target.value === '') {
                  handleClearSearch();
                }
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery !== '') {
                  handleSearch();
                }
              }}
              style={{ marginRight: 8 }}
              suffix={
                searchQuery.length > 0 ? (
                  <IoCloseCircle
                    style={{ color: 'rgba(0, 0, 0, 0.45)', cursor: 'pointer' }}
                    onClick={() => {
                      handleClearSearch();
                    }}
                  />
                ) : (
                  <></>
                )
              }
            />
            <Select
              defaultValue="all"
              style={{ width: 150, marginRight: '8px' }}
              onChange={(value) => setFilterStatus(value)}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <Table
          rowKey="uniqueId"
          dataSource={dataWithKeys}
          // loading={loading}
          columns={columns}
          pagination={{
            current,
            pageSize,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
          bordered
        />
      </BasePageContainer>
      <Drawer
        title="Category Detail"
        placement="right"
        closable={false}
        onClose={onClose}
        open={Draweropen}
      >
        {categoryData && (
          <div>
            <p>
              <Text strong>ID:</Text> {categoryData.uniqueId}
            </p>
            <p>
              <Text strong>Title:</Text> {categoryData.title}
            </p>
            <p>
              <Text strong>Description:</Text> {categoryData.description}
            </p>
            <p>
              <Text strong>Slug:</Text> {categoryData.slug}
            </p>
            <p>
              <Text strong>Status:</Text>{' '}
              {categoryData.status ? 'Active' : 'Inactive'}
            </p>
            <p>
              <Text strong>Thumbnail:</Text>{' '}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
                marginTop: 16,
              }}
            >
              {categoryData.thumbnail && (
                <div
                  style={{
                    width: 200,
                    overflow: 'hidden',
                  }}
                >
                  <Image src={categoryData.thumbnail} />
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
      <Drawer
        title="Category Detail"
        width={720}
        onClose={onClose}
        open={formDrawer}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => form.submit()}>Submit</Button>
          </Space>
        }
      >
        <Form
          form={form}
          name="addCategoryForm"
          layout="vertical"
          onFinish={handleSubmitForm}
          initialValues={{
            status: true,
            parentCategory: '',
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Name"
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Input placeholder="title" onChange={onTitleChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Slug is required' }]}
              >
                <Input placeholder="Slug" readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter url description"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="parentCategory" label="Parent Category">
                <Select placeholder="Please select any category">
                  <Option value="">No parent</Option>
                  {data.map((item: any) => {
                    return item.parentCategory === null ? (
                      <Option key={item.uniqueId} value={item.id}>
                        {item.title}
                      </Option>
                    ) : null;
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Category Status"
                valuePropName="checked"
              >
                <Switch
                  checked={true}
                  onChange={() => handleFormStatusChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="thumbnail"
                label="Image"
                rules={[{ required: true, message: 'Please upload an image' }]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    let newFileList: any = [...info.fileList];
                    newFileList = newFileList.slice(-2);
                    newFileList = newFileList.map((file: any) => {
                      if (file.response) {
                        file.url = file.response.url;
                      }
                      return file;
                    });
                    setFileList(newFileList);
                    // Manually set thumbnail field in form when file selected
                    if (info.fileList.length > 0) {
                      form.setFieldsValue({ thumbnail: info.fileList });
                    } else {
                      form.setFieldsValue({ thumbnail: undefined });
                    }
                  }}
                >
                  <Button icon={<LuUpload />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Drawer
        title="Update Category"
        width={720}
        onClose={onClose}
        open={formDrawerUpdate}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => formUpdate.submit()}>Update</Button>
          </Space>
        }
      >
        <Form
          form={formUpdate}
          layout="vertical"
          onFinish={handleUpdateSubmitForm}
          initialValues={{
            status: editData ? editData.status : false,
            parentCategory: editData ? editData.parentCategory : '',
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Name"
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Input placeholder="title" onChange={onTitleChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: 'Slug is required' }]}
              >
                <Input placeholder="Slug" readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter url description"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="parentCategory" label="Parent Category">
                <Select placeholder="Please select any category">
                  <Option value="">No parent</Option>
                  {data.map((item: any) =>
                    item.parentCategory === null &&
                    item.uniqueId != uniqueId ? (
                      <Option key={item.uniqueId} value={item.id}>
                        {item.title}
                      </Option>
                    ) : null
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Category Status"
                valuePropName="checked"
              >
                <Switch
                  checked={true}
                  onChange={() => handleFormStatusChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="thumbnail"
                label="Image"
                rules={[{ required: true, message: 'Please upload an image' }]}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  fileList={editFileList}
                  beforeUpload={() => false} // Prevents automatic upload
                  onChange={(info) => {
                    // console.log(info, 'on chnage');
                    let newFileList: any = [...info.fileList];
                    newFileList = newFileList.slice(-2);
                    newFileList = newFileList.map((file: any) => {
                      if (file.response) {
                        file.url = file.response.url;
                      }
                      return file;
                    });
                    setEditFileList(newFileList);
                    // Manually set thumbnail field in form when file selected
                    if (info.fileList.length > 0) {
                      formUpdate.setFieldsValue({ thumbnail: info.fileList });
                    } else {
                      formUpdate.setFieldsValue({ thumbnail: undefined });
                    }
                  }}
                >
                  <Button icon={<LuUpload />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default Categories;
