import React from 'react'
import Button from '@material-ui/core/Button'
import { withAuth } from 'components/Auth/context/AuthContext'

import './styles.scss';

const Error404 = (props) => (
  <div className="err-container text-center">
    <div className="err">
      <h1>404</h1>
      <h2>Sorry, page not found</h2>
    </div>

    <div className="err-body">
      <Button href={props.client_url} variant="contained"> Go Back to Home Page </Button>
    </div>
  </div>
);

const Exception = (props) => (
  <div className="page-err">{console.log(props)}
      <div key="1">
        <Error404 {...props} />
      </div>
  </div>
);

export default withAuth(Exception);
