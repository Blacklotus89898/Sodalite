import React from "react";
import { AudioIntensity } from "../components/audioIntensity";
import { CanvaShare } from "../components/canvaShare";
import CodeEditor from "../components/codeEditor";
import CollabApp from "../components/collabApp";
import { ChatApp } from "../components/chatApp";
import FileUploadComponent from "../components/fileUploadComponent";
import ManualRTC from "../components/manualRTC";
import TextComparator from "../components/textComparator";
import ModalTrigger from "../components/vanishingModal";
import FileShare from "../components/wsFileSharing";
import ContactBook from "../components/contactBook";
import CalendarPicker from "../components/calendarPicker";
import ReminderCreator from "../components/reminder";
import { LogManager } from "../components/logManager";

// Define the type for the props
interface HomeProps {
    title?: string;  // Optional prop
    description?: string;  // Optional prop
    count?: number;  // Optional prop
    onClick?: () => void;  // Optional prop
}


const Home: React.FC<HomeProps> = ({ title,  }) => {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>{title || "Home"}</h1>
            <div style={{display: 'flex'}}>
                <LogManager/>
            {/* <ReminderCreator/> */}
            {/* <CalendarPicker/> */}
            {/* <ContactBook/> */}
            {/* <FileShare websocketUrl="ws://192.168.0.103:8080"/> */}
            {/* <ManualRTC/> */}
            {/* <ChatApp/> */}
            {/* <CollabApp/> */}
            {/* <AudioIntensity/>*/}
             {/* <CanvaShare /> */}
             {/* <CodeEditor></CodeEditor> */}
             {/* <CollabApp></CollabApp> */}
             {/* <ChatApp/> */}
            {/* <FileUploadComponent/> */}
            {/* <ModalTrigger/> */}
            {/* <TextComparator/> */}
            </div>
        </div>
    );
};

// Set default props if not provided

export default Home;
