import { useState } from "react";
import { useLog } from "../stores/hooks";

export const LogManager: React.FC = () => {
    const { logs } = useLog();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const filteredLogs = logs.filter((log) => {

        console.log(JSON.stringify(log));
        // console.log(searchTerm.toLowerCase());
        const message = typeof log.Message === "object" && log.Message !== null 
            ? (log.Message as { message: string; group: string }) 
            : { message: "", group: "" };
        const matchesSearch = message.message.toLowerCase().includes(searchTerm.toLowerCase());
        console.log(matchesSearch);
        const matchesType = filterType ? log.Type.toLowerCase() === filterType.toLowerCase() : true;
        const matchesTime =
            (!startTime || new Date(log.Time) >= new Date(startTime)) &&
            (!endTime || new Date(log.Time) <= new Date(endTime));
        return matchesSearch && matchesType && matchesTime;
    });

    return (
        <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
            <h2>Log Viewer</h2>
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Search logs..."    
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginRight: "10px", padding: "5px" }}
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ marginRight: "10px", padding: "5px" }}
                >
                    <option value="">All Types</option>
                    <option value="info">Info</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="chatapp">Chat</option>
                </select>
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ marginRight: "10px", padding: "5px" }}
                />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{ marginRight: "10px", padding: "5px" }}
                />
            </div>
            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                        <div key={index} style={{ marginBottom: "5px" }}>
                            <strong>[{log.Time}] [{log.Type.toUpperCase()}]:</strong>{" "}
                            {typeof log.Message === "object" ? JSON.stringify(log.Message) : log.Message}
                        </div>
                    ))
                ) : (
                    <p>No logs available.</p>
                )}
            </div>
        </div>
    );
};
