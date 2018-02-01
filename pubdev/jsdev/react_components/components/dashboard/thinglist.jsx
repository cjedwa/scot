import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Label } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { timeOlderThan } from '../../utils/time';
const NEW_TIME = 24 * 60 * 60; // 1 day
const isNew = ( created ) => {
	return !timeOlderThan( created * 1000, NEW_TIME );
}

const SCOT_API = "/scot/api/v2/"

export default class ThingList extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			data: [],
		}
	}

	static propTypes = {
		thingType: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		queryOptions: PropTypes.object,
		processData: PropTypes.func,
		getSummary: PropTypes.func,
		getLink: PropTypes.func,
		newBadge: PropTypes.bool,
		errorToggle: PropTypes.func,
	}

	static defaultProps = {
		queryOptions: {
			limit: 5,
			offset: 0,
			sort: {
				id: -1,
			},
			columns: ['id', 'subject'],
		},
		processData: ( data ) => {
			return data;
		},
		getSummary: ( thing ) => {
			return thing.subject;
		},
		getLink: ( thingType, thing ) => {
			return `${thingType}/${thing.id}`;
		},
		newBadge: true,
	}

	fetchData() {
		// Force deep copy
		let data = $.extend( true, {}, this.props.queryOptions );
		if ( data.sort ) {
			data.sort = JSON.stringify(data.sort);
		}

		if ( data.filter ) {
			data = {
				...data,
				...data.filter,
			}
			delete data.filter;
		}

		if ( this.props.newBadge ) {
			data.columns.push( 'created' );
		}

		$.ajaxSetup({ traditional: true });
		$.ajax( {
			type: 'get',
			url: SCOT_API + this.props.thingType,
			data: data,
		} ).then(
			( data ) => {
				this.setState( {
					data: this.props.processData( data.records ),
				} );
			},
			( error ) => {
				this.props.errorToggle( "Failed to fetch data: "+ error );
			}
		);
	}

	componentDidMount() {
		this.fetchData();
	}

	genThingItem( thing, i ) {
		// Using this instead of a subcomponent so I don't have to forward all the props
		return (
			<Link key={i} to={this.props.getLink(this.props.thingType, thing)} className="list-group-item">
				{ this.props.getSummary(thing) }
				{ this.props.newBadge && isNew( thing.created ) &&
						<Label bsStyle="primary">New!</Label>
				}
				<i className="fa fa-angle-right" />
			</Link>
		)
	}

	render() {
		const things = this.state.data.map( ( thing, i ) => this.genThingItem( thing, i ) );
		return (
			<div className="ThingList">
				<h1>{this.props.title}</h1>
				<ListGroup>
					{things}
				</ListGroup>
			</div>
		)
	}
}

/**
 * Hardcoded variants of Thinglist
 */
export const Widgets = () => {
	return {
		...RecentIntel,
		...RecentEvents,
		...RecentIncidents,
		...OpenTasks,
	}
};

export const RecentIntel = {
	intel: {
		type: ThingList,
		title: "Recent Intel",
		description: "List of the 5 most recent Intel entries",
		props: {
			thingType: 'intel',
			title: 'Recent Intel',
		}
	},
};

export const RecentEvents = {
	events: {
		type: ThingList,
		title: "Recent Events",
		description: "List of the 5 most recent events",
		props: {
			thingType: 'event',
			title: 'Recent Events',
		}
	},
};

export const RecentIncidents = {
	incidents: {
		type: ThingList,
		title: "Recent Incidents",
		description: "List of the 5 most recent Incidents",
		props: {
			thingType: 'incident',
			title: 'Recent Incidents',
		}
	},
};

export const OpenTasks = {
	tasks: {
		type: ThingList,
		title: "Open Tasks",
		description: "List of recent open tasks",
		props: {
			thingType: 'task',
			title: 'Open Tasks',
			queryOptions: {
				limit: 5,
				offset: 0,
				sort: {
					updated: -1,
				},
				filter: {
					'metadata.task.status': 'open',
				},
				columns: ['id', 'body_plain', 'target'],
			},
			getSummary: ( thing ) => {
				return thing.body_plain.length > 200 ? thing.body_plain.substr(0, 200) +'...' : thing.body_plain;
			},
			getLink: ( thingType, thing ) => {
				let target = thing.target;
				return `${thingType}/${target.type}/${target.id}/${thing.id}`;
			},
		},
	},
}
