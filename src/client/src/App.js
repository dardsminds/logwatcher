import React from 'react';
import './style.css';
import Connector from './Connector';

function App() {

  return (
	<>
		<Connector />
		<div class="toolbar">
		<div class="controls">
		<button onClick="reload_data()">Reload</button>
		<button onClick="clear_data()">Clear</button>
		<input type="checkbox" id="clear_for_new_data" /> Auto-clear
		</div>
		<div id="ws_server_status" class="status_display"></div>
		</div>
		<div id="server_messages" class="language-java code"></div>
	</>
  );

}

export default App;
