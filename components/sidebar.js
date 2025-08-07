// Sidebar Component
const SidebarComponent = {
  init: function() {
    // DOM Elements
    this.bookSelect = document.getElementById("book-select");
    this.chapterSelect = document.getElementById("chapter-select");
    this.versionSelect = document.getElementById("version-select");
    this.btnLoadChapter = document.getElementById("btn-load-chapter");
    this.versesContainer = document.getElementById("verses-container");
    this.chapterTitle = document.getElementById("chapter-title");
    this.btnCopySelected = document.getElementById("btn-copy-selected");
    
    // Initialize books
    this.initBooks();
    
    // Event listeners
    this.bookSelect.addEventListener("change", (e) => this.handleBookChange(e));
    this.chapterSelect.addEventListener("change", () => this.handleChapterChange());
    this.versionSelect.addEventListener("change", () => this.handleVersionChange());
    this.btnLoadChapter.addEventListener("click", () => this.handleLoadChapter());
  },
  
  initBooks: function() {
    books.forEach((book) => {
      const option = document.createElement("option");
      option.value = book.name;
      option.textContent = book.name;
      this.bookSelect.appendChild(option);
    });
  },
  
  populateChapters: function(bookName) {
    this.chapterSelect.innerHTML = "";
    const book = books.find((b) => b.name === bookName);
    if (!book) {
      this.chapterSelect.disabled = true;
      this.btnLoadChapter.disabled = true;
      return;
    }
    
    for (let i = 1; i <= book.chapters; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      this.chapterSelect.appendChild(option);
    }
    
    this.chapterSelect.disabled = false;
    this.btnLoadChapter.disabled = false;
  },
  
  handleBookChange: function(e) {
    const bookName = e.target.value;
    this.populateChapters(bookName);
    this.versesContainer.innerHTML = `<p class="text-center text-indigo-500 italic select-none text-xl max-w-3xl mx-auto leading-relaxed mt-12">Select a chapter to read the Word.</p>`;
    this.chapterTitle.textContent = "Select Chapter";
    BibleContentComponent.clearSelectedVerse();
    this.btnCopySelected.disabled = true;
  },
  
  handleChapterChange: function() {
    this.btnLoadChapter.disabled = false;
    BibleContentComponent.clearSelectedVerse();
    this.btnCopySelected.disabled = true;
  },
  
  handleVersionChange: function() {
    // If book and chapter selected, reload chapter with new version
    if (this.bookSelect.value && this.chapterSelect.value) {
      BibleContentComponent.loadChapter(this.bookSelect.value, this.chapterSelect.value, this.versionSelect.value);
    }
  },
  
  handleLoadChapter: function() {
    const bookName = this.bookSelect.value;
    const chapterNumber = this.chapterSelect.value;
    const version = this.versionSelect.value;
    if (bookName && chapterNumber && version) {
      BibleContentComponent.loadChapter(bookName, chapterNumber, version);
      
      // Scroll to verses section on small screens
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          document.getElementById("verses-section").scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }
};