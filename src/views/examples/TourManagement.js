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
const Tables = () => {
  const [tours, setTours] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [TourSeletedId, setTourSeletedId] = useState(null);

  const [isTourVisible, setTourVisible] = useState(false);

  const [listImage, setListImage] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const { RangePicker } = DatePicker;
  const [placement, SetPlacement] = useState("topLeft");

  const showModal = (id) => {
    setTourSeletedId(id);
    setIsModalVisible(true);
  };

  const showModalAdd = () => {
    setTourVisible(true);
  };

  const handleOk = () => {
    try {
      console.log("listImage", listImage);
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

  const loadData = async () => {
    axios
      .get("/api/auth/user-tour")
      .then((res) => {
        console.log(res.data.data);
        setTours(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const gotopages = async () => {
    axios
      .get(`/api/auth/user-tour`, {
        params: {
          currentPage,
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

  console.log("listImage", listImage);

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
    console.log("radio checked", e.target.value);
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
                        onClick={showModalAdd}
                      >
                        Add Tour
                      </Button>
                      <Modal
                        title="ADD"
                        visible={isTourVisible}
                        onOk={handleOk}
                        onCancel={() => setTourVisible(false)}
                      >
                        <form>
                          <label className="label"> name</label>
                          <Input placeholder="tour" />

                          <label className="label">hotel</label>
                          <Input placeholder="hotel" />

                          <label className="label">schedule</label>
                          <Input placeholder="schedule" />

                          <label className="label">price child</label>
                          <Input placeholder="price child" />

                          <label className="label">price_adult</label>
                          <Input placeholder="price adlut" />

                          <label className="label">vehicle</label>
                          <Input placeholder="vehicle" />

                          <label className="label">capacity</label>
                          <Input placeholder="capacity" />

                          <label className="label">description</label>
                          <Input placeholder="description" />

                          <label className="label">available capacity </label>
                          <Input placeholder="available capacity	" />

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
                                  <div
                                    className="ant-picker-cell-inner"
                                    style={style}
                                  >
                                    {current.date()}
                                  </div>
                                );
                              }}
                            />
                          </Space>
                          <br />
                          <br />
                          <label
                            className="label"
                            style={{ marginBottom: "10px" }}
                          >
                            Status
                          </label>
                          <br />
                          <Radio.Group onChange={onChange} value={value}>
                            <Radio value={1}>Active</Radio>
                            <Radio value={2}>Not Active</Radio>
                          </Radio.Group>
                        </form>
                      </Modal>
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
                              onClick={() => showModal()}
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
                          gotopages();
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
                          gotopages();
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
                          gotopages();
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
          title="Watch"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="scroll-wrap">
            {TourSeletedId && (
              <form>
                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>hotel</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {tours[TourSeletedId].hotel}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>schedule</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {tours[TourSeletedId].schedule}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>date from</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {moment(tours[TourSeletedId].date_to).format(
                        "DD-MM-yyyy"
                      )}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>date from</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {moment(tours[TourSeletedId].date_from).format(
                        "DD-MM-yyyy"
                      )}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col
                    span={10}
                    style={{ margin: "18px", flexDirection: "row" }}
                  >
                    <input
                      type="file"
                      multiple="true"
                      onChange={onFileChange}
                    />
                    {listImage.map((item, index) => (
                      <img
                        src={URL.createObjectURL(item)}
                        style={{ width: 200, height: 200 }}
                      />
                    ))}
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {tours[TourSeletedId].images.map((x) => x.name)}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>vehicle</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {tours[TourSeletedId].vehicle_id}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>capacity</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {tours[TourSeletedId].capacity}
                    </Label>
                  </Col>
                </Row>
              </form>
            )}
          </div>
        </Modal>
      </Container>
    </>
  );
};

export default Tables;
