import React from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import {Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import SidePanel from "./SidePanel";
import SignalingConnection from "./SignalingConnection";

export class Videochat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startAvailable: true,
            callAvailable: false,
            hangupAvailable: false,
            userId: 0,
            userName: null,
            usersList: []
        };

        // Refs
        this.localVideoRef = React.createRef();
        this.remoteVideoRef = React.createRef();
        this.localStreamRef = React.createRef();
        this.usernameInput = React.createRef();
        this.client1Ref = React.createRef();
        this.client2Ref = React.createRef();
        this.serversRef = React.createRef();
        this.gotRemoteStream = React.createRef();

        // Binding functions
        this.onSignalingMessage = this.onSignalingMessage.bind(this);
        this.pushUsername = this.pushUsername.bind(this);
        this.start = this.start.bind(this);
        this.call = this.call.bind(this);
        this.gotStream = this.gotStream.bind(this);
        this.onCreateOfferSuccess = this.onCreateOfferSuccess.bind(this);
        this.onCreateAnswerSuccess = this.onCreateAnswerSuccess.bind(this);
        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.hangUp = this.hangUp.bind(this);
    }

    componentDidMount() {
        console.log('Component did mount');
        this.signalingConnection = new SignalingConnection({
            socketURL: window.location.host,
            onOpen: () => {console.log('signalingConnection open')},
            onMessage: this.onSignalingMessage
        });
    }


    // On signaling message received
    onSignalingMessage(msg) {
        console.log('signaling message : ', msg);
        switch (msg.type) {
            case 'id':
                this.setState({userId: msg.id});
                console.log(`changed user id ${JSON.stringify(this.state)}`);
                break;
            case 'userlist':
                console.log(`this is users list ${msg.users}`);
                break;
        }
    };

    pushUsername() {
        this.signalingConnection.sendToServer({
            name: this.usernameInput.current.value,
            date: Date.now(),
            id: this.state.userId,
            type: "username"
        });
    };


    start() {
        this.setState({startAvailable: false});
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true
            })
            .then(this.gotStream)
            .catch(e => {
                console.log(e);
                alert("getUserMedia() error:" + e.name)
            });
    }

    gotStream(stream) {
        this.localVideoRef.current.srcObject = stream;
        // On fait en sorte d'activer le bouton permettant de commencer un appel
        this.setState({callAvailable: true});
        this.localStreamRef.current = stream
    }

    gotRemoteStream(event) {
        this.remoteVideoRef.current.srcObject = event.streams[0];
        // On fait en sorte d'activer le bouton permettant de commencer un appel
        // this.setState({callAvailable: true});
        // this.remoteStreamRef.current = stream
    }

    call() {
        this.setState({callAvailable: false});
        this.setState({hangupAvailable: true})

        this.client1Ref.current = new RTCPeerConnection(/*serversRef.current*/);
        this.client2Ref.current = new RTCPeerConnection(/*serversRef.current*/);

        this.client1Ref.current.onicecandidate = e => this.onIceCandidate(this.client1Ref.current, e);
        this.client1Ref.current.oniceconnectionstatechange = e => {
            console.log("Connexion request")
            onIceStateChange(this.client1Ref.current, e);
        }

        this.client2Ref.current.onicecandidate = e => this.onIceCandidate(this.client2Ref.current, e);
        this.client2Ref.current.oniceconnectionstatechange = e => onIceStateChange(this.client2Ref.current, e);
        this.client2Ref.current.ontrack = e => {
            this.remoteVideoRef.current.srcObject = e.streams[0];
        };

        this.localStreamRef.current
            .getTracks()
            .forEach(track => this.client1Ref.current.addTrack(track, this.localStreamRef.current));

        this.client1Ref.current.createOffer({
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        })
            .then(this.onCreateOfferSuccess, error =>
                console.error(
                    "Failed to create session description",
                    error.toString()
                )
            );

    };

    onCreateOfferSuccess(desc) {

        this.client1Ref.current.setLocalDescription(desc).then(() =>
                console.log("client1 setLocalDescription complete createOffer"),
            error =>
                console.error(
                    "client1 Failed to set session description in createOffer",
                    error.toString()
                )
        );

        this.client2Ref.current.setRemoteDescription(desc).then(() => {
                console.log("client2 setRemoteDescription complete createOffer");
                this.client2Ref.current.createAnswer()
                    .then(this.onCreateAnswerSuccess, error =>
                        console.error(
                            "client2 Failed to set session description in createAnswer",
                            error.toString()
                        )
                    );
            },
            error =>
                console.error(
                    "client2 Failed to set session description in createOffer",
                    error.toString()
                )
        );
    };

    onCreateAnswerSuccess(desc) {

        this.client1Ref.current.setRemoteDescription(desc)
            .then(() => console.log("client1 setRemoteDescription complete createAnswer"),
                error => console.error(
                    "client1 Failed to set session description in onCreateAnswer",
                    error.toString()
                )
            );

        this.client2Ref.current.setLocalDescription(desc)
            .then(() => console.log("client2 setLocalDescription complete createAnswer"),
                error => console.error(
                    "client2 Failed to set session description in onCreateAnswer",
                    error.toString()
                )
            );
    };

    onIceCandidate = (pc, event) => {
        console.log("!!!!pc")
        console.log(pc)
        let otherPc = pc === this.client1Ref ? this.client2Ref.current : this.client1Ref.current;

        otherPc
            .addIceCandidate(event.candidate)
            .then(
                () => console.log("addIceCandidate success"),
                error =>
                    console.error(
                        "failed to add ICE Candidate",
                        error.toString()
                    )
            );
    };

      hangUp() {

          this.client1Ref.current.close();
          this.client2Ref.current.close();

          this.client1Ref.current = null;
          this.client2Ref.current = null;

          this.setState({hangupAvailable: false});
          this.setState({callAvailable: true});
      };

    render() {
        return (
            <Container fluid={true} className="vh-100">
                <Row className="h-100">
                    <Col xs={2}>
                            <Row>
                                <Col>
                                    <InputGroup className="mb-3" size="sm">
                                        <FormControl
                                            ref={this.usernameInput}
                                            placeholder="username"
                                            aria-label="Username"
                                            aria-describedby="basic-addon2"
                                        />
                                        <InputGroup.Append>
                                            <Button onClick={() => {this.pushUsername()}} variant="outline-primary">OK</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Col>
                                List of users :
                                <InputGroup className="mb-3" size="sm">
                                    <FormControl plaintext readOnly defaultValue="User 1" />
                                    <InputGroup.Append>
                                        <Button variant="outline-success">Call</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                            <Row />
                    </Col>
                    <Col xs={10}>
                        <Row className="h-75">
                            <Col xs={6} className="p-0">
                            <video
                                className="w-100"
                                ref={this.localVideoRef}
                                autoPlay
                                muted
                            />
                            </Col>
                            <Col xs={6} className="p-0">
                            <video
                                className="w-100"
                                ref={this.remoteVideoRef}
                                autoPlay
                            />
                            </Col>
                        </Row>
                        <Row className="h-25">
                            <ButtonToolbar>
                                <Button onClick={this.start} disabled={!this.state.startAvailable}>
                                    Start
                                </Button>
                                <Button onClick={this.call} disabled={!this.state.callAvailable}>
                                    Call
                                </Button>
                                <Button onClick={this.hangUp} disabled={!this.state.hangupAvailable}>
                                    Hang Up
                                </Button>
                            </ButtonToolbar>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}