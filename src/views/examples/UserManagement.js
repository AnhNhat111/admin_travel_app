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
import { Button, Modal, Input, Radio, DatePicker, Checkbox } from "antd";
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { formatDate } from "helpers";
import moment from "moment";
import TourModal from "./TourModal";

const Tables = () => {
  const [users, setUsers] = useState([]);
  const [dataAddUser, setDataAddUser] = useState([]);
  // const [listImage, setListImage] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowNewModel, setShowNewModel] = useState(false);

  const [userSeletedId, setUserSeletedId] = useState(null);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [placement, SetPlacement] = useState("topLeft");

  const showModal = (id) => {
    setUserSeletedId(id);
    setIsModalVisible(true);
  };

  const showModalAdd = () => {
    setShowNewModel(true);
  };

  const handleChangeInput = (e) => {
    setUsers((prevTour) => {
      console.log({ ...prevTour, [e.target.name]: e.target.value });
      return { ...prevTour, [e.target.name]: e.target.value };
    });
  };

  const handleChangeInputAdd = (e) => {
    setDataAddUser((prevTour) => {
      return { ...prevTour, [e.target.name]: e.target.value };
    });
  };

  const handleOk = () => {
    try {
      axios
        .post("/api/auth/get-all-user", {
          name: dataAddUser.name,
          email: dataAddUser.email,
          phone: dataAddUser.phone,
          gender: dataAddUser.gender,
          birthday: moment(dataAddUser.birthday).format("DD-MM-YYYY"),
        })
        .then(function (response) {
          console.log(response);
          alert("create user success");
          loadData();
        })
        .catch(function (error) {
          console.log(error);
        });
      setIsModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formData = () => {
    return (
      <form>
        <label className="label">Email</label>
        <Input placeholder="email" value={users[userSeletedId].email} />
        <label className="label">User name</label>
        <Input placeholder="username" value={users[userSeletedId].name} />
        <label className="label">Phone</label>
        <Input placeholder="phone" value={users[userSeletedId].phone} />
        <label className="label">Birtday</label>
        <br />
        <DatePicker
          placement={placement}
          value={formatDate(users[userSeletedId].birthday)}
          format="DD/MM/YYYY"
        />
        <br />
        <label className="label">Gender</label>
        <br />
        <Radio.Group value={users[userSeletedId].gender == 1 ? 1 : 0}>
          <Radio value={1}>male</Radio>
          <Radio value={0}>female</Radio>
        </Radio.Group>
        <br />
        <label className="label" style={{ marginBottom: "10px" }}>
          Status
        </label>
        <br />
        <Radio.Group value={users[userSeletedId].status == 1 ? 1 : 0}>
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

  const [active, setActive] = useState(active);

  const onActive = (e) => {
    setActive(e.target.checked);
  };

  const [status, setValue] = useState(status);

  const onChange = (e) => {
    setDataAddUser((prevTour) => {
      return { ...prevTour, gender: e.target.value };
    });
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
                <h3 className="mb-0"> User Management</h3>
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
                          <Input
                            placeholder="email"
                            name="email"
                            onChange={handleChangeInputAdd}
                            value={dataAddUser.email}
                          />
                          <label className="label">User name</label>
                          <Input
                            placeholder="username"
                            name="name"
                            onChange={handleChangeInputAdd}
                            value={dataAddUser.name}
                          />
                          <label className="label">Phone</label>
                          <Input
                            placeholder="phone"
                            name="phone"
                            onChange={handleChangeInputAdd}
                            value={dataAddUser.phone}
                          />
                          <label className="label">Birtday</label>
                          <br />
                          <DatePicker
                            placement={placement}
                            onChange={(e) =>
                              setDataAddUser((prevTour) => {
                                return { ...prevTour, birthday: e };
                              })
                            }
                          />
                          <br />
                          <label className="label">Gender</label>
                          <br />
                          <>
                            <Radio.Group
                              onChange={onChange}
                              value={dataAddUser.gender}
                            >
                              <Radio value={1}>Male</Radio>
                              <Radio value={0}>Female</Radio>
                            </Radio.Group>
                          </>
                          <br />
                          <label
                            className="label"
                            style={{ marginBottom: "10px" }}
                          >
                            Status
                          </label>
                          <br />
                          <Checkbox className="active" onChange={onActive}>
                            Active
                          </Checkbox>
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

                          <Button
                            className="btn-modal"
                            type="primary"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to save this thing into the database?"
                                )
                              ) {
                                axios
                                  .delete(`/api/auth/get-all-user/${users.id}`)
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
          <div className="">{userSeletedId && formData()}</div>
        </Modal>
      </Container>
    </>
  );
};

export default Tables;
