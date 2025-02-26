import React from "react";
import ResizableDraggableComponent from "../components/draggableComponent";
import { Iframe } from "../components/iframe";
import ThreeDProjection from "../components/threeDProjection";
import Streak from "../components/streak";
import Timer from "../components/timer";
import VideoChat from "../components/videoChat";
import ScreenShare from "../components/screenShare";

// Define the type for the props
interface RNDProps {
    title?: string;  // Optional prop
    description?: string;  // Optional prop
    count?: number;  // Optional prop
    onClick?: () => void;  // Optional prop
}


const RND: React.FC<RNDProps> = ({ title,  }) => {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>{title || "RND"}</h1>
                <VideoChat/>
                <ScreenShare/>
            <ResizableDraggableComponent>
                <div>Content goes here</div>
            </ResizableDraggableComponent>
            <Iframe>
                {{ link: "https://wikipedia.com", name: "Example" }}
            </Iframe>
            <ThreeDProjection/>
            <Timer initialTime={5} />
            <Streak activityDates={["2023-01-01", "2023-01-02", "2023-01-03","2025-02-23", "2025-02-24", "2025-02-25"]} />
        </div>
    );
};

// Set default props if not provided

export default RND;
