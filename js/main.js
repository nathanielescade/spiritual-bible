// Main Application Controller
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  HeaderComponent.init();
  SidebarComponent.init();
  BibleContentComponent.init();
  FavoritesNotesComponent.init();
  ModalsComponent.init();
  
  // Set NIV as default version
  document.getElementById("version-select").value = "niv";
  
  // Preselect a random book and chapter and load initial verse from it
  const randomBook = books[Math.floor(Math.random() * books.length)];
  document.getElementById("book-select").value = randomBook.name;
  SidebarComponent.populateChapters(randomBook.name);
  const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;
  document.getElementById("chapter-select").value = randomChapter;
  document.getElementById("chapter-select").disabled = false;
  document.getElementById("btn-load-chapter").disabled = false;
  
  // Load a random verse from that book and chapter in NIV as initial spiritual awakening
  (async () => {
    try {
      document.getElementById("chapter-title").textContent = `Awaken Your Soul - ${randomBook.name} ${randomChapter} (NIV)`;
      
      // Show loading spinner
      document.getElementById("verses-container").innerHTML = `
        <div class="flex justify-center items-center space-x-3 text-indigo-700 py-12">
          <div class="spinner"></div>
          <span class="text-xl font-medium">Breathing in the Word...</span>
        </div>
      `;
      
      // Use fallback for NIV (not supported by API)
      const response = await fetch(`${API_BASE}${encodeURIComponent(randomBook.name + " " + randomChapter)}?translation=web`);
      if (!response.ok) throw new Error("Failed to fetch initial verse.");
      
      const data = await response.json();
      if (!data.verses || data.verses.length === 0) {
        document.getElementById("verses-container").innerHTML = `<p class="text-center text-red-600 font-medium text-xl py-8">No verses found.</p>`;
        return;
      }
      
      // Pick a random verse from the chapter
      const verse = data.verses[Math.floor(Math.random() * data.verses.length)];
      
      // Display the verse with spiritual style
      document.getElementById("verses-container").innerHTML = `
        <div class="max-w-3xl mx-auto bg-indigo-50 rounded-2xl p-8 shadow-lg border border-indigo-200 text-center text-indigo-900 select-text">
          <p class="text-4xl font-playfair italic leading-relaxed mb-8 before:content-['"'] after:content-['"'] before:text-indigo-400 after:text-indigo-400 before:text-7xl after:text-7xl before:relative after:relative before:-left-6 after:-right-6">
            ${verse.text}
          </p>
          <p class="text-xl font-semibold mt-6 select-none">— ${randomBook.name} ${verse.chapter}:${verse.verse} (NIV)</p>
          <p class="mt-8 text-indigo-700 font-medium tracking-wide">"Let this verse awaken your spirit and fill your heart with divine peace."</p>
        </div>
      `;
    } catch (error) {
      console.error("Error loading initial verse:", error);
      document.getElementById("verses-container").innerHTML = `
        <p class="text-center text-indigo-500 italic select-none text-xl max-w-3xl mx-auto leading-relaxed mt-12">
          "The breath of God whispers through these sacred words, awakening your spirit and illuminating your path. May you find peace, hope, and divine love here."
        </p>
      `;
      document.getElementById("chapter-title").textContent = "Awaken Your Soul";
    }
  })();
});