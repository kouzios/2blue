import React, {useEffect, useState} from 'react';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const users = await res.json();
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
        <h1 className="mb-5 text-center">All Users</h1>
        {JSON.stringify(users)}
    </div>
  );
}

export default App;
