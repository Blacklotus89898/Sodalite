import { useLog } from "../stores/hooks";
// import { useEffect } from "react";

export const LogManager: React.FC = () => {
    const { logs } = useLog();

    return (
        <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
            <h2>Log Viewer</h2>
            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {logs.length > 0 ? (
                    logs.map((log, index) => (
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
