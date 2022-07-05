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
import "./style.css";
import "antd/dist/antd.css";
import { Button, Modal, Input, Radio, DatePicker } from "antd";
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { formatDate } from "helpers";
import moment from "moment";
import TourModal from "./TourModal";

const Tables = () => {
  const [users, setUsers] = useState([]);
  // const [listImage, setListImage] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowNewModel, setShowNewModel] = useState(false);

  const [UserSeletedId, setUserSeletedId] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [placement, SetPlacement] = useState("topLeft");

  const showModal = (id) => {
    console.log(id);
    setUserSeletedId(id);
    setIsModalVisible(true);
  };

  const showModalAdd = () => {
    setShowNewModel(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formData = () => {
    return (
      <form>
        <label className="label">Email</label>
        <Input placeholder="email" value={users[UserSeletedId].email} />
        <label className="label">User name</label>
        <Input placeholder="username" value={users[UserSeletedId].name} />
        <label className="label">Phone</label>
        <Input placeholder="phone" value={users[UserSeletedId].phone} />
        <label className="label">Birtday</label>
        <br />
        <DatePicker
          placement={placement}
          value={formatDate(users[UserSeletedId].birthday)}
          format="DD/MM/YYYY"
        />
        <br />
        <label className="label">Gender</label>
        <br />
        <Radio.Group value={users[UserSeletedId].gender == 1 ? 1 : 0}>
          <Radio value={1}>male</Radio>
          <Radio value={0}>female</Radio>
        </Radio.Group>
        <br />
        <label className="label" style={{ marginBottom: "10px" }}>
          Status
        </label>
        <br />
        <Radio.Group value={users[UserSeletedId].status == 1 ? 1 : 0}>
          <Radio value={1}>active</Radio>
        </Radio.Group>
      </form>
    );
  };

  const gotopages = async (page) => {
    axios
      .get("/api/auth/get-all-user", {
        params: { page: page },
      })
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
      .get("/api/auth/get-all-user")
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const addData = async () => {
  //   axios
  //     .post("/api/auth/get-all-user")
  //     .then((res) => {
  //       console.log(res);
  //       setUsers(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
                    <th scope="col">email</th>
                    <th scope="col">username</th>
                    <th scope="col">uid</th>
                    <th scope="col">phone</th>
                    <th scope="col">gender</th>
                    <th scope="col">birthday</th>
                    <th scope="col">status</th>
                    <th>
                      <Button
                        className="btn-add"
                        type="primary"
                        onClick={showModalAdd}
                      >
                        Add Customer
                      </Button>
                      <Modal
                        title="ADD"
                        visible={isShowNewModel}
                        onOk={handleOk}
                        onCancel={() => setShowNewModel(false)}
                      >
                        <form>
                          <label className="label">Email</label>
                          <Input placeholder="email" />
                          <label className="label">User name</label>
                          <Input placeholder="username" />
                          <label className="label">Phone</label>
                          <Input placeholder="phone" />
                          <label className="label">Birtday</label>
                          <br />
                          <DatePicker placement={placement} />
                          <br />
                          <label className="label">Gender</label>
                          <br />
                          <>
                            <Radio>male</Radio>
                            <Radio>Female</Radio>
                          </>
                          <br />
                          <label
                            className="label"
                            style={{ marginBottom: "10px" }}
                          >
                            Status
                          </label>
                          <br />
                          <Radio>Active</Radio>
                        </form>
                      </Modal>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((users, index) => {
                    return (
                      <tr>
                        <th scope="row">
                          <Media>
                            <span className="mb-0 text-sm">
                              {15 * currentPage - (15 - index) + 1}
                            </span>
                          </Media>
                        </th>
                        <td>{users.email}</td>
                        <td>{users.name}</td>
                        <td>{users.uid}</td>
                        <td>{users.phone}</td>
                        <td>{users.gender === 1 ? "male" : "female"}</td>
                        <td>{moment(users.birthday).format("DD-MM-yyyy")}</td>
                        <td>{users.status === 1 ? "active" : "no active"}</td>
                        <td className="btn-update">
                          <Button
                            className="btn-modal"
                            type="primary"
                            onClick={() => showModal(users.id)}
                          >
                            Update
                          </Button>

                          <Button className="btn-modal" type="primary">
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
          <div className="">{UserSeletedId && formData()}</div>
        </Modal>
      </Container>
    </>
  );
};

export default Tables;
