import React, {useState} from 'react';

import  FormInput  from '../form-input/form-input.component';
import Button from '../button/button.component';

import { 
    signInWithGooglePopup, 
    createUserDocumentFromAuth,
    signInAuthUserWithEmailAndPassword 
} from '../../utils/firebase/firebase.utils';

import './sign-in-form.styles.scss';

//object to help keep track of the input fields 
const defaultFormFields = {
    email: '',
    password: ''
}

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields)
    const { email, password} = formFields;

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const signInWithGoogle = async () =>{
        await signInWithGooglePopup();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await signInAuthUserWithEmailAndPassword(email, password);
            resetFormFields();

        } catch(error){
            switch(error.code){
                case 'auth/wrong-password':
                    alert('Incorrect password for email');
                break;

                case 'auth/user-not-found':
                    alert('no user associated with this email');
                break;

                default:
                    console.log(error);
            }
        }
    }

    const handleChange  = (event) => {
        //name of each input field is set as an identifier
        // allows us to tell setState(setFormFields) which event is being fired
        const { name, value } = event.target;

        //using the spread operator to affect the appropriate property value in formfields object
        setFormFields({...formFields, [name]: value});

    }

  return (
    <div className='sign-up-container'>
        <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={handleSubmit}>

        {/* name acts as an identifer for each input field */}
        <FormInput
            label="Email"
            type='email' 
            required 
            onChange={handleChange} 
            name='email'
            value={email}
        />

        <FormInput
            label="Password"
            type='password' 
            required 
            onChange={handleChange} 
            name='password'
            value={password}
        /> 

        <div className='buttons-container'>
            <Button type='submit'>Sign In</Button>
            {/* using type=button to prevent google sign to automatically submit details */}
            <Button  type='button' buttonType= 'google' onClick={signInWithGoogle}>
                Google Sign In
            </Button>
        </div> 
      </form>
    </div>
  )
}

export default SignInForm
