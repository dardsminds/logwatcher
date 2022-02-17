import React, {useState, useEffect} from 'react';
import './style.css';

const URL = 'wss://websocket.dealereprocess.com';

function App() {
	const [message, setMessage] = useState([]);
	const [messages, setMessages] = useState([]);
	const [ws, setWs] = useState(new WebSocket(URL))

	useEffect(() => {
		ws.onopen = () => {
			document.getElementById("ws_server_status").innerHTML = "<span class='success'>Connection established</span>";
		}

		ws.onmessage = (e) => {
			const message = JSON.parse(e.data);
			setMessages()

			if ( message.type == "log" ) {
				let logformat = extractLogDetails(message.logdata);
				let formated_data = n2br(logformat);
				let logplaceholder = document.getElementById("server_messages");

				if( document.getElementById("clear_for_new_data").checked ) {
					document.getElementById("server_messages").innerHTML="";
				}

				logplaceholder.insertAdjacentHTML('beforeend', "<br/>"+formated_data);
				let placeholder_height = logplaceholder.scrollHeight;
				logplaceholder.scrollTo(0, placeholder_height);
			}
		}

		return () => {
			ws.onclose = () => {
				console.log('Websocket Disconnected');
				setWs(new WebSocket(URL));
			}
		}

	}, [ws.onmessage, ws.onopen, ws.onclose, messages]);

	/**
	 * Reload the data from server that was previously loaded
	 */
	function reloadData() {
		if (ws) {
			ws.send("reload");
		}
	}

	function clearData() {
		document.getElementById("server_messages").innerHTML="";
	}

	/**
	 * Extract and format the data
	 *
	 * @param {*} data
	 * @returns string
	 */
	function extractLogDetails(data) {
		let arr = data.match(/\[client(.*)\](.*)/);
		if (!arr) return data;

		let arr1 = arr[0].split(']');
		let log_details = arr1[1];

		let string_index = data.indexOf(log_details);

		let string_data = data.substring(string_index);

		let log_date = data.match(/(\[(.*?)\])/);

		let tag_string = data.match(/(?=#).*?(?=\s)/);

		let ar_referer = string_data.match(/referer:(.*)/g);

		let referer_string = (ar_referer == null) ? "" : ar_referer[0];

		let tag_display = "";
		if (tag_string !== null) {
			tag_display = '<div class="content_tag">' + tag_string[0] + '</div>';
			string_data = string_data.replace(tag_string[0],'');
		}

		//extract the referer: url
		let referer_url = tag_display + '<div class="referer_tag">' + log_date[2] + ' | ' + referer_string + '</div><br/>';

		let log_data = string_data.replace(/, referer:(.*)/g,'');
        return referer_url + log_data;
	}

	// convert all newline character to <br>
	function n2br(data){
		const regex = /\\n|\\r\\n|\\n\\r|\\r/g;
		return data.replace(regex, '<br>')
	}

	return (
		<>
			<div className="toolbar">
			<div className="controls">
			<button onClick={reloadData}>Reload</button>
			<button onClick={clearData}>Clear</button>
			<input type="checkbox" id="clear_for_new_data" /> Auto-clear
			</div>
			<div id="ws_server_status" className="status_display"></div>
			</div>
			<div id="server_messages" className="data_display language-java code"></div>
		</>
	)

}

export default App;
