"use strict";

//---------------------------------------------------------------
// Google Web API for retrieving demo data 
//---------------------------------------------------------------

// these both come from the App Script 
//  - the API base is given when you publish the web app
//  - the API key is a constant defined in the script
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
// send GET request to Google web app API
//   title: name of request (for debug and error messages)
//   dataset: dataset name passed to API
//   params: JSON object holding any other query parameters passed to the API
//   funcError: (optional) function for error reporting
//--------------------------------------------------------------
async function _webAppGet(title, dataset, params, funcError) {
  var url = _buildApiUrl(dataset, params);
  
  try {
    const resp = await fetch(url);
    const json = await resp.json();

    if (json.status != 'success') {
      if (funcError != null) funcError(title, {name: 'API failure', message: json.text});
      console.log('error in ' + title + ': ' + json.text);
    }
    return json.data;
    
  } catch (error) {
    if (funcError != null) funcError(title, error);
    console.log('error in ' + title + ': ' + error);
  }
}

//--------------------------------------------------------------
// send POST request to Google web app API
//   title: name of request (for debug and error messages)
//   dataset: dataset name passed to API
//   params: JSON object holding data passed to the API
//   funcError: (optional) function for error reporting
//--------------------------------------------------------------
async function _webAppPost(title, dataset, postData, funcError) {
  var url = _buildApiUrl(dataset, {});
  
  try {
    const resp = await fetch(url, {method: 'post', contentType: 'application/x-www-form-urlencoded', body: JSON.stringify(postData)});  
    const json = await resp.json();

    if (json.status != 'success') {
      if (funcError != null) funcError(title, {name: 'API failure', message: json.text});
      console.log('error in ' + title + ': ' + json.text);
      return null;
    } else {
      return json.data;
    }

  } catch (error) {
    if (funcError != null) funcError(title, error);
    console.log('error in ' + title + ': ' + error);
  }  
}

//--------------------------------------------------------------
// use Google web app API to get list of courses
//--------------------------------------------------------------  
async function _getCourseList(funcError) {
  return await _webAppGet('_getCourseList', 'courselist', {}, funcError);
}

//--------------------------------------------------------------
// use Google web app API to get data for the given course
//--------------------------------------------------------------  
async function _getCourseData(courseKey, funcError) {
  return await _webAppGet('_getCourseData', 'coursedata', {coursekey: courseKey}, funcError);
}

//--------------------------------------------------------------
// use Google web app API to get data for all instructors
//--------------------------------------------------------------  
async function _getAllInstructorData(funcError) {
  return await _webAppGet('_getAllInstructorData', 'allinstructorinfo', {}, funcError);
}

//--------------------------------------------------------------
// use Google web app API to get data for the given instructor
//--------------------------------------------------------------  
async function _getInstructorData(instructorKey, funcError) {
  return await _webAppGet('_getInstructorData', 'instructorinfo', {instructorkey: instructorKey}, funcError);
}

//--------------------------------------------------------------
// use Google web app API to post review date for given course
//--------------------------------------------------------------  
async function _postReviewDate(courseKey, dateString, funcError) {
  const dataset = 'reviewdate'
  var result = await _webAppPost('_putReviewDate', dataset, {coursekey: courseKey, datestring: dateString}, funcError);
  return result == dataset;
}

