import React, { Component, Fragment } from 'react' //React Library
import { withAuth } from 'components/Auth/context/AuthContext' // AuthContext
import MaterialIcon from 'components/MaterialIcon' // Icon Function
import { TextField, Button } from '@material-ui/core' // Material UI library
import Firebase, { FireAuth, FireGoogleAuthProvider } from 'config/Firebase' // Load firebase from config
import notif from 'components/NotificationPopUp/notif' // Notification Function
import { Modal } from 'antd' // Antd Library

import SignInModal from './SignInModal' //Import SignIn Modal

class PasswordForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showModal: false,
            data: {
                newPassword: '',
                confirmPassword: ''
            },
            loading: {
                googleLoading: false,
                githubLoading: false,
                signinLoading: false,
            },
            modalForm: {                
                email: '',
                password: ''
            }
        }

        /* Start Bind All Function */
        this.handleChange       = this.handleChange.bind(this)
        this.handleOk           = this.handleOk.bind(this)
        this.handleLoading      = this.handleLoading.bind(this)
        this.handleSignInChange = this.handleSignInChange.bind(this)
        this.updatePassword     = this.updatePassword.bind(this)
        this.signInWithGoogle   = this.signInWithGoogle.bind(this)
        this.signInWithEmailPassword = this.signInWithEmailPassword.bind(this)
        /* End Bind A;; Function */
    }

    /* Start function for initial state */
    componentDidMount = () => {
        const { initUser } = this.props // InitUser from context
        const profile = JSON.parse(localStorage.getItem('profileData')) // Get data profile from localstorage

        initUser() // Call function for init profile state in context

        this.setState({
            uid: profile.uid,
            modalForm : { 
                email: profile.email,
                password: ''
            }
        })
    }
    /* End function for initial state */

    /* Start Function for handle loading at the button */
    handleLoading = (req, action) => {
        if (req === 'all') { // Reqest for all loading 
            this.setState({
                loading: {
                    googleLoading: action,
                    githubLoading: action,
                    signinLoading: action,
                }
            })
        } else { // Request for specified loading
            this.setState({
                loading: {
                    ...this.state.loading,
                    [req]: action
                }            
            })
        }
    }
    /* End Function for handle loading at the button */

    /* Start Function Handle input function for change password form */ 
    handleChange = e => {
        const { name, value } = e.target // Init name and value from input target

        this.setState({ // Set input value to state
            data: {
                ...this.state.data,
                [name]: value
            }
        })
    }
    /* End Handle input function for change password form */ 

    /* Start Handle input function for Sign In form */ 
    handleSignInChange = e => {
        const { name, value } = e.target // Init name and value from input target

        this.setState({ // Set input value to state
            modalForm: {
                ...this.state.modalForm,
                [name]: value
            }
        })
    }
    /* End Handle input function for Sign In form */ 

    /* Start close modal function*/
    handleCloseModal = () => {
        this.setState({ // Set state for reset sign in modal form and change password form
            ...this.state,
            showModal: false,
            data: {
                newPassword: '',
                confirmPassword: ''
            },
            modalForm: {
                ...this.state.modalForm,
                password: ''
            }
        })
    }
    /* End close modal function*/

    /* Start function for re authenticate with Google Account*/
    signInWithGoogle = () => {        
        this.handleLoading('googleLoading', true) // Set loading at google sign button
        const user = FireAuth.currentUser // Init Firebase current user and function

        // Re-Authenticate with methode Google Account
        user.reauthenticateWithPopup(FireGoogleAuthProvider) // Show google sign in popup
        .then(res => { // If google account valid with existing signed account
            this.updatePassword() // Rungging update password function
        }).catch(err => { // If google account not valid with existing signed account
            notif('error', 'Sign In Failed!' , `It's look like your google account doesn't match to your current user signed`) // Notification if credential not valid
        })
    }
    /* End function for re authenticate with Google Account*/

    /* Start function for re authenticate with Email and Password methode*/
    signInWithEmailPassword = e => {
        e && e.preventDefault() // Hold Form for not refresh the page
        const { modalForm }   = this.state // Init Form data value for sign Form
        const user      = FireAuth.currentUser // Init Firebase current user and function
        let credential  = Firebase.auth.EmailAuthProvider.credential(modalForm.email, modalForm.password) // Create credential from Firebase Auth

        this.handleLoading('signinLoading', true) // Set loading at sign button

        // Re-Authenticate with methode Email And Password
        user.reauthenticateWithCredential(credential).then(() => {
            this.updatePassword() // If credential valid, will run update password function
        }).catch(err => { // If credential Not valid
            notif('error', 'Sign In Failed!' , `It's look like user you're entered doesn't match to your current user signed or your password is wrong.`) // Notification if credential not valid
        });
    }
    /* End function for re authenticate with Email and Password methode*/

    /* Start Function for update password */
    updatePassword = () => {
        const { data }  = this.state
        const user      = FireAuth.currentUser
        
        user.updatePassword(data.newPassword).then(() => {
            notif('success', 'Success!' , `Password was updated.`) // Notif if password updated
            this.handleCloseModal() // Reset password and signin form
            this.handleLoading('all', false) // set off for all loading
        }).catch(error => {
            // Error handling for update password
            notif('error', 'Failed update Password!' , `Some thing wrong from the server. Please contact Administrator to fix this.`)
        })
    }
    /* End Function for update password */

    /* Start Function for handle button change password action */
    handleOk = (e) => {
        e.preventDefault() // Hold Form for not refresh the page
        const { data } = this.state // Init data value from state

        if (data.newPassword.length < 8) {
            // Validate IF Password length less than 8
            notif('warning', 'Warning!' , 'Minimum password length is 8 characters.')
        } else if (data.newPassword !== data.confirmPassword) {
            // Validate If password and confirm password not match
            notif('error', 'Password Not Match!' , 'Please type your password again.')
            this.setState({ // If password not match will reset password form value
                data: {
                    ...data,
                    newPassword: '',
                    confirmPassword: ''
                }
            })
        } else {
            // If valid value will popup sign in modal for re authenticate
            this.setState({
                showModal: true
            })
        }
    }
    /* End Function for handle button change password action */

    render() {
        const { data, showModal } = this.state // Init state in render function

        return (
            <Fragment>
                <Modal
                    visible={showModal}
                    onCancel={this.handleCloseModal}
                    closable={true}
                    width={500}
                    className="custom-modal-dialog"
                    footer={false}
                >
                    <SignInModal handleChange={this.handleSignInChange} handleOk={this.signInWithEmailPassword} signInWithGoogle={this.signInWithGoogle} {...this.state.loading} {...this.state.modalForm} />
                </Modal>

                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-md-12">
                            <div className="row justify-content-center">
                                <form onSubmit={this.handleOk} className="form-v1 col-xs-12 col-md-8">
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="lock" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="newPassword"
                                                name="newPassword"
                                                label="New Password"
                                                type="password"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}
                                                required
                                                placeholder="Your old password"
                                                value={data.newPassword}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group-v1">
                                            <div className="input-group-icon">
                                                <MaterialIcon icon="lock" style={{color: '#00BCD4'}} />
                                            </div>
                                            <TextField                                   
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                type="password"
                                                fullWidth
                                                autoComplete="off"
                                                onChange={this.handleChange}
                                                required
                                                placeholder="Type your new password again"
                                                value={data.confirmPassword}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group d-flex justify-content-center">
                                        <Button className="col-md-4" variant="contained" color="primary" type="submit"> Change Password </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withAuth(PasswordForm)