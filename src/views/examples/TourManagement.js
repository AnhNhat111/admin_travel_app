import {
  Card,
  CardHeader,
  CardFooter,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Label,
} from "reactstrap";
import "antd/dist/antd.css";

import {
  Button,
  Modal,
  Upload,
  Col,
  Radio,
  DatePicker,
  Input,
  Space,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import storage from "../../config/firebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import "./style.css";
// core components
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import moment from "moment";
import { Option } from "antd/lib/mentions";
import Admin from "../../layouts/Admin";
import { data } from "jquery";
import TourModal from "./TourModal";
const Tables = () => {
  const [tours, setTours] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tourSeleted, setTourSeleted] = useState(null);

  const [isShowNewModal, setShowNewModel] = useState(false);

  const [listImage, setListImage] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const { RangePicker } = DatePicker;
  const [placement, SetPlacement] = useState("topLeft");

  const showModal = (id) => {
    setTourSeleted(tours.find((x) => x.id == id));
    setIsModalVisible(true);
  };

  const showModalAdd = () => {
    setShowNewModel(true);
  };

  const handleOk = () => {
    try {
      listImage.map((file) => {
        const imageRef = ref(storage, `images/${file.name}`);
        uploadBytes(imageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log(url);
          });
        });
      });

      setIsModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    loadData();
  }, []);

  const formData = () => {
    console.log(tours);
    return (
      <form>
        <label className="label"> name</label>
        <Input placeholder="name" value={tourSeleted.name} />
        <label className="label">price child</label>
        <Input placeholder="price child" value={tourSeleted.price_child} />
        <label className="label">price_adult</label>
        <Input placeholder="price adlut" value={tourSeleted.price_adult} />
        <label className="label">vehicle</label>
        <Input
          placeholder="vehicle"
          // value={tourSeleted.vehicle.map((item) => item.name)}
        />
        <label className="label">capacity</label>
        <Input placeholder="capacity" value={tourSeleted.capacity} />
        <label className="label">available capacity </label>
        <Input
          placeholder="available capacity"
          value={tourSeleted.available_capacity}
        />
        <label className="label">hotel</label>
        <Input style={{ height: "150px" }} placeholder="hotel" />
        <label className="label">schedule</label>
        <Input style={{ height: "150px" }} placeholder="schedule" />
        <label className="label">description</label>
        <Input style={{ height: "150px" }} placeholder="description" />
        <label className="label">location start</label>
        <br />
        <Col flex="0 1 300px">
          <Select
            defaultValue="Choose"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Col>
        <label className="label">location start</label>
        <br />
        <Col flex="1 1 100px">
          <Select
            defaultValue="Choose"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </Col>
        <br />
        <label className="label">Date to</label>
        <br />
        <Space direction="vertical" size={12}>
          <RangePicker
            dateRender={(current) => {
              const style = {};

              if (current.date() === 1) {
                style.border = "1px solid #1890ff";
                style.borderRadius = "50%";
              }

              return (
                <div className="ant-picker-cell-inner" style={style}>
                  {current.date()}
                </div>
              );
            }}
          />
        </Space>
        <br />
        <br />

        <input type="file" multiple="true" onChange={onFileChange} />
        {tourSeleted.images.lenght > 0 &&
          tourSeleted.images.map((item, index) => (
            <img src={item.image_path} style={{ width: 200, height: 200 }} />
          ))}

        <br />
        <label className="label" style={{ marginBottom: "10px" }}>
          Status
        </label>
        <br />
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>Active</Radio>
          <Radio value={2}>Not Active</Radio>
        </Radio.Group>
      </form>
    );
  };

  const loadData = async () => {
    axios
      .get("/api/auth/user-tour")
      .then((res) => {
        setTours(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const gotopages = async (page) => {
    axios
      .get(`/api/auth/user-tour`, {
        params: {
          page: page,
        },
      })
      .then((response) => setTours(response.data?.data))
      .catch((err) => console.warn(err));
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setListImage(newFileList);

  const onFileChange = (event) => {
    const newArr = [...listImage];
    newArr.push(event.target.files[0]);
    setListImage(newArr);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const [value, setValue] = useState(1);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Card tables</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Code</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price child</th>
                    <th scope="col">Price adult</th>
                    <th scope="col">start loaction</th>
                    <th scope="col">end loaction</th>
                    <th scope="col">Available</th>
                    <th scope="col">Status</th>
                    <th>
                      <Button
                        className="btn-add"
                        type="primary"
                        onClick={() => showModalAdd()}
                      >
                        Add Tour
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tours &&
                    tours?.map((tour, index) => {
                      return (
                        <tr>
                          <th scope="row">
                            <Media>
                              <span className="mb-0 text-sm">
                                {15 * currentPage - (15 - index) + 1}
                              </span>
                            </Media>
                          </th>
                          <td>{tour.code}</td>
                          <td>{tour.name}</td>
                          <td>{tour.price_child}</td>
                          <td>{tour.price_adult}</td>
                          <td>{tour.start_location.name}</td>
                          <td>{tour.end_location.name}</td>
                          <td>{tour.available_capacity}</td>
                          <td>{tour.status === 1 ? "active" : "not active"}</td>
                          <td className="btn-update">
                            <Button
                              style={{ marginRight: "10px" }}
                              className="btn-modal"
                              type="primary"
                              onClick={() => showModal(tour.id)}
                            >
                              Update
                            </Button>

                            <Button
                              style={{ marginRight: "10px" }}
                              className="btn-modal"
                              type="primary"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to save this thing into the database?"
                                  )
                                ) {
                                  axios
                                    .delete(`/api/auth/tour/${tour.id}`)
                                    .then(function (response) {
                                      loadData();

                                      console.log(response);
                                    })
                                    .catch(function (error) {
                                      console.log(error);
                                    });
                                } else {
                                  // Do nothing!
                                  console.log(
                                    "Thing was not saved to the database."
                                  );
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>

              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className={currentPage === 1 && "active"}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          setCurrentPage(1);
                          e.preventDefault();
                          gotopages(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className={currentPage === 2 && "active"}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          setCurrentPage(2);
                          gotopages(2);
                          e.preventDefault();
                        }}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className={currentPage === 3 && "active"}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(3);
                          gotopages(3);
                        }}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        <Modal
          title="Update"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="">{tourSeleted && formData()}</div>
        </Modal>
        <TourModal
          visible={isShowNewModal}
          setVisible={setShowNewModel}
          title="ADD"
          onCancel={() => setShowNewModel()}
          onOK={(data) => console.log(data)}
        />
      </Container>
    </>
  );
};

export default Tables;
