import { Card, CardHeader, Media, Table, Container, Row } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { Button, Input, Modal } from "antd";
import moment from "moment";
const Tables = () => {
  const [locations, setLocations] = useState([]);
  const [dataAddLocation, setDataAddLocation] = useState([]);

  const [TourSeletedId, setTourSeletedId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocationVisible, setLocationVisible] = useState(false);

  const handleChangeInputAdd = (e) => {
    setDataAddLocation((prevTour) => {
      console.log({ ...prevTour, [e.target.name]: e.target.value });

      return { ...prevTour, [e.target.name]: e.target.value };
    });
  };

  const showModal = (id) => {
    setTourSeletedId(id);
    setIsModalVisible(true);
  };

  const showModalAdd = () => {
    setLocationVisible(true);
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleOk = () => {
    try {
      axios
        .post("/api/auth/location", {
          name: dataAddLocation.name,
          status: 1,
        })
        .then(function (response) {
          loadData();
          alert("create location success");
        })
        .catch(function (error) {
          console.log(error);
        });
      setLocationVisible(false);
      setIsModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const loadData = async () => {
    axios
      .get("/api/auth/location")
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {
        console.log(err);
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
                <h3 className="mb-0">Card tables</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Name</th>
                    <th scope="col">Ngày tạo</th>
                    <th scope="col">Ngày cập nhật</th>
                    <th scope="col">Status</th>
                    <th>
                      <Button
                        style={{ width: "155px" }}
                        className="btn-add"
                        type="primary"
                        onClick={showModalAdd}
                      >
                        Add
                      </Button>
                      <Modal
                        title="ADD"
                        visible={isLocationVisible}
                        onOk={handleOk}
                        onCancel={() => setLocationVisible(false)}
                      >
                        <form>
                          <label className="name">Location name</label>
                          <Input
                            placeholder="Location name"
                            name="name"
                            onChange={handleChangeInputAdd}
                            value={dataAddLocation.name}
                          />
                        </form>
                      </Modal>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locations &&
                    locations?.map((locations, index) => {
                      return (
                        <tr>
                          <th scope="row">
                            <Media>
                              <span className="mb-0 text-sm">{index + 1}</span>
                            </Media>
                          </th>
                          <td>{locations.name}</td>
                          <td>
                            {moment(locations.created_at).format(
                              "DD-MM-YYYY hh:mm:ss"
                            )}
                          </td>
                          <td>
                            {moment(locations.updated_at).format(
                              "DD-MM-YYYY hh:mm:ss"
                            )}
                          </td>
                          <td>
                            {locations.status === 1 ? "active" : "not active"}
                          </td>
                          <td>
                            <Button
                              style={{ marginRight: "5px" }}
                              className="btn-modal"
                              type="primary"
                              onClick={() => showModal(locations.id)}
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
                                    .delete(
                                      `/api/auth/location/${locations.id}`
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
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Tables;
