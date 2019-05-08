"use strict";

//---------------------------------------------------------------
// Google Web API for retrieving demo data 
//---------------------------------------------------------------

// these both come from the App Script 
//  - the API base is a result of publishing
//  - the API key is a constant in the script
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
// use Google web app API to get list of courses
//--------------------------------------------------------------  
async function _getCourseList(funcError) {
  var urlParams = {};
  var url = _buildApiUrl('courselist', urlParams);
  
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    if (json.status == 'error') {
      funcError('_getCourseList', {name: 'API failure', message: json.text});
      console.log('error in _getCourseList: ' + json.text);
    }
    return json.data;
    
  } catch (error) {
    funcError('_getCourseList', error);
    console.log('error in _getCourseList: ' + error);
  }
}

//--------------------------------------------------------------
// use Google web app API to get data for the given course
//--------------------------------------------------------------  
async function _getCourseData(courseKey, funcError) {
  var urlParams = {
    coursekey: courseKey
  };
  var url = _buildApiUrl('coursedata', urlParams);
  
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    if (json.status == 'error') {
      funcError('_getCourseData', {name: 'API failure', message: json.text});
      console.log('error in _getCourseData: ' + json.text);
    }
    return json.data;
    
  } catch (error) {
    funcError('_getCourseInfo', error);
    console.log('error in _getCourseData: ' + error);
  }
}

//--------------------------------------------------------------
// use Google web app API to get data for the given instructor
//--------------------------------------------------------------  
async function _getInstructorData(instructorKey, funcError) {
  var urlParams = {
    instructorkey: instructorKey
  };
  var url = _buildApiUrl('instructorinfo', urlParams);
  
  try {
    const resp = await fetch(url);
    const json = await resp.json();
    if (json.status == 'error') {
      funcError('_getInstructorData', {name: 'API failure', message: json.text});
      console.log('error in _getInstructorData: ' + json.text);
    }
    return json.data;
    
  } catch (error) {
    funcError('_getInstructorData', error);
    console.log('error in _getInstructorData: ' + error);
  }
}
