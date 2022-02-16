import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

ReactDOM.render(
	<>
		<div class="toolbar">
		<div class="controls">
		<button onClick="reload_data()">Reload</button>
		<button onClick="clear_data()">Clear</button>
		<input type="checkbox" id="clear_for_new_data" /> Auto-clear
		</div>
		<div id="ws_server_status" class="status_display"></div>
		</div>
		<div id="server_messages" class="language-java code"></div>
	</>,
  document.getElementById('root')
);