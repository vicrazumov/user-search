import React from 'react';
import Users from '../users'

import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
})

const App = props => (
  <div>
    <main>
      <Users />
    </main>
  </div>
)

export default withStyles(styles)(App)
