// Bible Content Component
const BibleContentComponent = {
  init: function() {
    // DOM Elements
    this.versesContainer = document.getElementById("verses-container");
    this.chapterTitle = document.getElementById("chapter-title");
    this.btnCopyAll = document.getElementById("btn-copy-all");
    this.btnCopySelected = document.getElementById("btn-copy-selected");
    this.initialVerse = document.getElementById("initial-verse");
    
    // Copy buttons event listeners
    this.btnCopyAll.addEventListener("click", () => this.copyAllVerses());
    this.btnCopySelected.addEventListener("click", () => this.copySelectedVerse());
  },
  
  clearSelectedVerse: function() {
    if (window.selectedVerseElement) {
      window.selectedVerseElement.classList.remove("selected");
      window.selectedVerseElement = null;
      this.btnCopySelected.disabled = true;
    }
  },
  
  loadChapter: async function(bookName, chapterNumber, version) {
    this.clearSelectedVerse();
    this.initialVerse?.remove();
    
    // Show loading spinner
    this.versesContainer.innerHTML = `
      <div class="flex justify-center items-center space-x-3 text-indigo-700 py-12">
        <div class="spinner"></div>
        <span class="text-xl font-medium">Loading scripture...</span>
      </div>
    `;
    
    this.chapterTitle.textContent = `Loading ${bookName} ${chapterNumber} (${version.toUpperCase()})...`;
    
    try {
      // Bible API supports only some versions: kjv, web, asv, bbe, ylt
      // For unsupported versions (niv, nlt), fallback to web and show a note
      const supportedVersions = ["kjv", "web", "asv", "bbe", "ylt"];
      let apiVersion = version.toLowerCase();
      let versionFallback = false;
      
      if (!supportedVersions.includes(apiVersion)) {
        apiVersion = "web"; // Use WEB as fallback instead of KJV for more modern language
        versionFallback = true;
      }
      
      const query = encodeURIComponent(`${bookName} ${chapterNumber}`);
      const url = `${API_BASE}${query}?translation=${apiVersion}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Bible verses.");
      
      const data = await response.json();
      if (!data.verses || data.verses.length === 0) {
        this.versesContainer.innerHTML = `<p class="text-center text-red-600 font-medium text-xl py-8">No verses found for ${bookName} ${chapterNumber}.</p>`;
        this.chapterTitle.textContent = `${bookName} ${chapterNumber} (${version.toUpperCase()})`;
        return;
      }
      
      this.chapterTitle.textContent = `${bookName} ${chapterNumber} (${version.toUpperCase()})`;
      
      // Clear container
      this.versesContainer.innerHTML = "";
      
      // Show fallback note if needed
      if (versionFallback) {
        const fallbackNote = document.createElement("div");
        fallbackNote.className = "bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded";
        fallbackNote.innerHTML = `
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <span class="font-medium">Version note:</span> The selected version (${version.toUpperCase()}) is not available. Displaying World English Bible (WEB) instead.
              </p>
            </div>
          </div>
        `;
        this.versesContainer.appendChild(fallbackNote);
      }
      
      // Display each verse with spiritual styling and clickable to select
      data.verses.forEach((verse, index) => {
        const verseEl = document.createElement("article");
        verseEl.className = "verse fade-in bg-white p-4 rounded-lg shadow-sm border border-indigo-100 mb-4";
        verseEl.setAttribute("role", "listitem");
        verseEl.setAttribute("tabindex", "0");
        verseEl.dataset.verseNumber = verse.verse;
        verseEl.dataset.text = verse.text;
        verseEl.dataset.book = bookName;
        verseEl.dataset.chapter = chapterNumber;
        verseEl.dataset.version = versionFallback ? "web" : version;
        
        const numberSpan = document.createElement("span");
        numberSpan.className = "verse-number";
        numberSpan.textContent = verse.verse;
        
        const textP = document.createElement("p");
        textP.className = "verse-text";
        textP.textContent = verse.text;
        
        verseEl.appendChild(numberSpan);
        verseEl.appendChild(textP);
        
        // Add favorite and note buttons
        FavoritesNotesComponent.addVerseControls(verseEl);
        
        // Click or keyboard select verse
        verseEl.addEventListener("click", () => {
          if (window.selectedVerseElement) {
            window.selectedVerseElement.classList.remove("selected");
          }
          verseEl.classList.add("selected");
          window.selectedVerseElement = verseEl;
          this.btnCopySelected.disabled = false;
          this.btnCopySelected.focus();
        });
        
        verseEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            verseEl.click();
          }
        });
        
        this.versesContainer.appendChild(verseEl);
      });
      
      // Add a spiritual closing message
      const closingMsg = document.createElement("div");
      closingMsg.className = "mt-8 text-center italic text-indigo-700 font-playfair text-lg select-none p-4 bg-indigo-50 rounded-lg";
      closingMsg.textContent = "May these sacred words breathe life into your spirit and illuminate your path.";
      this.versesContainer.appendChild(closingMsg);
      
      // Scroll to top of verses container
      this.versesContainer.scrollTop = 0;
    } catch (error) {
      console.error("Error loading verses:", error);
      this.versesContainer.innerHTML = `
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-2xl mx-auto mt-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                <span class="font-medium">Error loading verses.</span> Please check your internet connection and try again later.
              </p>
            </div>
          </div>
        </div>
      `;
      this.chapterTitle.textContent = `${bookName} ${chapterNumber} (${version.toUpperCase()})`;
    }
  },
  
  loadRandomVerse: async function(book, chapter) {
    try {
      // Fetch the whole chapter first (using WEB as default)
      const response = await fetch(`${API_BASE}${encodeURIComponent(book + " " + chapter)}?translation=web`);
      if (!response.ok) throw new Error("Failed to fetch today's verse.");
      
      const data = await response.json();
      if (!data.verses || data.verses.length === 0) {
        this.versesContainer.innerHTML = `<p class="text-center text-red-600 font-medium text-xl py-8">No verses found.</p>`;
        return;
      }
      
      // Pick a random verse from the chapter
      const verse = data.verses[Math.floor(Math.random() * data.verses.length)];
      
      // Display the verse with a beautiful spiritual style
      this.versesContainer.innerHTML = `
        <div class="max-w-3xl mx-auto bg-indigo-50 rounded-2xl p-8 shadow-lg border border-indigo-200 text-center text-indigo-900 select-text">
          <p class="text-4xl font-playfair italic leading-relaxed mb-6 before:content-['"'] after:content-['"'] before:text-indigo-400 after:text-indigo-400 before:text-7xl after:text-7xl before:relative after:relative before:-left-6 after:-right-6">
            ${verse.text}
          </p>
          <p class="text-xl font-semibold mt-6 select-none">— ${book} ${verse.chapter}:${verse.verse} (WEB)</p>
          <p class="mt-8 text-indigo-700 font-medium tracking-wide">"Let this verse awaken your spirit and fill your heart with divine peace."</p>
        </div>
      `;
    } catch (error) {
      console.error("Error loading today's verse:", error);
      this.versesContainer.innerHTML = `
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-2xl mx-auto mt-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                <span class="font-medium">Error loading today's verse.</span> Please check your internet connection and try again later.
              </p>
            </div>
          </div>
        </div>
      `;
    }
  },
  
  copyAllVerses: function() {
    if (!this.versesContainer.textContent.trim()) return;
    
    navigator.clipboard.writeText(this.versesContainer.textContent.trim()).then(() => {
      // Show success feedback
      const originalText = this.btnCopyAll.innerHTML;
      this.btnCopyAll.innerHTML = '<i class="fas fa-check mr-2"></i> Copied!';
      this.btnCopyAll.classList.add("bg-green-500", "text-white");
      
      setTimeout(() => {
        this.btnCopyAll.innerHTML = originalText;
        this.btnCopyAll.classList.remove("bg-green-500", "text-white");
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Show error feedback
      const originalText = this.btnCopyAll.innerHTML;
      this.btnCopyAll.innerHTML = '<i class="fas fa-times mr-2"></i> Failed';
      this.btnCopyAll.classList.add("bg-red-500", "text-white");
      
      setTimeout(() => {
        this.btnCopyAll.innerHTML = originalText;
        this.btnCopyAll.classList.remove("bg-red-500", "text-white");
      }, 2000);
    });
  },
  
  copySelectedVerse: function() {
    if (!window.selectedVerseElement) return;
    
    const book = window.selectedVerseElement.dataset.book;
    const chapter = window.selectedVerseElement.dataset.chapter;
    const verseNum = window.selectedVerseElement.dataset.verseNumber;
    const version = window.selectedVerseElement.dataset.version.toUpperCase();
    const text = window.selectedVerseElement.dataset.text;
    const fullText = `${book} ${chapter}:${verseNum} (${version}) - "${text}"`;
    
    navigator.clipboard.writeText(fullText).then(() => {
      // Show success feedback
      const originalText = this.btnCopySelected.innerHTML;
      this.btnCopySelected.innerHTML = '<i class="fas fa-check mr-2"></i> Copied!';
      this.btnCopySelected.classList.add("bg-green-500", "text-white");
      
      setTimeout(() => {
        this.btnCopySelected.innerHTML = originalText;
        this.btnCopySelected.classList.remove("bg-green-500", "text-white");
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Show error feedback
      const originalText = this.btnCopySelected.innerHTML;
      this.btnCopySelected.innerHTML = '<i class="fas fa-times mr-2"></i> Failed';
      this.btnCopySelected.classList.add("bg-red-500", "text-white");
      
      setTimeout(() => {
        this.btnCopySelected.innerHTML = originalText;
        this.btnCopySelected.classList.remove("bg-red-500", "text-white");
      }, 2000);
    });
  }
};