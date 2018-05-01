import axios from 'axios';

import { GET_USERS, SERVER } from './apiConstants';

const GET_USERS_REQUEST = 'GET_USERS_REQUEST';
const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
const GET_USERS_ERROR = 'GET_USERS_ERROR';

const initialState = {
  users: [],
  status: null,
  error: null,
  nextPageUrl: null,
  previousPageUrl: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_REQUEST:
      return {
        ...state,
        status: 'request',
        users: [],
      }
    case GET_USERS_SUCCESS:
      return {
        ...state,
        status: 'success',
        users: action.payload.result,
        nextPageUrl: action.payload.nextPageUrl,
        previousPageUrl: action.payload.previousPageUrl,
      }
    case GET_USERS_ERROR:
      return {
        ...state,
        status: 'error',
        error: action.error,
      }

    default:
      return state
  }
}

const _usersRequest = (dispatch, url) => {
  dispatch({ type: GET_USERS_REQUEST });

  return axios.get(url)
  .then(response => {
    dispatch({
      type: GET_USERS_SUCCESS,
      payload: response.data,
    })
  })
  .catch(err => dispatch({
    type: GET_USERS_ERROR,
    error: err.message,
  }));
}

export const getUsers = (searchTerm = '') => dispatch => {
  _usersRequest(dispatch, `${GET_USERS}?searchTerm=${searchTerm}`);
}


export const getNextPage = () => (dispatch, getState) => {
  const { nextPageUrl } = getState().users;
  if (nextPageUrl)
    return _usersRequest(dispatch, `${SERVER}${nextPageUrl}`);
}

export const getPreviousPage = () => (dispatch, getState) => {
  const { previousPageUrl } = getState().users;
  if (previousPageUrl)
    return _usersRequest(dispatch, `${SERVER}${previousPageUrl}`);
}

