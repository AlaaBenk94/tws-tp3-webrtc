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
    }

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
    }

    gotStream = stream => {
        this.state.localVideoRef.current.srcObject = stream;
        // On fait en sorte d'activer le bouton permettant de commencer un appel
        this.setState({callAvailable: true});
        // this.localStreamRef.current = stream
        this.localStreamRef.current = stream
    }

   /* call() {
        this.setState({callAvailable: false});
        setCall(false);
        setHangup(true);

        client1Ref.current = new RTCPeerConnection(serversRef.current);
        client2Ref.current = new RTCPeerConnection(serversRef.current);

        client1Ref.current.onicecandidate = e => onIceCandidate(client1Ref.current, e);
        client1Ref.current.oniceconnectionstatechange = e => onIceStateChange(client1Ref.current, e);

        client2Ref.current.onicecandidate = e => onIceCandidate(client2Ref.current, e);
        client2Ref.current.oniceconnectionstatechange = e => onIceStateChange(client2Ref.current, e);
        client2Ref.current.ontrack = gotRemoteStream;

        localStreamRef.current
            .getTracks()
            .forEach(track => client1Ref.current.addTrack(track, localStreamRef.current));

        client1Ref.current.createOffer({
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
*/
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
  {/*                  <Button onClick={this.call} disabled={!this.state.callAvailable}>
                        Call
                    </Button>
                    <Button onClick={this.hangUp} disabled={!this.state.hangupAvailable}>
                        Hang Up
                    </Button>*/}
                </ButtonToolbar>
            </div>
        )
    }
}