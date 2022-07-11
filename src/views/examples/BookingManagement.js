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

import { Button, Modal, Upload, Col, Radio, DatePicker } from "antd";
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
  const [bookings, setBooking] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [BookingSeletedId, setBookingSeletedId] = useState(null);

  const [isBookingVisible, setBookingVisible] = useState(false);

  const [listImage, setListImage] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const { RangePicker } = DatePicker;
  const [placement, SetPlacement] = useState("topLeft");

  const showModal = (id) => {
    setBookingSeletedId(id);
    setIsModalVisible(true);
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
      .get("/api/auth/booking-tour-admin")
      .then((res) => {
        console.log(res);
        setBooking(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const gotopages = async () => {
    axios
      .get(`/api/auth/booking-tour-admin`, {
        params: {
          currentPage,
        },
      })
      .then((response) => {
        console.log(response.data);
        setBooking(response.data);
      })
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
                    <th scope="col">Name</th>
                    <th scope="col">Tour</th>
                    <th scope="col">Quantity adult</th>
                    <th scope="col">Quantity child</th>
                    <th scope="col">Total quantity</th>
                    <th scope="col">unit price child</th>
                    <th scope="col">unit price adult</th>
                    <th scope="col">total price</th>
                    <th scope="col">Date booking</th>
                    <th scope="col">Date payment</th>
                    <th scope="col">Paid</th>

                    <th scope="col">confirm</th>
                    <th scope="col">Status</th>
                    <th className="UD">UD</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings &&
                    bookings.map((bookings, index) => {
                      return (
                        <tr>
                          <th scope="row">
                            <Media>
                              <span className="mb-0 text-sm">
                                {15 * currentPage - (15 - index) + 1}
                              </span>
                            </Media>
                          </th>
                          <td>{bookings.user?.name}</td>
                          <td>{bookings.tour?.map((x) => x.name)}</td>
                          <td>{bookings.quantity_adult}</td>
                          <td>{bookings.quantity_child}</td>
                          <td>{bookings.quantity}</td>
                          <td>{bookings.unit_price_child}</td>
                          <td>{bookings.unit_price_adult}</td>
                          <td>{bookings.total_price}</td>
                          <td>{bookings.date_of_booking}</td>
                          <td>{bookings.date_of_payment}</td>
                          <td>{bookings.is_paid === 1 ? "paid" : "unpaid"}</td>
                          <td>
                            {bookings.is_confirm === 1
                              ? "confirmed"
                              : "not confirmed"}
                          </td>
                          <td>
                            {bookings.status === 1 ? "active" : "not active"}
                          </td>
                          <td className="btn-update-booking">
                            <Button
                              style={{ marginRight: "10px" }}
                              className="btn-modal"
                              type="primary"
                              onClick={() => showModal(bookings.id)}
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
                                    "Are you sure you want to delete this row booking into the database?"
                                  )
                                ) {
                                  axios
                                    .delete(
                                      `/api/auth/booking-tour-admin/${bookings.id}`
                                    )
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
                                    "booking was not delete to the database."
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
          title="Update"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="">
            {BookingSeletedId && (
              <form>
                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>hotel</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {bookings[BookingSeletedId].booking_details}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>schedule</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {bookings[BookingSeletedId].schedule}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>date from</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {moment(bookings[BookingSeletedId].date_to).format(
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
                      {moment(bookings[BookingSeletedId].date_from).format(
                        "DD-MM-yyyy"
                      )}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>vehicle</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {bookings[BookingSeletedId].vehicle_id}
                    </Label>
                  </Col>
                </Row>

                <Row>
                  <Col span={10} style={{ margin: "18px" }}>
                    <label>capacity</label>
                  </Col>
                  <Col span={10}>
                    <Label placeholder="capacity" style={{ margin: "18px" }}>
                      {bookings[BookingSeletedId].capacity}
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
