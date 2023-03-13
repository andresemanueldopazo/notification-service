import React, { useState } from 'react';

function App() {
  const [parentName, setParentName] = useState("");
  const [serverEvents, setServerEvents] = useState<EventSource | undefined>(undefined);
  const [sseData, setSseData] = useState<unknown>(undefined);

  return (
    <>
      <input
        onChange={async (e) => setParentName(e.target.value)}
        placeholder="Enter parent name..."
      />
      <button
        onClick={() => {
          const events = new EventSource(`http://localhost:5000/connect?parent=${parentName}`);
          events.onopen = (e) => {
            console.log("Connection open!");
          }
          events.onmessage = (event) => {
            const data = event.data;
            console.log(`Received from server: ${data}`);
            setSseData(data);
          }
          events.onerror = (e) => {
            events.close();
          }
          setServerEvents(events);
        }}
      >
        Connect
      </button>
      <br></br>
      <br></br>
      <button
        onClick={() => {
          serverEvents?.close();
          if (serverEvents)
            console.log(`server events connection: ${serverEvents?.readyState}`)
          setServerEvents(undefined);
          setSseData("Disconnected");
        }}
      >
        Disconnect
      </button>
      <br></br>
      <h3>Server-side event data:</h3>
      {sseData}
    </>
  );
}

export default App;
