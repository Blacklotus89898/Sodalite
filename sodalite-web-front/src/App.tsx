import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CanvaShare } from './components/canvaShare'
import { AudioIntensity } from './components/audioIntensity'
import Sandbox from './sandbox/sandbox'
import { Container } from './components/container'
import { Iframe } from './components/iframe'
import { ChatApp } from './components/chatApp'
import CollabApp from './components/collabApp'

function App() {
  // const [count, setCount] = useState(0)
  const wikiProps = {
    link: 'https://en.wikipedia.org/wiki/Main_Page',
    name: 'Wikipedia'
  }

  return (
    <>
    <Container>
      <ChatApp></ChatApp>
      <CollabApp></CollabApp>
    </Container>

    <Container>
    <Sandbox></Sandbox>
    </Container>
  
    <Container>
    <Iframe>{wikiProps}</Iframe>
    </Container>
  
    <Container>
    <AudioIntensity></AudioIntensity>
    </Container>
    <Container>
    <CanvaShare></CanvaShare>
    </Container>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {/* <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
