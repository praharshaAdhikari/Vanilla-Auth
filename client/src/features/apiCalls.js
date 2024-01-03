import axios from 'axios';

const registerCall = async (registerData) => {
  const res = await axios.post(`/api/register`, registerData);
};

const loginCall = async (loginData) => {
  const res = await axios.post(`/api/login`, loginData)
  if (res.data) {
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  }
  return res;
};

const authorizedDataCall = async (token) => {
  const res = await axios.get(`/api/auth/authData`, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  });
  return res.data ? res.data : res;
}

export {
  registerCall,
  loginCall,
  authorizedDataCall
}