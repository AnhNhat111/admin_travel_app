import { Card, CardHeader, Media, Table, Container, Row } from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
const Tables = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

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
                  </tr>
                </thead>
                <tbody>
                  {locations.map((locations, index) => {
                    return (
                      <tr>
                        <th scope="row">
                          <Media>
                            <span className="mb-0 text-sm">{index + 1}</span>
                          </Media>
                        </th>
                        <td>{locations.name}</td>
                        <td>{locations.status}</td>
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
