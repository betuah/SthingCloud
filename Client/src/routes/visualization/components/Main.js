import React, { Component } from 'react'
import { Redirect, Route, Switch } from "react-router-dom"
import loadable from 'react-loadable'
import LoadingComponent from 'components/Loading'
import { withAuth } from 'components/Auth/context/AuthContext'
import Breadcrumb from 'components/Layout/Breadcrumb'
import MaterialIcon from 'components/MaterialIcon'
import { Grid, Container, Box } from '@material-ui/core'
import GraphList from './GraphList'

let Graph = loadable({
    loader: () => import('./Graph'),
    loading: LoadingComponent
})

class Main extends Component {
    componentDidMount() {
        this.props.checkToken();
    }

    render() {
        const { match } = this.props

        if(!this.props.isLoggedIn)
            return <Redirect push to='/user/signin' />

        return (
            <Box mt={5} mb={5}>
                <Container maxWidth="lg">
                    <Grid container spacing={1} >                        
                        <Switch>
                            <Route exact path={`${match.url}/graph`}>
                                <Grid item xs={12} sm={12}>
                                    <Graph {...this.props} />
                                </Grid>
                            </Route>
                            <Route exact path={`${match.url}`}>                                
                                <Grid container>
                                    <Grid item xs={12} sm={6} container justify="flex-start">
                                        <h5><b><span className="ui-highlight" style={{backgroundColor: '#FF9800'}}><MaterialIcon icon="bar_chart" style={{color: '#FFFFFF'}} />  Visualization   </span></b></h5>
                                    </Grid>
                                    <Grid item xs={12} sm={6} container justify="flex-end">
                                        <Breadcrumb />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <GraphList {...this.props} />
                                    </Grid>
                                </Grid>
                            </Route>
                        </Switch>
                    </Grid>
                </Container>
            </Box>
        )
    }
}

export default withAuth(Main);