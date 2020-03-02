import React from 'react';
import { withAuth } from 'components/Auth/context/AuthContext'
import axios from 'axios';
import notif from 'components/NotificationPopUp/notif';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import AddDevice from './AddDevice';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import MaterialIcon from 'components/MaterialIcon';

axios.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  config.headers.Authorization = `Bearer ${token}`
  return config
})

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

const columnData = [
  
  { id: 'device', numeric: false, disablePadding: false, label: 'Device' },
  { id: 'desc', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'token', numeric: false, disablePadding: false, label: 'Token' },
  { id: 'lastConn', numeric: false, disablePadding: false, label: 'Last Connection' },
  { id: 'state', numeric: false, disablePadding: false, label: 'State' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, updateData, resetSelected, searchState, handleSearch, url } = props;

  const handleDelete = e => {
    axios
      .delete(`${url}/api/device`, { data: { id: props.selectedData } })
      .then(res => {
        const cb = res.data
        notif('success', 'Success', `Successfully  deleted ${cb.deletedCount} data.`)
        resetSelected()
        updateData()
      })
      .catch(err => {
        if(err.code === 500) {
          notif('error', err.status, err.msg)
        } else {
          notif('error', 'Error', 'Failed delete data.')
        }        
      })
  }

  const searchData = e => {
    const { name, value } = e.target
    const text = name === 'search' && value
    handleSearch(text)
  }

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (             
          <li className="list-inline-item search-box seach-box-right d-none d-md-inline-block">            
            <div className="search-box-inner">              
                <div className="search-box-icon">                  
                    <MaterialIcon icon="search" style={{color: '#00BCD4' }}/>                    
                </div>
                <input onChange={searchData} type="text" name="search" value={searchState} placeholder="Search device ..." />
                <span className="input-bar"></span>                
            </div>            
          </li>           
        )}
      </div>
      <div className={classes.spacer} />
      <div className="col-md-6">
        {numSelected > 0 ? (
          <div className="text-right">
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={handleDelete}>
                <DeleteIcon style={{color: '#F44336'}} />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div className="text-right">         
            <AddDevice updateData={updateData} />
          </div>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'device',
      searchValue: '',
      selected: [],
      data: [
        // createData()
      ],
      page: 0,
      rowsPerPage: 5,
    };

    this.handleData     = this.handleData.bind(this)
    this.handleSearch   = this.handleSearch.bind(this)
    this.updateData     = this.updateData.bind(this)
    this.resetSelected  = this.resetSelected.bind(this)
  }

  resetSelected = () => {
    this.setState({
      selected: []
    })
  }

  handleData = (data) => {
    this.setState({
      data: [...data]
    })
  }

  handleSearch = (val) => {
    this.setState({ searchValue: val })
  }

  updateData = () => {
    const handleData = this.handleData;

    axios.get(`${this.props.url}/api/device`)
    .then((res) => {
        handleData(res.data)
    })
    .catch((err) => {
        localStorage.clear()
    });
  }

  componentDidMount() { 
    this.updateData()
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: state.data.map(n => n._id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          selectedData={this.state.selected} 
          updateData={this.updateData} 
          resetSelected={this.resetSelected} 
          searchState={this.state.searchValue} 
          handleSearch={this.handleSearch}
          url={this.props.url}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter(val => {
                  return val.device.match(this.state.searchValue.toLowerCase())})
                .map(n => {
                  const isSelected = this.isSelected(n._id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n._id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n._id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox" width="5%">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell width="15%" style={{ maxWidth: '15px', whiteSpace: 'normal', wordWrap: 'break-word'}}>{n.device}</TableCell>
                      <TableCell width="20%" style={{ maxWidth: '20px', whiteSpace: 'normal', wordWrap: 'break-word'}}>{n.desc}</TableCell>
                      <TableCell width="40%" style={{ maxWidth: '40px', whiteSpace: 'normal', wordWrap: 'break-word'}}>{n.token}</TableCell>
                      <TableCell width="15%" style={{ maxWidth: '15px', whiteSpace: 'normal', wordWrap: 'break-word'}}>{n.updatedAt}</TableCell>
                      <TableCell width="5%" style={{ whiteSpace: 'normal', wordWrap: 'break-word'}}><span className="ui-highlight" style={n.state === 0 ? {backgroundColor: '#F44336'} : {backgroundColor: '#2196F3'}}>{n.state === 0 ? 'Disconected' : 'Connected'}</span></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-secondary">{data.length === 0 && <strong>No Data Available.</strong>}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const EnhancedTable1 = withStyles(styles)(EnhancedTable);


const Section = (props) => (
  <article className="article">
    <EnhancedTable1 {...props}/>
  </article>
)

export default withAuth(Section);
