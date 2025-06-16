export const signUpFormControls = [
    {
        name: 'userName',
        label: 'User Name',
        placeholder: 'Enter Your User Name',
        type: 'text',
        componentType: 'input'
    },
    {
        name: 'userEmail',
        label: 'Email',
        placeholder: 'Enter Your Email',
        type: 'email',
        componentType: 'input'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter Your Password',
        type: 'password',
        componentType: 'input'
    },
]
export const signInFormControls = [
    {
        name: 'userEmail',
        label: 'Email',
        placeholder: 'Enter Your Email',
        type: 'email',
        componentType: 'input'
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter Your Password',
        type: 'password',
        componentType: 'input'
    },
]

export const initialSignUpFormData = {
    userName: '',
    userEmail: '',
    password: ''
}

export const initialSignInFormData = {
    userEmail: '',
    password: ''
}