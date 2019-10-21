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

      ///the innerhtml is having troubles differentiating if unit or folder comes first.

      ///if learningPath[1427].className.includes("topic-level-")

      if (
        learningPath[i].firstChild &&
        learningPath[i].firstChild.innerHTML.includes("icon-folder")
      ) {
        lpgArrayItemType[i] = "folder";
      } else if (
        learningPath[i].firstChild &&
        learningPath[i].firstChild.innerHTML.includes("unit-icon")
      ) {
        lpgArrayItemType[i] = "unit";
      } else if (learningPath[i].innerHTML.includes("icon-reading2")) {
        lpgArrayItemType[i] = "reading";
      } else if (learningPath[i].innerHTML.includes("icon-images")) {
        lpgArrayItemType[i] = "media";
      } else if (learningPath[i].innerHTML.includes("icon-flashcards")) {
        lpgArrayItemType[i] = "flashcards";
      } else if (learningPath[i].innerHTML.includes("icon-feed5")) {
        lpgArrayItemType[i] = "rss";
      } else if (learningPath[i].innerHTML.includes("icon-link")) {
        lpgArrayItemType[i] = "link";
      } else if (learningPath[i].innerHTML.includes("icon-file-o")) {
        lpgArrayItemType[i] = "file";
      } else if (learningPath[i].innerHTML.includes("icon-assign")) {
        if (
          learningPath[i].parentElement.previousElementSibling &&
          learningPath[
            i
          ].parentElement.previousElementSibling.className.includes(
            "activity--has-child"
          )
        ) {
          lpgArrayItemType[i] = "inline_assignment";
        } else {
          lpgArrayItemType[i] = "assignment";
        }
      } else {
        lpgArrayItemType[i] = "unknown";
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

    console.log(combinedArray);

    var finalLPG = [];
    finalLPG = transposeArray(combinedArray);

    console.log(finalLPG);

    // So what we will do is run through the length of finalLPG
    //and make a new array with the columns n stuff at the right places
    //var exportLPG = [];

    for (var i = 0; i < finalLPG.length; i++) {
      // var position = finalLPG[i][0];
      // var title = finalLPG[i][1];
      //var type = finalLPG[i][2];

      if (finalLPG[i][0] === 1) {
        finalLPG[i].splice(2, 0, "", "", "", "", "");
      } else if (finalLPG[i][0] === 2) {
        finalLPG[i].splice(1, 0, "");
        finalLPG[i].splice(3, 0, "", "", "", "");
      } else if (finalLPG[i][0] === 3) {
        finalLPG[i].splice(1, 0, "", "");
        finalLPG[i].splice(4, 0, "", "", "");
      } else if (finalLPG[i][0] === 4) {
        finalLPG[i].splice(1, 0, "", "", "");
        finalLPG[i].splice(5, 0, "", "");
      } else if (finalLPG[i][0] === 5) {
        finalLPG[i].splice(1, 0, "", "", "", "");
        finalLPG[i].splice(6, 0, "");
      } else if (finalLPG[i][0] === 6) {
        finalLPG[i].splice(1, 0, "", "", "", "", "");
      }
      finalLPG[i].splice(0, 1, ""); //remove the digit
    }
    finalLPG.unshift([
      "ADF_CGI",
      "level_1",
      "level_2",
      "level_3",
      "level_4",
      "level_5",
      "level_6",
      "node_type"
    ]);
    console.log(finalLPG);

    finalLPG;

    function convert_it(TextEntry) {
      /* Note: In Excel spreadsheets rows are horizontal and labeled with numbers
        Columns are vertical labeled with letters
        Note: To put a quote in a CSV file you use two quotes as in: , "Black ""Bear"" Diner",
      */
      var seperator = "\t"; // Separate data by tabs or commas
      //TextEntry = document.getElementById('TextEntry').value;
      // If they converted once and finished text is in finished
      // and is the same as what is in the TextEntry, then change TextEntry back to original
      if (finished == TextEntry) TextEntry = original;
      else original = document.getElementById("TextEntry").value;
      /* Count how many commas or tabs are in string.  
        If there are more commas than we will assume the data is comma separated
      */
      //remove the linebreaks if they are encased between a quote.  This ignores single quotes!
      TextEntry = TextEntry.replace(/(\t"[^"\n]*)\r?\n(?=[^"]*"\t)/g, "$1 ");
      //console.log("This is after we have removed the pagebreaks between quotes")
      //console.log(TextEntry)
      //and now we'll remove all of the regular stray quotes
      //TextEntry = TextEntry.replace(/"/g,'')
      //console.log("This is after we remove all double quotes")
      //console.log(TextEntry)
      /* Count how many commas or tabs are in string.  
        If there are more commas than we will assume the data is comma separated */
      var commas = TextEntry.split(",").length - 1;
      var tabs = TextEntry.split("\t").length - 1;
      console.log(commas);
      console.log(tabs);
      if (commas > tabs)
        //seperator = ',';
        //seperator = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/;
        seperator = /,\s*(?=(?:[^"]|"[^"]*")*$)/; // This is regex for matching commas not in quotes
      //var lines = TextEntry.split(/\r?\n(?=(?:[^"]|"[^"]*")*$)/); // 9/17/2018 - Version 1.2a - Split at new lines not in quotes
      var lines = TextEntry.split(/\r?\n/);
      // Reset array of rows
      rows = [];
      // Iterate through lines and put in 2D array 'rows'
      for (var i = 0; i < lines.length; i++) {
        rows[i] = lines[i].split(seperator);
        for (var a = 0; a < rows[i].length; a++) {
          // Remove quotes around cell if first and last character are a quote
          if (
            (rows[i][a].charAt(0) == '"' &&
              rows[i][a].charAt(rows[i][a].length - 1) == '"') ||
            (rows[i][a].charAt(0) == "'" &&
              rows[i][a].charAt(rows[i][a].length - 1) == "'")
          ) {
            rows[i][a] = rows[i][a].substr(1); // Remove first character
            rows[i][a] = rows[i][a].slice(0, -1); // Remove last character
          }
        }
      }
      /* Clean up: If there is a blank line at bottom of textarea
      it is being put in the last row with as a blank array.
      We need to remove it
    */
      if (rows[rows.length - 1].length == 1 && rows[rows.length - 1][0] == "")
        rows.pop();
      console.log("This is the result from the CONVERT_IT function");
      console.log(rows);
      return rows;
    }

    let csvContent =
      "data:text/csv;charset=utf-8," +
      finalLPG.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lpg.csv");
    document.body.appendChild(link); // Required for FF

    link.click();

    chrome.runtime.sendMessage({ message: "scrapestart" });
  } else if (request.message === "scrapedone") {
    console.log(request.message);
    chrome.runtime.sendMessage({ message: "done" });
  }
}
