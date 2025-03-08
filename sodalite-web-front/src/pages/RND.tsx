import React from "react";
import ResizableDraggableComponent from "../components/draggableComponent";
import Iframe from "../components/iframe";
import ThreeDProjection from "../components/threeDProjection";
import Streak from "../components/streak";
import Timer from "../components/timer";
import VideoChat from "../components/videoChat";
import ScreenShare from "../components/screenShare";
import ManualRTC from "../components/manualRTC";
import Weather from "../components/weather";
import VoiceToText from "../components/voiceToText";
import TextToVoice from "../components/textToVoice";
import ThemeSwitcher from "../components/themeSwitcher";
import CollabApp from "../components/collabApp";
import { CanvaShare } from "../components/canvaShare";
import Notebook from "../components/notebook";
import CodeEditor from "../components/codeEditor";
import PersistentLayout from "../components/persistentLayout";

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
                <PersistentLayout/>
                <Streak />
                <CodeEditor 
                    theme="dark" 
                    chroma="default" 
                    onProfileLoad={(profile) => console.log(profile)} 
                />
                <ScreenShare/>
            {/* <ResizableDraggableComponent>
                <div>Content goes here</div>
            </ResizableDraggableComponent> */}
            <ManualRTC/> 
            <Notebook/>
            <CollabApp/>
            <CanvaShare />
            <Weather/>
            <Iframe initialLink="https://wikipedia.com" name="Example" />   
            <ThreeDProjection/>
            <Timer initialTime={5} />
        </div>
    );
};

// Set default props if not provided

export default RND;
