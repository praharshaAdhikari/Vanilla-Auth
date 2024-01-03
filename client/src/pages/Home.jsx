import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { Button } from "@chakra-ui/react";
import { dataFetchThunk } from "../features/dataSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  const { data } = useSelector(state => state.data);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const handleAuthorizedData = () => {
    dispatch(dataFetchThunk(user.token));
  };
  
  return (
    <div className="h-screen w-screen text-white flex flex-col justify-center items-center">
      { user && <p>Welcome, {user.name}.</p> }
      <Logout className='my-2'/>
      <Button my={4} colorScheme='teal' onClick={handleAuthorizedData}> Get Authorized Data</Button>
      { data.length!==0 && <p>{JSON.stringify(data)}</p> }
    </div>
  )
}
export default Home