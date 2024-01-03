import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk, resetAuth } from '../features/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toast = useToast();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!(password === confirmPassword) || !emailRegex.test(email) || !passwordRegex.test(password)) {
      if (!(password === confirmPassword))
        toast({
          title: "Varying Passwords.",
          description: "Your passwords don't match each other.",
          status: "error",
          position: 'top-right',
          isClosable: true
        });
      if (!emailRegex.test(email))
        toast({
          title: "Invalid Email.",
          description: "Please enter a valid email.",
          status: "error",
          position: 'top-right',
          isClosable: true
        });
      if (!passwordRegex.test(password))
        toast({
          title: "Invalid password.",
          description: "Please enter a secure password with numbers, uppercases as well as lowercases.",
          status: "error",
          position: 'top-right',
          isClosable: true
        });
    } else dispatch(registerThunk({ name, email, password }));
  };
  const { isLoading, isError, isSuccess, message } = useSelector(state => state.auth);

  useEffect(() => {
    if (isSuccess) {
      toast({
        position: 'top-right',
        status: 'success',
        title: 'User Registered.',
        description: "Check your email to verify your account and login.",
        isClosable: true
      });
      navigate('/login');
    };

    if (isError)
      toast({
        position: 'top-right',
        status: 'error',
        title: 'Error.',
        description: message,
        isClosable: true
      });

    dispatch(resetAuth());
  }, [isError, isSuccess, message, navigate, dispatch])

return (
  <div className='w-[60vw] m-auto min-h-screen flex flex-col justify-center gap-6 text-white py-8'>
    <p className='text-4xl uppercase'>Register</p>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input type='text' value={name} onChange={handleNameChange} />
        <FormHelperText textColor="white">This will be used as your username.</FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email address</FormLabel>
        <Input type='text' value={email} onChange={handleEmailChange} />
        <FormHelperText textColor="white">We'll never share your email.</FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input type='password' value={password} onChange={handlePasswordChange} />
        <FormHelperText textColor="white">Choose a secure password with special characters and numbers.</FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input type='password' value={confirmPassword} onChange={handleConfirmPasswordChange} />
        <FormHelperText textColor="white">Rewrite the password to be sure.</FormHelperText>
      </FormControl>
      <Button mt={4} colorScheme='teal' type='submit' isLoading={isLoading}> Register </Button>
    </form>
    <div className='flex items-center gap-4 mx-auto'>
      <p>Already been here?</p>
      <Button colorScheme='teal' type='button' variant='outline' size='sm' onClick={() => navigate('/login')}> Login </Button>
    </div>
  </div>
)
}
export default Register