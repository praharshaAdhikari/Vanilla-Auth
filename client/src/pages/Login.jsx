import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  useToast
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { loginThunk, resetAuth } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toast = useToast();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth);

  useEffect(() => {
    if (isError)
      toast({
        position: 'top-right',
        status: 'error',
        title: 'Error.',
        description: message,
        isClosable: true
      });
    if (isSuccess || user) navigate('/');
    dispatch(resetAuth());
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      toast({
        title: "Invalid Email.",
        description: "Please enter a valid email.",
        status: "error",
        position: 'top-right',
        isClosable: true
      });
    else dispatch(loginThunk({ email, password }));
  };

  return (
    <div className='w-[60vw] m-auto min-h-screen flex flex-col justify-center gap-6 text-white py-8'>
      <p className='text-4xl uppercase'>Login</p>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type='text' value={email} onChange={handleEmailChange} />
          <FormHelperText textColor="white">We'll never share your email.</FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type='password' value={password} onChange={handlePasswordChange} />
          <FormHelperText textColor="white">Try to remember. Resetting is a bother.</FormHelperText>
        </FormControl>
        <Button mt={4} colorScheme='teal' type='submit' isLoading={isLoading}> Login </Button>
      </form>
      <div className='flex items-center gap-4 mx-auto'>
        <p>New around here?</p>
        <Button colorScheme='teal' type='button' variant='outline' size='sm' onClick={() => navigate('/register')}> Register </Button>
      </div>
    </div>
  )
}
export default Login