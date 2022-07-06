import {
  Modal,
  Input,
  Select,
  Space,
  DatePicker,
  Radio,
  InputNumber,
  Row,
} from "antd";
import { Option } from "antd/lib/mentions";
import { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import storage from "../../config/firebaseConfig";
import axios from "../../config/axiosConfig";
import { Col } from "reactstrap";

const TourModal = ({ title, visible, onOK, onCancel, setVisible }) => {
  const [tour, setTour] = useState({});

  const [listImage, setListImage] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChangeInput = (e) => {
    setTour((prevTour) => {
      console.log({ ...prevTour, [e.target.name]: e.target.value });
      return { ...prevTour, [e.target.name]: e.target.value };
    });
  };

  const { TextArea } = Input;
  const { RangePicker } = DatePicker;

  const onFileChange = (event) => {
    const newArr = [...listImage];
    newArr.push(event.target.files[0]);
    setListImage(newArr);
  };

  const handleOk = () => {
    try {
      axios
        .post("/api/auth/tour", {
          name: tour.name,
          date_to: date_to,
          date_from: date_from,
          schedule: tour.schedule,
          hotel: tour.hotel,
          image: "images",
          price_child: tour.price_child,
          price_adult: tour.price_adult,
          start_location_id: start_location,
          end_location_id: end_location,
          capacity: tour.capacity,
          available_capacity: tour.available_capacity,
          type_id: 1,
          vehicle_id: vehicle_id,
          promotion_id: 1,
          status: status,
        })
        .then(function (response) {
          listImage.map((file) => {
            const imageRef = ref(storage, `images/${file.name}`);
            uploadBytes(imageRef, file).then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);
                axios
                  .post("/api/auth/images", {
                    tour_id: response.data.id,
                    image_path: url,
                    name: file.name,
                  })
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              });
            });
          });
          alert("create success");
        })
        .catch(function (error) {
          console.log(error);
        });
      setVisible(false);
      setIsModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  };
  const [status, setValue] = useState(status);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const [dataLocation, setDataLocation] = useState([]);
  const [dataVehicle, setDataVehicle] = useState([]);
  const [date_from, setDateFrom] = useState();
  const [date_to, setDateTo] = useState();
  const [vehicle_id, setVehicle] = useState(vehicle_id);

  const [start_location, setStartLocation] = useState(start_location);
  const [end_location, setEndLocation] = useState(end_location);

  const loadData = async () => {
    axios
      .get("/api/auth/location")
      .then((res) => {
        setDataLocation(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadDataVehicle = async () => {
    axios
      .get("/api/auth/vehicle")
      .then((res) => {
        setDataVehicle(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    loadDataVehicle();
  }, []);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={onCancel}>
      <form>
        <Row>
          <label className="label"> name</label>
          <Input
            placeholder="name"
            name="name"
            onChange={handleChangeInput}
            value={tour.name}
          />
        </Row>

        <Row>
          <label className="label">hotel</label>
          <TextArea
            name="hotel"
            style={{ height: "150px" }}
            placeholder="hotel"
            onChange={handleChangeInput}
            value={tour.hotel}
          ></TextArea>
        </Row>

        <Row>
          <label className="label">schedule</label>
          <TextArea
            name="schedule"
            style={{ height: "150px" }}
            placeholder="schedule"
            onChange={handleChangeInput}
            value={tour.schedule}
          ></TextArea>
        </Row>

        <Row>
          <label className="label">description</label>
          <TextArea
            name="description"
            style={{ height: "150px" }}
            placeholder="description"
            onChange={handleChangeInput}
            value={tour.description}
          ></TextArea>
        </Row>

        <label className="label">Date to</label>
        <br />
        <Space direction="vertical" size={12}>
          <RangePicker
            onChange={(value, dateString) => {
              setDateFrom(dateString[0]);
              setDateTo(dateString[1]);
            }}
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

        <Row>
          <Col>
            <label className="label">Vehicle</label>
            <br />

            <Select
              defaultValue="Choose"
              style={{ width: 120 }}
              onChange={setVehicle}
            >
              {dataVehicle.map((item, index) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Col>

          <Col>
            <label className="label">location start</label>
            <br />

            <Select
              defaultValue="Choose"
              style={{ width: 120 }}
              onChange={setStartLocation}
            >
              {dataLocation.map((item, index) => (
                <Option name="location_start" value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col>
            <label className="label">location end</label>
            <br />

            <Select
              defaultValue="Choose"
              style={{ width: 120 }}
              onChange={setEndLocation}
            >
              {dataLocation.map((item, index) => (
                <Option name="location_end" value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row>
          <Col>
            <label className="label">price child</label>
            <br />
            <Input
              placeholder="price child"
              name="price_child"
              onChange={handleChangeInput}
              value={tour.price_child}
              min={1}
              max={10}
              defaultValue={0}
            />
          </Col>

          <Col>
            <label className="label">price_adult</label>
            <br />
            <Input
              name="price_adult"
              placeholder="price adult"
              onChange={handleChangeInput}
              value={tour.price_adult}
              min={1}
              max={10}
              defaultValue={0}
            />
          </Col>

          <Col>
            <label className="label">capacity</label>
            <br />
            <Input
              name="capacity"
              placeholder="capacity"
              onChange={handleChangeInput}
              value={tour.capacity}
              min={1}
              max={10}
              defaultValue={0}
            />
          </Col>

          <Col>
            <label className="label">available</label>
            <br />
            <Input
              name="available_capacity"
              placeholder="available capacity"
              onChange={handleChangeInput}
              value={tour.available_capacity}
              min={1}
              max={10}
              defaultValue={0}
            />
          </Col>
        </Row>

        <Row className="images-input">
          <Col>
            <input type="file" multiple="true" onChange={onFileChange} />
          </Col>

          <Col>
            {listImage.map((item, index) => (
              <img
                src={URL.createObjectURL(item)}
                style={{ width: 200, height: 200 }}
              />
            ))}
          </Col>
        </Row>

        <Row>
          <Col>
            <label
              name="status"
              className="label"
              style={{ marginBottom: "10px" }}
            >
              Status
            </label>

            <Radio.Group onChange={onChange} value={status}>
              <Radio value={1}>Active</Radio>
              <Radio value={2}>Not Active</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

export default TourModal;
