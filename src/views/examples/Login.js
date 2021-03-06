/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React from "react";
import { useHistory } from "react-router-dom";
import { TOKEN_KEY } from "../../constants/index";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Spinner,
} from "reactstrap";

const Login = () => {
  const history = useHistory();
  const [loginInputs, setLoginInputs] = React.useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [loading, setLoading] = React.useState(false);

  // React.useEffect(() => {
  //   if (sessionStorage.getItem("access_token")) history.push("/admin/index");
  // }, []);

  const onLogin = async () => {
    try {
      setLoading(true);
      const url_login = "http://127.0.0.1:8000/api/auth/login";
      const { email, password, remember_me } = loginInputs;
      const loginBodyData = {
        email,
        password,
        admin: 1,
        method_login: 1,
        remember_me,
      };
      const resJson = await fetch(url_login, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginBodyData),
      });
      const data = await resJson.json();
      sessionStorage.setItem(TOKEN_KEY, data.access_token);
      history.push("/admin/index");
    } catch (e) {
      alert("Loi dang nhap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          {/* <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon"></span>
              </Button>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader> */}
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Login</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={loginInputs.email}
                    onChange={(e) =>
                      setLoginInputs({ ...loginInputs, email: e.target.value })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={loginInputs.password}
                    onChange={(e) =>
                      setLoginInputs({
                        ...loginInputs,
                        password: e.target.value,
                      })
                    }
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                  checked={loginInputs.remember_me}
                  onChange={(e) =>
                    setLoginInputs({
                      ...loginInputs,
                      remember_me: !loginInputs.remember_me,
                    })
                  }
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={onLogin}
                >
                  {loading ? <Spinner /> : "Sign in"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            ></a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => {
                e.preventDefault();
              }}
            ></a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
