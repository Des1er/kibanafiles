import React , {useState} from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMasage, serErrorMesage] = useState<string>('');
  const navigate = useNavigate();


  function login(e: { preventDefault: () => void; }){
    e.preventDefault();
    const url = 'http://localhost:4000/getAuthToken';
    fetch(url,{
      method: 'POST',
      headers:{
        
      },
      body: JSON.stringify({
        email: email,
        password: password 
      })
    })
      .then((res) =>{
        return res.json();
      })
      .then((data)=>{
        if (data.authentication_token)
        {
          localStorage.setItem('token',data.authentication_token.token);
          navigate('/')
        }
        else if (data.error.password)
        {
          serErrorMesage(String("Password "+ data.error.password));
        }else
        {
          serErrorMesage(String("Wrong email or password"));
        }
      })
      
  }

  return (
    <>
      <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-sm">
        {errorMasage? <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-3" role="alert">
          <span className="block sm:inline">{errorMasage}</span>   
        </div>: null}
        
        <form className="space-y-6" onSubmit={login} >
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                value={email}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              
            </div>
            <div className="mt-2">
              <input
                value={password}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
export default Login;
