import { useState, useEffect } from 'react';
import {
  Table,
  Modal,
  Drawer,
  Button,
  Space,
  Typography,
  Image,
  Switch,
  Input,
  TreeSelect,
  Select,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { IoCloseCircle } from 'react-icons/io5';
import { MdModeEditOutline } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegEye } from 'react-icons/fa';
import { apiRoutes } from '../../routes/api';
import { webRoutes } from '../../routes/web';
import {
  handleErrorResponse,
  NotificationType,
  showNotification,
} from '../../utils';
import http from '../../utils/http';
import BasePageContainer from '../layout/PageContainer';

const { confirm } = Modal;
const { Text } = Typography;
const { Option } = Select;

const breadcrumb = {
  items: [
    {
      key: webRoutes.dashboard,
      title: <Link to={webRoutes.dashboard}>Dashboard</Link>,
    },
    {
      key: webRoutes.products,
      title: <Link to={webRoutes.products}>Products</Link>,
    },
  ],
};

const ActionKey = {
  DELETE: 'delete',
  EDIT: 'edit',
  VIEW: 'view',
};

const Product = () => {
  const [categoryData, setCategoryData] = useState<any>([]);
  const [value, setValue] = useState<string>('all');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [Draweropen, setDrawerOpen] = useState(false);
  const [productData, setProductData] = useState<any>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImages, setPreviewImages] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoryData();
  }, []);
  useEffect(() => {
    fetchData({ current, pageSize, searchQuery, value, filterStatus });
  }, [current, pageSize]);

  const fetchData = async (params: any) => {
    try {
      setLoading(true);
      const response = await http.post(apiRoutes.products, {
        params: {
          page: params.current,
          per_page: params.pageSize,
          search: params.searchQuery,
          value: params.newValue ?? value,
          status: filterStatus,
        },
      });
      setData(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await http.post(apiRoutes.categoriesFullList, {
        params: {
          search: '', // Pass the search query to the API
        },
      });
      const transformedData = transformCategoryData(response.data.data);
      setCategoryData(transformedData);
    } catch (err: any) {
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response?.data?.errors[0]
      );
    } finally {
      setLoading(false);
    }
  };
  const transformCategoryData = (
    data: any,
    addAllCategories: boolean = true
  ) => {
    const transformed = data.map((item: any) => ({
      title: item.title,
      value: item.id,
      key: item.id,
      children: item.children
        ? transformCategoryData(item.children, false)
        : [],
    }));

    // Add "All Categories" option only at the top level
    if (addAllCategories) {
      transformed.unshift({
        title: 'All Categories',
        value: 'all',
        key: 'all',
        children: [],
      });
    }

    return transformed;
  };

  const handleActionOnSelect = async (action: any, product: any) => {
    if (action === ActionKey.EDIT) {
      // console.log(product, '-=-=-=-=-=-=- product');
      navigate(`${webRoutes.editProduct}`, {
        state: { recordId: product?.uniqueId },
      });
    } else if (action === ActionKey.DELETE) {
      showDeleteConfirmation(product);
    }
  };

  const showDeleteConfirmation = (product: any) => {
    confirm({
      title: `Are you sure to delete this product?`,
      okButtonProps: {
        className: 'bg-primary',
      },
      onOk: async () => {
        try {
          await http.delete(`${apiRoutes.deleteProduct}`, {
            data: { uniqueId: product.uniqueId },
          });
          showNotification(
            'Success',
            NotificationType.SUCCESS,
            'Product is deleted.'
          );
          fetchData({ current, pageSize });
        } catch (error) {
          handleErrorResponse(error);
        }
      },
    });
  };

  const handleStatusChange = async (uniqueId: string, checked: boolean) => {
    const newStatus = checked ? 1 : 0;
    try {
      await http.post(`${apiRoutes.changeProductStatus}/${uniqueId}`, {
        status: newStatus,
      });
      showNotification(
        'Success',
        NotificationType.SUCCESS,
        `Product status is now ${checked ? 'Active' : 'Inactive'}.`
      );
      fetchData({ current, pageSize });
    } catch (err: any) {
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response.data.errors[0]
      );
    }
  };

  const handleDrawerOpen = async (product: any) => {
    try {
      const uniqueId = product.uniqueId;
      const res = await http.get(`${apiRoutes.getProductDetails}/${uniqueId}`);
      setProductData(res.data.data);
      setDrawerOpen(true);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const onClose = () => {
    setDrawerOpen(false);
  };
  const columns: any = [
    {
      title: 'Index',
      dataIndex: 'index',
      width: '4%',
      fixed: 'left',
      align: 'center',
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'title',
      width: '13%',
      align: 'center',
      sorter: (a: any, b: any) => a.title.localeCompare(b.title),
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '31%',
      sorter: (a: any, b: any) => a.description.localeCompare(b.description),
      render: (text: any) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Regular Price',
      dataIndex: 'regularPrice',
      width: '10%',
      sorter: (a: any, b: any) => a.regularPrice - b.regularPrice,
      render: (text: any) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Sales Price',
      dataIndex: 'salesPrice',
      width: '10%',
      sorter: (a: any, b: any) => a.salesPrice - b.salesPrice,
      render: (text: any) => (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      key: 'status',
      ellipsis: true,
      render: (status: any, record: any) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.uniqueId, checked)}
        />
      ),
    },
    {
      title: 'Action',
      align: 'center',
      width: '20%',
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

  const handleAddProduct = () => {
    navigate(webRoutes.addProduct, { replace: true });
  };

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setCurrent(current);
    setPageSize(pageSize);
  };
  const handleSearch = () => {
    setCurrent(1);
    setPageSize(5);
    fetchData({ current, pageSize, searchQuery, value });
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrent(1);
    setPageSize(5);
    fetchData({ current: 1, pageSize: 5, searchQuery: '' });
  };

  const onChange = (newValue: any) => {
    setValue(newValue);
    // console.log(newValue);
    fetchData({ current, pageSize, searchQuery, newValue });
  };

  const handleCloseDrawer = () => {
    onClose(); // Call the onClose function passed from props to close the drawer
  };

  return (
    <>
      <BasePageContainer breadcrumb={breadcrumb}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Product List</h2>
          <div className="justify-end flex mb-2">
            <Button onClick={handleAddProduct}>Add Product</Button>
          </div>
        </div>
        <div className="flex items-center mb-3">
          {/* Search Input and Button */}
          <div className="flex" style={{ marginRight: '8px' }}>
            <Input
              placeholder="Search Product"
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
              style={{ width: '250px', marginRight: '4px' }}
              suffix={
                searchQuery.length > 0 ? (
                  <IoCloseCircle
                    style={{
                      color: 'rgba(0, 0, 0, 0.45)',
                      cursor: 'pointer',
                    }}
                    onClick={handleClearSearch}
                  />
                ) : (
                  <></>
                )
              }
            />
            {/* TreeSelect */}
            <TreeSelect
              showSearch={false}
              style={{ width: '200px' }}
              dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
              value={value}
              placeholder="Please select a category"
              treeDefaultExpandAll
              onChange={onChange}
              treeData={categoryData}
              key="tree-select-category"
            />
            <Select
              defaultValue="all"
              style={{ width: 150, marginLeft: '8px' }}
              onChange={(value) => setFilterStatus(value)}
            >
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
            <Button
              onClick={handleSearch}
              style={{ minWidth: '80px', marginLeft: '8px' }}
            >
              Search
            </Button>
          </div>
        </div>

        <Table
          rowKey="uniqueId"
          dataSource={data}
          loading={loading}
          columns={columns}
          pagination={{
            current,
            pageSize,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
          bordered
        />
      </BasePageContainer>
      <Drawer
        // title="Product Detail"
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Product Detail</span>
            <Button
              type="text"
              onClick={handleCloseDrawer}
              icon={<IoClose />}
            />
          </div>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={Draweropen}
      >
        {productData && (
          <div>
            <p>
              <Text strong>ID:</Text> {productData.uniqueId}
            </p>
            <p>
              <Text strong>Product Name:</Text> {productData.productName}
            </p>
            <p>
              <Text strong>Description:</Text> {productData.description}
            </p>
            <p>
              <Text strong>Product Short Description:</Text>{' '}
              {productData.productShortDescription}
            </p>
            <p>
              <Text strong>Regular Price:</Text> $ {productData.regularPrice}
            </p>
            <p>
              <Text strong>Sales Price:</Text> $ {productData.salesPrice}
            </p>
            <p>
              <Text strong>Product Tag:</Text> {productData.productTag}
            </p>
            <p>
              <Text strong>Status:</Text>{' '}
              {productData.status ? 'Active' : 'Inactive'}
            </p>
            <p>
              <Text strong>Categories:</Text>
            </p>
            <ul>
              {productData.categories?.map((category: any) => (
                <li key={category.id}>
                  {category.title}
                  {/* {category.parentCategory &&
                    ` (Parent: ${
                      productData.categories.find(
                        (c: any) => c.id === category.parentCategory
                      )?.title
                    })`} */}
                </li>
              ))}
            </ul>
            <p>
              <Text strong>Image:</Text>{' '}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Image src={productData.image} width={200} />
            </div>
            {productData.gallery && (
              <p>
                <Text strong>Gallery:</Text>{' '}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              {productData.gallery && productData.gallery.length > 0 && (
                <Image
                  src={productData.gallery[0]}
                  width={200}
                  onClick={() => {
                    setPreviewImages(productData.gallery);
                    setPreviewVisible(true);
                  }}
                />
              )}
              {previewImages.length > 0 && (
                <Image.PreviewGroup
                  preview={{
                    visible: previewVisible,
                    onVisibleChange: (visible) => {
                      setPreviewVisible(visible);
                      if (!visible) {
                        setPreviewImages([]);
                      }
                    },
                  }}
                >
                  {previewImages.map((img: any, index: any) => (
                    <Image
                      key={index}
                      src={img}
                      width={200}
                      style={{ marginRight: 8 }}
                    />
                  ))}
                </Image.PreviewGroup>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Product;
