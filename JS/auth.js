console.log("hello");
var token = localStorage.getItem("tokens-Taskbook");
var ROOTURL = "https://survey-project.lndo.site";
const RESTROOT = ROOTURL + "/wp-json";
const RESTROUTE = RESTROOT + "/wp/v2/tasks/";
var settings = {
  url: RESTROUTE,
  method: "GET",
  timeout: 0,
  headers: {
    Authorization: `Basic ${token}`,
  },
};
function getToken(token) {
  $.ajax(settings)
    .done(function (response) {
      console.log("The response",response);
      // if (token !== null) {
      //   localStorage.setItem("tokens-Taskbook", token);
      //   window.location.href = "/tasklist.html";
      // }
    })
    .fail(function (error) {
      console.log("The ERROR", error.status);

      if(error.status !== 200) {
          window.location.href = "/";
      }

        // $(".site-title").append("<div class='error_request'>Something went wrong!, Please Try again</div>")
        // document.querySelector("#username").value = '';
        // document.querySelector("#password").value = '';
        // localStorage.removeItem("tokens-Taskbook");
        

      // if(error) {
      //   $(".site-title").append("<div class='error_request'>Something went wrong!, Please Try again</div>")
      //   setTimeout(() => {        
      //     // if (token !== null) {
      //     //   window.location.href = "/";
      //     // }
      //     if($('.error_request')) {
      //       $('.error_request').remove();
      //     }
  
      //     document.querySelector("#username").value = '';
      //     document.querySelector("#password").value = '';
          
      //     localStorage.removeItem("tokens-Taskbook");
      //   }, 2000);
      // } else {
      //   window.location.href = "/tasklist.html";
      // }
    });
}
// });

$(".login-button").click(function (e) {
  e.preventDefault();
  let username = document.querySelector("#username").value;
  let password = document.querySelector("#password").value;
  let token = btoa(username + ":" + password);
  var theToken = localStorage.setItem("tokens-Taskbook", token);
  getToken(theToken);
  // If we are on the home page, redirect to tasklist.html:
  if (location.pathname == "/") {
    if (theToken !== null) {
      window.location.href = "/tasklist.html";
    }
  } else {
    // If we have a token, assume we're logged in:
    if (token !== null) {
      // If we're not logged in, redirect to the login page:
      window.location.href = "/";
    }
  }
});

$("#logout").click(function () {
  oauthLogout();
  window.location.href = "/";
});

function oauthLogout() {
  localStorage.removeItem("tokens-Taskbook");
}
