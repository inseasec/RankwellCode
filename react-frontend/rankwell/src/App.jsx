import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import {Navigate} from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/login"
                    element={<AdminLogin/>}/>
                <Route path="/admin/dashboard"
                    element={<AdminDashboard/>}/> {/* <Route path="/admin/dashboard"
                    element={
                        <ProtectedRoute><AdminDashboard/></ProtectedRoute>
                    }/> */}
                <Route path="/"
                    element={
                        <Navigate
                    to="/admin/login"/>
                    }/>
            </Routes>
        </Router>
    );
}

export default App;
