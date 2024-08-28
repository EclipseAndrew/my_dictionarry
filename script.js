import exampleList from './exList.js'
console.log(exampleList);

const containerMain = document.querySelector(".container-main__blocks");
const scrollAreaTopNav = document.querySelector(".scrol-area");
const scrollAreaBottomNav = document.querySelector(".container-nav");

scrollAreaTopNav.addEventListener("mouseenter", () => {
   containerMain.style.overflowX = "scroll";
});

scrollAreaTopNav.addEventListener("mouseleave", () => {
   containerMain.style.overflowX = "hidden";
});

const scroll = (event) => {
   event.preventDefault();
   containerMain.scrollLeft += event.deltaY;
};

scrollAreaTopNav.addEventListener("wheel", scroll);
scrollAreaBottomNav.addEventListener("wheel", scroll);

let isDown = false;
let startX;
let scrollLeft;

containerMain.addEventListener("mousedown", (e) => {
   if (e.target.tagName === "IMG" || e.target.tagName === "BUTTON") {
      return;
   }

   isDown = true;
   containerMain.style.overflowX = "scroll";
   startX = e.pageX - containerMain.offsetLeft;
   scrollLeft = containerMain.scrollLeft;
});

containerMain.addEventListener("mouseleave", () => {
   isDown = false;
});

containerMain.addEventListener("mouseup", () => {
   isDown = false;
   containerMain.style.overflowX = "hidden";
   containerMain.classList.remove("cursor-grab");
});

containerMain.addEventListener("mousemove", (e) => {
   if (!isDown) return;

   if (e.target.tagName === "IMG" || e.target.tagName === "BUTTON") {
      return;
   }
   e.preventDefault();
   const x = e.pageX - containerMain.offsetLeft;
   const walk = (x - startX) * 3; //scroll-fast
   containerMain.scrollLeft = scrollLeft - walk;
   containerMain.classList.add("cursor-grab");
});

let isScrolling;
let lastScrollLeft = containerMain.scrollLeft;

function handleScroll() {
   if (containerMain.scrollLeft !== lastScrollLeft) {
      containerMain.classList.add("no-select");
      lastScrollLeft = containerMain.scrollLeft;

      clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
         containerMain.classList.remove("no-select");
      }, 500);
   }
}

containerMain.addEventListener("scroll", handleScroll);

//hidden or visible footer nav bar
const btnNav = document.querySelector(".btn-nav");
const mainBlock = document.querySelector(".main");
const navBlock = document.querySelector(".nav");

btnNav.addEventListener("click", () => {
   mainBlock.classList.toggle("main--calc-height");
   btnNav.classList.toggle("btn-nav--calc-position");

   if (navBlock.classList.contains("nav--hidden")) {
      navBlock.classList.remove("nav--hidden");
      navBlock.classList.add("nav--visible");
   } else {
      navBlock.classList.add("nav--hidden");
      navBlock.classList.remove("nav--visible");
   }
});

//hidden or visible form of addin word to main list
const btnNav1 = document.querySelector(".nav__btn-1");
const btnClose = document.querySelector(".btn-close");
const mainPhon = document.querySelector(".container-main__phon-around");
const area1 = document.querySelector(".adding-area-1");
let currentRequestId = 0;

btnNav1.addEventListener("click", () => {
   const inputWord = document.querySelector(".input-text-form-1");

   if (mainPhon.style.display === "none" || mainPhon.style.display === "") {
      mainPhon.style.display = "block";
      area1.style.display = "block";
      inputWord.focus();

      // This level of nesting is responsible for the dropdown block with options for completing the input word.
      const dropdown = document.getElementById("dropDownListWords");

      inputWord.addEventListener("input", async function () {
         const query = this.value.toLowerCase();
         dropdown.innerHTML = "";

         const requestId = ++currentRequestId;

         if (query) {
            try {
               const response = await fetch(
                  `https://api.datamuse.com/sug?s=${query}&max=8`
               );
               const suggestions = await response.json();

               if (requestId !== currentRequestId) {
                  //alternative abortController()
                  return;
               }

               suggestions.forEach((suggestion) => {
                  const suggestionElement = document.createElement("div");
                  suggestionElement.className = "suggestion";
                  suggestionElement.textContent = suggestion.word;
                  suggestionElement.addEventListener("click", function () {
                     inputWord.value = suggestion.word;
                     dropdown.innerHTML = "";
                     dropdown.style.display = "none";
                  });

                  dropdown.appendChild(suggestionElement);
               });
               dropdown.style.display = "block";
            } catch (error) {
               console.error("Error taking data from API:", error);
            }
         } else {
            dropdown.style.display = "none";
         }
      });

      inputWord.addEventListener("blur", () => {
         dropdown.style.display = "none";
      });
      dropdown.addEventListener("mousedown", (event) => {
         event.preventDefault();
      });
   } else {
      mainPhon.style.display = "none";
      area1.style.display = "none";
   }
});

btnClose.addEventListener("click", () => {
   mainPhon.style.display = "none";
   area1.style.display = "none";
});

mainPhon.addEventListener("click", (event) => {
   if (event.target === mainPhon) {
      mainPhon.style.display = "none";
      area1.style.display = "none";
   }
});

const saveNewWord = (event) => {
   event.preventDefault(); //button "send" form is reload page
   const word = document.querySelector(".input-text-form-1").value;
   const description = document.querySelector(
      ".input-description-form-1"
   ).value;
   const form = document.querySelector(".form-type-1");

   wordProcessing(word, description);

   form.reset();
   document.querySelector(".input-text-form-1").focus();
};

const checktypeOfBtn = (event) => {
   if (event.key === "Enter") {
      // event.preventDefault();
      saveNewWord(event);
   }
};

//  save into localStorage (beta)
const savebtn = document.querySelector(".btn-save");
savebtn.addEventListener("click", saveNewWord);
const saveKeyPress = document.querySelectorAll(".submit-form-1");
saveKeyPress.forEach((input) => {
   input.addEventListener("keydown", checktypeOfBtn);
});

const wordProcessing = async (word, description) => {
   const processedWord = word.toLowerCase().trim();
   const processedDescription = description.toLowerCase().trim();

   const checkStatus = document.querySelector(".save-status-block");

   if (processedWord === "") {
      fastRemoveClass(checkStatus);
      checkStatus.classList.add("save-status--negative");
      checkStatus.innerHTML = "Enter the word";

      setTimeout(() => {
         checkStatus.classList.remove("save-status--negative");
      }, 3000);
   } else if (/\d/.test(word)) {
      fastRemoveClass(checkStatus);
      checkStatus.classList.add("save-status--negative");
      checkStatus.innerHTML = "Without digits";

      setTimeout(() => {
         checkStatus.classList.remove("save-status--negative");
      }, 3000);
   } else if (/[^a-zA-Z' (),-]/.test(word)) {
      fastRemoveClass(checkStatus);
      checkStatus.classList.add("save-status--negative");
      checkStatus.innerHTML = "Withhout symbols or choose language";

      setTimeout(() => {
         checkStatus.classList.remove("save-status--negative");
      }, 3000);
   } else {
      const processedTrans = await getTrans(processedWord);

      const wordData = {
         word: processedWord,
         transcription: processedTrans,
         description: [processedDescription],
         countOfRepeatWord: 1,
      };

      pushWordInList(wordData);
      fastRemoveClass(checkStatus);
      checkStatus.classList.add("save-status--positive");
      checkStatus.innerHTML = "Saved";

      setTimeout(() => {
         checkStatus.classList.remove("save-status--positive");
      }, 3000);
   }
};

const getTrans = async (word) => {
   try {
      const response = await fetch(
         `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!response.ok) throw new Error("Transcription API request failed");

      const data = await response.json();
      const audioUrl = await findAudioUrl(data);
      const trans = data[0].phonetic;
      return trans ? [trans, audioUrl] : ["", ""];
   } catch (error) {
      console.error("Error fetching transcription:", error);
      return ["", ""];
   }
};

function findAudioUrl(data) {
   if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
         for (let item of data) {
            const result = findAudioUrl(item);
            if (result) return result;
         }
      } else {
         for (let key in data) {
            if (data.hasOwnProperty(key)) {
               if (key === "audio" && data[key] !== "") {
                  return data[key];
               }
               const result = findAudioUrl(data[key]);
               if (result) return result;
            }
         }
      }
   }
   return null;
}

const pushWordInList = (wordElem) => {
   const tamplateOfSave = {
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: [],
      h: [],
      i: [],
      j: [],
      k: [],
      l: [],
      m: [],
      n: [],
      o: [],
      p: [],
      q: [],
      r: [],
      s: [],
      t: [],
      u: [],
      v: [],
      w: [],
      x: [],
      y: [],
      z: [],
   };
   const storedWords =
      JSON.parse(localStorage.getItem("wordsList")) ||
      tamplateOfSave; //exList import at the beginning

   const firstLetterOfSaveWord = wordElem.word[0];
   const wordsList = storedWords[firstLetterOfSaveWord];
   const existingWord = wordsList.find((word) => word.word === wordElem.word);

   if (existingWord) {
      existingWord.countOfRepeatWord++;
      existingWord.transcription[0] = wordElem.transcription[0];
      existingWord.description[0] = wordElem.description[0];
   } else {
      wordsList.push(wordElem);
      wordsList.sort((a, b) => a.word.localeCompare(b.word));
   }

   renderWords(storedWords);
   localStorage.setItem("wordsList", JSON.stringify(storedWords));
};

const fastRemoveClass = (checkStatus) => {
   // it will use when the user been input words fast and setTimeout don't made delite the class for the previous state
   if (
      checkStatus.classList.contains(
         "save-status--negative",
         "save-status--positive"
      )
   ) {
      checkStatus.classList.remove(
         "save-status--negative",
         "save-status--positive"
      );
   }
};

const renderWords = (wordList) => {
   deleteOldWordList();
   for (let key in wordList) {
      const field = document.querySelector(`.field-${key}`);
      for (let elem of wordList[key]) {
         const wordContainer = document.createElement("div");
         wordContainer.classList.add("word-container");
         field.appendChild(wordContainer);

         const mainParagraph = document.createElement("p");
         mainParagraph.textContent = elem.word;
         mainParagraph.classList.add("main-descript");
         wordContainer.appendChild(mainParagraph);

         const minorParagraph = document.createElement("p");
         minorParagraph.innerHTML = `&nbsp${elem.word} <br>  <div>${elem.transcription[0]}</div>  &nbsp${elem.description}`;
         minorParagraph.classList.add("minor-descript");
         wordContainer.appendChild(minorParagraph);
         const transcriptionSpan = minorParagraph.querySelector("div");

         if (elem.transcription[1]) {
            transcriptionSpan.classList.add("transkript")
            transcriptionSpan.innerHTML = `${elem.transcription[0]} &nbsp <img src="img/speaker.png" style="height: 20px;" /> `;
            transcriptionSpan.addEventListener("click", () => {
               const audio = new Audio(elem.transcription[1]);
               audio.play();
            });
         }

         const asideContainer = document.createElement("p");
         asideContainer.classList.add("aside-container");
         wordContainer.appendChild(asideContainer);

         if (elem.countOfRepeatWord > 1) {
            const countOfEnteredWords = document.createElement("p");
            countOfEnteredWords.textContent = elem.countOfRepeatWord;
            countOfEnteredWords.classList.add("second");
            asideContainer.appendChild(countOfEnteredWords);
         }

         const delBtn = document.createElement("button");
         delBtn.classList.add("delBtn");
         const img = document.createElement("img");
         img.src = "img/delete.svg";
         img.alt = "Icon";
         delBtn.appendChild(img);
         asideContainer.appendChild(delBtn);
      }
   }
};



const deleteOldWordList = () => {
   const containers = document.querySelectorAll(".container-main__block");
   containers.forEach((container) => {
      const paragraphs = container.querySelectorAll("p");
      paragraphs.forEach((p) => p.remove());
   });
};

const renderList = JSON.parse(localStorage.getItem("wordsList")) || exampleList;
document.addEventListener('DOMContentLoaded', renderWords(renderList));


//containerMain variable created at the beginning of this doc
containerMain.addEventListener("click", (e) => {
   if (e.target.closest(".delBtn")) {
      e.stopPropagation();

      const wordContainer = e.target.closest(".word-container");

      if (wordContainer) {
         const mainDescript =
            wordContainer.querySelector(".main-descript").textContent;
         deleteWordInObjectList(mainDescript);
      }
      wordContainer.remove();
   }
});

const deleteWordInObjectList = (wordArgument) => {
   const wordsObjectList = JSON.parse(localStorage.getItem("wordsList"));
   const firstLetter = wordArgument.split("").slice(0, 1).join("");
   const index = wordsObjectList[firstLetter].findIndex(
      (item) => item.word === wordArgument
   );

   wordsObjectList[firstLetter].splice(index, 1);

   localStorage.setItem("wordsList", JSON.stringify(wordsObjectList));
};

addEventListener(
   "DOMContentLoaded",
   () => {
      const storedWordsList = JSON.parse(localStorage.getItem("wordsList"));
      renderWords(storedWordsList);
   },
   { once: true }
);

function handleMouseOver(event) {
   if (event.target.classList.contains("main-descript")) {
      const rect = event.target.getBoundingClientRect();
      const topY = rect.top;
      const minorDescript = event.target.nextElementSibling;
      if (minorDescript && minorDescript.classList.contains("minor-descript")) {
         minorDescript.style.top = `${topY - 40}px`;
      }

      event.target.addEventListener("mouseleave", handleMouseLeave);

      document.removeEventListener("mouseover", handleMouseOver);
   }
}
document.addEventListener("mouseover", handleMouseOver);

function handleMouseLeave(event) {
   if (event.target.classList.contains("main-descript")) {
      document.addEventListener("mouseover", handleMouseOver);
      event.target.removeEventListener("mouseleave", handleMouseLeave);
   }
}

const wordsObject = JSON.parse(localStorage.getItem("wordsList"));

const input = document.querySelector(".search-input");
const resultsDiv = document.querySelector(".dropdown-container");

input.addEventListener("input", function () {
   const query = this.value.toLowerCase();
   let results = [];

   if (query) {
      for (const key in wordsObject) {
         wordsObject[key].forEach((item) => {
            if (item.word.toLowerCase().includes(query)) {
               results.push(item);
            }
         });
      }
   }

   displayResults(results);
});

function displayResults(results) {
   resultsDiv.innerHTML = "";

   if (results.length === 0) {
      resultsDiv.innerHTML = "<p>Nothing found</p>";
   } else {
      results.slice(0, 8).forEach((result) => {
         const resultItem = document.createElement("div");
         resultItem.innerHTML = `<strong>${result.word}</strong>`;
         resultItem.classList.add("render-word");
         resultsDiv.appendChild(resultItem);
      });
   }
}

input.addEventListener("input", () => {
   const allRenderWords = document.querySelectorAll(".render-word");
   allRenderWords.forEach((e) => {
      e.addEventListener("click", () => {
         input.value = e.innerText;
         resultsDiv.innerHTML = "";
      });
   });
});

const searchButton = document.querySelector(".search-btn");
const containerBlocks = document.querySelector(".container-main__blocks");

const findWordInSite = () => {
   const searchTerm = input.value.trim().toLowerCase();

   if (searchTerm) {
      document
         .querySelectorAll(".highlight")
         .forEach((e) => e.classList.remove("highlight"));

      const firstChar = searchTerm.charAt(0).toLowerCase();
      const columnClass = `field-${firstChar}`;

      const block = containerBlocks.querySelector(`.${columnClass}`);

      if (block) {
         const wordContainers = block.querySelectorAll(
            ".word-container .main-descript"
         );
         wordContainers.forEach((wordElement) => {
            const wordText = wordElement.innerText.toLowerCase();

            if (wordText.includes(searchTerm)) {
               wordElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
               });

               wordElement.classList.add("highlight");

               setTimeout(() => {
                  wordElement.classList.remove("highlight");
               }, 3000);
            }
         });
      } else {
         console.log("No block found for the given letter.");
      }
   }
};

searchButton.addEventListener("click", findWordInSite);
input.addEventListener("keydown", (e) => {
   if (e.key === "Enter") {
      findWordInSite();
      resultsDiv.innerHTML = "";
   }
});
input.addEventListener("blur", () => {
   setTimeout(() => {
      resultsDiv.innerHTML = "";
   }, 100); // if we do input area unactive it delite all dropdown list and you not catch any of option(this delay is important)
});
