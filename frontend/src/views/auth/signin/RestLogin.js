import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import useScriptRef from '../../../hooks/useScriptRef';
import { API_SERVER } from './../../../config/constant';
import { ACCOUNT_INITIALIZE } from './../../../store/actions';

const RestLogin = ({ className, ...rest }) => {
    const dispatcher = useDispatch();
    const scriptedRef = useScriptRef();
    let history = useHistory();

    const setJwtCookie = (jwt) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (60 * 60 * 1000)); // Set hạn sử dụng là 7 ngày
        document.cookie = `jwt=${jwt}; expires=${expires.toUTCString()}; path=/; secure; SameSite=None;`;
    };

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        axios
                        .post(API_SERVER + 'authen/login', {
                            email: values.email,
                            password: values.password,
                        })
                        .then(function (response) {
                            if (response.data.jwt) { // Kiểm tra xem phản hồi có chứa JWT không
                                setJwtCookie(response.data.jwt); // Lưu trữ JWT vào cookie
                                dispatcher({
                                    type: ACCOUNT_INITIALIZE,
                                    payload: { isLoggedIn: true, token: response.data.jwt }
                                });
                                history.push('/create');
                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            } else {
                                // Xử lý trường hợp không nhận được JWT
                                setStatus({ success: false });
                                setErrors({ submit: 'Login failed. Please try again.' });
                                setSubmitting(false);
                            }
                        })
                        .catch(function (error) {
                            const errorResponse = error.response.data;
                            let errorMessage = 'Login failed. Please try again.';
                            if (errorResponse.detail) {
                                errorMessage = errorResponse.detail;
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
                                    Login
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

export default RestLogin;
