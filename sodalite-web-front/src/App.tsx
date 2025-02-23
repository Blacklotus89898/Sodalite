import { CanvaShare } from './components/canvaShare';
import { AudioIntensity } from './components/audioIntensity';
import Sandbox from './sandbox/sandbox';
import { Container } from './components/container';
import { Iframe } from './components/iframe';
import { ChatApp } from './components/chatApp';
import CollabApp from './components/collabApp';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Footer from './components/footer';
import ServerSettings from './components/serverSettings';

const wikiProps = {
  link: 'https://en.wikipedia.org/wiki/Main_Page',
  name: 'Wikipedia',
};

const sidebarItems = [
  { label: 'Chat', href: '#ChatApp' },
  { label: 'Sandbox', href: '#sandbox' },
  { label: 'Iframe', href: '#Iframe' },
  { label: 'Audio Intensity', href: '#AudioIntensity' },
  { label: 'Canva Share', href: '#CanvaShare' },
];

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar items={sidebarItems} position='left' />

        <div style={{ flex: 1, margin: '3em', marginTop: '0px' }}>
          <Section id="sandbox">
            <Container>
              <Sandbox />
            </Container>
          </Section>
          <Section id="ChatApp">
            <Container>
              <ChatApp />
              <CollabApp />
            </Container>
          </Section>
          <Section id="Iframe">
            <Container>
              <Iframe children={wikiProps} />
            </Container>
          </Section>
          <Section id="AudioIntensity">
            <Container>
              <AudioIntensity />
            </Container>
          </Section>
          <Section id="CanvaShare">
            <Container>
              <CanvaShare />
            </Container>
          </Section>
        </div>

        <Sidebar items={sidebarItems} position='right' children={<ServerSettings />} />
      </div>

      <Footer></Footer>
    </div>
  );
}

const Section = ({ id, children }: { id: string, children: React.ReactNode }) => (
  <div id={id} style={{ marginBottom: '16px' }}>
    {children}
  </div>
);

export default App;
