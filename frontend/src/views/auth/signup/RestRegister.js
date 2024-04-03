import React from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import useScriptRef from '../../../hooks/useScriptRef';
import { API_SERVER } from './../../../config/constant';

const RestRegister = ({ className, ...rest }) => {
    let history = useHistory();
    const scriptedRef = useScriptRef();

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    username: Yup.string().required('Username is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            axios
            .post(API_SERVER + 'authen/register', {
                username: values.username,
                email: values.email,
                password: values.password,
            })
            .then(function (response) {
                if (response.data.id) { // Kiểm tra xem phản hồi có chứa 'id' không
                    history.push('/auth/login');
                }
            })
            .catch(function (error) {
                const errorResponse = error.response.data;
                let errorMessage = 'Registration failed. Please try again.';
                // Kiểm tra xem phản hồi có chứa thông báo lỗi về email không
                if (errorResponse.email && errorResponse.email.length > 0) {
                    errorMessage = errorResponse.email[0];
                }
                setStatus({ success: false });
                setErrors({ submit: errorMessage });
                setSubmitting(false);
            });
                    try {
                        axios
                        .post(API_SERVER + 'authen/register', {
                            username: values.username,
                            email: values.email,
                            password: values.password,
                        })
                        .then(function (response) {
                            if (response.data.id) { // Kiểm tra xem phản hồi có chứa 'id' không
                                history.push('/auth/login');
                            }
                        })
                        .catch(function (error) {
                            const errorResponse = error.response.data;
                            let errorMessage = 'Registration failed. Please try again.';
                            // Kiểm tra xem phản hồi có chứa thông báo lỗi về email không
                            if (errorResponse.email && errorResponse.email.length > 0) {
                                errorMessage = errorResponse.email[0];
                            }
                            setStatus({ success: false });
                            setErrors({ submit: errorMessage });
                            setSubmitting(false);
                        });
                } catch (err) {
                    console.error(err);
                    if (scriptedRef.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
                        <div className="form-group mb-3">
                            <input
                                className="form-control"
                                error={touched.username && errors.username}
                                label="Username"
                                placeholder="Username"
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="email"
                                value={values.username}
                            />
                            {touched.username && errors.username && <small className="text-danger form-text">{errors.username}</small>}
                        </div>
                        <div className="form-group mb-3">
                            <input
                                className="form-control"
                                error={touched.email && errors.email}
                                label="Email Address"
                                placeholder="Email Address"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="email"
                                value={values.email}
                            />
                            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                        </div>
                        <div className="form-group mb-4">
                            <input
                                className="form-control"
                                error={touched.password && errors.password}
                                label="Password"
                                placeholder="Password"
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.password}
                            />
                            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
                        </div>

                        {errors.submit && (
                            <Col sm={12}>
                                <Alert variant="danger">{errors.submit}</Alert>
                            </Col>
                        )}

                        <div className="custom-control custom-checkbox  text-left mb-4 mt-2">
                            <input type="checkbox" className="custom-control-input" id="customCheck1" />
                            <label className="custom-control-label" htmlFor="customCheck1">
                                Save credentials.
                            </label>
                        </div>

                        <Row>
                            <Col mt={2}>
                                <Button
                                    className="btn-block"
                                    color="primary"
                                    disabled={isSubmitting}
                                    size="large"
                                    type="submit"
                                    variant="primary"
                                >
                                    Sign UP
                                </Button>
                            </Col>
                        </Row>
                    </form>
                )}
            </Formik>
            <hr />
        </React.Fragment>
    );
};

export default RestRegister;
