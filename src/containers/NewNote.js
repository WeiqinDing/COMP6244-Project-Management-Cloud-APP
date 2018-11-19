import React, {Component} from "react";
import {FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {API, Auth} from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";
import {s3Upload} from "../libs/awsLib";

export default class NewNote extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,

            projectContent: "",
            projectName: "",
            detail: "Active"

        };
    }

    validateForm() {
        return this.state.projectContent.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }


    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    handleSubmit = async event => {
        event.preventDefault();

        if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        this.setState({isLoading: true});

        try {
            const attachment = this.file
                ? await s3Upload(this.file)
                : null;

            await this.createNote({
                attachment,
                content: {
                    projectContent: this.state.projectContent,
                    projectName: this.state.projectName,
                    detail: this.state.detail
                }

            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({isLoading: false});
        }
    }

    createNote(note) {
        return API.post("notes", "/notes", {
            body: note
        });
    }

    render() {

        return (
            <div className="NewNote">
                <form onSubmit={this.handleSubmit}>
                    {/*<input type="text" className="form-control js-blob-filename js-breadcrumb-nav" name="projectname"
                           defaultValue="Name your project…" autoFocus="autofocus"/>*/}
                    <FormGroup controlId="projectName" bsSize="large">
                        <ControlLabel>Project Name</ControlLabel>
                        <FormControl
                            autoFocus
                            type={"projectName"}
                            value={this.state.projectName}
                            onChange={this.handleChange}

                        />
                    </FormGroup>
                    <FormGroup controlId="projectContent">
                        <ControlLabel>Project Describe</ControlLabel>
                        <FormControl
                            componentClass="textarea"
                            type={"projectContent"}
                            value={this.state.projectContent}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="file">
                        <ControlLabel>Attachment</ControlLabel>
                        <FormControl onChange={this.handleFileChange} type="file"/>
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Create"
                        loadingText="Creating…"
                    />
                </form>
            </div>
        );
    }
}