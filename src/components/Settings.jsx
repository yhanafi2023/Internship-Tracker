import React, { useState, useEffect } from 'react';
import URL from './config.js';

const Settings = ({ onSettingsChange }) => {
    const [autoRemoveRejected, setAutoRemoveRejected] = useState(() => {
        return JSON.parse(localStorage.getItem("autoRemoveRejected")) || false;
    });

    const handleToggle = () => {
        const newValue = !autoRemoveRejected;
        setAutoRemoveRejected(newValue);
        localStorage.setItem("autoRemoveRejected", JSON.stringify(newValue));
        onSettingsChange({ autoRemoveRejected: newValue });
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Settings</h2>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                maxWidth: "400px"
            }}>
                <div>
                    <div style={{ fontWeight: "bold" }}>Auto-remove Rejected Applications</div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                        Automatically deletes an application when its status is set to Rejected
                    </div>
                </div>
                <div
                    onClick={handleToggle}
                    style={{
                        width: "50px",
                        height: "26px",
                        borderRadius: "13px",
                        background: autoRemoveRejected ? "#667eea" : "#ccc",
                        cursor: "pointer",
                        position: "relative",
                        flexShrink: 0,
                        transition: "background 0.2s"
                    }}
                >
                    <div style={{
                        position: "absolute",
                        top: "3px",
                        left: autoRemoveRejected ? "27px" : "3px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s"
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Settings;