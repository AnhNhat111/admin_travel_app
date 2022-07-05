import { Card, CardHeader, Media, Table, Container, Row } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import { Button, Input, Modal } from "antd";
const Tables = () => {
  const [locations, setLocations] = useState([]);
  const [TourSeletedId, setTourSeletedId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTourVisible, setTourVisible] = useState(false);

  const showModal = (id) => {
    setTourSeletedId(id);
    setIsModalVisible(true);
  };

  const showModalAdd = () => {
    setTourVisible(true);
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const loadData = async () => {
    axios
      .get("/api/auth/location")
      .then((res) => {
        console.log(res);
        setLocations(res.data);
        console.group(res.data);
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
                          <label className="label">description</label>
                          <Input placeholder="description" />

                          <label className="label">available capacity </label>
                          <Input placeholder="available capacity	" />
                        </form>
                      </Modal>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locations &&
                    locations.map((locations, index) => {
                      return (
                        <tr>
                          <th scope="row">
                            <Media>
                              <span className="mb-0 text-sm">{index + 1}</span>
                            </Media>
                          </th>
                          <td>{locations.name}</td>
                          <td>
                            {locations.status === 1 ? "active" : "not active"}
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
