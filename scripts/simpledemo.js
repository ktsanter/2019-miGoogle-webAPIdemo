"use strict";
//
// TODO: add POST
//

const app = function () {
	const page = {};
  
	const settings = {
    courselist: null
  };
  
  const apiInfo = {
    miGoogle2019: {
      apibase: 'https://script.google.com/macros/s/AKfycbzrVV2otcnpD2t-II38JVnB7FM7UN5Us9q3964tNHCCiSJOxfU/exec',
      apikey: 'miGoogle2019_webappAPIDemo'
    }
  };
  
  const NO_COURSE = '[none]';
    
	//---------------------------------------
	// get things going
	//----------------------------------------
	async function init (navmode) {
		page.body = document.getElementsByTagName('body')[0];
    page.contents = document.getElementById('contents');
    
    page.body.appendChild(_renderTitle());
    page.body.appendChild(_renderNoticeElement());
		
    _setNotice('loading course list...');
    var requestResult  = await googleSheetWebAPI.webAppGet(apiInfo.miGoogle2019, 'courselist', {}, _reportError);
    if (requestResult.success) {
      settings.courselist = requestResult.data;
      _setNotice('');
      _renderContents();
    }
	}
		
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  function _renderTitle() {
    var elemTitle = document.createElement('div');
    
    elemTitle.innerHTML = 'Demo of using a web app to retrieve data from a Google Sheet';
    elemTitle.classList.add('title');
    
    return elemTitle;
  }

  function _renderNoticeElement() {
    var elemNotice = document.createElement('div');
    
    elemNotice.innerHTML = 'notice';
    elemNotice.classList.add('notice');
    page.notice = elemNotice;
    
    return elemNotice;
    
  }
  
  function _renderContents() {
    if (settings.courselist == null) return;
    page.contents = document.createElement('div');
    page.contents.id = 'contents';
    page.body.appendChild(page.contents);

    page.contents.appendChild(_renderCourseList());
  }  
  
  function _renderCourseList() {
    var elemContainer = document.createElement('div');
    
    var elemLabel = document.createElement('span');
    elemLabel.innerHTML = 'Courses';
    elemLabel.classList.add('label');
    elemContainer.appendChild(elemLabel);
    
    var elemSelect = document.createElement('select');
    var courses = settings.courselist;
    
    var elemOpt = document.createElement('option');
    elemOpt.value = NO_COURSE;
    elemOpt.text = '<select a course>';
    elemSelect.add(elemOpt);
    
    for (var i = 0; i < courses.length; i++) {
      var elemOpt = document.createElement('option');
      elemOpt.value = courses[i].coursekey;
      elemOpt.text = courses[i].coursename;
      elemSelect.add(elemOpt);
    }
    elemContainer.appendChild(elemSelect);
    elemSelect.addEventListener('change', _handleCourseSelect, false);
    
    return elemContainer;
  }
  
  async function _displayCourseInfo(coursekey, coursename) {
    if (page.courseinfo != null) {
      page.courseinfo.parentNode.removeChild(page.courseinfo);
      page.courseinfo = null;
    }
    
    if (coursekey == NO_COURSE) return;
    
    _setNotice('retrieving info for ' + coursename + '...');
    
    var requestResult = await googleSheetWebAPI.webAppGet(apiInfo.miGoogle2019, 'coursedata', {coursekey: coursekey}, _reportError);
    if (!requestResult.success) return;
    settings.coursedata = requestResult.data[0];
    _setNotice('');

    var elemContainer = document.createElement('div');
    elemContainer.classList.add('courseinfo');
    
    var elemTable = document.createElement('table');
    elemTable.appendChild(_createTableRow('key', 'value', true));
    for (var key in settings.coursedata) {
      elemTable.appendChild(_createTableRow(key, settings.coursedata[key], false));
    }
    
    elemContainer.appendChild(elemTable);
    
    elemContainer.appendChild(_renderReviewButton());
    
    page.courseinfo = elemContainer;
    page.contents.appendChild(elemContainer);
  }
  
  function _createTableRow(val1, val2, isHeader) {
    var elemRow = document.createElement('tr');
    
    var elemCell = isHeader ? document.createElement('th') : document.createElement('td');
    elemCell.innerHTML = val1;
    elemRow.appendChild(elemCell);
    elemCell = elemCell = isHeader ? document.createElement('th') : document.createElement('td');
    elemCell.innerHTML = val2;
    elemRow.appendChild(elemCell);
    
    return elemRow;
  }
  
  function _renderReviewButton() {
    var elemContainer = document.createElement('div');
    
    var elemButton = document.createElement('button');
    elemButton.innerHTML = 'save review date';
    elemButton.addEventListener('click', _handleReviewButton, false);
    elemContainer.appendChild(elemButton);
    
    return elemContainer;
  }
  
  async function _saveReviewDate(courseKey) {
    // note this doesn't address time zone issues
    var d = new Date();
    var dateString = '\'' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    
    _setNotice('saving review date...');
    var requestResult = await googleSheetWebAPI.webAppPost(apiInfo.miGoogle2019, 'reviewdate', {criteria: {coursekey: courseKey}, newdata:{reviewdate: dateString}}, _reportError);
    console.log(requestResult);
    if (requestResult.success) _setNotice('');
  }
  
	//-----------------------------------------------------------------------------
	// control styling, visibility, and enabling
	//-----------------------------------------------------------------------------    
  function _showElement(elem) {
    if (elem.classList.contains('hide-me')) {
      elem.classList.remove('hide-me');
    }
  }

  function _hideElement(elem) {
    elem.classList.add('hide-me');
  }
  
	//------------------------------------------------------------------
	// handlers
	//------------------------------------------------------------------
  function _handleCourseSelect(e) {
    var selectedOption = e.target.options[e.target.selectedIndex];
    _displayCourseInfo(selectedOption.value, selectedOption.text);
  }
  
  function _handleReviewButton(e) {
    _saveReviewDate(settings.coursedata.coursekey);
  }
  
	//---------------------------------------
	// utility functions
	//----------------------------------------
	function _setNotice (label) {
		page.notice.innerHTML = label;

		if (label == '') {
			_hideElement(page.notice);
		} else {
			_showElement(page.notice);
		}
	}
  
  function _reportError(src, err) {
    _setNotice('Error in ' + src + ': ' + err.name + ' "' + err.message + '"');
  }

	//---------------------------------------
	// return from wrapper function
	//----------------------------------------
	return {
		init: init
 	};
}();
