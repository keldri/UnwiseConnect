import React from 'react';
import ItemForm from './Form';
import PropTypes from 'prop-types';

class Item extends React.Component {
	constructor(){
		super();

		this.onEdit = this.onEdit.bind(this);
		this.onDelete = this.onDelete.bind(this);
			
    this.state = {
      isEditing: false,
    };
	}

	onEdit(){
    this.setState({ isEditing: true });
	}

	onDelete(){
		this.props.onDelete(this.props.item.itemId);
	}

	render() {
		const item = this.props.item;

		return (
			<div>
				<h3>Item/Task(ID): {item.summary}</h3>
				<ul> 
					<li>Summary: {item.summary}</li>
					<li>Phase: {item.phase}</li>
					<li>Feature: {item.feature}</li>
					<h3>Budget Hours</h3>
					<ul>
						<li>Phase: {item.budgetHours.column}</li>
						<li>Hours: {item.budgetHours.value}</li>
					</ul>
					<h3>Descriptions</h3>
					<ul>
						<li>
							Workplan: {item.descriptions.workplan}
						</li>
						<li>
							Budget: {item.descriptions.budget}
						</li>
						<li>
							Assumptions: {item.descriptions.assumptions}
						</li>  
						<li>
							Exclusions: {item.descriptions.exclusions}
						</li>
					</ul>
					<li>Tags: {item.tags}</li>
				</ul>
				{this.state.isEditing && (
          <ItemForm 
            item={item}
          />
        )}
        {!this.state.isEditing && (
					<div>
						<button onClick={this.onEdit} className="btn btn-primary">Edit Item</button>
						<button onClick={this.onDelete} className="btn btn-primary">Delete Item</button>
					</div>
				)}
			</div> 
		)
	}
}

Item.propTypes = {
  item: React.PropTypes.object.isRequired,
}



export default Item;
