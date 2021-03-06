//http://127.0.0.1:5500/single.html?task=1211

var urlParams = new URLSearchParams(window.location.search);

const CURRENTID = urlParams.get('task');

console.info("TASK ID: ",CURRENTID);


/**
 * Display human readable dates:
 * For in-progress taks, show just published date,
 * for completed tasks, show both published and modified dates.
 */
 function getDate(object) {

    var options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    var taskDate = new Date(object.date);
    var date =
        '<div class="task-date">' +
        'Task created ' +
        '<time>' +
        taskDate.toLocaleDateString("en-us", options) +
        '</time>' +
        '</div>';

    var modifiedDate = new Date(object.modified);
    var modified = '';
    // Set modified only if taskDate and modifiedDate are different:
    if ( object.date != object.modified ) {
        modified =
            '<div class="task-date">' +
            'Task updated ' +
            '<time>' +
            modifiedDate.toLocaleDateString("en-us", options) +
            '</time>' +
            '</div>';
    }

    return date + modified;
}


function getLevel(objectLevel) {
    switch (objectLevel) {
        case '1':
            return "Very Stressed";
            break;
        case '2':
            return "Somewhat Stressed";
            break;
        case '3':
            return "Neurtal";
            break;
        case '4':
            return "Somewhat Relaxed";
            break;
        case '1':
            return "Very Relaxed";
            break;
    
        default:
            return "Neutral";
            break;
    }
}


/**
 * Build the Task HTML based on REST data.
 */
 function buildTask(object) {

    $('.single-task').empty().append( '<article class="task"></article>' );

    var task =
        '<h2 class="task-title">' +
        object.title.rendered +
        '</h2>' +
        '<div class="task-meta">' +
        getDate(object) +
        '</div>' +
        '<div class="task-description task-block">' +
        object.content.rendered +
        '</div>' +
        '<div class="task-prediction">' +
        '<h3 class="task-sub">' +
        'Task Prediction' +
        '</h3>' +
        '<div class="task-block">' +
        object.cmb2.taskbook_metabox.taskbook_prediction +
        '</div>' +
        '<h3 class="task-sub">' +
        'Pre-task stress level' +
        '</h3>' +
        '<div class="task-pre-level level">' +
        getLevel(object.cmb2.taskbook_metabox.taskbook_pre_level) +
        '</div>' +
        '</div><!-- .task-prediction -->'+
        getOutcome(object);

    $('.single-task article').append(task);
}


/**
 * Display Outcome depending on status:
 * If status is open, allow editing of Outcome + Post-level.
 * If status is closed, display Outcome + Post-level.
 */
 function getOutcome(object) {

    let taskStatus = object.task_status;
    console.log(object.task_status);

    if ( object.cmb2.taskbook_metabox.taskbook_post_level ) {
        var closedOutcome =
            '<div class="task-outcome">' +
            '<h3 class="task-sub">' +
            'Task Outcome' +
            '</h3>' +
            '<div class="task-block">' +
            object.cmb2.taskbook_metabox.taskbook_outcome +
            '</div>' +
            '<h3 class="task-sub">' +
            'Post-task stress level' +
            '</h3>' +
            '<div class="task-pre-level level">' +
            getLevel(object.cmb2.taskbook_metabox.taskbook_post_level) +
            '</div>' +
            '</div><!-- .task-prediction -->';
        return closedOutcome;
    } else {
        var openOutcome =
            '<form id="task-form" method="POST">' +
            '<label for="outcome">' +
            '<span class="label">Outcome</span>' +
            '<div class="field-description">What do you expect will happen?</div>' +
            '<textarea name="outcome" rows="10" cols="50" minlength="20" required></textarea>' +
            '</label>'+
            '<fieldset class="stress-level">' +
            '<legend class="label">Actual stress level </legend>' +
            '<label for="1"><input type="radio" name="post-level" value="1" id="1" required>' +
            'Very Stressed</label>' +
            '<label for="2"><input type="radio" name="post-level" value="2" id="2" required>' +
            'Somewhat Stressed</label>' +
            '<label for="3"><input type="radio" name="post-level" value="3" id="3" required>' +
            'Neutral</label>' +
            '<label for="4"><input type="radio" name="post-level" value="4" id="4" required>' +
            'Somewhat Relaxed</label>' +
            '<label for="5"><input type="radio" name="post-level" value="5" id="5" required>' +
            'Very Relaxed</label>' +
            '</fieldset>' +
            '<input type="submit" value="Update task">' +
            '</form>';
            var newTask = false;
			monitorFormSubmit(newTask);
        return openOutcome;
    }
}


function getTask(taskRoute) {
    $(".task-list").append(
      '<div class="loader"><img src="JS/spinner.svg" class="ajax-loader"></div>'
    );
  
    var settings = {
      url: taskRoute,
      method: "GET",
      timeout: 0,
      headers: {
        Authorization: `Basic ${token}`,
      },
    };
  
    jQuery
      .ajax(settings)
      .done(function (object) {
        console.info(object);
        // console.info(object);
        // console.info(object.type);
        // console.info(object.task_status);
        // console.info(object.id);
        buildTask(object);
      })
  
      .fail(function (error) {
        console.error("REST Error. Nothing Returned from Ajax");
      })
  
      .always(function () {
        $(".loader").remove();
      });
  }
  

if(CURRENTID !== null) {
    let taskRoute = RESTROUTE + CURRENTID;
    console.info("Task Route: ",taskRoute);
    getTask(taskRoute);

} else {
    window.location.href = '/tasklist.html';
}