import React, { useEffect, useState } from 'react';
import './CssFiles/Stats.css';
import { Helmet } from 'react-helmet';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const Stats = () => {
    const [users, setUsers] = useState([]); // Store user data

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "Players"); // Reference Firestore collection
                const snapshot = await getDocs(usersCollection);
                const usersList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <Helmet>
                <title>Statistics Page</title>
            </Helmet>
            
            <div className="stats-container">
                <h1 className="title">User Statistics</h1>
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>UID</th>
                            <th>Money</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.uid}</td>
                                <td>${user.money}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Stats;
