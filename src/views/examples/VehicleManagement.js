import { Card, CardHeader, Media, Table, Container, Row } from "reactstrap";
import { Button, Input, Modal } from "antd";

// core components
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import moment from "moment";
const Tables = () => {
  const [vehicles, setVehicles] = useState([]);
  const [dataAddVehicle, setDataAddVehicle] = useState([]);
  const [isVehicleVisible, setVehicleVisible] = useState(false);
  const [TourSeletedId, setVehicleSeletedId] = useState(null);

  const handleChangeInputAdd = (e) => {
    setDataAddVehicle((prevTour) => {
      console.log({ ...prevTour, [e.target.name]: e.target.value });

      return { ...prevTour, [e.target.name]: e.target.value };
    });
  };

  const showModalAdd = () => {
    setVehicleVisible(true);
  };

  const showModal = (id) => {
    setVehicleSeletedId(id);
    setVehicleVisible(true);
  };

  const handleOk = () => {
    try {
      axios
        .post("/api/auth/vehicle", {
          name: dataAddVehicle.name,
          status: 1,
        })
        .then(function (response) {
          loadData();
          alert("create vehicle success");
        })
        .catch(function (error) {
          console.log(error);
        });
      setVehicleVisible(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    axios
      .get("/api/auth/vehicle")
      .then((res) => {
        setVehicles(res.data);
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
                    <th scope="col">Tên Phương Tiện</th>
                    <th scope="col">Ngày tạo</th>
                    <th scope="col">Ngày cập nhật</th>
                    <th scope="col">Status</th>
                    <th scope="col">
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
                        visible={isVehicleVisible}
                        onOk={handleOk}
                        onCancel={() => setVehicleVisible(false)}
                      >
                        <form>
                          <label className="name">Tên Phương Tiện</label>
                          <Input
                            placeholder="Location name"
                            name="name"
                            onChange={handleChangeInputAdd}
                            value={dataAddVehicle.name}
                          />
                        </form>
                      </Modal>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles &&
                    vehicles.map((vehicles, index) => {
                      return (
                        <tr>
                          <th scope="row">
                            <Media>
                              <span className="mb-0 text-sm">{index + 1}</span>
                            </Media>
                          </th>
                          <td>{vehicles.name}</td>
                          <td>
                            {moment(vehicles.created_at).format(
                              "DD-MM-YYYY hh:mm:ss"
                            )}
                          </td>
                          <td>
                            {moment(vehicles.updated_at).format(
                              "DD-MM-YYYY hh:mm:ss"
                            )}
                          </td>
                          <td>
                            {vehicles.status === 1 ? "active" : "not active"}
                          </td>
                          <td>
                            <Button
                              style={{ marginRight: "5px" }}
                              className="btn-modal"
                              type="primary"
                              onClick={() => showModal(vehicles.id)}
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
                                    .delete(`/api/auth/vehicle/${vehicles.id}`)
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
