import React from 'react';
import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import LocalVideochat from "./LocalVideochat";
import RemoteVideochat from "./RemoteVideochat";

class Home extends React.Component {

  state = {
    firstVisit: true,
    local: true
  };

  render() {
    return (
      <Container fluid={true}>
        {this.state.firstVisit ?
          <>
            <Row className="vh-100 align-content-center justify-content-center">
              <Col>
                <Row className="align-content-center justify-content-center">
                  <Col xs={6} className="text-center">
                    <h1>TWS TP3 WebRTC</h1>
                    <p>Simple video chat using React, WebSocket & WebRTC</p>
                    <h3>Developers</h3>
                    <h6>AISSAOUI Abdelwalid & BENKARRAD Alaa Eddine</h6>
                  </Col>
                </Row>
                <Row className="align-content-center justify-content-center">
                  <Col className="text-center">
                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="primary"
                        onClick={() => this.setState({firstVisit: false})}
                      >LocalVersion</Button>
                      <Button
                        variant="primary"
                        onClick={() => this.setState({firstVisit: false, local: false})}
                      >RemoteVersion</Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
          </> :
          (this.state.local ? <LocalVideochat/> : <RemoteVideochat/>)}
      </Container>
    );
  }
}

export default Home;
