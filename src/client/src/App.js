import React, {useState, useRef, useEffect} from 'react';
import './style.css';

function App() {

	const dataDisplay = useRef();
	const clearForNewData = useRef();
	const serverStatusDisplay = useRef();
	const ws = useRef(null); // use the useRef so the ws can be access by other function
	const URL = 'wss://websocket.dealereprocess.com';

	/**
	 * function to connect to websocket
	 */
	function connectToWebSocket() {

		ws.current = new WebSocket(URL);

		ws.current.onopen = () => {
			serverStatusDisplay.current.innerHTML = "<span class='success'>Connection established</span>";
			console.log("connection establish");
		}

		ws.current.onmessage = (e) => {
			const message = JSON.parse(e.data);

			if ( message.type == "log" ) {
				let logformat = extractLogDetails(message.logdata);
				let formated_data = n2br(logformat);
				let logplaceholder = dataDisplay.current;
				if( clearForNewData.current.checked ) {
					clearData();
				}

				logplaceholder.insertAdjacentHTML('beforeend', "<br/>"+formated_data);
				let placeholder_height = logplaceholder.scrollHeight;
				logplaceholder.scrollTo(0, placeholder_height);
			}
		}

		ws.current.onerror = (e) => {
			console.log("Websocket eror: ", e);
		}

		ws.current.onclose = (e) => {
			serverStatusDisplay.current.innerHTML = "<span class='error'>disconnected to server, reconnecting...</span>";

			// in case of disconnection try to reconnect
			setTimeout(() => {
				if (ws.current) {
					ws.current.close();
				}
				console.log("reconnecting...");
				connectToWebSocket();
			}, 1000);
		}
	}

	useEffect(() => {
		connectToWebSocket()
	}, []);

	/**
	 * Clear the content on dataDisplay
	 */
	function clearData() {
		dataDisplay.current.innerHTML = "";
	}

	// /**
	//  * Extract and format the data
	//  *
	//  * @param {*} data
	//  * @returns string
	//  */
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

	/**
	 * Reload the data from server that was previously loaded
	 */
	 function reloadData() {
		if (ws.current) {
			ws.current.send("reload");
		}
	}

	return (
		<>
			<div className="toolbar">
				<div className="controls">
				<button onClick={reloadData}>Reload</button>
				<button onClick={clearData}>Clear</button>
				<input type="checkbox" ref={clearForNewData} /> Auto-clear
				</div>
				<div ref={serverStatusDisplay} className="status_display"></div>
			</div>
			<div ref={dataDisplay} className="data_display language-java code"></div>
		</>
	);

}

export default App;