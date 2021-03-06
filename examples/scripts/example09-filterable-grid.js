var ReactGrid             = require('../build/react-data-grid');
var QuickStartDescription = require('../components/QuickStartDescription')
var ReactPlayground       = require('../assets/js/ReactPlayground');

var EditableExample = `
var Toolbar = ReactDataGrid.Toolbar;

//helper to generate a random date
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
}

//helper to create a fixed number of rows
function createRows(numberOfRows){
  var _rows = [];
  for (var i = 1; i < numberOfRows; i++) {
    _rows.push({
      id: i,
      task: 'Task ' + i,
      complete: Math.min(100, Math.round(Math.random() * 110)),
      priority : ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
      issueType : ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
      startDate: randomDate(new Date(2015, 3, 1), new Date()),
      completeDate: randomDate(new Date(), new Date(2016, 0, 1))
    });
  }
  return _rows;
}

//function to retrieve a row for a given index
var rowGetter = function(i){
  return _rows[i];
};

//Columns definition
var columns = [
{
  key: 'id',
  name: 'ID',
  width: 80,
  filterable: true,
  filterKey: 'filter_id'
},
{
  key: 'task',
  name: 'Title',
  filterable: true,
  filterKey: 'filter_task'
},
{
  key: 'priority',
  name: 'Priority',
  filterable: true,
  filterKey: 'filter_priority'
},
{
  key: 'issueType',
  name: 'Issue Type',
  filterable: true,
  filterKey: 'filter_issueType'
},
{
  key: 'complete',
  name: '% Complete',
  filterable: true,
  filterKey: 'filter_complete'
},
{
  key: 'startDate',
  name: 'Start Date',
  filterable: true,
  filterKey: 'filter_startDate'
},
{
  key: 'completeDate',
  name: 'Expected Complete',
  filterable: true,
  filterKey: 'filter_completeDate'
}
]


var Example = React.createClass({

  getInitialState : function(){
    var originalRows = createRows(1000);
    var rows = originalRows.slice(0);
    for (var i = 0; i < rows.length; i++) {
      for (var column_key in columns) {
        var column = columns[column_key];
        if (column.filterable)
          rows[i][column.filterKey] = String(rows[i][column.key]).toLowerCase();
      }
    }
    //store the original rows array, and make a copy that can be used for modifying eg.filtering, sorting
    return {originalRows : originalRows, rows : rows, filters : {}};
  },

  rowGetter : function(rowIdx){
    return this.state.rows[rowIdx];
  },

  filterRows : function(originalRows, filters) {
    var rows = [];
    for (var rowIdx = 0; rowIdx < originalRows.length; rowIdx++) {
      var row = originalRows[rowIdx];
      var include = true;

      for (var column_key in filters) {
        var column;
        for (var colIdx = 0; colIdx < columns.length; colIdx++) {
          if (columns[colIdx].key == column_key)
            column = columns[colIdx]
        }
        if (!column)
          continue;

        var rowFilterValue = row[column.filterKey];
        if (rowFilterValue.indexOf(filters[column_key]) == -1) {
          include = false;
          break;
        }
      }

      if (include)
        rows.push(row);
    }
    return rows;
  },

  handleFilterChange : function(filter){
    this.setState(function(currentState) {
      if (filter.filterTerm)
        currentState.filters[filter.columnKey] = filter.filterTerm;
      else
        delete currentState.filters[filter.columnKey];
      currentState.rows = this.filterRows(currentState.originalRows, currentState.filters);
      return currentState;
    });
  },

  render:function(){
    return(
      <ReactDataGrid
        columns={columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500}
        toolbar={<Toolbar enableFilter={true}/>}
        onAddFilter={this.handleFilterChange}/>
    )
  }

});

React.render(<Example />, mountNode);
`;

module.exports = React.createClass({

  render:function(){
    return(
      <div>
      <h3>Filterable Columns Example</h3>
      <p>While ReactDataGrid doesn't not provide the ability to filter directly, it does provide hooks that allow you to provide your own filter function. This is done via the <code>onAddFilter</code> prop. To enable filtering for a given column, set <code>column.filterable = true</code> for that column. Now when the header cell has a new filter value entered for that column, <code>onAddFilter</code> will be triggered passing the filter key and value.</p>
      <ReactPlayground codeText={EditableExample} />
      </div>
    )
  }

});
