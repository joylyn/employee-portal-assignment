import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class CommonModal extends Component {

    constructor(props) {
      super(props);
      this.state = {
        show: false,
        data: null,
        modalTitle: props.modalTitle ? props.modalTitle : null,
        modalBodyStyle : props.modalBodyStyle ? props.modalBodyStyle : null
      }
    }
  
    showModal = () => {
      this.setState({show: true});
    }
  
    hideModal = () => {
      this.setState({show: false});
    }
  
    render() {
      const {modalBodyStyle, saveBtnTitle, cancelBtnTitle} = this.state;
      return (
        <Modal
          show={this.state.show}
          onHide={this.hideModal}
          backdrop={this.props.hasOwnProperty("backdrop") ? this.props.backdrop : "static"}
          keyboard={this.props.keyboard || false}
          aria-labelledby="contained-modal-title"
          className={"modal-colored-header " + this.props.modalSize}>
          { this.props.showHeader ?
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">{(this.state.modalTitle || this.props.modalTitle)}</Modal.Title>
            </Modal.Header>
            : null
          }
          <Modal.Body  style={modalBodyStyle}>
          {
            this.props.hasOwnProperty("modalBody")
              ? <div><this.props.modalBody ref="BodyComp" data={this.state.data}/></div>
              : <div>{this.props.bodyMsg}</div>
          }
          </Modal.Body>
          { this.props.showFooter ?
            <Modal.Footer>
              {
                this.props.hasOwnProperty("modalFooter")
                  ? <this.props.modalFooter ref="FooterComp" data={this.state.data}/>
                  : <div>
                      { (this.props.showCancelBtn === undefined || (this.props.showCancelBtn !== undefined && this.props.showCancelBtn !== false)) && 
                        <Button onClick={this.hideModal} title={cancelBtnTitle} className="m-r-sm">{this.props.cancelBtnText}</Button>
                      }
                      {
                        this.props.saveBtn === true
                          ? (<Button onClick={this.props.onSaveBtnClick} bsStyle={this.props.saveBtnStyle ||"primary"} title={saveBtnTitle} disabled={this.props.disableSaveButton}>
                            {this.props.saveBtnText}</Button>)
                          : null
                      }
                    </div>
              }
            </Modal.Footer>
            : null
          }
        </Modal>
      )
    }
  }