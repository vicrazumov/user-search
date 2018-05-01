const users = require('./users');
const LIMIT = 10;
const BASIC_URL = '/api/users';

const _getURL = (searchTerm, index) => `${BASIC_URL}${searchTerm ? `?searchTerm=${searchTerm}&` : '?'}page=${index}`;

const getUsers = (req, res) => {
  const { page = 0, searchTerm = '' } = req.query;
  const _searchTerm = searchTerm.toLowerCase();
  const filteredUsers = searchTerm ? users.filter(user => user.name.toLowerCase().includes(_searchTerm)) : users;

  const start = page * LIMIT;
  const end = start + LIMIT;
  const result = filteredUsers.slice(start, end);

  const ret = { result };

  if (filteredUsers.length > end) ret.nextPageUrl = _getURL(searchTerm, +page + 1);
  if (page > 0) ret.previousPageUrl = _getURL(searchTerm, page - 1);

  res.json(ret);
};

module.exports = {
  getUsers,
};
