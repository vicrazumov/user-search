import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  getUsers,
  getNextPage,
  getPreviousPage,
} from '../../modules/users'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';

import debounce from 'lodash/debounce';
const DEBOUNCE_RATE = 400;

const initialState = {
  searchTerm: '',
  loading: false,
};

class Home extends Component {
  state = initialState;

  constructor(props) {
    super(props);

    this.debouncedUserRequest = debounce(props.getUsers, DEBOUNCE_RATE);
  }

  componentDidMount() {
    const { users, getUsers } = this.props;
    if (users.length === 0) getUsers();
  }

  componentDidUpdate(prevProps) {
    const { status, users } = this.props;

    if (prevProps.status !== status && status === 'success' && users.length > 0) {
      this.setState({ loading: true });
      this.imagesToLoad = new Set(users.map(user => user.id));
    }
  }

  handleImageLoaded = id => {
    console.log(id)
    this.imagesToLoad.delete(id);
    if (this.imagesToLoad.size === 0) this.setState({ loading: false });
  }

  handleNextPageClick = () => {
    this.props.getNextPage();
  }

  handlePreviousPageClick = () => {
    this.props.getPreviousPage();
  }

  handleChange = e => {
    const searchTerm = e.target.value;

    this.debouncedUserRequest(searchTerm);
    this.setState({ searchTerm });
  }

  get renderHeader() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>Users</h1>
        {
          this.state.loading &&
          <CircularProgress />
        }
        <TextField
          placeholder="Search..."
          value={this.state.searchTerm}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  renderUserRow = user => (
    <TableRow style={{ height: 109 }} key={user.id}>
      <TableCell>{user.id}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>
        <img
          onLoad={() => this.handleImageLoaded(user.id)}
          alt="avatar"
          style={{
            height: 100,
            width: 100,
            backgroundColor: 'silver'
          }}
          src={user.avatarUrl} />
      </TableCell>
    </TableRow>
  );

  get renderUserTable() {
    return (
      <Paper style={{
        height: 'calc(100vh - 148px)',
        overflow: 'scroll',
        opacity: this.state.loading ? 0.5 : 1
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Avatar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{this.props.users.map(this.renderUserRow)}</TableBody>
        </Table>
      </Paper>
    );
  }

  get renderFooter() {
    return (
      <div style={{ margin: 12, display: 'flex', justifyContent: 'space-between' }}>
        {
          this.props.previousPageUrl ?
            <Button raised color="primary" style={{ marginRight: 8 }} onClick={this.handlePreviousPageClick}>Back</Button>
            : <div />
        }
        {
          this.props.nextPageUrl &&
          <Button raised color="secondary" onClick={this.handleNextPageClick}>More...</Button>
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderHeader}
        {this.renderUserTable}
        {this.renderFooter}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.users,
  status: state.users.status,
  error: state.users.error,
  nextPageUrl: state.users.nextPageUrl,
  previousPageUrl: state.users.previousPageUrl,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getUsers,
  getNextPage,
  getPreviousPage,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
