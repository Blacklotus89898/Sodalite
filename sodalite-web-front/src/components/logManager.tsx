import { useState } from "react";
import { useLog } from "../stores/hooks";
import { Container } from "./container";

export const LogManager: React.FC = () => {
    const { logs } = useLog();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [sortKey, setSortKey] = useState<"type" | "message" | "time">("time");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const filteredLogs = logs
        .filter((log) => {
            const message = typeof log.Message === "object" && log.Message !== null
                ? (log.Message as { message: string; group: string })
                : { message: "", group: "" };
            const matchesSearch = message.message?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType ? log.Type.toLowerCase() === filterType.toLowerCase() : true;
            const matchesTime =
                (!startTime || new Date(log.Time) >= new Date(startTime)) &&
                (!endTime || new Date(log.Time) <= new Date(endTime));
            return matchesSearch && matchesType && matchesTime;
        })
        .sort((a, b) => {
            let valueA, valueB;
            if (sortKey === "type") {
                valueA = a.Type.toLowerCase();
                valueB = b.Type.toLowerCase();
            } else if (sortKey === "message") {
                const messageA = typeof a.Message === "object" && a.Message !== null
                    ? (a.Message as { message: string }).message
                    : a.Message;
                const messageB = typeof b.Message === "object" && b.Message !== null
                    ? (b.Message as { message: string }).message
                    : b.Message;
                valueA = messageA?.toLowerCase() || "";
                valueB = messageB?.toLowerCase() || "";
            } else {
                const parseTime = (time: string) => new Date(time).getTime();
                valueA = isNaN(parseTime(a.Time)) ? 0 : parseTime(a.Time);
                valueB = isNaN(parseTime(b.Time)) ? 0 : parseTime(b.Time);
            }

            if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
            if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    return (
        <Container maxWidth={1200} maxHeight={1200}>
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
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value as "type" | "message" | "time")}
                        style={{ marginRight: "10px", padding: "5px" }}
                    >
                        <option value="time">Sort by Time</option>
                        <option value="type">Sort by Type</option>
                        <option value="message">Sort by Message</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        style={{ padding: "5px" }}
                    >
                        {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </button>
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
        </Container>
    );
};
