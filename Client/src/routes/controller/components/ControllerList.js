import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { withAuth } from 'components/Auth/context/AuthContext'
import axios from 'axios';
import notif, { deleteConfirm } from 'components/NotificationPopUp/notif';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import DeleteIcon from '@material-ui/icons/Delete';
import AddControl from './AddControl';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import MaterialIcon from 'components/MaterialIcon';
import { withStyles } from '@material-ui/core/styles';
import { 
    TableBody, 
    TableCell, 
    TableHead, 
    TablePagination, 
    TableRow, 
    TableSortLabel, 
    Toolbar, 
    Typography, 
    Paper, 
    Table, 
    Checkbox, 
    IconButton, 
    Tooltip
} from '@material-ui/core';

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
  
  { id: 'controllerId', disablePadding: false, label: 'Controller ID' },
  { id: 'name', disablePadding: false, label: 'Controller Name' },
  { id: 'desc', disablePadding: false, label: 'desc' },
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
    paddingRight: theme.spacing(),
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
  const { numSelected, classes, updateData, resetSelected, searchState, handleSearch, server_url } = props;

  const handleDelete = e => {
    deleteConfirm(confirm => {
      if(confirm)
        axios
          .delete(`${server_url}/api/controller`, { data: { id: props.selectedData } })
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
    })
  }

  const searchData = e => {
    const { name, value } = e.target
    const text = name === 'search' && value
    handleSearch(text)
  }

  const handleControllerDefault = e => {
    axios
      .put(`${server_url}/api/controller/default/${props.selectedData}`)
      .then(res => {
        notif('success', 'Success', `Default controller was changed.`)
        resetSelected()
        updateData()
      })
      .catch(err => {
        if(err.code === 500) {
          notif('error', err.status, err.msg)
        } else {
          notif('error', 'Error', 'Failed change default controller.')
        }        
      })
  }

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant={"inherit"}>
            {numSelected} selected
          </Typography>
        ) : (             
          <li className="list-inline-item search-box seach-box-right d-none d-md-inline-block">            
            <div className="search-box-inner">              
                <div className="search-box-icon">                  
                    <MaterialIcon icon="search" style={{color: '#00BCD4' }}/>                    
                </div>
                <input onChange={searchData} type="text" name="search" value={searchState} placeholder="Search by name ..." />
                <span className="input-bar"></span>                
            </div>            
          </li>           
        )}
      </div>
      <div className={classes.spacer} />
      <div className="col-md-6">
        {numSelected === 1 ? (
          <div className="text-right">
            <Tooltip title="Set Default Graph">              
              <IconButton aria-label="Copy" onClick={handleControllerDefault}>
                <BeenhereIcon style={{color: '#4CAF50'}} />
              </IconButton>              
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={handleDelete}>
                <DeleteIcon style={{color: '#F44336'}} />
              </IconButton>
            </Tooltip>            
          </div>
        ) : ( numSelected > 1 ? (
          <div className="text-right">
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={handleDelete}>
                <DeleteIcon style={{color: '#F44336'}} />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div className="text-right">         
            <AddControl updateData={updateData} />
          </div>
        ))}
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
    marginTop: theme.spacing() * 3,
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
      orderBy: 'name',
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
    axios.get(`${this.props.server_url}/api/controller`)
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
    const { selected, data } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let dataToken = '';

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      dataToken = newSelected.length === 1 ? data.filter(data => data._id === newSelected[0] && data) : ''
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      dataToken = newSelected.length === 1 ? data.filter(data => data._id === newSelected[0] && data) : ''
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      dataToken = newSelected.length === 1 ? data.filter(data => data._id === newSelected[0] && data) : ''
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
      dataToken = newSelected.length === 1 ? data.filter(data => data._id === newSelected[0] && data) : ''
    }

    const token = dataToken ? dataToken[0].token : '';
    this.setState({ selected: newSelected, tokenSelected: token });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected      = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    let controller_default = null;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    data.forEach(item => {
      if (item.controller_default === 1)
      controller_default = item._id
    });

    if (controller_default && !this.props.location.hash) 
      return <Redirect push to={`/app/controller/${controller_default}`} />

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          selectedData={this.state.selected} 
          updateData={this.updateData} 
          resetSelected={this.resetSelected} 
          searchState={this.state.searchValue} 
          handleSearch={this.handleSearch}
          server_url={this.props.server_url}
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
                  return val.controller.match(this.state.searchValue.toLowerCase())})
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
                      <TableCell width="15%" style={{ maxWidth: '15px', whiteSpace: 'normal', wordWrap: 'break-word'}}>{n._id}</TableCell>
                      <TableCell width="25%" style={{ maxWidth: '50px', whiteSpace: 'normal', wordWrap: 'break-word'}}>
                        <Tooltip title={`Click to access graph`}>
                          <Link className="link-animated-hover link-hover-v3" to={`/app/controller/${n._id}`}>{<b style={{color: '#FF9800'}}>
                            {n.controller}</b>}
                          </Link>                          
                        </Tooltip>&nbsp;&nbsp;&nbsp;
                        {n.controller_default === 1 && <small><span className="ui-highlight" style={{backgroundColor: '#2196F3'}}>Default</span></small>}                        
                      </TableCell>
                      <TableCell width="60%" style={{ maxWidth: '80px', whiteSpace: 'normal', wordWrap: 'break-word'}}>{n.desc}</TableCell>
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
