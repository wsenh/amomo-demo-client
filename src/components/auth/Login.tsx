import { Button, Icon, Modal, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useCallback, useState } from "react";
import * as yup from "yup";
import { useLoginMutation } from "../../graphql/auth";
import { useAuthDispatch } from "../../store/auth";
import { password, username } from "../../validators/auth";
import { PasswordFormField } from "../form/PasswordFormField";
import { TextFormField } from "../form/TextFormField";

const schema = yup.object({
  username,
  password,
});

interface IFormValue {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const [modalVisible, setModalVisibility] = useState(false);
  const dispatch = useAuthDispatch();
  const [login] = useLoginMutation();

  const onSubmit = useCallback(
    (values: IFormValue) => {
      login({ variables: { payload: values } })
        .then(res => {
          if (!res.data || !res.data.login) {
            return;
          }

          const { id, email, username, token } = res.data.login;
          dispatch({ type: "SET_USER", payload: { id, username, email } });
          token && dispatch({ type: "SET_TOKEN", payload: { token } });
          setModalVisibility(false);
        })
        .catch(err => {}); // TODO: Handle login failure
    },
    [login, dispatch]
  );

  const formIconStyle: React.CSSProperties = {
    color: "rgba(0,0,0,.25)",
  };

  const formInputStyle: React.CSSProperties = {
    marginTop: 5,
    marginBottom: 10,
  };

  const form = (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ username: "", password: "" } as IFormValue}
      validationSchema={schema}
    >
      {() => (
        <>
          <Form>
            <Typography.Title level={2}>Login</Typography.Title>
            <Field
              label="Username"
              name="username"
              prefix={<Icon type="user" style={formIconStyle} />}
              placeholder="Enter your username"
              style={formInputStyle}
              component={TextFormField}
            />
            <Field
              label="Password"
              name="password"
              prefix={<Icon type="lock" style={formIconStyle} />}
              placeholder="Enter your password"
              style={formInputStyle}
              component={PasswordFormField}
            />
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );

  return (
    <>
      <div onClick={() => setModalVisibility(true)}>Login</div>
      <Modal
        closable={false}
        footer={null}
        centered
        visible={modalVisible}
        onCancel={() => setModalVisibility(false)}
      >
        {form}
      </Modal>
    </>
  );
};
