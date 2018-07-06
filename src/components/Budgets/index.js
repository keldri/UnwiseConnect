import * as BudgetsActions from '../../actions/budgets';
import Form from './Item/Form';
import List from './List';
import * as search from 'searchtabular';
import React, { Component } from 'react';
import Table from './Table';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { compose } from 'redux';
import { multiInfix } from '../../helpers/utils';

class Budgets extends Component {
	constructor(props) {
		super();

    this.state = {
      filter: {
        field: 'summary',
        value: '',
      },
    };    

    this.filterItems = this.filterItems.bind(this);
    this.onAdd    = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit   = this.onEdit.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.search   = this.search.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(BudgetsActions.subscribe());
  }

  filterItems(items, query) {
    const rows = this.props.items;
    const columns = this.props.fields.map((field) => ({
      property: field.name,      
      header: {
        label: field.label,
      },
      filterType:field.filterType,
    }));

    const searchExecutor = search.multipleColumns({ 
      columns, 
      query, 
      strategy: multiInfix });
    const visibleItems = compose(searchExecutor)(rows);

    return visibleItems;
  }

  onFilter({ field = this.state.filter.field, value = this.state.filter.value }) {
    this.setState({
      filter: {
        field,
        value,
      },
    }); 
    
    const newQuery = {
      ...this.props.query,
      [field]: value,
    };

    this.props.dispatch(BudgetsActions.search({ query: newQuery })); 
  }

  onAdd(item) {
    this.props.dispatch(BudgetsActions.addItem({ item }));
  }

  onDelete(itemId) {
    this.props.dispatch(BudgetsActions.removeItem({ itemId }));
  }

  onEdit(updatedItem) {
    this.props.dispatch(BudgetsActions.updateItem({ updatedItem }));
  }

  renderList() {

     return (
       <List
         items={this.props.items}
         filter={this.state.filter}
         filterItems={this.filterItems}
         fields={this.props.fields}
         onFilter={this.onFilter}
         onEdit={this.onEdit}
         onDelete={this.onDelete}
         query={this.props.query}
       />
     );
   }

   renderTable() {

    return (
      <Table 
        fields={this.props.fields}
        filterItems={this.filterItems}
        items={this.props.items}
        query={this.props.query}
        search={this.search}
        toggleColumn={this.toggleColumn}
        userColumns={this.props.userColumns}
      /> 
    );
   }

   search(query) {
     this.props.dispatch(BudgetsActions.search({ query }));
   }

   toggleColumn(payload){
     this.props.dispatch(BudgetsActions.toggleColumn({ columnName: payload.columnName }));
   }


  render() {

    return (
      <div>
        <div className="panel-uc panel panel-default">
          <div className="panel-uc__heading panel-heading clearfix">
            <h4>Budget Tool</h4>
          </div>
        </div>
        <div className="row panel-body">
          <div className="panel-body projects__wrapper">
            <Form
              onSubmit={this.onAdd}
              fields={this.props.fields}
            />
            <h3>View Selection</h3>
            <ul>
              <li>
                <Link to={this.props.match.url + '/list'}>List</Link>
              </li>
              <li>
                <Link to={this.props.match.url + '/table'}>Table</Link>
              </li>
            </ul>
            <Route 
              exact path={this.props.match.url} 
              render={this.renderList}
            />
            <Route 
              path={this.props.match.url + '/list'} 
              render={this.renderList}
            />
            <Route 
              path={this.props.match.url + '/table'} 
              render={this.renderTable}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.budgets.items,
  fields: state.budgets.fields,
  query: state.budgets.query,
  userColumns: state.budgets.userColumns,
})

export default connect(mapStateToProps)(Budgets);
