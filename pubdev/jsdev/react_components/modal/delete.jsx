import React, { PureComponent } from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const customStyles = {
    content : {
        top     : '50%',
        left    : '50%',
        right   : 'auto',
        bottom  : 'auto',
        marginRight: '-50%',
        transform:  'translate(-50%, -50%)'
    },
    overlay: {
        zIndex: '101'
    }
}

export class DeleteEvent extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			key: props.id,
		};

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
        $.ajax({
            type: 'delete',
            url: 'scot/api/v2/' + this.props.type + '/'  + this.props.id,
            success: function(data) {
                console.log('success: ' + data);
                this.props.deleteToggle(true);
            }.bind(this),
            error: function(data) {
                this.props.errorToggle('Failed to delete', data);  
                this.props.deleteToggle();
            }.bind(this)
        });  
        this.props.history.push( '/' + this.props.type );       
	}

	render() {
		return (
			<Modal isOpen={true} onRequestClose={this.props.deleteToggle} style={customStyles}>
				<div className='modal-header'>
					<img src='images/close_toolbar.png' className='close_toolbar' onClick={this.props.deleteToggle} />
					<h3 id='myModalLabel'>Are you sure you want to delete {this.props.subjectType}: {this.props.id}?</h3>
				</div> 
				<div className='modal-footer'>
					<Button id='cancel-delete' onClick={this.props.deleteToggle}>Cancel</Button>
					<Button bsStyle='danger' id='delete' onClick={this.toggle}>Delete</Button>     
				</div>
			</Modal>
		)
	}
}

export class DeleteEntry extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			key: props.id,
		};

		this.toggle = this.toggle.bind( this );
	}

	toggle() {
        $.ajax({
           type: 'delete',
           url: 'scot/api/v2/entry/' + this.props.entryid,
           success: function(data) {
               console.log('success: ' + data);
               var key = this.state.key;
           }.bind(this),
           error: function(data) {
               this.props.errorToggle('Failed to delete entry', data);
           }.bind(this)
        }); 
        this.props.deleteToggle();
	}

	render() {
        return (
			<Modal isOpen={true} onRequestClose={this.props.deleteToggle} style={customStyles}>
				<div className='modal-header'>
					<img src='images/close_toolbar.png' className='close_toolbar' onClick={this.props.deleteToggle} />
					<h3 id='myModalLabel'>Are you sure you want to delete Entry: {this.props.entryid}?</h3>
				</div>
				<div className='modal-footer'>
					<Button id='cancel-delete' onClick={this.props.deleteToggle}>Cancel</Button>
					<Button bsStyle='danger' id='delete' onClick={this.toggle}>Delete</Button>
				</div>
			</Modal>
        )
	}
}

const deleteObjectType = 
			PropTypes.shape([
				type: PropTypes.string,
				id: PropTypes.number,
			])

export class DeleteModal extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
		};

		this.deleteAll = this.deleteAll.bind(this);
	}

	static propTypes = {
		things: PropTypes.oneOfType([
			deleteObjectType,
			PropTypes.arrayOf(deleteObjectType),
		]).isRequired,
		errorToggle: PropTypes.func.isRequired,
	}

	deleteAll() {
	}

	render() {}
}
