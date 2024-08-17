// import exampleList from './exList.js'
// console.log(exampleList);
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
   isDown = true;
   containerMain.style.overflowX = "scroll";
   // containerMain.classList.add('active');
   // containerMain.classList.add('no-select');
   startX = e.pageX - containerMain.offsetLeft;
   scrollLeft = containerMain.scrollLeft;
});

containerMain.addEventListener("mouseleave", () => {
   isDown = false;
   // containerMain.classList.remove('no-select');
   // containerMain.classList.remove('active');
});

containerMain.addEventListener("mouseup", () => {
   isDown = false;
   containerMain.style.overflowX = "hidden";
   // containerMain.classList.remove('no-select');
   // containerMain.classList.remove('active');
});

containerMain.addEventListener("mousemove", (e) => {
   if (!isDown) return;
   e.preventDefault();
   const x = e.pageX - containerMain.offsetLeft;
   const walk = (x - startX) * 3; //scroll-fast
   containerMain.scrollLeft = scrollLeft - walk;
});

let isScrolling;
let lastScrollLeft = containerMain.scrollLeft;

function handleScroll() {
  // Перевірити чи позиція скроллу змінилася
  if (containerMain.scrollLeft !== lastScrollLeft) {
    containerMain.classList.add('no-select');
    lastScrollLeft = containerMain.scrollLeft;

    // Очистити попередній таймер
    clearTimeout(isScrolling);

    // Додати клас назад через певний час після завершення прокрутки
    isScrolling = setTimeout(() => {
      containerMain.classList.remove('no-select');
    }, 500); // Затримка в мс
  }
}

containerMain.addEventListener('scroll', handleScroll);

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

btnNav1.addEventListener("click", () => {
   const inputWord = document.querySelector(".input-text-form-1");

   if (mainPhon.style.display === "none" || mainPhon.style.display === "") {
      mainPhon.style.display = "block";
      area1.style.display = "block";
      inputWord.focus();

      // This level of nesting is responsible for the dropdown block with options for completing the input word.
      const dropdown = document.getElementById('dropDownListWords');

      inputWord.addEventListener('input', async function() {
         const query = this.value.toLowerCase();
         dropdown.innerHTML = ''; 
         if (query) {
            try {
               const response = await fetch(`https://api.datamuse.com/sug?s=${query}`);
               const suggestions = await response.json();
               console.log(suggestions)
               suggestions.slice(0, 10).forEach(suggestion => {
                  const suggestionElement = document.createElement('div');
                  suggestionElement.className = 'suggestion';
                  suggestionElement.textContent = suggestion.word;
                  suggestionElement.addEventListener('click', function() {
                     inputWord.value = suggestion.word;
                     dropdown.innerHTML = ''; 
                     dropdown.style.display = 'none'; 
                  });
                  dropdown.appendChild(suggestionElement);
               });
               dropdown.style.display = 'block'; 
            } catch (error) {
               console.error('Error taking data from API:', error);
            }
         } else {
            dropdown.style.display = 'none'; 
         }
      });

      document.addEventListener('click', function(e) {
         if (!inputWord.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
         }
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

const saveNewWord = (event) => {
   event.preventDefault();//button "send" form and reload page
   const word = document.querySelector(".input-text-form-1").value;
   const transcription = document.querySelector(
      ".input-transcription-form-1"
   ).value;
   const description = document.querySelector(
      ".input-description-form-1"
   ).value;
   const form = document.querySelector(".form-type-1");

   wordProcessing(word, transcription, description);

   // console.log(form.elements);

   form.reset();
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

const wordProcessing = (word, transcription, description) => {
   const processedWord = word.toLowerCase().trim();
   const processedTranscription = word.toLowerCase().trim(); // тут функція що в інтернеті шукає відповідник
   const processedDescription = word.toLowerCase().trim(); // тут функція що в інтернеті шукає відповідник
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
   } else if (/[^a-zA-Z'-]/.test(word)) {
      fastRemoveClass(checkStatus);
      checkStatus.classList.add("save-status--negative");
      checkStatus.innerHTML = "Withhout symbols or choose language";

      setTimeout(() => {
         checkStatus.classList.remove("save-status--negative");
      }, 3000);
   } else { 
      const wordData = {
         word: processedWord,
         transcription: processedTranscription,
         description: processedDescription,
         countOfRepeatWord: 0,
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
      JSON.parse(localStorage.getItem("wordsList")) || tamplateOfSave;
   const firstLetterOfSaveWord = wordElem.word.split("")[0];
   checkCountOfRepeatTheWord(storedWords, wordElem);

   storedWords[firstLetterOfSaveWord].push(wordElem);
   storedWords[firstLetterOfSaveWord].sort((a, b) => {
      return a.word < b.word ? -1 : 1;
   });

   renderWords(storedWords);
   //  console.log(storedWords)
   localStorage.setItem("wordsList", JSON.stringify(storedWords));
};

const checkCountOfRepeatTheWord = (objectDB, word) => {};

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
      // console.log(key);
      const field = document.querySelector(`.field-${key}`);
      for (let elem of wordList[key]) {
         
            const wordContainer = document.createElement("div");
            wordContainer.classList.add("word-container");
            field.appendChild(wordContainer);

            {
               // console.log(elem.word);
               const mainParagraph = document.createElement("p");
               mainParagraph.textContent = elem.word;
               mainParagraph.classList.add("main-descript");
               wordContainer.appendChild(mainParagraph);

               if (elem.countOfRepeatWord > 2) {
                  document.querySelector(".main-descript").style.maxWidth =
                     "calc(100% - 30px)";
                  const countOfEnteredWords = document.createElement("p");
                  countOfEnteredWords.textContent = elem.countOfRepeatWord;
                  countOfEnteredWords.classList.add("second");
                  wordContainer.appendChild(countOfEnteredWords);
               }

               const minorParagraph = document.createElement("p");
               minorParagraph.innerHTML = `&nbsp${elem.word} <br> [${elem.transcription}] <br> &nbsp${elem.description}`;
               minorParagraph.classList.add("minor-descript");
               wordContainer.appendChild(minorParagraph);
            }
         
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

addEventListener(
   "DOMContentLoaded",
   () => {
      const storedWordsList = JSON.parse(localStorage.getItem("wordsList"));
      renderWords(storedWordsList);
   },
   { once: true }
);

// Функція для обробки події mouseover
function handleMouseOver(event) {
   if (event.target.classList.contains('main-descript')) {
       const rect = event.target.getBoundingClientRect();
       const topY = rect.top;
       const minorDescript = event.target.nextElementSibling;       
         if (minorDescript && minorDescript.classList.contains('minor-descript')) {
            // console.log('Found .minor-descript:', minorDescript);
            minorDescript.style.top = `${topY - 40}px`;
            // minorDescript.style.display = 'block';
        }

       event.target.addEventListener('mouseleave', handleMouseLeave);
       
       document.removeEventListener('mouseover', handleMouseOver);
   }
}

function handleMouseLeave(event) {
   if (event.target.classList.contains('main-descript')) {
       document.addEventListener('mouseover', handleMouseOver);
       event.target.removeEventListener('mouseleave', handleMouseLeave);
   }
}

document.addEventListener('mouseover', handleMouseOver);
  