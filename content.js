console.log("content running for lpg helper");

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(request, sender, sendResponse) {
  if (request.message === "start") {
    console.log(request.message);

    function eventFire(el, etype) {
      if (el.fireEvent) {
        el.fireEvent("on" + etype);
      } else {
        var evObj = document.createEvent("Events");
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }

    //if it says Collapse all, then click it to expand it.
    var expandCollapseButton = document.getElementsByClassName(
      "cl-course-pane-toolbar__btn"
    )[0];
    if (expandCollapseButton.innerText === "Collapse all") {
      //this will appear if as collapse all even if you only have one expanded.
      //let's click to clear it..then click to expand all correctly.
      eventFire(expandCollapseButton, "click"); //closes all of it
      wait(500);
    }
    //we won't even do an else statement -- because if it was collapsed, it's closed.
    //we'll expand it now.

    eventFire(expandCollapseButton, "click"); //expands all of it.
    ////////learning path is now fully expanded.  Begin scraping the LPG//////////

    //   level 1 contains:
    //   activities:	class="activity-name"
    //   folders:	class="topic-name-level-1"
    //   units:		class="topic-name-level-1"

    // level 2 contains:
    //   activities:	class="activity-name"
    //   folders:	class="topic-name-level-2"
    //   units:		class="topic-name-level-2"

    // etc...

    // how to tell level 2 stuff inside of level 1 stuff...?

    // topic-level-2

    // document.getElementsByClassName("topic-level-1")[6].getElementsByClassName("topic-level-2")[0].getElementsByClassName("topic-name-level-2")[0].innerText

    // document.getElementsByClassName("topic-level-1")[0].getElementsByClassName("activity-name").length

    // -----------------

    // Array of all
    // class="activity-name"

    // This is all of the activities...readings..everything that can be clicked on and interacted with..

    // Then we can place them according to a for loop?

    // we can check placement if we do something like this?
    // document.getElementsByClassName("topic-level-1")[0].getElementsByClassName("activity-name")[0]===document.getElementsByClassName("activity-name")[1]
    // -shows TRUE

    // -------
    // starting over... train of thought

    // ::::::GET LENGTHS until lengths is zero::::::::

    // document.getElementsByClassName("activity-name").length
    // 134
    // document.getElementsByClassName("topic-name-level-1").length
    // 13
    // document.getElementsByClassName("topic-name-level-2").length
    // 22
    // document.getElementsByClassName("topic-name-level-3").length
    // 0

    // Then walk backwards to start formulating placement of the activities.

    // document.getElementsByClassName("topic-level-1")[1].getElementsByClassName("topic-level-2")[0].getElementsByClassName("activity-name")[0].innerText
    // ...
    // ugh
    // this isn't going to work out either...with things being all weird and kinda nested in places.

    // ----------------------------------

    // document.querySelectorAll(".activity-name")

    // OKAY I THINK I GOT IT

    // If the activity-name is on the main plank location, it will get <ul role="tabpanel" as the parent node after this many iterations:

    // document.querySelectorAll(".activity-name")[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

    // MAIN LEVEL: SIX

    // If it's nested in the first folder/unit then it has this many:
    // document.querySelectorAll(".activity-name")[1].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

    // FIRST FOLDER NEST: TWELVE

    // If it's nested within the next level...

    // document.querySelectorAll(".activity-name")[8].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

    // SECOND FOLDER NEST: FIFTEEN

    // ................

    // SO now we have all of the activities labeled with which level they are at.

    // ................
    // So then we can just get the
    // class="topic-name-level-1"
    // class="topic-name-level-2"
    // ...etc

    // and place then between each hirearchy jump between Activities?

    // Maybe?
    // idk if this would work... no idea.......

    // There might be a methodical way to count out the hirearchy jumpers and literally get the array location for

    // document.getElementsByClassName("topic-name-level-1")[12].getElementsByClassName("topic-name__text")[0].innerText

    // document.getElementsByClassName("topic-name-level-1")[12].getElementsByClassName("topic-name-level-1")[0].innerText

    // this is the div that holds stuff.
    // topic-level-1
    // topic-level-2
    // topic-level-3

    // this is the div that holds the name of the item specifically
    // topic-name-level-1
    // topic-name-level-2
    // topic-name-level-3

    // and I'm not sure if it is level 1 specific... or if it's specific to ALL units.. But to get the name of the unit without the "XX activities" text, you need to use:
    // topic-name__text

    // like:
    // document.getElementsByClassName("topic-level-1")[11].getElementsByClassName("topic-name-level-1")[0].getElementsByClassName("topic-name__text")[0].innerText

    chrome.runtime.sendMessage({ message: "scrapestart" });
  } else if (request.message === "scrapedone") {
    console.log(request.message);
    chrome.runtime.sendMessage({ message: "done" });
  }
}
