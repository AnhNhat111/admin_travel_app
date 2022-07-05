import { Modal, Input, Col, Select, Space, DatePicker, Radio } from "antd";
import { Option } from "antd/lib/mentions";
import { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import storage from "../../config/firebaseConfig";
import axios from "../../config/axiosConfig";
import { IoThunderstormSharp } from "react-icons/io5";

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
          schedule: "",
          hotel: tour.hotel,
          image: "",
          price_child: tour.price_child,
          price_adult: tour.price_adult,
          start_location_id: 1,
          end_location_id: 2,
          capacity: tour.capacity,
          available_capacity: tour.available_capacity,
          type_id: 1,
          vehicle_id: 1,
          promotion_id: 1,
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
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const [dataLocation, setDataLocation] = useState([]);
  const [dataVehicle, setDataVehicle] = useState([]);
  const [date_from, setDateFrom] = useState();
  const [date_to, setDateTo] = useState();

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
        <label className="label"> name</label>
        <Input
          placeholder="name"
          name="name"
          onChange={handleChangeInput}
          value={tour.name}
        />

        <label className="label">price child</label>
        <Input
          placeholder="price child"
          name="price_child"
          onChange={handleChangeInput}
          value={tour.price_child}
        />

        <label className="label">price_adult</label>
        <Input
          placeholder="price adult"
          onChange={handleChangeInput}
          value={tour.price_adult}
        />

        <label className="label">Vehicle</label>
        <br />

        <Col flex="0 1 300px">
          <Select defaultValue="Choose" style={{ width: 120 }}>
            {dataVehicle.map((item, index) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Col>

        <label className="label">capacity</label>
        <Input
          placeholder="capacity"
          onChange={handleChangeInput}
          value={tour.capacity}
        />

        <label className="label">hotel</label>
        <Input
          style={{ height: "150px" }}
          placeholder="hotel"
          onChange={handleChangeInput}
          value={tour.hotel}
        />

        <label className="label">schedule</label>
        <Input
          style={{ height: "150px" }}
          placeholder="schedule"
          onChange={handleChangeInput}
          value={tour.schedule}
        />
        <label className="label">description</label>
        <Input
          style={{ height: "150px" }}
          placeholder="description"
          onChange={handleChangeInput}
          value={tour.direction}
        />

        <label className="label">available capacity </label>
        <Input
          placeholder="available capacity"
          onChange={handleChangeInput}
          value={tour.available_capacity}
        />

        <label className="label">location start</label>
        <br />

        <Col flex="0 1 300px">
          <Select defaultValue="Choose" style={{ width: 120 }}>
            {dataLocation.map((item, index) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Col>

        <label className="label">location end</label>
        <br />

        <Col flex="1 1 100px">
          <Select defaultValue="Choose" style={{ width: 120 }}>
            {dataLocation.map((item, index) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Col>

        <br />
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
        <br />
        <br />
        <input type="file" multiple="true" onChange={onFileChange} />
        {listImage.map((item, index) => (
          <img
            src={URL.createObjectURL(item)}
            style={{ width: 200, height: 200 }}
          />
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
    </Modal>
  );
};

export default TourModal;
