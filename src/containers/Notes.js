import React, {Component} from "react";
import {API, Storage, Auth} from "aws-amplify";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";
import {s3Upload} from "../libs/awsLib";
import DropdownButton from "react-bootstrap/es/DropdownButton";
import MenuItem from "react-bootstrap/es/MenuItem";
import ButtonToolbar from "react-bootstrap/es/ButtonToolbar";

export default class Notes extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
            note: null,

            content: "",
            projectContent: "",
            projectName: "",
            detail: "",
            attachmentURL: null
        };
    }

    // async getAttributes() {
    //
    //     const user = Auth.currentUserInfo();
    //     const userAtt = Auth.userAttributes(user);
    //     console.log(user);
    //     console.log(userAtt);
    //
    //     return true;
    // }

    async componentDidMount() {
        try {
            let attachmentURL;
            const note = await this.getNote();
            const {content, attachment} = note;

            if (attachment) {
                attachmentURL = await Storage.vault.get(attachment);
            }

            this.setState({
                note,
                content,
                attachmentURL
            });
            this.setState({
                projectContent: content.projectContent,
                projectName: content.projectName,
                detail: content.detail
            });
        } catch (e) {
            alert(e);
        }
    }

    getNote() {
        return API.get("notes", `/notes/${this.props.match.params.id}`);
    }

    validateForm() {
        return this.state.projectContent.length > 0;
    }

    formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    saveNote(note) {
        return API.put("notes", `/notes/${this.props.match.params.id}`, {
            body: note
        });
    }

    handleSubmit = async event => {
        let attachment;

        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({isLoading: true});

        try {
            if (this.file) {
                attachment = await s3Upload(this.file);
            }

            await this.saveNote({
                content: {
                    projectContent: this.state.projectContent,
                    projectName: this.state.projectName,
                    detail: this.state.detail
                },
                attachment: attachment || this.state.note.attachment
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({isLoading: false});
        }
    }

    deleteNote() {
        return API.del("notes", `/notes/${this.props.match.params.id}`);
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({isDeleting: true});

        try {
            await this.deleteNote();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({isDeleting: false});
        }
    }

    handleDropdownButton = event => {
        this.setState({detail: event});
    }

    render() {
        return (


            <div className="Notes">
                {this.state.note &&
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="projectName" bsSize={"large"}>
                        <ControlLabel>Project Name</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.projectName}
                            type={"projectName"}
                        />
                    </FormGroup>

                    <ButtonToolbar>
                        <DropdownButton
                            bsStyle={"success"}
                            title={this.state.detail}
                            key={"statusbutton"}
                            id={"dropdown-basic"}
                            onSelect={this.handleDropdownButton}>
                            <MenuItem eventKey="Completed">Completed</MenuItem>
                            <MenuItem eventKey="Active">Active</MenuItem>
                            <MenuItem eventKey="Pending">Pending</MenuItem>

                        </DropdownButton>
                    </ButtonToolbar>

                    <FormGroup controlId="projectContent">
                        <ControlLabel>Project Describe</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.projectContent}
                            componentClass="textarea"
                        />
                    </FormGroup>
                    {this.state.note.attachment &&
                    <FormGroup>
                        <ControlLabel>Attachment</ControlLabel>
                        <FormControl.Static>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={this.state.attachmentURL}
                            >
                                {this.formatFilename(this.state.note.attachment)}
                            </a>
                        </FormControl.Static>
                    </FormGroup>}
                    <FormGroup controlId="file">
                        {!this.state.note.attachment &&
                        <ControlLabel>Attachment</ControlLabel>}
                        <FormControl onChange={this.handleFileChange} type="file"/>
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Save"
                        loadingText="Saving…"
                    />
                    <LoaderButton
                        block
                        bsStyle="danger"
                        bsSize="large"
                        isLoading={this.state.isDeleting}
                        onClick={this.handleDelete}
                        text="Delete"
                        loadingText="Deleting…"
                    />
                </form>}
            </div>
        );
    }
}