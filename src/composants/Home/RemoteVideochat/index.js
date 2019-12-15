import React from "react";

import Button from "react-bootstrap/Button";
import {ButtonGroup, Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import SignalingConnection from "./SignalingConnection";
import PeerConnection from "./PeerConnection";
import Client from "./Client/Client";

class RemoteVideochat extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      startAvailable: true,
      callAvailable: true,
      hangupAvailable: false,
      userId: 0,
      userName: "user",
      usersList: []
    };

    // Refs
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.localStreamRef = React.createRef();
    this.usernameInput = React.createRef();
  }

  componentDidMount() {
    console.log('Component did mount');
    this.signalingConnection = new SignalingConnection({
      socketURL: window.location.host,
      onOpen: () => {
        console.log('signalingConnection open')
      },
      onMessage: this.onSignalingMessage
    });
  }

  onSignalingMessage = msg => {
    console.log('signaling message : ', msg);
    switch (msg.type) {
      case 'id':
        this.setState({userId: msg.id});
        console.log(`changed user id ${JSON.stringify(this.state)}`);
        break;
      case "rejectusername":
        this.usernameInput.current.value = msg.name;
        this.setState({userName: msg.name});
        break;
      case 'userlist':
        console.log(`this is users list ${msg.users}`);
        this.setState({usersList: [...msg.users], userName: this.usernameInput.current.value});
        break;

      // Signaling messages: these messages are used to trade WebRTC
      // signaling information during negotiations leading up to a video
      // call.
      case "connection-offer": // Invitation and offer to chat
        console.log(`[ recv ] connection-offer from ${msg.name} to ${msg.target}`);
        this.targetUsername = msg.name;
        this.createPeerConnection();
        this.peerConnection.connectionOffer(msg);
        break;

      case "connection-answer": // Callee has answered our offer
        console.log(`[ recv ] connection-answer from ${msg.name} to ${msg.target}`);
        this.peerConnection.connectionAnswer(msg);
        break;

      case "new-ice-candidate": // A new ICE candidate has been received
        this.peerConnection.newICECandidate(msg);
        break;

      case "hang-up": // The other peer has hung up the call
        this.close();
        break;
    }
  };

  pushUsername = () => {
    this.signalingConnection.sendToServer({
      name: this.usernameInput.current.value,
      date: Date.now(),
      id: this.state.userId,
      type: "username"
    });
  };


  start = () => {
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
  };

  call = user => {
    this.targetUsername = user; // ref et non state
    this.createPeerConnection();
    this.peerConnection.offerConnection();
    this.setState({
      callAvailable: false,
      hangupAvailable: true
    });
  };

  createPeerConnection = () => {
    if (this.peerConnection) return;
    console.log(`creating connection from ${this.state.userName} to ${this.targetUsername.value}`);
    this.peerConnection = new PeerConnection({
      gotRemoteStream: this.gotRemoteStream,
      gotRemoteTrack: this.gotRemoteTrack,
      signalingConnection: this.signalingConnection,
      onClose: this.closeVideoCall,
      localStream: this.localStreamRef.current,
      username: this.state.userName,
      targetUsername: this.targetUsername.value
    });
  };

  gotStream = stream => {
    this.localVideoRef.current.srcObject = stream;
    this.setState({callAvailable: true});
    this.localStreamRef.current = stream;
  };

  gotRemoteTrack = event => {
    let remoteVideo = this.remoteVideoRef.current;
    if (remoteVideo.srcObject !== event.streams[0]) {
      remoteVideo.srcObject = event.streams[0];
    }
    this.setState({hangupAvailable: true});
  };

  gotRemoteStream = event => {
    let remoteVideo = this.remoteVideoRef.current;
    if (remoteVideo.srcObject !== event.streams[0]) {
      remoteVideo.srcObject = event.streams[0];
    }
  };

  close = () => {
    this.peerConnection.close();
    this.peerConnection = null;
    this.closeVideoCall();
  };

  closeVideoCall = () => {
    this.remoteVideoRef.current.srcObject &&
    this.remoteVideoRef.current.srcObject
      .getTracks()
      .forEach(track => track.stop());
    this.remoteVideoRef.current.src = null;

    // Mettre à jour l'état des boutons, et supprimer targetUsername.
    this.setState({
      callAvailable: true,
      hangupAvailable: false
    });
    this.targetUsername = null;
  };

  render() {

    let userList = [];
    for (let i = 0; i < this.state.usersList.length; i += 1)
      userList.push(
        <Client key={i}
                user={this.state.usersList[i]}
                callAvailable={this.state.callAvailable}
                callback={this.call}/>
      );

    return (
      <Container fluid={true} className="vh-100">
        <Row className="h-100 justify-content-center align-item-center-center">
          <Col xs={2} className="sidePanel pt-3">
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
                    <Button onClick={() => {
                      this.pushUsername()
                    }} variant="outline-primary">OK</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Row>
            <Col>
              <h6>Online users</h6>
              {userList}
            </Col>
            <Row/>
          </Col>
          <Col xs={9} id="videosContainer">
            <Row className="vh-100">
              <Col>
                <Row className="h-75">
                  <Col xs={6}>
                    <video
                      className="w-100"
                      ref={this.localVideoRef}
                      autoPlay
                      muted
                    />
                  </Col>
                  <Col xs={6}>
                    <video
                      className="w-100"
                      ref={this.remoteVideoRef}
                      autoPlay
                    />
                  </Col>
                </Row>
                <Row className="h-25 align-content-center justify-content-center">
                  <Col className="text-center flex-row justify-content-center align-content-center">
                    <ButtonGroup>
                      <Button
                        variant="success"
                        onClick={this.start} disabled={!this.state.startAvailable}>
                        <i className="material-icons">
                          videocam
                        </i> Start
                      </Button>
                      <Button
                        className="ml-1"
                        variant="danger"
                        onClick={this.close} disabled={!this.state.hangupAvailable}>
                        <i className="material-icons">
                          call_end
                        </i> HangUp
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default RemoteVideochat;