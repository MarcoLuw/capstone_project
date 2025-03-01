import React from 'react';
import { ListGroup} from 'react-bootstrap';
// import { Link } from 'react-router-dom';

import useWindowSize from '../../../../hooks/useWindowSize';
// import NavSearch from './NavSearch';

const NavLeft = () => {
    const windowSize = useWindowSize();

    // let dropdownRightAlign = false;

    let navItemClass = ['nav-item'];
    if (windowSize.width <= 575) {
        // navItemClass = [...navItemClass, 'd-none'];
    }

    return (
        <React.Fragment>

            <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
                {/* Các phần tử khác trong ListGroup */}

                {/* Thêm đoạn văn bản ở đây */}
                <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
                    <div className="f-w-400 d-flex align-items-center m-b-0" style={{ fontSize: '1.5rem' }}>
                    <i className="feather icon-shopping-cart f-30 text-c-green" style={{ marginRight: '10px' }}/>  E-COMMERCE ANALYTICS SYSTEM 
                    </div>
                </ListGroup.Item>

                {/* Tiếp tục với phần còn lại của component */}
            </ListGroup>

            {/* <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
                <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
                    <Dropdown alignRight={dropdownRightAlign}>
                        <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                            Dropdown
                        </Dropdown.Toggle>
                        <ul>
                            <Dropdown.Menu>
                                <li>
                                    <Link to="#" className="dropdown-item">
                                        Action
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="dropdown-item">
                                        Another action
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="dropdown-item">
                                        Something else here
                                    </Link>
                                </li>
                            </Dropdown.Menu>
                        </ul>
                    </Dropdown>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
                    <NavSearch windowWidth={windowSize.width} />
                </ListGroup.Item>
            </ListGroup> */}
        </React.Fragment>
    );
};

export default NavLeft;
