import React from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";

export class Videochat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startAvailable: true,
            callAvailable: false,
            hangupAvailable: false
        };
        this.localVideoRef = React.createRef();
        this.remoteVideoRef = React.createRef();
        this.localStreamRef= React.createRef();
        this.client1Ref= React.createRef();
        this.client2Ref= React.createRef();
        this.serversRef= React.createRef();
        this.gotRemoteStream=React.createRef();

        this.start=this.start.bind(this)
        this.call=this.call.bind(this)
    }

    start(){
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

    gotStream = stream => {
        this.localVideoRef.current.srcObject = stream;
        // On fait en sorte d'activer le bouton permettant de commencer un appel
        this.setState({callAvailable: true});
        this.localStreamRef.current = stream
    }

    call() {
        this.setState({callAvailable: false});
        this.setState({hangupAvailable : true})

        this.client1Ref.current = new RTCPeerConnection(/*serversRef.current*/);
        this.client2Ref.current = new RTCPeerConnection(/*serversRef.current*/);

        this.client1Ref.current.onicecandidate = e => onIceCandidate(this.client1Ref.current, e);
        this.client1Ref.current.oniceconnectionstatechange = e =>{
            console.log("Connexion request")
            onIceStateChange(this.client1Ref.current, e);
        }

        this.client2Ref.current.onicecandidate = e => onIceCandidate(this.client2Ref.current, e);
        this.client2Ref.current.oniceconnectionstatechange = e => onIceStateChange(this.client2Ref.current, e);
        this.client2Ref.current.ontrack = gotRemoteStream;

        this.localStreamRef.current
            .getTracks()
            .forEach(track => this.client1Ref.current.addTrack(track, this.localStreamRef.current));

        this.client1Ref.current.createOffer({
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        })
            .then(onCreateOfferSuccess, error =>
                console.error(
                    "Failed to create session description",
                    error.toString()
                )
            );

    };

  /*  hangUp() {

        client1Ref.current.close();
        client2Ref.current.close();

        client1Ref.current = null;
        client2Ref.current = null;

        setHangup(false)
        setCall(true)
    };*/

    render() {
        return (
            <div>
                <video
                    ref={this.localVideoRef}
                    autoPlay
                    muted
                />
                <video
                    ref={this.remoteVideoRef}
                    autoPlay
                />

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
            </div>
        )
    }
}