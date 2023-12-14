import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
const LogInicioSesion = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/logConexiones").then((response) => {
            setLogs(response.data);
        })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div >
            <Navbar />
            <h1 className="text-center">Logs de inicio de sesion</h1>
            {logs.map((log) => (
                <div key={log._id} className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{log.usuario}</h5>
                        <p className="card-text">
                            Timestamp: {log.timestamp}<br />
                            Caducidad: {log.caducidad}<br />
                            Token: {log.token}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );

}

export default LogInicioSesion;