import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Upload, Button, TreeSelect, Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import BasePageContainer from '../layout/PageContainer';
import { webRoutes } from '../../routes/web';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineDriveFolderUpload } from 'react-icons/md';
import http from '../../utils/http';
import { apiRoutes } from '../../routes/api';
import LoaderNew from '../loader/loader';
import { NotificationType, showNotification } from '../../utils';

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
    {
      key: webRoutes.addProduct,
      title: <Link to={webRoutes.addProduct}>Add Product</Link>,
    },
  ],
};

const AddProduct: React.FC = () => {
  const [categoryData, setCategoryData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [value, setValue] = useState<string>();
  const [fileList, setFileList] = useState<any>([]);
  const [galleryFileList, setGalleryFileList] = useState([]);
  const [categorySelectedItems, setCategorySelectedItems] = useState<any>({});

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
  const transformCategoryData = (data: any) => {
    return data.map((item: any) => ({
      title: item.title,
      value: item.id,
      key: item.id,
      children: item.children ? transformCategoryData(item.children) : [],
    }));
  };

  useEffect(() => {
    fetchCategoryData();
    // setSearchQuery('');
  }, []);

  const onChange = (newValue: any) => {
    // Delete items that are not included in newValue
    Object.keys(categorySelectedItems).forEach((item) => {
      if (!newValue.includes(item)) {
        setCategorySelectedItems((prevItems: any) => {
          const tempCategorySelectedItems = { ...prevItems };
          delete tempCategorySelectedItems[item];
          return tempCategorySelectedItems;
        });
      }
    });
    // Iterate through selected values
    newValue.forEach((value: string) => {
      // Find the parent node for each selected child
      const parentNode: any = findParentNode(categoryData, value);
      if (parentNode) {
        // Update categorySelectedItems for parent node
        setCategorySelectedItems((prevItems: any) => ({
          ...prevItems,
          [parentNode.value]: [...(prevItems[parentNode.value] || []), value],
        }));
      } else {
        // Update categorySelectedItems for direct children
        categoryData.some((element: any) => {
          const isTrue = element.key === value;
          if (isTrue) {
            setCategorySelectedItems((prevItems: any) => ({
              ...prevItems,
              [value]: element.children.map((item: any) => item.value),
            }));
          }
          return isTrue;
        });
      }
    });
    setValue(newValue);
  };
  const findParentNode = (
    treeData: DataNode[],
    childValue: string
  ): DataNode | undefined => {
    for (let node of treeData) {
      if (node.children) {
        // Check if the childValue is among the node's children
        const foundChild = node.children.find(
          (child: any) => child.value === childValue
        );
        if (foundChild) {
          return node;
        } else {
          // Recursively search in children nodes
          const parentNode = findParentNode(node.children, childValue);
          if (parentNode) {
            return parentNode;
          }
        }
      }
    }
    return undefined;
  };

  const handleFinish = async (values: any) => {
    try {
      // Handle form submission
      // console.log('Form values:', values);

      const parentCategory: any = Object.keys(categorySelectedItems);
      const subCategories: any = Object.values(categorySelectedItems).flat();
      // setLoading(true);
      form.setFieldsValue({
        parentCategory: parentCategory,
        subCategories: subCategories,
      });

      const formData = new FormData();
      formData.append('productName', values.productName);
      formData.append('parentCategory', parentCategory);
      formData.append('subCategories', subCategories);
      formData.append('productDescription', values.productDescription);
      formData.append(
        'productShortDescription',
        values.productShortDescription
      );
      formData.append('regularPrice', values.regularPrice);
      formData.append('salesPrice', values.salesPrice);
      formData.append('productTag', values.productTag);
      formData.append('productSKU', values.productSKU);
      formData.append('stock', values.stock);

      // console.log(values.productImage, 'values.productImage ');
      // console.log(fileList, 'fileList ');
      if (values.productImage && fileList.length > 0) {
        const productImage = values.productImage[0].originFileObj;
        formData.append('productImage', productImage);
      }
      // Append productGallery files (assuming an array of files)
      if (values.productGallery && galleryFileList.length > 0) {
        values.productGallery.forEach((file: any) => {
          formData.append('productGallery', file.originFileObj);
        });
      }
      if (values.productGallery) {
        let galleryErrors = false;
        values.productGallery.forEach((file: any) => {
          if (
            !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
              file.type
            )
          ) {
            galleryErrors = true;
            showNotification(
              'Error',
              NotificationType.ERROR,
              'You can only upload JPEG/JPG/PNG/GIF files in the gallery!'
            );
          }
        });

        if (galleryErrors) {
          return;
        }
      }
      // console.log(formData, 'formData');
      // return;
      await http.post(apiRoutes.addProduct, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      form.resetFields();
      navigate(webRoutes.products, { replace: true });
      showNotification(
        'Success',
        NotificationType.SUCCESS,
        'Product added successfully'
      );
    } catch (err: any) {
      setLoading(false);
      // console.log(err);
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response?.data?.errors[0]
      );
    }
  };

  const beforeUpload = (file: any) => {
    const isImage = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ].includes(file[0].type);
    if (!isImage) {
      showNotification(
        'Error',
        NotificationType.ERROR,
        'You can only upload JPG/PNG/GIF file!'
      );
    }
    return isImage;
  };

  return (
    <>
      {loading && <LoaderNew />}
      <BasePageContainer breadcrumb={breadcrumb}>
        <h2 className="text-xl font-bold mt-2 mb-4">Add Product</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          scrollToFirstError
          initialValues={{
            productCategory:
              categoryData.length > 0 ? categoryData[0].value : undefined,
            parentCategory: Object.keys(categorySelectedItems),
            subCategory: [],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="Name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="Please enter name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productCategory"
                label="Category"
                rules={[
                  { required: true, message: 'Please select a category' },
                ]}
              >
                <TreeSelect
                  showSearch={false}
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  value={value}
                  placeholder="Please select a category"
                  allowClear
                  treeCheckable
                  multiple
                  // treeDefaultExpandAll
                  showCheckedStrategy={TreeSelect.SHOW_PARENT}
                  onChange={onChange}
                  // onSelect={(value) => {
                  //   console.log(value);
                  // }}
                  treeData={categoryData}
                  key="tree-select-category"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="productDescription"
                label="Description"
                rules={[
                  { required: true, message: 'Please enter description' },
                  {
                    min: 150,
                    message: 'Description must be at least 150 characters',
                  },
                  {
                    max: 500,
                    message: 'Description must be at most 500 characters',
                  },
                ]}
                help={
                  form.getFieldError('productDescription') &&
                  form.getFieldError('productDescription')[0]
                }
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Please enter description"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="productShortDescription"
                label="Short Description"
                rules={[
                  { required: true, message: 'Please enter short description' },
                  {
                    min: 50,
                    message: 'Short Description must be at least 50 characters',
                  },
                  {
                    max: 150,
                    message: 'Short Description must be at most 150 characters',
                  },
                ]}
                help={
                  form.getFieldError('productShortDescription') &&
                  form.getFieldError('productShortDescription')[0]
                }
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Please enter short description"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="regularPrice"
                label="Regular Price"
                rules={[
                  { required: true, message: 'Please enter regular price' },
                ]}
              >
                <Input placeholder="Please enter regular price" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="salesPrice"
                label="Sales Price"
                rules={[
                  { required: true, message: 'Please enter sales price' },
                ]}
              >
                <Input placeholder="Please enter sales price" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="productSKU"
                label="SKU"
                rules={[
                  { required: true, message: 'Please enter SKU of product' },
                ]}
              >
                <Input placeholder="Please enter SKU number" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="stock"
                label="Total Stocks"
                rules={[
                  { required: true, message: 'Please enter stock number' },
                ]}
              >
                <Input placeholder="Please enter stock number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productTag"
                label="Tag"
                rules={[{ required: true, message: 'Please enter tag' }]}
              >
                <Input placeholder="Please enter tag" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productImage"
                label="Image"
                rules={[{ required: true, message: 'Please upload image' }]}
              >
                <Upload
                  name="productImage"
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
                    const beforeUploadOutput = beforeUpload(newFileList);
                    if (beforeUploadOutput) {
                      setFileList(newFileList);
                      // Manually set productImage field in form when file selected
                      if (info.fileList.length > 0) {
                        form.setFieldsValue({ productImage: info.fileList });
                      } else {
                        form.setFieldsValue({ productImage: undefined });
                      }
                    }
                  }}
                >
                  <Button icon={<MdOutlineDriveFolderUpload />}>
                    Upload Image
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productGallery"
                label="Gallery"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  if (e && e.fileList) {
                    return e.fileList;
                  }
                  return [];
                }}
              >
                <Upload
                  name="productGallery"
                  listType="picture"
                  multiple
                  maxCount={5}
                  // fileList={}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    const validatedFiles: any = [];
                    // Validate each file type
                    info.fileList.forEach((file: any) => {
                      const isImage = [
                        'image/jpeg',
                        'image/jpg',
                        'image/png',
                        'image/gif',
                      ].includes(file.type);
                      if (isImage) {
                        validatedFiles.push(file);
                        // Upload.LIST_IGNORE;
                      } else {
                        showNotification(
                          'Error',
                          NotificationType.ERROR,
                          'You can only upload JPG/PNG/GIF files!'
                        );
                      }
                    });

                    // Keep only the last five validated files
                    const newFileList = validatedFiles.slice(-5);

                    // console.log(newFileList, 'fileList array length');
                    setGalleryFileList(newFileList);
                  }}
                >
                  <Button icon={<MdOutlineDriveFolderUpload />}>
                    Upload Gallery
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <div className="flex justify-end items-center mb-4">
                  <Button htmlType="submit">Submit</Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </BasePageContainer>
    </>
  );
};

export default AddProduct;
