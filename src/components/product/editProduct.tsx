import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Upload, Button, TreeSelect } from 'antd';
import { DataNode } from 'antd/lib/tree';
import BasePageContainer from '../layout/PageContainer';
import { webRoutes } from '../../routes/web';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
      key: webRoutes.editProduct, // Update with edit product route
      title: <Link to={webRoutes.editProduct}>Edit Product</Link>,
    },
  ],
};

const EditProduct: React.FC = () => {
  const location = useLocation(); // Assuming you have productId in route params
  const { recordId } = location.state;
  const [categoryData, setCategoryData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [value, setValue] = useState<any>([]);
  const [productDetails, setProductDetails] = useState<any>({});
  const [fileList, setFileList] = useState<any>([]);
  const [galleryFileList, setGalleryFileList] = useState([]);
  const [categorySelectedItems, setCategorySelectedItems] = useState<any>({});

  // Fetch product details based on productId
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await http.get(
        `${apiRoutes.getProductDetails}/${recordId}`
      );
      const productDetails = response.data.data;

      setProductDetails(productDetails);

      const productData: any = {
        productName: productDetails.productName,
        productCategory: productDetails.categories.map((cat: any) => cat.id),
        productDescription: productDetails.description,
        productShortDescription: productDetails.productShortDescription,
        regularPrice: productDetails.regularPrice,
        salesPrice: productDetails.salesPrice,
        productTag: productDetails.productTag,
        productSKU: productDetails.productSKU,
        stock: productDetails.stock,
      };

      if (productDetails.image) {
        const fileArray = productDetails.image.split('/');
        productData.productImage = [
          {
            uid: productDetails.uniqueId, // Use a unique identifier for UID
            name: fileArray[fileArray.length - 1],
            status: 'done',
            url: productDetails.image,
          },
        ];
        setFileList([
          {
            uid: productDetails.uniqueId, // Use a unique identifier for UID
            name: fileArray[fileArray.length - 1],
            status: 'done',
            url: productDetails.image,
          },
        ]);
      }

      const selectedCategoryIds = productDetails?.categories?.map(
        (cat: any) => cat.id
      );
      setValue(selectedCategoryIds);

      if (productDetails.gallery) {
        let productGalleryArr: any = [];
        const galleryFiles = productDetails.gallery.map(
          (cat: any, index: number) => {
            const galleryArray = cat.split('/');
            const imageName = galleryArray[galleryArray.length - 1];
            const imageSplit = imageName.split('.').pop();
            const object = {
              uid: `${index}`, // Custom UID combining uniqueId and index
              name: imageName, // Custom name using index
              status: 'done',
              type: `image/${imageSplit}`,
              url: cat,
            };
            productGalleryArr.push(object);
            return object;
          }
        );
        productData.productGallery = productGalleryArr;
        setGalleryFileList(galleryFiles);
      }

      form.setFieldsValue(productData);
      setLoading(false);
    } catch (err: any) {
      // console.log(err, 'fetch data');
      setLoading(false);
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response?.data?.errors[0]
      );
    } finally {
      setLoading(false);
    }
  };

  //  For category
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await http.post(apiRoutes.categoriesFullList, {
        params: {
          search: '',
        },
      });
      const transformedData = transformCategoryData(response.data.data);
      setCategoryData(transformedData);
    } catch (err: any) {
      // console.log(err);
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
    fetchProductDetails();
    fetchCategoryData();
  }, [recordId]);

  useEffect(() => {
    if (categoryData?.length && value?.length) onChange(value, categoryData);
  }, [categoryData?.length, value?.length]);

  const onChange = (newValue: any, categoryDataParam: any = null) => {
    const tempCategoryData = categoryDataParam || categoryData;
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
      const parentNode: any = findParentNode(tempCategoryData, value);
      if (parentNode) {
        // Update categorySelectedItems for parent node
        setCategorySelectedItems((prevItems: any) => ({
          ...prevItems,
          [parentNode.value]: [...(prevItems[parentNode.value] || []), value],
        }));
      } else {
        // Update categorySelectedItems for direct children
        tempCategoryData.some((element: any) => {
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
      setLoading(true);
      const parentCategory: any = Object.keys(categorySelectedItems);
      const subCategories: any = Object.values(categorySelectedItems).flat();
      // setLoading(true);
      form.setFieldsValue({
        parentCategory: parentCategory,
        subCategories: subCategories,
      });

      const formData = new FormData();
      // Append other form fields to formData
      formData.append('productName', values.productName);
      formData.append('productCategory', values.productCategory);
      formData.append('parentCategory', parentCategory);
      formData.append('subCategories', subCategories);
      formData.append('productSKU', values.productSKU);
      formData.append('stock', values.stock ? values.stock : 0);
      formData.append('productDescription', values.productDescription);
      formData.append(
        'productShortDescription',
        values.productShortDescription
      );
      formData.append('regularPrice', values.regularPrice);
      formData.append('salesPrice', values.salesPrice);
      formData.append('productTag', values.productTag);

      // Handle product image update
      // console.log(values.productImage, 'product image');
      // console.log(fileList, 'fileList');

      if (values.productImage && fileList.length > 0) {
        // console.log(fileList[0], 'values.product');
        const productImage = fileList[0].originFileObj;
        formData.append('productImage', productImage);
      }

      // Handle product gallery update
      if (values.productGallery && values.productGallery.length > 0) {
        let productGalleryUploaded: any = '';
        values.productGallery.forEach((file: any, index: any) => {
          if (file.originFileObj === undefined) {
            productGalleryUploaded += `${file.name}`;
            if (index < values.productGallery.length - 1) {
              productGalleryUploaded += ',';
            }
          } else {
            formData.append('productGallery', file.originFileObj);
          }
        });
        formData.append('productGalleryUploaded', productGalleryUploaded);
      }
      // console.log(values, 'product Image');
      await http.put(`${apiRoutes.editProduct}/${recordId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(webRoutes.products, { replace: true });
      setLoading(false);
      showNotification(
        'Success',
        NotificationType.SUCCESS,
        'Product updated successfully'
      );
    } catch (err: any) {
      // console.log(err, '-====-');
      setLoading(false);
      showNotification(
        'Error',
        NotificationType.ERROR,
        err.response?.data?.msg
      );
    }
  };

  return (
    <>
      {loading && <LoaderNew />}
      <BasePageContainer breadcrumb={breadcrumb}>
        <h2 className="text-xl font-bold mt-2 mb-4">Edit Product</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            productName: productDetails.productName,
            productCategory: productDetails.categories
              ? productDetails.categories.map((cat: any) => cat.id)
              : [],
            productDescription: productDetails.description,
            productShortDescription: productDetails.productShortDescription,
            regularPrice: productDetails.regularPrice,
            salesPrice: productDetails.salesPrice,
            productTag: productDetails.productTag,
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
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  value={value}
                  placeholder="Please select a category"
                  // allowClear
                  treeCheckable
                  multiple
                  treeDefaultExpandAll
                  showCheckedStrategy={TreeSelect.SHOW_PARENT}
                  onChange={onChange}
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
                  rows={2}
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
              <Form.Item name="stock" label="Total Stocks">
                <Input placeholder="Total product stocks" />
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
                    setFileList(newFileList);
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
                valuePropName="galleryFileList"
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
                  fileList={galleryFileList}
                  beforeUpload={() => false}
                  onChange={(info) => {
                    const validatedFiles: any = [];
                    // console.log(info, 'info+++');
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
                  <Button htmlType="submit">Update</Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </BasePageContainer>
    </>
  );
};

export default EditProduct;
