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

    ///learningPath is the FULL learning path
    var learningPath = document
      .getElementById("outlineViewTab")
      .querySelectorAll(
        "li.activities-wrapper,li.topic-level-1,li.topic-level-2,li.topic-level-3,li.topic-level-4,li.topic-level-5,li.topic-level-6"
      );

    //Make new arrays
    var lpgArrayTitle = [];
    //var lpgArrayCaption = [];
    var lpgArrayType = [];
    var lpgArrayItemType = [];

    //walk down the learning path...
    for (var i = 0; i < learningPath.length; i++) {
      lpgArrayTitle[i] = learningPath[i].innerText.split("\n")[0]; //title
      // lpgArrayCaption[i] = learningPath[i].innerText.split("\n")[1]; //caption -- not always perfect.. so ignore this functionality for now

      lpgArrayType[i] = learningPath[i].className; //class type (topic-level-# or activities-wrapper)

      //check what it is, based on the icon

      if (learningPath[i].innerHTML.includes("icon-folder")) {
        lpgArrayItemType[i] = "Folder";
      } else if (learningPath[i].innerHTML.includes("unit-icon")) {
        lpgArrayItemType[i] = "Unit";
      } else if (learningPath[i].innerHTML.includes("icon-reading2")) {
        lpgArrayItemType[i] = "Reading";
      } else if (learningPath[i].innerHTML.includes("icon-images")) {
        lpgArrayItemType[i] = "Media";
      } else if (learningPath[i].innerHTML.includes("icon-flashcards")) {
        lpgArrayItemType[i] = "Flashcards";
      } else if (learningPath[i].innerHTML.includes("icon-feed5")) {
        lpgArrayItemType[i] = "RSS";
      } else if (learningPath[i].innerHTML.includes("icon-link")) {
        lpgArrayItemType[i] = "Link";
      } else if (learningPath[i].innerHTML.includes("icon-file-o")) {
        lpgArrayItemType[i] = "File";
      } else if (learningPath[i].innerHTML.includes("icon-assign")) {
        if (
          learningPath[i].parentElement.previousElementSibling &&
          learningPath[
            i
          ].parentElement.previousElementSibling.className.includes(
            "activity--has-child"
          )
        ) {
          lpgArrayItemType[i] = "Inline Assignment";
        } else {
          lpgArrayItemType[i] = "Assignment";
        }
      } else {
        lpgArrayItemType[i] = "Unknown";
      }
    }
    //populate title into the correct column?
    var columnNumber = 0;
    var lpgPlacement = [];

    for (var i = 0; i < learningPath.length; i++) {
      if (
        learningPath[i].className.includes("topic-level-1") ||
        (learningPath[i].previousElementSibling &&
          learningPath[i].previousElementSibling.className.includes(
            "topic-level-1"
          ))
      ) {
        columnNumber = 1;
      } else if (
        learningPath[i].className.includes("topic-level-2") ||
        (learningPath[i].previousElementSibling &&
          learningPath[i].previousElementSibling.className.includes(
            "topic-level-2"
          ))
      ) {
        columnNumber = 2;
      } else if (
        learningPath[i].className.includes("topic-level-3") ||
        (learningPath[i].previousElementSibling &&
          learningPath[i].previousElementSibling.className.includes(
            "topic-level-3"
          ))
      ) {
        columnNumber = 3;
      } else if (
        learningPath[i].className.includes("topic-level-4") ||
        (learningPath[i].previousElementSibling &&
          learningPath[i].previousElementSibling.className.includes(
            "topic-level-4"
          ))
      ) {
        columnNumber = 4;
      } else if (
        learningPath[i].className.includes("topic-level-5") ||
        (learningPath[i].previousElementSibling &&
          learningPath[i].previousElementSibling.className.includes(
            "topic-level-5"
          ))
      ) {
        columnNumber = 5;
      } else if (
        learningPath[i].className.includes("topic-level-6") ||
        (learningPath[i].previousElementSibling &&
          learningPath[i].previousElementSibling.className.includes(
            "topic-level-6"
          ))
      ) {
        columnNumber = 6;
      } else if (
        learningPath[i].className.includes("topic-level-7") ||
        (learningPath[i].previousElementSibling &&
          learningPath[i].previousElementSibling.className.includes(
            "topic-level-7"
          ))
      ) {
        columnNumber = 7;
      } else if (
        learningPath[i].previousElementSibling &&
        !learningPath[i].previousElementSibling.className.includes(
          "activities-wrapper"
        )
      ) {
        columnNumber = columnNumber + 1;
      } else if (
        learningPath[i].previousElementSibling &&
        learningPath[i].previousElementSibling.className.includes(
          "activities-wrapper"
        ) &&
        learningPath[i].innerHTML.includes("activity--has-child") &&
        learningPath[i].previousElementSibling.innerHTML.includes(
          "activity--has-child"
        )
      ) {
        columnNumber = columnNumber - 1;
      } else if (
        !learningPath[i].previousElementSibling &&
        learningPath[i].className.includes("activities-wrapper") &&
        learningPath[i].parentElement.className.includes("inline-activities")
      ) {
        columnNumber = columnNumber + 1;
      } else if (!learningPath[i].previousElementSibling) {
        columnNumber = columnNumber + 1;
      }

      lpgPlacement[i] = columnNumber;
    }

    console.log(lpgPlacement);
    console.log(lpgArrayTitle);
    console.log(lpgArrayType);
    console.log(lpgArrayItemType);

    var combinedArray = [];
    combinedArray.push(lpgPlacement);
    combinedArray.push(lpgArrayTitle);
    //combinedArray.push(lpgArrayType); we no longer need this.  it would only show topic-level-# OR activities-wrapper.  The next line is better.
    combinedArray.push(lpgArrayItemType);

    /////////If you've got an array that goes one way, but you want it the other way.... this will transpose it.
    function transposeArray(array) {
      var newArray = [];
      for (var i = 0; i < array[0].length; i++) {
        newArray.push([]);
      }
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[0].length; j++) {
          newArray[j].push(array[i][j]);
        }
      }
      return newArray;
    }

    var finalLPG = [];
    finalLPG = transposeArray(combinedArray);

    console.log(finalLPG);

    // So what we will do is run through the length of finalLPG
    for (var i = 0; i < finalLPG.length; i++) {
      var title = finalLPG[i][0];
      var position = finalLPG[i][1];
      var type = finalLPG[i][2];

      // And at each line - check the first [0]  that is which column we put shit into
      // From there, we take the TITLE [1] and put spaces ahead/behind accordingly for 6 columns.

      ////PUT THEM INTO THE CORRECT COLUMNS
      finalLPG[1].splice(1, 0, "baz");
      //[2, "baz", "Video", "Media"]
    }

    chrome.runtime.sendMessage({ message: "scrapestart" });
  } else if (request.message === "scrapedone") {
    console.log(request.message);
    chrome.runtime.sendMessage({ message: "done" });
  }
}
