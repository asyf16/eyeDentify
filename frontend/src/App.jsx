import React, { useState } from 'react';
import { useNavContext } from './context/NavContext';
import {Routes, Route, useNavigate} from "react-router-dom"
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Homepage from './pages/Homepage';
import UploadPics from './pages/UploadPics';
import Collection from './pages/Collection';
import './output.css';

function App() {   
    return (
        <>  
            <Routes>
                <Route path='/' element={<Homepage/>}></Route>
                <Route path='/home' element={<Homepage/>}></Route>
                <Route path='/login' element={<Login/>}></Route>
                <Route path='/register' element={<SignUp/>}></Route>
                <Route path='/upload' element={<UploadPics/>}></Route>
                <Route path='/collection' element={<Collection/>}></Route>
            </Routes>
        </>
    );
}

export default App;
