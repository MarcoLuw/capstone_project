import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

// import GuestGuard from './components/Auth/GuestGuard';
import AuthGuard from './components/Auth/AuthGuard';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
    <Suspense fallback={<Loader />}>
        <Switch>
            {routes.map((route, i) => {
                const Guard = route.guard || Fragment;
                const Layout = route.layout || Fragment;
                const Component = route.component;

                return (
                    <Route
                        key={i}
                        path={route.path}
                        exact={route.exact}
                        render={(props) => (
                            <Guard>
                                <Layout>{route.routes ? renderRoutes(route.routes) : <Component {...props} />}</Layout>
                            </Guard>
                        )}
                    />
                );
            })}
        </Switch>
    </Suspense>
);

const routes = [
    {
        exact: true,
        path: '/auth/login',
        component: lazy(() => import('./views/auth/signin/SignIn'))
    },
    {
        exact: true,
        path: '/auth/register',
        component: lazy(() => import('./views/auth/signup/SignUp'))
    },
    {
        path: '*',
        layout: AdminLayout,
        guard: AuthGuard,
        routes: [
            {
                exact: true,
                path: '/dashboard',
                component: lazy(() => import('./views/report/dashboard'))
            },

            {
                exact: true,
                path: '/create',
                component: lazy(() => import('./views/home/create'))
            },
            {
                exact: true,
                path: '/browse',
                component: lazy(() => import('./views/home/browse'))
            },

            {
                exact: true,
                path: '/forecast',
                component: lazy(() => import('./views/report/forecast'))
            },

            {
                exact: true,
                path: '/datasource',
                component: lazy(() => import('./views/report/datasource/data'))
            },

            {
                exact: true,
                path: '/chat-bot',
                component: lazy(() => import('./views/extra/Chatbot'))
            },
            {
                path: '*',
                exact: true,
                component: () => <Redirect to={BASE_URL} />
            }
        ]
    }
];

export default routes;
