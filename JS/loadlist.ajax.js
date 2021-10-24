
var pageCount = 1;

/**
 * Script for loading task list
 *
 * Constant RESTROUTE and variable token inherited from auth.js
 */
function getDate(object) {
    
    let options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
  let date;

  if (!object.modified) {
    let taskDate = new Date(object.date);
    date = `Task created <time datetime='${
      object.date
    }'>${taskDate.toLocaleDateString("en-us", options)}</time>`;
  } else {
    let taskModified = new Date(object.modified);

    date = `Task modified <time datetime='${
      object.modified
    }'>${taskModified.toLocaleDateString("en-us", options)}</time>`;
  }

  return date;
}

/**
 * Display status messages based on boolean task_status value.
 *
 * Called form within the for loop and applied to individual task objects.
 */
 function getStatus(status) {

  let taskStatus;


  if (status) {
    taskStatus = 'Completed';
  } else {
    taskStatus = 'In progress';
  }

  return taskStatus;

}


function createTaskList(object) {
  // $(".task-list").empty().append("<ul></ul>");


  for (let i = 0; i < object.length; i++) {
    let navListItem = `<li>
        <a href='single.html?task=${object[i].id}'>
            <h2 class="task-title">${object[i].title.rendered}</h2>
                  <div class="task-date">
                  ${getDate(object[i])}
      </div>
      <div class="task-status">${getStatus(object[i].cmb2.taskbook_metabox.taskbook_outcome)}</div>
        </a>
    </li>`;
    $(".task-list ul").append(navListItem);

    
  }
  $('.main-area').append('<button class="more">Load more tasks</button>');
  morePostsTrigger();
}

function getTaskList(listRoute) {
  // Remove the Load More Tasks button.
	$('.more').remove();
  	// Display the spinner as we wait for the response.

  $(".task-list").append(
    '<div class="loader"><img src="JS/spinner.svg" class="ajax-loader"></div>'
  );

  var settings = {
    url: listRoute,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: `Basic ${token}`,
    },
  };

  jQuery
    .ajax(settings)
    .done(function (object) {
      // console.log(object);
      createTaskList(object);
    })

    .fail(function (error) {
      // window.location.href = "/";
      // localStorage.removeItem("tokens-Taskbook");
    })

    .always(function () {
      $(".loader").remove();
    });
}



/**
 * Load more posts when we reach the bottom.
 */
 function morePostsTrigger() {

	var triggerPosition = $('.more').offset().top - $(window).outerHeight();

  console.log("Trigger Position:",triggerPosition);
  console.log("WINDOW:" , $(window).scrollTop());
	$(window).scroll(function(event) {
		if ( triggerPosition > $(window).scrollTop() ) {
			return;
		}
		// Bump up pageCount:
		pageCount++;
		// Generate new reqest route with pagination:
		listRoute = RESTROUTE + '?page=' + pageCount;
		// Get new tasks for the task list:
		getTaskList(listRoute);
		// Stop the event so we can start over:
		$(this).off(event);

	});

}

if (token != null) {
  let listRoute = RESTROUTE;
  getTaskList(listRoute);
} else {
  window.location.href = "/";
}
