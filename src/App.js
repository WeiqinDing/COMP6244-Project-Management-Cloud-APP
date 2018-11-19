import React, {Component, Fragment} from "react";
import {Link, withRouter} from "react-router-dom";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import {LinkContainer} from "react-router-bootstrap";
import {API, Auth} from "aws-amplify";
import {Button} from "react-bootstrap";
import DropdownButton from "react-bootstrap/es/DropdownButton";
import MenuItem from "react-bootstrap/es/MenuItem";
import ButtonToolbar from "react-bootstrap/es/ButtonToolbar";


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            userID: "",
            userRole: "",
            userEmail: "",
            searchText: ""
        };
    }

    async componentDidMount() {
        try {
            await Auth.currentSession();
            this.userHasAuthenticated(true);
            await this.handleUserInfo();

        }
        catch (e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({isAuthenticating: false});
    }

    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    }

    handleLogout = async event => {
        await Auth.signOut();

        this.userHasAuthenticated(false);

        this.props.history.push("/login");
    }

    handleChange = async event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSearch = async event => {
        console.log(this.state.searchText);
    }

    handleUserInfo = async event => {
        let user = await Auth.currentUserInfo();
        let userE = await Auth.currentAuthenticatedUser();
        const user_ID = user.id;
        const user_Email = userE.attributes.email;
        console.log(user_ID + "\n" + user_Email);


        this.setState({
            userID: user_ID,
            userEmail: user_Email
        });

        console.log(this.state.userID, this.state.userEmail);
        //const userCertain = await API.get("notes", `/certainrole/${user_ID}`);


        // this.setState({
        //     userRole: userCertain.userRole
        // });

        console.log(this.state);
    }



    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };


        return (

            !this.state.isAuthenticating &&
            <div className="App container">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/" className={"mid"}>GitProject</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated
                                ? <Fragment>
                                    {/*<NavItem onClick={this.handleUserClick}>{this.state.userInfo}</NavItem>*/}
                                    <NavItem>
                                        <ButtonToolbar>
                                            <DropdownButton
                                                bsStyle={"default"}
                                                title={this.state.userEmail}
                                                key={"userbutton"}
                                                id={"dropdown-basic-user"}>
                                                {/*<MenuItem eventKey="status">{this.state.userRole}</MenuItem>*/}
                                                <MenuItem eventKey="status">Admin</MenuItem>
                                            </DropdownButton>
                                        </ButtonToolbar>
                                    </NavItem>
                                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                </Fragment>
                                : <Fragment>

                                    <LinkContainer to="/signup">
                                        <NavItem>Signup</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>

                                </Fragment>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps}/>
            </div>
        );
    }


}


export default withRouter(App);