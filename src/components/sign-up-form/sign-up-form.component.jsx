import React, {useState} from 'react';

import  FormInput  from '../form-input/form-input.component';
import Button from '../button/button.component';

import { 
    createAuthUserWithEmailAndPassword, 
    createUserDocumentFromAuth 
} from '../../utils/firebase/firebase.utils';

import './sign-up-form.styles.scss';

//object to help keep track of the input fields 
const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const SignUpForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields)
    const {displayName, email, password, confirmPassword} = formFields;

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if(password !== confirmPassword){
            alert("passwords do not match")
            return;
        }

        try {
            // user is a destructed vale of response
            const { user } = await createAuthUserWithEmailAndPassword(
                email,
                password
            ); 

            await createUserDocumentFromAuth(user, {displayName}); // Building a user document object and getting the user display name
            resetFormFields();

        } catch(error){
            if(error.code === 'auth/email-already-in-use'){
                alert('cannot create user, email already in use');
            }else{
                console.log('user creation encoutered an error', error);
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
        <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>

        {/* name acts as an identifer for each input field */}
        <FormInput
            label="Display Name"
            type='text' 
            required 
            onChange={handleChange} 
            name='displayName' 
            value={displayName}
        />

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

        <FormInput
            label="Confirm Password"
            type='password' 
            required 
            onChange={handleChange} 
            name='confirmPassword'
            value={confirmPassword}
        />

        <Button type='submit'>Sign Up</Button>
      </form>
    </div>
  )
}

export default SignUpForm
