// Header Component
const HeaderComponent = {
  init: function() {
    // DOM Elements
    this.btnToday = document.getElementById("btn-today");
    this.btnDevotion = document.getElementById("btn-devotion");
    this.btnAbout = document.getElementById("btn-about");
    this.btnBible = document.getElementById("btn-bible");
    this.versesSection = document.getElementById("verses-section");
    this.versesContainer = document.getElementById("verses-container");
    this.chapterTitle = document.getElementById("chapter-title");
    this.initialVerse = document.getElementById("initial-verse");
    
    // Event listeners
    this.btnToday.addEventListener("click", () => this.showTodaysVerse());
    this.btnDevotion.addEventListener("click", () => this.showDevotionals());
    this.btnAbout.addEventListener("click", () => this.showAbout());
    this.btnBible.addEventListener("click", () => this.showBibleSection());
  },
  
  showTodaysVerse: function() {
    BibleContentComponent.clearSelectedVerse();
    this.initialVerse?.remove();
    this.versesSection.scrollIntoView({ behavior: "smooth" });
    
    this.chapterTitle.textContent = "Today's Inspirational Verse";
    
    // Show loading spinner
    this.versesContainer.innerHTML = `
      <div class="flex justify-center items-center space-x-3 text-indigo-700 py-12">
        <div class="spinner"></div>
        <span class="text-xl font-medium">Loading today's verse...</span>
      </div>
    `;
    
    // Pick a random book from spiritual books
    const spiritualBooks = ["Psalms", "Proverbs", "Isaiah", "John"];
    const book = spiritualBooks[Math.floor(Math.random() * spiritualBooks.length)];
    
    // Pick a random chapter and verse within that book
    const bookData = books.find((b) => b.name === book);
    if (!bookData) return;
    
    const chapter = Math.floor(Math.random() * bookData.chapters) + 1;
    
    BibleContentComponent.loadRandomVerse(book, chapter);
  },
  
  showDevotionals: function() {
    BibleContentComponent.clearSelectedVerse();
    this.initialVerse?.remove();
    this.versesSection.scrollIntoView({ behavior: "smooth" });
    
    this.chapterTitle.textContent = "Daily Devotionals";
    
    const devotionals = [
      {
        title: "Faith that Moves Mountains",
        scripture: "Matthew 17:20",
        text: "Truly, faith as small as a mustard seed can move mountains. Let your heart be filled with unwavering trust in God's power and love.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Mountain with sunrise symbolizing faith and hope",
      },
      {
        title: "Peace in the Storm",
        scripture: "Mark 4:39",
        text: "Jesus calms the storm with a word. In your life's tempests, remember His peace that surpasses all understanding.",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Calm sea with storm clouds parting, symbolizing peace amidst chaos",
      },
      {
        title: "Light of the World",
        scripture: "John 8:12",
        text: "Walk in the light of Christ, the lamp that guides your path through darkness and uncertainty.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Light shining through darkness symbolizing guidance and hope",
      },
      {
        title: "Love Never Fails",
        scripture: "1 Corinthians 13:8",
        text: "God's love is eternal and unfailing. Let it transform your heart and overflow to those around you.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Heart symbolizing eternal love and compassion",
      },
      {
        title: "Strength in Weakness",
        scripture: "2 Corinthians 12:9",
        text: "God's grace is sufficient, and His power is made perfect in weakness. Embrace your vulnerabilities and find strength in Him.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Tree symbolizing resilience and divine strength",
      },
    ];
    
    this.versesContainer.innerHTML = "";
    
    devotionals.forEach((devotion, index) => {
      const devotionEl = document.createElement("article");
      devotionEl.className = `mb-8 bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row fade-in`;
      devotionEl.style.animationDelay = `${index * 0.1}s`;
      
      const img = document.createElement("img");
      img.src = devotion.image;
      img.alt = devotion.alt;
      img.className = "w-full md:w-1/3 h-48 object-cover";
      
      const content = document.createElement("div");
      content.className = "p-6 flex-1";
      
      const title = document.createElement("h3");
      title.className = "text-indigo-900 font-playfair text-2xl font-bold mb-2 tracking-wide select-none";
      title.textContent = devotion.title;
      
      const scripture = document.createElement("p");
      scripture.className = "text-indigo-600 font-medium italic mb-3 select-none";
      scripture.textContent = devotion.scripture;
      
      const text = document.createElement("p");
      text.className = "text-gray-700 leading-relaxed";
      text.textContent = devotion.text;
      
      content.appendChild(title);
      content.appendChild(scripture);
      content.appendChild(text);
      
      devotionEl.appendChild(img);
      devotionEl.appendChild(content);
      this.versesContainer.appendChild(devotionEl);
    });
  },
  
  showAbout: function() {
    BibleContentComponent.clearSelectedVerse();
    this.initialVerse?.remove();
    this.versesSection.scrollIntoView({ behavior: "smooth" });
    
    this.chapterTitle.textContent = "About The Spiritual Bible";
    
    this.versesContainer.innerHTML = `
      <div class="max-w-4xl mx-auto prose prose-indigo text-gray-700 select-text">
        <div class="bg-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
          <p class="text-xl text-indigo-800 font-medium mb-4">
            Welcome to <strong class="text-indigo-900">The Spiritual Bible</strong>, a sacred sanctuary where the breath of God fills every word and awakens your soul.
          </p>
          <p>
            This digital Bible experience is crafted with reverence, beauty, and a deep desire to inspire your spiritual journey.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <h3 class="text-lg font-bold text-indigo-900 mb-3">Features</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Multiple Bible translations</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Favorite and save meaningful verses</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Add personal notes to reflect on scripture</span>
              </li>
              <li class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                <span>Daily devotionals for spiritual growth</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div class="bg-indigo-900 text-indigo-100 rounded-xl p-6 text-center">
          <p class="italic font-playfair text-lg mb-2">
            "Your word is a lamp to my feet and a light to my path." – Psalm 119:105
          </p>
          <p class="text-indigo-300">
            May this digital sanctuary bless your spiritual journey.
          </p>
        </div>
      </div>
    `;
  },
  
  showBibleSection: function() {
    document.getElementById("sidebar").scrollIntoView({ behavior: "smooth" });
    this.chapterTitle.textContent = "Awaken Your Soul";
    this.versesContainer.innerHTML = `
      <p class="text-center text-indigo-500 italic select-none text-xl max-w-3xl mx-auto leading-relaxed">
        "The breath of God whispers through these sacred words, awakening your spirit and illuminating your path. May you find peace, hope, and divine love here."
      </p>
      <div class="mt-10 max-w-3xl mx-auto bg-indigo-50 rounded-3xl p-8 shadow-lg border border-indigo-200 prose prose-indigo text-center text-indigo-900 select-text" id="initial-verse">
        <p class="text-3xl font-playfair italic leading-relaxed mb-6 before:content-['"'] after:content-['"'] before:text-indigo-400 after:text-indigo-400 before:text-7xl after:text-7xl before:relative after:relative before:-left-4 after:-right-4">
          "The Lord is my shepherd; I shall not want."
        </p>
        <p class="text-lg font-semibold mt-4 select-none">— Psalm 23:1 (NIV)</p>
        <p class="mt-6 text-indigo-700 font-semibold">Let this timeless promise comfort and guide your heart today.</p>
      </div>
    `;
    BibleContentComponent.clearSelectedVerse();
    document.getElementById("btn-copy-selected").disabled = true;
  }
};