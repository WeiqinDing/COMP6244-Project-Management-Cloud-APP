import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom"

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            notes: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const notes = await this.notes();
            this.setState({ notes });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    notes() {
        return API.get("notes", "/notes");
    }

    renderNotesList(notes) {
        return [{}].concat(notes).map(
            (note, i) =>
                i !== 0
                    ? <LinkContainer
                        key={note.noteId}
                        to={`/notes/${note.noteId}`}
                    >
                        <ListGroupItem header={"Title: " + note.content.projectName.trim().split("\n")[0]}>  {/*note.content.trim().split("\n")[0]*/}
                            {"Created: " + new Date(note.createdAt).toLocaleString()}
                        </ListGroupItem>
                    </LinkContainer>
                    : <LinkContainer
                        key="new"
                        to="/notes/new"
                    >
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Create a new project
                            </h4>
                        </ListGroupItem>
                    </LinkContainer>
        );
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>GitProject</h1>
                <p>A Project Library</p>
                <div>
                    <Link to="/login" className="btn btn-success btn-lg">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-info btn-lg">
                        Signup
                    </Link>
                </div>

            </div>
        );
    }

    renderNotes() {
        return (
            <div className="notes">
                <PageHeader>Your Projects</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderNotesList(this.state.notes)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
            </div>
        );
    }
}