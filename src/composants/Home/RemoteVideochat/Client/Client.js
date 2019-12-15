import {FormControl, InputGroup} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React from 'react';

class Client extends React.Component {
  render() {
    return (
      <InputGroup className="mb-3" size="sm">
        <FormControl
          plaintext
          readOnly
          defaultValue={this.props.user}
        />
        <InputGroup.Append>
          <Button
            onClick={() => {this.props.callback(this.props.user)}}
            disabled={!this.props.callAvailable}
            variant="outline-success"
          >
            <i className="material-icons">
              call
            </i>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

export default Client;
