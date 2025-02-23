import React from "react";
import ResizableDraggableComponent from "../components/draggableComponent";
import { Iframe } from "../components/iframe";
import ThreeDProjection from "../components/threeDProjection";

// Define the type for the props
interface RNDProps {
    title?: string;  // Optional prop
    description?: string;  // Optional prop
    count?: number;  // Optional prop
    onClick?: () => void;  // Optional prop
}


const RND: React.FC<HomeProps> = ({ title, description, count, onClick }) => {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>{title || "RND"}</h1>
            <ResizableDraggableComponent>
                <div>Content goes here</div>
            </ResizableDraggableComponent>
            <Iframe>
                {{ link: "https://wikipedia.com", name: "Example" }}
            </Iframe>
            <ThreeDProjection/>
        </div>
    );
};

// Set default props if not provided

export default RND;
