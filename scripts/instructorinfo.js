"use strict";
//
// TODO: 
//

const app = function () {
	const page = {};
  const settings = {};

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
    
    page.body.appendChild(_renderNoticeElement());

    _setNotice('initializing...');
    if (!_initializeSettings()) return;
    
    _setNotice('loading instructor data...');
    if (settings.instructorkey == null) {
      var requestResult = await googleSheetWebAPI.webAppGet(apiInfo.miGoogle2019, 'allinstructorinfo', {}, _reportError);
      if (!requestResult.success) return;
      settings.instructordata = requestResult.data;
      
    } else {
      var requestResult = await googleSheetWebAPI.webAppGet(apiInfo.miGoogle2019, 'instructorinfo', {instructorkey: settings.instructorkey}, _reportError);
      if (!requestResult.success) return;
      settings.instructordata = requestResult.data;
    }
    
    _setNotice('');
    page.body.appendChild(_renderTitle());
    _renderContents();
	}
		  
	//-------------------------------------------------------------------------------------
	// query params:
	//-------------------------------------------------------------------------------------
	function _initializeSettings() {
    var result = false;

    var params = {};
    var urlParams = new URLSearchParams(window.location.search);
		params.instructorkey = urlParams.has('instructorkey') ? urlParams.get('instructorkey') : null;

    settings.instructorkey = params.instructorkey
    result = true;
    
    return result;
  }
      
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  function _renderTitle() {
    var elemTitle = document.createElement('div');
    
    elemTitle.innerHTML = 'Instructor information';
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
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('courseinfo');

    var instructors = settings.instructordata;
    for (var i = 0; i < instructors.length; i++) {
      elemContainer.appendChild(_renderInstructorInfo(instructors[i]));
    }
    
    page.body.appendChild(elemContainer);
  }
  
  function _renderInstructorInfo(instructor) {
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('instructor-info');
    
    var elemImage = document.createElement('img');
    elemImage.src = instructor.photo;
    elemImage.classList.add('instructor-info-photo');
    elemContainer.appendChild(elemImage);

    var fullName = instructor.first + ' ' + instructor.last;
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', fullName, 'instructor-info-name', ' (' + instructor.courses + ')', ''));
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'room: ', 'instructor-info-label', instructor.room, ''));
    
    var linktext = '<a href=mailto:' + instructor.email + '>' + instructor.email + '</a>';
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'email: ', 'instructor-info-label', linktext, ''));
    
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'phone: ', 'instructor-info-label', instructor.phone, ''));
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'conference period: ', 'instructor-info-label', instructor.conferenceperiod, ''));
    
    linktext = '<a href=' + instructor.website + ' target=_blank>' + instructor.website + '</a>';
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'web site: ', 'instructor-info-label', linktext, ''));
    
    return elemContainer;
  }
    
  function _renderPairedDiv(divClass, label, labelClass, value, valueClass) {
    var elemContainer = document.createElement('div');
    elemContainer.classList.add(divClass);
    
    if (label != '') {
      var elemLabel = document.createElement('span');
      elemLabel.innerHTML = label;
      if (labelClass != '') elemLabel.classList.add(labelClass);
      elemContainer.appendChild(elemLabel);
    }
    
    var elemValue = document.createElement('span');
    elemValue.innerHTML = value;
    if (valueClass != '') elemValue.classList.add(valueClass);
    elemContainer.appendChild(elemValue);
    
    return elemContainer;
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
