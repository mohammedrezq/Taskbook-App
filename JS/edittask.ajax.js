const FILENAME =  location.href.split('/').slice(-1);

function createTask(formData, newTask) {
  let requestRoute;
  if(newTask) {
    requestRoute = RESTROUTE;
  } else {
    requestRoute = RESTROUTE + CURRENTID;
  }
  var settings = {
    url: requestRoute,
    dataType: 'json',
    method: "POST",
    // timeout: 0,
    headers: {
      Authorization: `Basic ${token}`,
    },
    data: formData,
  };

  jQuery
    .ajax(settings)
    .done(function(object) {
      console.log(object);
      if ( newTask ) {
        window.location.href = "/tasklist.html";
      } else {
        getTask(requestRoute);
      }
    })

    .fail(function (error) {
      console.error("REST Error. Nothing Returned from Ajax");
    })

    .always(function () {
      
    });
}

function generateJSON(newTask) {
  let formData;
  if ( newTask ) {
		formData = {
			"status": "private",
			"title": $('input[name=title]').val(),
			"content": $('textarea[name=description]').val(),
			"cmb2": {
						"taskbook_metabox": {
								"taskbook_prediction": $('textarea[name=prediction]').val(),
								"taskbook_pre_level": $('input[name=pre-level]:checked').val()
						}
			},
			"task_status": false
		};
	} else {
		formData = {
			"cmb2": {
						"taskbook_metabox": {
								"taskbook_outcome": $('textarea[name=outcome]').val(),
								"taskbook_post_level": $('input[name=post-level]:checked').val()
						}
			},
			"task_status": true
		};
	}

  createTask(formData, newTask);
}
function monitorFormSubmit(newTask) {
  $(document).on("submit", "#task-form", function (event) {
    event.preventDefault();
      generateJSON(newTask);
  });

}

if(FILENAME[0] === 'newtask.html') {
  var newTask = true;
  monitorFormSubmit(newTask);
}