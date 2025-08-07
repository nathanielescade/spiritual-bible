// Favorites & Notes Component
const FavoritesNotesComponent = {
  init: function() {
    // DOM Elements
    this.toggleFavoritesNotesBtn = document.getElementById("toggle-favorites-notes");
    this.favoritesNotesPanel = document.getElementById("favorites-notes-panel");
    this.favoritesList = document.getElementById("favorites-list");
    this.notesList = document.getElementById("notes-list");
    this.bookSelect = document.getElementById("book-select");
    this.chapterSelect = document.getElementById("chapter-select");
    this.versionSelect = document.getElementById("version-select");
    this.btnLoadChapter = document.getElementById("btn-load-chapter");
    
    // Toggle panel button
    this.toggleFavoritesNotesBtn.addEventListener("click", () => this.togglePanel());
    
    // Initialize favorites and notes from storage
    this.renderFavorites();
    this.renderNotes();
  },
  
  togglePanel: function() {
    this.favoritesNotesPanel.classList.toggle("hidden");
    if (!this.favoritesNotesPanel.classList.contains("hidden")) {
      this.favoritesNotesPanel.focus();
    }
  },
  
  saveFavorites: function() {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
  },
  
  saveNotes: function() {
    localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
  },
  
  renderFavorites: function() {
    this.favoritesList.innerHTML = "";
    const keys = Object.keys(favorites);
    
    if (keys.length === 0) {
      this.favoritesList.innerHTML = `<p class="text-indigo-500 italic select-none">No favorite verses yet.</p>`;
      return;
    }
    
    keys.forEach((key) => {
      const fav = favorites[key];
      const item = document.createElement("div");
      item.className = "favorite-item bg-indigo-50 rounded-lg p-3 mb-2 cursor-pointer";
      item.setAttribute("role", "listitem");
      item.tabIndex = 0;
      item.title = `Go to ${fav.book} ${fav.chapter}:${fav.verse} (${fav.version.toUpperCase()})`;
      
      const text = fav.text.length > 60 ? fav.text.slice(0, 60) + "…" : fav.text;
      item.innerHTML = `
        <div class="font-medium">${fav.book} ${fav.chapter}:${fav.verse} (${fav.version.toUpperCase()})</div>
        <div class="text-sm text-indigo-700 mt-1">${text}</div>
      `;
      
      // On click, load that verse's chapter and highlight verse
      item.addEventListener("click", () => {
        this.bookSelect.value = fav.book;
        SidebarComponent.populateChapters(fav.book);
        this.chapterSelect.value = fav.chapter;
        this.chapterSelect.disabled = false;
        this.versionSelect.value = fav.version;
        this.btnLoadChapter.disabled = false;
        
        BibleContentComponent.loadChapter(fav.book, fav.chapter, fav.version).then(() => {
          // After loading, highlight the verse
          setTimeout(() => {
            const verseEls = [...document.querySelectorAll(".verse")];
            const targetVerse = verseEls.find(v => v.dataset.verseNumber == fav.verse);
            
            if (targetVerse) {
              if (window.selectedVerseElement) window.selectedVerseElement.classList.remove("selected");
              targetVerse.classList.add("selected");
              window.selectedVerseElement = targetVerse;
              document.getElementById("btn-copy-selected").disabled = false;
              targetVerse.scrollIntoView({behavior: "smooth", block: "center"});
            }
          }, 500);
        });
      });
      
      // Remove favorite button
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn text-indigo-500 hover:text-indigo-700 mt-2 text-sm";
      removeBtn.setAttribute("aria-label", `Remove favorite ${fav.book} ${fav.chapter}:${fav.verse}`);
      removeBtn.innerHTML = "<i class='fas fa-trash-alt mr-1'></i> Remove";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        delete favorites[key];
        this.saveFavorites();
        this.renderFavorites();
      });
      
      item.appendChild(removeBtn);
      this.favoritesList.appendChild(item);
    });
  },
  
  renderNotes: function() {
    this.notesList.innerHTML = "";
    const keys = Object.keys(notes);
    
    if (keys.length === 0) {
      this.notesList.innerHTML = `<p class="text-indigo-500 italic select-none">No notes yet.</p>`;
      return;
    }
    
    keys.forEach((key) => {
      const note = notes[key];
      const item = document.createElement("div");
      item.className = "note-item bg-indigo-50 rounded-lg p-3 mb-2 cursor-pointer";
      item.setAttribute("role", "listitem");
      item.tabIndex = 0;
      item.title = `Go to note for ${note.book} ${note.chapter}:${note.verse} (${note.version.toUpperCase()})`;
      
      const previewText = note.noteText.length > 60 ? note.noteText.slice(0, 60) + "…" : note.noteText;
      item.innerHTML = `
        <div class="font-medium">${note.book} ${note.chapter}:${note.verse} (${note.version.toUpperCase()})</div>
        <div class="text-sm text-indigo-700 mt-1">${previewText}</div>
      `;
      
      // On click, open note modal to edit
      item.addEventListener("click", () => {
        ModalsComponent.openNoteModal(key);
      });
      
      // Remove note button
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn text-indigo-500 hover:text-indigo-700 mt-2 text-sm";
      removeBtn.setAttribute("aria-label", `Remove note for ${note.book} ${note.chapter}:${note.verse}`);
      removeBtn.innerHTML = "<i class='fas fa-trash-alt mr-1'></i> Remove";
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        delete notes[key];
        this.saveNotes();
        this.renderNotes();
      });
      
      item.appendChild(removeBtn);
      this.notesList.appendChild(item);
    });
  },
  
  generateVerseKey: function(book, chapter, verse, version) {
    return `${book}_${chapter}_${verse}_${version}`;
  },
  
  toggleFavorite: function(verseEl) {
    const book = verseEl.dataset.book;
    const chapter = verseEl.dataset.chapter;
    const verseNum = verseEl.dataset.verseNumber;
    const version = verseEl.dataset.version;
    const text = verseEl.dataset.text;
    const key = this.generateVerseKey(book, chapter, verseNum, version);
    
    if (favorites[key]) {
      delete favorites[key];
      verseEl.querySelector(".btn-favorite").classList.remove("favorited");
    } else {
      favorites[key] = { book, chapter, verse: verseNum, version, text };
      verseEl.querySelector(".btn-favorite").classList.add("favorited");
    }
    
    this.saveFavorites();
    this.renderFavorites();
  },
  
  addVerseControls: function(verseEl) {
    // Create favorite star button
    const favBtn = document.createElement("button");
    favBtn.className = "btn-favorite absolute right-12 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-yellow-500 focus:outline-none";
    favBtn.setAttribute("aria-label", "Add or remove favorite");
    favBtn.title = "Add or remove favorite";
    favBtn.innerHTML = '<i class="fas fa-star text-xl"></i>';
    
    // Mark if already favorited
    const key = this.generateVerseKey(
      verseEl.dataset.book,
      verseEl.dataset.chapter,
      verseEl.dataset.verseNumber,
      verseEl.dataset.version
    );
    
    if (favorites[key]) {
      favBtn.classList.add("favorited", "text-yellow-500");
    }
    
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleFavorite(verseEl);
    });
    
    // Create note button
    const noteBtn = document.createElement("button");
    noteBtn.className = "btn-note absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 focus:outline-none";
    noteBtn.setAttribute("aria-label", "Add or edit note");
    noteBtn.title = "Add or edit note";
    noteBtn.innerHTML = '<i class="fas fa-sticky-note text-xl"></i>';
    
    noteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      ModalsComponent.openNoteModal(key);
    });
    
    verseEl.appendChild(favBtn);
    verseEl.appendChild(noteBtn);
  }
};