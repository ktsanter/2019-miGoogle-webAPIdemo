"use strict";

//---------------------------------------------------------------
// Google Web API for retrieving demo data 
//---------------------------------------------------------------

const API_BASE = 'https://script.google.com/a/mivu.org/macros/s/AKfycbwnSjdPvk1V8hEDeMz5zsaDdimmvIcgVFzObNQh/exec';
const API_KEY = 'DemoWebAPI_miGoogle2019';

//--------------------------------------------------------------
// build URL for use with Google sheet web API
//--------------------------------------------------------------
	function _buildApiUrl (datasetname, params) {
    let url = API_BASE;
    url += '?key=' + API_KEY;
    url += datasetname && datasetname !== null ? '&dataset=' + datasetname : '';

    for (var param in params) {
      url += '&' + param + '=' + params[param].replace(/ /g, '%20');
    }

    //console.log('buildApiUrl: url=' + url);
    
    return url;
  }
  
//--------------------------------------------------------------
// use Google Sheet web API to get list of courses
//--------------------------------------------------------------  
async function _getCourseList() {
  var urlParams = {};
  var url = _buildApiUrl('courselist', urlParams);
  
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    return json.data;
    
  } catch (error) {
    console.log('error in _getCourseList: ' + error);
  }
}

//--------------------------------------------------------------
// use Google Sheet web API to get data for the given course
//--------------------------------------------------------------  
async function _getCourseData(courseKey) {
  var urlParams = {
    coursekey: courseKey
  };
  var url = _buildApiUrl('coursedata', urlParams);
  
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    return json.data;
    
  } catch (error) {
    console.log('error in _getCourseData: ' + error);
  }
}

//--------------------------------------------------------------
// use GitHub Developer Markdown API
//--------------------------------------------------------------
function _convertMarkdownToHTML(data, notice, callback, elemToSet) {
  if (true) {  // alternative until I figure out rate limiting from GitHub (change to async/await if re-enabled)
    callback(_alternativeConvertMarkdownToHTML(data), elemToSet);
  }
  /*
	var postData = {
    "text": data,
    "mode": "markdown"
	};
  
  var url = 'https://api.github.com/markdown/raw';
	
	fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: data,
      mode: 'cors'
		})
    .then( (results) => results.text() )
		.then( (textdata) => callback(textdata, elemToSet) )

		.catch((error) => {
			notice('Unexpected error using markdown API');
			console.log(error);
		})
    */
}
