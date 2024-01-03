import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk, resetAuth } from "../features/authSlice";
import { Button } from "@chakra-ui/react";
import { resetData } from "../features/dataSlice";

const Logout = ({className}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = ()=> {
    dispatch(logoutThunk());
    navigate('/login');
    dispatch(resetAuth());
    dispatch(resetData());
  };

  return (
    <Button className={className} mt={4} colorScheme='teal' onClick={handleLogout}> Logout </Button>
  )
}
export default Logout