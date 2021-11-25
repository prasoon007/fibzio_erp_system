import React from 'react'
import { useState } from 'react';

function Login(props) {
    const [credentials, setCredentials] = useState({ username: '', password: '', authLev: ''});
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/auth/adminSchoolLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: credentials.username, password: credentials.password , authLev: credentials.authLev})
        });
        const json = await response.json();
        console.log(json);
    }
    return (
        <>
            <div className="container my-3">
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">username</label>
                        <input type="text" onChange={onChange} className="form-control" id="username" name="username" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" onChange={onChange} className="form-control" id="password" name="password" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">authLev</label>
                        <input type="number" onChange={onChange} className="form-control" id="authLev" name="authLev" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}

export default Login
