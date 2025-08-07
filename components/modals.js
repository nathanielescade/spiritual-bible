// Modals Component
const ModalsComponent = {
  init: function() {
    // DOM Elements
    this.notesModal = document.getElementById("notes-modal");
    this.notesModalTitle = document.getElementById("notes-modal-title");
    this.notesModalDesc = document.getElementById("notes-modal-desc");
    this.noteTextarea = document.getElementById("note-textarea");
    this.btnCloseNotes = document.getElementById("btn-close-notes");
    this.btnCancelNote = document.getElementById("btn-cancel-note");
    this.btnSaveNote = document.getElementById("btn-save-note");
    
    // Notes modal event listeners
    this.btnCloseNotes.addEventListener("click", () => this.closeNoteModal());
    this.btnCancelNote.addEventListener("click", () => this.closeNoteModal());
    this.btnSaveNote.addEventListener("click", () => this.saveNote());
    
    // Close modal on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.notesModal.classList.contains("hidden")) {
        this.closeNoteModal();
      }
    });
  },
  
  openNoteModal: function(verseKey) {
    window.currentNoteVerseKey = verseKey;
    const note = notes[verseKey];
    
    if (note) {
      this.notesModalTitle.textContent = `Edit Note for ${note.book} ${note.chapter}:${note.verse} (${note.version.toUpperCase()})`;
      this.notesModalDesc.textContent = `"${note.text}"`;
      this.noteTextarea.value = note.noteText || "";
    } else {
      // Parse key to get verse info
      const parts = verseKey.split("_");
      if (parts.length === 4) {
        this.notesModalTitle.textContent = `Add Note for ${parts[0]} ${parts[1]}:${parts[2]} (${parts[3].toUpperCase()})`;
        this.notesModalDesc.textContent = "";
        this.noteTextarea.value = "";
      }
    }
    
    this.notesModal.classList.remove("hidden");
    this.notesModal.classList.add("flex");
    this.noteTextarea.focus();
  },
  
  closeNoteModal: function() {
    this.notesModal.classList.add("hidden");
    this.notesModal.classList.remove("flex");
    window.currentNoteVerseKey = null;
    this.noteTextarea.value = "";
  },
  
  saveNote: function() {
    if (!window.currentNoteVerseKey) return;
    
    const noteText = this.noteTextarea.value.trim();
    if (noteText.length === 0) {
      // If empty note, remove it
      if (notes[window.currentNoteVerseKey]) {
        delete notes[window.currentNoteVerseKey];
        FavoritesNotesComponent.saveNotes();
        FavoritesNotesComponent.renderNotes();
      }
    } else {
      // Save or update note
      // Parse key for verse info
      const parts = window.currentNoteVerseKey.split("_");
      if (parts.length === 4) {
        notes[window.currentNoteVerseKey] = {
          book: parts[0],
          chapter: parts[1],
          verse: parts[2],
          version: parts[3],
          noteText,
          text: favorites[window.currentNoteVerseKey]?.text || "", // if favorite, keep verse text
        };
        FavoritesNotesComponent.saveNotes();
        FavoritesNotesComponent.renderNotes();
      }
    }
    
    this.closeNoteModal();
  }
};