import { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, notification, Select, Upload, Tooltip, Row, Col } from "antd";
import { createVaccine } from "@/services/ApiServices/vaccineService";
import { InfoCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { getAllVaccineCategories } from "@/services/ApiServices/vaccineCategoryService";
import { getCountries } from "@/services/CountriesService";

const { Option } = Select;

const CreateVaccineDialog = ({
  isModalOpen,
  setIsModalOpen,
  fetchVaccines
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchVaccines: any;
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [minAge, setMinAge] = useState<any | null>(null);
  const [maxAge, setMaxAge] = useState<any | null>(null);
  const [vaccineCategories, setVaccineCategories] = useState<any>([]);
  const [fileList, setFileList] = useState<any>([]);
  const [mainImage, setMainImage] = useState<any>(null);
  const [countriesList, setCountriesList] = useState<any[]>([]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    if (!mainImage && newFileList.length > 0) {
      setMainImage(newFileList[0]);
    }
  };

  const handlePreview = (file: any) => {
    setMainImage(file);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllVaccineCategories();
        console.log(categories.vaccineCategories)
        setVaccineCategories(categories.vaccineCategories);
      } catch (error) {
        console.error('Failed to fetch vaccine categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const countries = getCountries();
    setCountriesList(countries);
  }, []);

  const handleCreate = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        console.log("Vaccine Data:", values);

        const recommendedAgeRange = `${values.minAge}-${values.maxAge}`;

        try {
          if (fileList.length === 0) {
            notification.warning({ message: "Please upload at least one image!" });
            return;
          }

          const formData = new FormData();

          // Append text fields
          formData.append("Name", values.name);
          formData.append("Description", values.description || "");
          formData.append("RecommendedAgeRange", recommendedAgeRange);
          formData.append("Contraindications", values.contraindications);
          formData.append("UsageInstructions", values.usageInstructions || "");
          formData.append("Dose", values.dose);
          formData.append("TargetDisease", values.targetDisease || "");
          formData.append("Unit", values.unitType);
          formData.append("Country", values.country || "");
          formData.append("Producer", values.producer || "");
          formData.append("Quantity", values.quantity);
          formData.append('VaccineCategoryId', values.vaccineCategoryId);
          formData.append("Price", values.price);
          formData.append("Status", values.status);

          fileList.forEach((file: any) => {
            formData.append('files', file.originFileObj);
          });

          await createVaccine(formData);

          notification.success({
            message: "Vaccine Created Successfully",
            description: `The vaccine "${values.name}" has been added.`,
          });
          setIsModalOpen(false);
          form.resetFields();
          await fetchVaccines();
        } catch (error) {
          notification.error({
            message: "Failed to Create Vaccine",
            description: "An error occurred while adding the vaccine. Please try again.",
          });
        }

        setLoading(false);
      })
      .catch((info) => {
        console.log("Validation Error:", info);
        notification.warning({ message: "Please check your input and try again!" });
      });
  };

  const handleMinAgeChange = (value: any) => {
    setMinAge(value);
    if (maxAge !== null && value >= maxAge) {
      setMaxAge(null);
      form.setFieldsValue({ maxAge: undefined });
    }
  };

  const handleMaxAgeChange = (value: any) => {
    setMaxAge(value);
  };

  const generateAgeOptions = () => {
    const monthOptions = Array.from({ length: 13 }, (_, i) => ({
      label: `${i} month${i !== 1 ? 's' : ''}`,
      value: `${i}m`,
    }));

    const yearOptions = Array.from({ length: 100 }, (_, i) => ({
      label: `${i + 1} year${i + 1 !== 1 ? 's' : ''}`,
      value: `${i + 1}y`,
    }));

    return [...monthOptions, ...yearOptions].map(({ label, value }) => (
      <Option key={value} value={value}>
        {label}
      </Option>
    ));
  };

  return (
    <Modal
      title="Add New Vaccine"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleCreate}
      okText="Create Vaccine"
      cancelText="Cancel"
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical">
        <div className="!grid !grid-cols-2 !gap-6">
          <div className="!col-span-2">
            <Form.Item
              label="Upload Images"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
                beforeUpload={() => false}
                multiple
              >
                {fileList.length < 5 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>

              {mainImage && (
                <>
                  <img
                    src={URL.createObjectURL(mainImage.originFileObj)}
                    alt="Main"
                    style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }}
                  />
                  <p className="!text-center !text-lg !text-yellow-600">Preview image</p>
                </>
              )}
            </Form.Item>

          </div>

          <div className="flex flex-col gap-4">
            <Form.Item
              label="Vaccine Name"
              name="name"
              rules={[{ required: true, message: "Please enter the vaccine name!" }]}
            >
              <Input placeholder="Enter vaccine name" />
            </Form.Item>

            <Form.Item label="Recommended Age Range" required>
              <div className="flex gap-3">
                <Form.Item
                  name="minAge"
                  rules={[{ required: true, message: "Select min age" }]}
                  className="!mb-0 w-full"
                >
                  <Select placeholder="Min Age" onChange={handleMinAgeChange}>
                    {generateAgeOptions()}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="maxAge"
                  rules={[
                    { required: true, message: "Select max age" },
                    () => ({
                      validator(_, value) {
                        const parseAge = (age: string) => {
                          if (age?.endsWith("m")) return parseInt(age);
                          if (age?.endsWith("y")) return parseInt(age) * 12;
                          return 0;
                        };
                  
                        if (!value || minAge === null || parseAge(value) > parseAge(minAge)) {
                          return Promise.resolve();
                        }
                  
                        return Promise.reject(new Error("Max age must be greater than min age!"));
                      },
                    }),
                  ]}                  
                  className="!mb-0 w-full"
                >
                  <Select placeholder="Max Age" onChange={handleMaxAgeChange} disabled={minAge === null}>
                  {generateAgeOptions().filter((option: any) => {
  const parseAge = (age: string) => {
    if (age.endsWith("m")) return parseInt(age);
    if (age.endsWith("y")) return parseInt(age) * 12;
    return 0;
  };

  return minAge === null || parseAge(option.key) > parseAge(minAge);
})}

                  </Select>
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              label="Contraindications"
              name="contraindications"
              rules={[{ required: true, message: "Please enter contraindications!" }]}
            >
              <Input placeholder="Enter contraindications" />
            </Form.Item>

            <Form.Item
              label="Price ($)"
              name="price"
              rules={[{ required: true, message: "Please enter the vaccine price!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={1}
                placeholder="Enter vaccine price"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: any) => value?.replace(/,/g, '')}
              />
            </Form.Item>

            <Form.Item
              label="Producer"
              name="producer"
            >
              <Input placeholder="Enter producer name" />
            </Form.Item>


            <Form.Item
              label="Usage Instructions"
              name="usageInstructions"
            >
              <Input.TextArea rows={2} placeholder="Enter usage instructions" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select placeholder="Select status">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <Form.Item
              label="Dose"
              name="dose"
              rules={[{ required: true, message: "Please enter dose!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} placeholder="Enter number of doses" />
            </Form.Item>

            <Form.Item
              label="Target Disease"
              name="targetDisease"
            >
              <Input placeholder="Enter target disease" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Unit Type&nbsp;
                  <Tooltip title="Vial is a small bottle, ampoule is a sealed glass container.">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
              name="unitType"
              rules={[{ required: true, message: "Please select unit type!" }]}
            >
              <Select placeholder="Select unit type">
                <Option value="Vial">Vial</Option>
                <Option value="Ampoule">Ampoule</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please select a country!' }]}
            >
              <Select placeholder="Select a country">
                {countriesList.map((country) => (
                  <Option key={country.name} value={country.name}>
                    <Row gutter={8}>
                      <Col>
                        <img src={country.flagUrl} alt={country.name} style={{ width: 20, marginRight: 10 }} />
                      </Col>
                      <Col>{country.name}</Col>
                    </Row>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter quantity!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter quantity" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter the description!" }]}
            >
              <Input.TextArea rows={2} placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              label="Vaccine Category"
              name="vaccineCategoryId"
              rules={[{ required: true, message: 'Please select a vaccine category!' }]}
            >
              <Select placeholder="Select a category">
                {vaccineCategories?.map((category: any) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateVaccineDialog;
