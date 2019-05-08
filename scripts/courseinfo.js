//
// TODO: 
//

const app = function () {
	const page = {};
  const settings = {};
    
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
    
    _setNotice('loading course data...');
    settings.coursedata = await _getCourseData(settings.coursekey, _reportError);
    if (settings.coursedata == null) return;
    
    _setNotice('loading instructor data...');
    settings.instructordata = await _getInstructorData(settings.instructorkey, _reportError);
    if (settings.instructordata == null) return;
    
    _setNotice('');
    page.body.appendChild(_renderTitle());
    _renderCourseInfo();
	}
		
	//-------------------------------------------------------------------------------------
	// query params:
	//-------------------------------------------------------------------------------------
	function _initializeSettings() {
    var result = false;

    var params = {};
    var urlParams = new URLSearchParams(window.location.search);
		params.coursekey = urlParams.has('coursekey') ? urlParams.get('coursekey') : null;
		params.instructorkey = urlParams.has('instructorkey') ? urlParams.get('instructorkey') : null;

    if (params.coursekey != null && params.instructorkey != null) {
      settings.coursekey = params.coursekey;
      settings.instructorkey = params.instructorkey
			result = true;

    } else {   
      _setNotice('failed to initialize: coursekey and/or instructorkey is missing or invalid');
    }
    
    return result;
  }
  
	//-----------------------------------------------------------------------------
	// page rendering
	//-----------------------------------------------------------------------------  
  function _renderTitle() {
    var elemTitle = document.createElement('div');
    
    elemTitle.innerHTML = settings.coursedata.coursename + ' course information';
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
    
  function _renderCourseInfo() {
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('courseinfo');

    elemContainer.appendChild(_renderInstructorInfo());
    elemContainer.appendChild(_renderSubsection('Expectations', settings.coursedata.expectations));
    elemContainer.appendChild(_renderSubsection('Suggested Supplies', settings.coursedata.supplies));
    elemContainer.appendChild(_renderSubsection('Absence Policy', settings.coursedata.absencepolicy));
    elemContainer.appendChild(_renderSubsection('Retake Policy', settings.coursedata.retakepolicy));
    elemContainer.appendChild(_renderGradingBreakdown());
    elemContainer.appendChild(_renderFinalGradeBreakdown());
    
    page.body.appendChild(elemContainer);
  }
  
  function _renderInstructorInfo() {
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('instructor-info');
    
    var elemImage = document.createElement('img');
    elemImage.src = settings.instructordata.photo;
    elemImage.classList.add('instructor-info-photo');
    elemContainer.appendChild(elemImage);
    
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', '', '', settings.instructordata.name, 'instructor-info-name'));
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'room: ', 'instructor-info-label', settings.instructordata.room, ''));
    
    var linktext = '<a href=mailto:' + settings.instructordata.email + '>' + settings.instructordata.email + '</a>';
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'email: ', 'instructor-info-label', linktext, ''));
    
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'phone: ', 'instructor-info-label', settings.instructordata.phone, ''));
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'conference period: ', 'instructor-info-label', settings.instructordata.conferenceperiod, ''));
    
    linktext = '<a href=' + settings.instructordata.website + ' target=_blank>' + settings.instructordata.website + '</a>';
    elemContainer.appendChild(_renderPairedDiv('instructor-info-section', 'web site: ', 'instructor-info-label', linktext, ''));
    
    return elemContainer;
  }
    
  function _renderSubsection(label, message) {
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('subsection');
    
    var elemLabel = document.createElement('div');
    elemLabel.classList.add('subsection-label');
    elemLabel.innerHTML = label;
    elemContainer.appendChild(elemLabel);
    
    var elemMessage = document.createElement('div');
    elemMessage.classList.add('subsection-message');
    elemMessage.innerHTML = _alternativeConvertMarkdownToHTML(message);
    elemContainer.appendChild(elemMessage);
    
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
  
  function _renderGradingBreakdown() {
    console.log(settings.coursedata);
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('subsection');

    var elemLabel = document.createElement('div');
    elemLabel.classList.add('subsection-label');
    elemLabel.innerHTML = 'Grading breakdown';
    elemContainer.appendChild(elemLabel);
    
    elemContainer.appendChild(_renderTwoColumnTable(
      ['category', 'weight'],
      [
        ['tests', settings.coursedata.gradepct_tests + '%'],
        ['quizzes', settings.coursedata.gradepct_quizzes + '%'],
        ['practice work', settings.coursedata.gradepct_practice + '%'],
        ['other', settings.coursedata.gradepct_other + '%']
      ]
     ));
    
    return elemContainer;
  }
    
  function _renderFinalGradeBreakdown() {
    var elemContainer = document.createElement('div');
    elemContainer.classList.add('finalgrade-breakdown');

    var elemLabel = document.createElement('div');
    elemLabel.classList.add('subsection-label');
    elemLabel.innerHTML = 'Final grade breakdown';
    elemContainer.appendChild(elemLabel);

    elemContainer.appendChild(_renderTwoColumnTable(
      ['category', 'weight'],
      [
        ['marking period 1', settings.coursedata.finalgradepct_mp1 + '%'],
        ['marking period 2', settings.coursedata.finalgradepct_mp2 + '%'],
        ['final exam', settings.coursedata.finalgradepct_exam + '%']
      ]
     ));

    return elemContainer;
  }
  
  function _renderTwoColumnTable(headerFields, cellFields) {
    var elemTable = document.createElement('table');
    var elemRow, elemCell;
    
    elemRow = document.createElement('tr');
    for (var i = 0; i < headerFields.length; i++) {
      elemCell = document.createElement('th');
      elemCell.innerHTML = headerFields[i];
      elemRow.appendChild(elemCell);
    }
    elemTable.appendChild(elemRow);
    
    for (var i = 0; i < cellFields.length; i++) {
      elemRow = document.createElement('tr');

      elemCell = document.createElement('td');
      elemCell.innerHTML = cellFields[i][0];
      elemRow.appendChild(elemCell);
      
      elemCell = document.createElement('td');
      elemCell.innerHTML = cellFields[i][1];
      elemRow.appendChild(elemCell);

      elemTable.appendChild(elemRow);
    }
    
    return elemTable;
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
