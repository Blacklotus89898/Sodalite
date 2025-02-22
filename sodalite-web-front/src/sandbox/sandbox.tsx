import React from 'react';
import { useEffect, useRef } from 'react';
import { useData } from '../stores/dataContext';
import ServerSettings from '../components/serverSettings';

const Sandbox: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    // const [message, setMessage] = React.useState<string>('Waiting for child answer...');
    const { message, setMessage } = useData();
    useEffect(() => {
        const handleChildMessage = (event: MessageEvent) => {
            console.log('Message received from child:', event.data);
            setMessage(event.data);
        };

        window.addEventListener('message', handleChildMessage);

        return () => {
            window.removeEventListener('message', handleChildMessage);
        };
    }, []);

    const sendMessageToIframe = () => {
        const message = 'Hello from parent';
        iframeRef.current?.contentWindow?.postMessage(message, '*');
    };

    return (
        <div>
            <ServerSettings />
            <h1>Sandbox Component</h1>
            <p>This is a template for the Sandbox component.</p>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11184.958932650527!2d-73.56415999999999!3d45.5052525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a46510f9635%3A0xdde4da9200a4ae74!2sMcGill%20University!5e0!3m2!1sen!2sca!4v1739917144948!5m2!1sen!2sca" width="600" height="450" loading="lazy"></iframe>
            <iframe src='https://en.wikipedia.org/wiki/Main_Page'></iframe>
            <iframe
                ref={iframeRef}
                src='http://127.0.0.1:5500/sodalite-web-front/src/sandbox/index.html'
                width="600"
                height="450"
                loading="lazy"
            ></iframe>
            <button onClick={sendMessageToIframe}>Send Message to iFrame</button>
            <p>{message}</p>
        </div>
    );
};

export default Sandbox;


