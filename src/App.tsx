import React from 'react';
import Login from './Login';
import Files from './Files';
import Header from './Header';
import ChangeFile from './ChangeFile';
import CreateFile from './CreateFile';
import './index.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Header>
        <Routes>
          <Route path='/login' element= {<Login/>}/>
          <Route path='/' element= {<Files/>}/>
          <Route path='/configure' element= {<ChangeFile/>}/>
          <Route path='/createfile' element= {<CreateFile/>}/>
        </Routes>
      </Header>
    </BrowserRouter>

  );
}

export default App;
