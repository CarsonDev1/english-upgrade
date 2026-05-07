// IPA Roadmap — 5 levels, structured curriculum.
// Each lesson teaches one phoneme (or pattern) with: description, mouth tip,
// example words (with audio), minimal pairs, and a quiz of 5 questions.

export interface IPAExample {
  word: string;
  ipa: string;
  vi?: string;
}

export interface MinimalPair {
  a: { word: string; ipa: string };
  b: { word: string; ipa: string };
}

export interface QuizQuestion {
  word: string;        // word to play / show
  prompt?: string;     // optional override
  options: string[];   // IPA options
  answerIndex: number; // index of correct option
}

export interface IPALesson {
  id: string;          // e.g. "L1-iː"
  title: string;       // "/iː/ — long ee"
  symbol: string;      // "iː"
  category: "vowel" | "diphthong" | "consonant" | "stress" | "connected";
  description: string; // brief explanation
  mouthTip: string;    // how to position mouth/tongue
  examples: IPAExample[];
  minimalPairs?: MinimalPair[];
  quiz: QuizQuestion[];
}

export interface IPALevel {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  summary: string;
  estDuration: string;
  goal: string;
  lessons: IPALesson[];
}

export const IPA_LEVELS: IPALevel[] = [
  // ========================================================
  // LEVEL 1 — Monophthongs (single vowels)
  // ========================================================
  {
    level: 1,
    title: "Monophthongs",
    summary: "12 nguyên âm đơn — nền tảng cho mọi từ.",
    estDuration: "~1 tuần",
    goal: "Phân biệt được minimal pairs (ship/sheep, bad/bed) khi nghe.",
    lessons: [
      {
        id: "L1-iː",
        title: "/iː/ — long ee",
        symbol: "iː",
        category: "vowel",
        description: "Nguyên âm dài, môi cười rộng, lưỡi cao và đẩy ra trước.",
        mouthTip: "Cười rộng, đầu lưỡi gần răng cửa dưới, giữ âm dài.",
        examples: [
          { word: "see", ipa: "/siː/", vi: "thấy" },
          { word: "tree", ipa: "/triː/", vi: "cây" },
          { word: "key", ipa: "/kiː/", vi: "chìa khóa" },
          { word: "machine", ipa: "/məˈʃiːn/", vi: "máy" },
        ],
        minimalPairs: [
          { a: { word: "sheep", ipa: "/ʃiːp/" }, b: { word: "ship", ipa: "/ʃɪp/" } },
          { a: { word: "leave", ipa: "/liːv/" }, b: { word: "live", ipa: "/lɪv/" } },
        ],
        quiz: [
          { word: "feet", options: ["/fɪt/", "/fiːt/", "/fet/"], answerIndex: 1 },
          { word: "seat", options: ["/sɪt/", "/seɪt/", "/siːt/"], answerIndex: 2 },
          { word: "key", options: ["/kɪ/", "/kiː/", "/keɪ/"], answerIndex: 1 },
          { word: "cheap", options: ["/tʃiːp/", "/tʃɪp/", "/tʃep/"], answerIndex: 0 },
          { word: "leave", options: ["/lɪv/", "/leɪv/", "/liːv/"], answerIndex: 2 },
        ],
      },
      {
        id: "L1-ɪ",
        title: "/ɪ/ — short i",
        symbol: "ɪ",
        category: "vowel",
        description: "Nguyên âm ngắn, môi và lưỡi thư giãn hơn /iː/.",
        mouthTip: "Miệng mở nhẹ, lưỡi thấp hơn /iː/. Âm ngắn, dứt khoát.",
        examples: [
          { word: "ship", ipa: "/ʃɪp/", vi: "tàu" },
          { word: "kit", ipa: "/kɪt/", vi: "bộ dụng cụ" },
          { word: "fish", ipa: "/fɪʃ/", vi: "" },
          { word: "village", ipa: "/ˈvɪlɪdʒ/", vi: "làng" },
        ],
        minimalPairs: [
          { a: { word: "ship", ipa: "/ʃɪp/" }, b: { word: "sheep", ipa: "/ʃiːp/" } },
          { a: { word: "bit", ipa: "/bɪt/" }, b: { word: "beat", ipa: "/biːt/" } },
        ],
        quiz: [
          { word: "ship", options: ["/ʃiːp/", "/ʃɪp/", "/ʃep/"], answerIndex: 1 },
          { word: "fit", options: ["/fiːt/", "/fɪt/", "/feɪt/"], answerIndex: 1 },
          { word: "bin", options: ["/biːn/", "/bɪn/", "/ben/"], answerIndex: 1 },
          { word: "sit", options: ["/sɪt/", "/siːt/", "/seɪt/"], answerIndex: 0 },
          { word: "rich", options: ["/riːtʃ/", "/rɪtʃ/", "/retʃ/"], answerIndex: 1 },
        ],
      },
      {
        id: "L1-e",
        title: "/e/ — short e",
        symbol: "e",
        category: "vowel",
        description: "Nguyên âm ngắn, môi mở vừa, lưỡi ở giữa.",
        mouthTip: "Miệng mở giữa, lưỡi không cao không thấp. Như chữ 'e' trong 'bed'.",
        examples: [
          { word: "bed", ipa: "/bed/" },
          { word: "head", ipa: "/hed/" },
          { word: "friend", ipa: "/frend/" },
          { word: "many", ipa: "/ˈmeni/" },
        ],
        minimalPairs: [
          { a: { word: "bed", ipa: "/bed/" }, b: { word: "bad", ipa: "/bæd/" } },
          { a: { word: "men", ipa: "/men/" }, b: { word: "man", ipa: "/mæn/" } },
        ],
        quiz: [
          { word: "bed", options: ["/bæd/", "/bed/", "/bɪd/"], answerIndex: 1 },
          { word: "head", options: ["/hed/", "/hæd/", "/hiːd/"], answerIndex: 0 },
          { word: "leg", options: ["/leɪg/", "/leg/", "/læg/"], answerIndex: 1 },
          { word: "many", options: ["/ˈmæni/", "/ˈmeni/", "/ˈmeɪni/"], answerIndex: 1 },
          { word: "friend", options: ["/freɪnd/", "/frend/", "/frænd/"], answerIndex: 1 },
        ],
      },
      {
        id: "L1-æ",
        title: "/æ/ — flat a",
        symbol: "æ",
        category: "vowel",
        description: "Nguyên âm ngắn, miệng mở rộng, lưỡi thấp và bẹt.",
        mouthTip: "Mở miệng rộng hơn /e/, đẩy hàm dưới xuống. Như 'a' trong 'cat'.",
        examples: [
          { word: "cat", ipa: "/kæt/" },
          { word: "bad", ipa: "/bæd/" },
          { word: "happy", ipa: "/ˈhæpi/" },
          { word: "apple", ipa: "/ˈæpəl/" },
        ],
        minimalPairs: [
          { a: { word: "bad", ipa: "/bæd/" }, b: { word: "bed", ipa: "/bed/" } },
          { a: { word: "cat", ipa: "/kæt/" }, b: { word: "cut", ipa: "/kʌt/" } },
        ],
        quiz: [
          { word: "cat", options: ["/kʌt/", "/kæt/", "/ket/"], answerIndex: 1 },
          { word: "bad", options: ["/bed/", "/bʌd/", "/bæd/"], answerIndex: 2 },
          { word: "apple", options: ["/ˈæpəl/", "/ˈepəl/", "/ˈʌpəl/"], answerIndex: 0 },
          { word: "man", options: ["/men/", "/mæn/", "/mʌn/"], answerIndex: 1 },
          { word: "happy", options: ["/ˈhepi/", "/ˈhʌpi/", "/ˈhæpi/"], answerIndex: 2 },
        ],
      },
      {
        id: "L1-ʌ",
        title: "/ʌ/ — short u",
        symbol: "ʌ",
        category: "vowel",
        description: "Nguyên âm ngắn, mở vừa, lưỡi giữa, môi thư giãn.",
        mouthTip: "Như 'a' trong tiếng Việt 'ăn' nhưng ngắn và trầm hơn.",
        examples: [
          { word: "cup", ipa: "/kʌp/" },
          { word: "love", ipa: "/lʌv/" },
          { word: "money", ipa: "/ˈmʌni/" },
          { word: "country", ipa: "/ˈkʌntri/" },
        ],
        minimalPairs: [
          { a: { word: "cut", ipa: "/kʌt/" }, b: { word: "cat", ipa: "/kæt/" } },
          { a: { word: "luck", ipa: "/lʌk/" }, b: { word: "lock", ipa: "/lɒk/" } },
        ],
        quiz: [
          { word: "cup", options: ["/kæp/", "/kʌp/", "/kɒp/"], answerIndex: 1 },
          { word: "love", options: ["/lʌv/", "/lɒv/", "/lev/"], answerIndex: 0 },
          { word: "son", options: ["/sɒn/", "/sʌn/", "/sæn/"], answerIndex: 1 },
          { word: "money", options: ["/ˈmɒni/", "/ˈmʌni/", "/ˈmæni/"], answerIndex: 1 },
          { word: "but", options: ["/bʊt/", "/bʌt/", "/bæt/"], answerIndex: 1 },
        ],
      },
      {
        id: "L1-ɑː",
        title: "/ɑː/ — long aa",
        symbol: "ɑː",
        category: "vowel",
        description: "Nguyên âm dài, miệng mở to, lưỡi thấp và lui sau.",
        mouthTip: "Mở miệng như khi bác sĩ khám họng. Âm dài, sâu.",
        examples: [
          { word: "car", ipa: "/kɑːr/" },
          { word: "father", ipa: "/ˈfɑːðər/" },
          { word: "calm", ipa: "/kɑːm/" },
          { word: "heart", ipa: "/hɑːrt/" },
        ],
        quiz: [
          { word: "car", options: ["/kær/", "/kɑːr/", "/kɔːr/"], answerIndex: 1 },
          { word: "park", options: ["/pɑːrk/", "/pærk/", "/pʌrk/"], answerIndex: 0 },
          { word: "calm", options: ["/kæm/", "/kʌm/", "/kɑːm/"], answerIndex: 2 },
          { word: "heart", options: ["/hɜːrt/", "/hɑːrt/", "/hɔːrt/"], answerIndex: 1 },
          { word: "father", options: ["/ˈfʌðər/", "/ˈfɑːðər/", "/ˈfeɪðər/"], answerIndex: 1 },
        ],
      },
      {
        id: "L1-ɒ",
        title: "/ɒ/ — short o (UK)",
        symbol: "ɒ",
        category: "vowel",
        description: "Nguyên âm ngắn, môi tròn, miệng mở. Chỉ có trong British English.",
        mouthTip: "Miệng mở vừa, môi tròn nhẹ. Trong American English thường là /ɑː/.",
        examples: [
          { word: "hot", ipa: "/hɒt/" },
          { word: "dog", ipa: "/dɒɡ/" },
          { word: "stop", ipa: "/stɒp/" },
          { word: "watch", ipa: "/wɒtʃ/" },
        ],
        quiz: [
          { word: "hot", options: ["/hʌt/", "/hɒt/", "/hæt/"], answerIndex: 1 },
          { word: "dog", options: ["/dɔːɡ/", "/dʌɡ/", "/dɒɡ/"], answerIndex: 2 },
          { word: "stop", options: ["/stʌp/", "/stɒp/", "/stæp/"], answerIndex: 1 },
          { word: "lock", options: ["/lʌk/", "/lɒk/", "/lɔːk/"], answerIndex: 1 },
          { word: "watch", options: ["/wʌtʃ/", "/wɒtʃ/", "/wætʃ/"], answerIndex: 1 },
        ],
      },
      {
        id: "L1-ɔː",
        title: "/ɔː/ — long aw",
        symbol: "ɔː",
        category: "vowel",
        description: "Nguyên âm dài, môi tròn, miệng mở vừa, lưỡi lui sau.",
        mouthTip: "Tròn môi, kéo dài âm. Như chữ 'or' trong 'more'.",
        examples: [
          { word: "more", ipa: "/mɔːr/" },
          { word: "law", ipa: "/lɔː/" },
          { word: "sport", ipa: "/spɔːrt/" },
          { word: "thought", ipa: "/θɔːt/" },
        ],
        quiz: [
          { word: "more", options: ["/mɒr/", "/mɔːr/", "/mʊr/"], answerIndex: 1 },
          { word: "law", options: ["/lɔː/", "/lɒ/", "/laʊ/"], answerIndex: 0 },
          { word: "sport", options: ["/spɔːrt/", "/spɒrt/", "/spʌrt/"], answerIndex: 0 },
          { word: "thought", options: ["/θʌt/", "/θɔːt/", "/θɒt/"], answerIndex: 1 },
          { word: "door", options: ["/dʊr/", "/dɔːr/", "/dɒr/"], answerIndex: 1 },
        ],
      },
      {
        id: "L1-ʊ",
        title: "/ʊ/ — short oo",
        symbol: "ʊ",
        category: "vowel",
        description: "Nguyên âm ngắn, môi tròn nhẹ, lưỡi cao và lui.",
        mouthTip: "Như 'u' trong 'put', không kéo dài. Môi tròn nhẹ.",
        examples: [
          { word: "put", ipa: "/pʊt/" },
          { word: "good", ipa: "/ɡʊd/" },
          { word: "book", ipa: "/bʊk/" },
          { word: "could", ipa: "/kʊd/" },
        ],
        minimalPairs: [
          { a: { word: "pull", ipa: "/pʊl/" }, b: { word: "pool", ipa: "/puːl/" } },
        ],
        quiz: [
          { word: "put", options: ["/pʊt/", "/puːt/", "/pʌt/"], answerIndex: 0 },
          { word: "good", options: ["/ɡuːd/", "/ɡʊd/", "/ɡɒd/"], answerIndex: 1 },
          { word: "book", options: ["/buːk/", "/bʊk/", "/bʌk/"], answerIndex: 1 },
          { word: "look", options: ["/lʊk/", "/luːk/", "/lʌk/"], answerIndex: 0 },
          { word: "would", options: ["/wuːd/", "/wʊd/", "/wʌd/"], answerIndex: 1 },
        ],
      },
      {
        id: "L1-uː",
        title: "/uː/ — long oo",
        symbol: "uː",
        category: "vowel",
        description: "Nguyên âm dài, môi tròn căng, lưỡi cao và lui sau.",
        mouthTip: "Tròn môi mạnh, kéo dài. Như 'oo' trong 'too'.",
        examples: [
          { word: "too", ipa: "/tuː/" },
          { word: "blue", ipa: "/bluː/" },
          { word: "shoe", ipa: "/ʃuː/" },
          { word: "moon", ipa: "/muːn/" },
        ],
        minimalPairs: [
          { a: { word: "pool", ipa: "/puːl/" }, b: { word: "pull", ipa: "/pʊl/" } },
          { a: { word: "fool", ipa: "/fuːl/" }, b: { word: "full", ipa: "/fʊl/" } },
        ],
        quiz: [
          { word: "too", options: ["/tʊ/", "/tuː/", "/təʊ/"], answerIndex: 1 },
          { word: "blue", options: ["/bluː/", "/blʊ/", "/bləʊ/"], answerIndex: 0 },
          { word: "moon", options: ["/mʊn/", "/mʌn/", "/muːn/"], answerIndex: 2 },
          { word: "food", options: ["/fʊd/", "/fuːd/", "/fʌd/"], answerIndex: 1 },
          { word: "soup", options: ["/sʊp/", "/səʊp/", "/suːp/"], answerIndex: 2 },
        ],
      },
      {
        id: "L1-ɜː",
        title: "/ɜː/ — long er",
        symbol: "ɜː",
        category: "vowel",
        description: "Nguyên âm dài, miệng mở giữa, lưỡi giữa, môi thư giãn.",
        mouthTip: "Như 'er' trong 'her', kéo dài. Lưỡi không cao không thấp.",
        examples: [
          { word: "bird", ipa: "/bɜːrd/" },
          { word: "work", ipa: "/wɜːrk/" },
          { word: "learn", ipa: "/lɜːrn/" },
          { word: "girl", ipa: "/ɡɜːrl/" },
        ],
        quiz: [
          { word: "bird", options: ["/bɪrd/", "/bɜːrd/", "/berd/"], answerIndex: 1 },
          { word: "work", options: ["/wʌrk/", "/wɜːrk/", "/wɔːrk/"], answerIndex: 1 },
          { word: "learn", options: ["/lɜːrn/", "/lɪrn/", "/lærn/"], answerIndex: 0 },
          { word: "first", options: ["/fɪrst/", "/fɜːrst/", "/fʌrst/"], answerIndex: 1 },
          { word: "her", options: ["/hɜːr/", "/hɪr/", "/her/"], answerIndex: 0 },
        ],
      },
      {
        id: "L1-ə",
        title: "/ə/ — schwa (the most common sound!)",
        symbol: "ə",
        category: "vowel",
        description: "Nguyên âm yếu, ngắn, mờ. Là âm phổ biến NHẤT trong tiếng Anh.",
        mouthTip: "Miệng thư giãn hoàn toàn, lưỡi giữa, âm rất ngắn. Thường ở âm tiết KHÔNG nhấn.",
        examples: [
          { word: "about", ipa: "/əˈbaʊt/" },
          { word: "banana", ipa: "/bəˈnɑːnə/" },
          { word: "computer", ipa: "/kəmˈpjuːtər/" },
          { word: "the", ipa: "/ðə/" },
        ],
        quiz: [
          { word: "about", options: ["/əˈbaʊt/", "/æˈbaʊt/", "/ʌˈbaʊt/"], answerIndex: 0 },
          { word: "banana", options: ["/bæˈnæneɪ/", "/bəˈnɑːnə/", "/bɒˈnænə/"], answerIndex: 1 },
          { word: "today", options: ["/ˈtuːdeɪ/", "/təˈdeɪ/", "/tʌˈdeɪ/"], answerIndex: 1 },
          { word: "support", options: ["/səˈpɔːrt/", "/sʌˈpɔːrt/", "/suːˈpɔːrt/"], answerIndex: 0 },
          { word: "the", options: ["/ði/", "/ðə/", "/ðiː/"], answerIndex: 1 },
        ],
      },
    ],
  },

  // ========================================================
  // LEVEL 2 — Diphthongs
  // ========================================================
  {
    level: 2,
    title: "Diphthongs",
    summary: "8 nguyên âm đôi — 2 nguyên âm chuyển động liền nhau.",
    estDuration: "~1 tuần",
    goal: "Đọc đúng 50 từ chứa diphthong ngẫu nhiên.",
    lessons: [
      {
        id: "L2-eɪ",
        title: "/eɪ/ — eh-ee",
        symbol: "eɪ",
        category: "diphthong",
        description: "Bắt đầu /e/, trượt nhẹ sang /ɪ/.",
        mouthTip: "Miệng từ vị trí 'e' (bed) trượt lên 'ɪ' (sit). Không cong môi.",
        examples: [
          { word: "say", ipa: "/seɪ/" },
          { word: "name", ipa: "/neɪm/" },
          { word: "today", ipa: "/təˈdeɪ/" },
          { word: "rain", ipa: "/reɪn/" },
        ],
        quiz: [
          { word: "say", options: ["/seɪ/", "/saɪ/", "/se/"], answerIndex: 0 },
          { word: "name", options: ["/næm/", "/neɪm/", "/nɑːm/"], answerIndex: 1 },
          { word: "rain", options: ["/reɪn/", "/ræn/", "/rɪn/"], answerIndex: 0 },
          { word: "eight", options: ["/aɪt/", "/eɪt/", "/iːt/"], answerIndex: 1 },
          { word: "great", options: ["/ɡriːt/", "/ɡreɪt/", "/ɡrʌt/"], answerIndex: 1 },
        ],
      },
      {
        id: "L2-aɪ",
        title: "/aɪ/ — ah-ee",
        symbol: "aɪ",
        category: "diphthong",
        description: "Bắt đầu /a/ mở rộng, trượt sang /ɪ/.",
        mouthTip: "Miệng mở to rồi đóng lại. Như 'ai' trong 'high'.",
        examples: [
          { word: "high", ipa: "/haɪ/" },
          { word: "time", ipa: "/taɪm/" },
          { word: "five", ipa: "/faɪv/" },
          { word: "child", ipa: "/tʃaɪld/" },
        ],
        quiz: [
          { word: "high", options: ["/heɪ/", "/haɪ/", "/hʌɪ/"], answerIndex: 1 },
          { word: "time", options: ["/teɪm/", "/taɪm/", "/tɪm/"], answerIndex: 1 },
          { word: "five", options: ["/feɪv/", "/faɪv/", "/fɪv/"], answerIndex: 1 },
          { word: "buy", options: ["/buː/", "/baɪ/", "/biː/"], answerIndex: 1 },
          { word: "eye", options: ["/iː/", "/aɪ/", "/eɪ/"], answerIndex: 1 },
        ],
      },
      {
        id: "L2-ɔɪ",
        title: "/ɔɪ/ — oy",
        symbol: "ɔɪ",
        category: "diphthong",
        description: "Bắt đầu /ɔː/ tròn môi, trượt sang /ɪ/.",
        mouthTip: "Tròn môi rồi mở ra cười nhẹ. Như 'oy' trong 'boy'.",
        examples: [
          { word: "boy", ipa: "/bɔɪ/" },
          { word: "noise", ipa: "/nɔɪz/" },
          { word: "enjoy", ipa: "/ɪnˈdʒɔɪ/" },
          { word: "voice", ipa: "/vɔɪs/" },
        ],
        quiz: [
          { word: "boy", options: ["/bɔɪ/", "/baɪ/", "/bəʊ/"], answerIndex: 0 },
          { word: "voice", options: ["/voɪs/", "/vɔɪs/", "/vʊs/"], answerIndex: 1 },
          { word: "noise", options: ["/naɪz/", "/nɔɪz/", "/nəʊz/"], answerIndex: 1 },
          { word: "join", options: ["/dʒaɪn/", "/dʒɔɪn/", "/dʒəʊn/"], answerIndex: 1 },
          { word: "toy", options: ["/tɔɪ/", "/taɪ/", "/təʊ/"], answerIndex: 0 },
        ],
      },
      {
        id: "L2-aʊ",
        title: "/aʊ/ — ow",
        symbol: "aʊ",
        category: "diphthong",
        description: "Bắt đầu /a/, trượt sang /ʊ/ tròn môi.",
        mouthTip: "Mở miệng to rồi tròn môi lại. Như 'ow' trong 'now'.",
        examples: [
          { word: "now", ipa: "/naʊ/" },
          { word: "house", ipa: "/haʊs/" },
          { word: "down", ipa: "/daʊn/" },
          { word: "out", ipa: "/aʊt/" },
        ],
        quiz: [
          { word: "now", options: ["/nəʊ/", "/naʊ/", "/nuː/"], answerIndex: 1 },
          { word: "house", options: ["/həʊs/", "/haʊs/", "/huːs/"], answerIndex: 1 },
          { word: "out", options: ["/əʊt/", "/aʊt/", "/uːt/"], answerIndex: 1 },
          { word: "town", options: ["/təʊn/", "/taʊn/", "/tuːn/"], answerIndex: 1 },
          { word: "loud", options: ["/ləʊd/", "/laʊd/", "/luːd/"], answerIndex: 1 },
        ],
      },
      {
        id: "L2-əʊ",
        title: "/əʊ/ — oh (UK) / /oʊ/ (US)",
        symbol: "əʊ",
        category: "diphthong",
        description: "Bắt đầu /ə/ trung tâm, trượt sang /ʊ/ tròn môi.",
        mouthTip: "Bắt đầu thư giãn, kết thúc tròn môi. Như 'oh' trong 'go'.",
        examples: [
          { word: "go", ipa: "/ɡəʊ/" },
          { word: "home", ipa: "/həʊm/" },
          { word: "no", ipa: "/nəʊ/" },
          { word: "phone", ipa: "/fəʊn/" },
        ],
        quiz: [
          { word: "go", options: ["/ɡəʊ/", "/ɡaʊ/", "/ɡuː/"], answerIndex: 0 },
          { word: "home", options: ["/həʊm/", "/haʊm/", "/huːm/"], answerIndex: 0 },
          { word: "no", options: ["/nuː/", "/nəʊ/", "/naʊ/"], answerIndex: 1 },
          { word: "snow", options: ["/snaʊ/", "/snəʊ/", "/snʊ/"], answerIndex: 1 },
          { word: "boat", options: ["/baʊt/", "/buːt/", "/bəʊt/"], answerIndex: 2 },
        ],
      },
      {
        id: "L2-ɪə",
        title: "/ɪə/ — ear",
        symbol: "ɪə",
        category: "diphthong",
        description: "Bắt đầu /ɪ/, trượt sang /ə/.",
        mouthTip: "Như 'ear' trong 'hear'. Bắt đầu cao, kết thúc thư giãn.",
        examples: [
          { word: "ear", ipa: "/ɪə/" },
          { word: "here", ipa: "/hɪə/" },
          { word: "near", ipa: "/nɪə/" },
          { word: "idea", ipa: "/aɪˈdɪə/" },
        ],
        quiz: [
          { word: "ear", options: ["/ɪə/", "/eə/", "/ʊə/"], answerIndex: 0 },
          { word: "here", options: ["/heə/", "/hɪə/", "/hʊə/"], answerIndex: 1 },
          { word: "near", options: ["/neə/", "/nɪə/", "/nuːə/"], answerIndex: 1 },
          { word: "year", options: ["/jeə/", "/jɪə/", "/juːə/"], answerIndex: 1 },
          { word: "beer", options: ["/bɪə/", "/beə/", "/baɪə/"], answerIndex: 0 },
        ],
      },
      {
        id: "L2-eə",
        title: "/eə/ — air",
        symbol: "eə",
        category: "diphthong",
        description: "Bắt đầu /e/, trượt sang /ə/.",
        mouthTip: "Như 'air' trong 'hair'. Mở miệng vừa, kết thúc thư giãn.",
        examples: [
          { word: "air", ipa: "/eə/" },
          { word: "where", ipa: "/weə/" },
          { word: "care", ipa: "/keə/" },
          { word: "share", ipa: "/ʃeə/" },
        ],
        quiz: [
          { word: "air", options: ["/ɪə/", "/eə/", "/ʊə/"], answerIndex: 1 },
          { word: "where", options: ["/wɪə/", "/weə/", "/wʊə/"], answerIndex: 1 },
          { word: "care", options: ["/kɪə/", "/keə/", "/kʌə/"], answerIndex: 1 },
          { word: "hair", options: ["/heə/", "/hɪə/", "/haɪə/"], answerIndex: 0 },
          { word: "fair", options: ["/feə/", "/fɪə/", "/faɪə/"], answerIndex: 0 },
        ],
      },
      {
        id: "L2-ʊə",
        title: "/ʊə/ — oor (rare)",
        symbol: "ʊə",
        category: "diphthong",
        description: "Bắt đầu /ʊ/ tròn môi, trượt sang /ə/. Hiếm gặp; thường biến thành /ɔː/.",
        mouthTip: "Như 'oor' trong 'poor' (RP cũ). Trong tiếng Anh hiện đại thường thay bằng /ɔː/.",
        examples: [
          { word: "poor", ipa: "/pʊə/" },
          { word: "tour", ipa: "/tʊə/" },
          { word: "sure", ipa: "/ʃʊə/" },
          { word: "cure", ipa: "/kjʊə/" },
        ],
        quiz: [
          { word: "poor", options: ["/pɔːr/", "/pʊə/", "/puːr/"], answerIndex: 1 },
          { word: "tour", options: ["/taʊə/", "/tʊə/", "/tɔːr/"], answerIndex: 1 },
          { word: "sure", options: ["/ʃʊə/", "/ʃɔːr/", "/ʃʌə/"], answerIndex: 0 },
          { word: "pure", options: ["/pjʊə/", "/pjuːə/", "/pɔːr/"], answerIndex: 0 },
          { word: "cure", options: ["/kjʊə/", "/kuːə/", "/kɔːr/"], answerIndex: 0 },
        ],
      },
    ],
  },

  // ========================================================
  // LEVEL 3 — Difficult consonants
  // ========================================================
  {
    level: 3,
    title: "Phụ âm khó",
    summary: "Các phụ âm tiếng Anh không có (hoặc khác) trong tiếng Việt.",
    estDuration: "~2 tuần",
    goal: "Phân biệt /θ-s/, /ð-d/, /ʃ-s/, /tʃ-ʃ/.",
    lessons: [
      {
        id: "L3-θ",
        title: "/θ/ — th (voiceless)",
        symbol: "θ",
        category: "consonant",
        description: "Phụ âm vô thanh, lưỡi đặt giữa răng, hơi thoát ra.",
        mouthTip: "Đặt đầu lưỡi giữa hai hàm răng, thổi hơi nhẹ. KHÔNG rung dây thanh.",
        examples: [
          { word: "think", ipa: "/θɪŋk/" },
          { word: "three", ipa: "/θriː/" },
          { word: "thought", ipa: "/θɔːt/" },
          { word: "bath", ipa: "/bɑːθ/" },
        ],
        minimalPairs: [
          { a: { word: "think", ipa: "/θɪŋk/" }, b: { word: "sink", ipa: "/sɪŋk/" } },
          { a: { word: "thigh", ipa: "/θaɪ/" }, b: { word: "sigh", ipa: "/saɪ/" } },
        ],
        quiz: [
          { word: "think", options: ["/sɪŋk/", "/θɪŋk/", "/tɪŋk/"], answerIndex: 1 },
          { word: "three", options: ["/triː/", "/sriː/", "/θriː/"], answerIndex: 2 },
          { word: "thought", options: ["/sɔːt/", "/θɔːt/", "/tɔːt/"], answerIndex: 1 },
          { word: "bath", options: ["/bɑːs/", "/bɑːt/", "/bɑːθ/"], answerIndex: 2 },
          { word: "month", options: ["/mʌns/", "/mʌnt/", "/mʌnθ/"], answerIndex: 2 },
        ],
      },
      {
        id: "L3-ð",
        title: "/ð/ — th (voiced)",
        symbol: "ð",
        category: "consonant",
        description: "Phụ âm hữu thanh, lưỡi đặt giữa răng, dây thanh rung.",
        mouthTip: "Cùng vị trí với /θ/ nhưng RUNG dây thanh. Đặt tay lên cổ — bạn cảm nhận được rung.",
        examples: [
          { word: "this", ipa: "/ðɪs/" },
          { word: "that", ipa: "/ðæt/" },
          { word: "mother", ipa: "/ˈmʌðər/" },
          { word: "weather", ipa: "/ˈweðər/" },
        ],
        minimalPairs: [
          { a: { word: "they", ipa: "/ðeɪ/" }, b: { word: "day", ipa: "/deɪ/" } },
          { a: { word: "breathe", ipa: "/briːð/" }, b: { word: "breed", ipa: "/briːd/" } },
        ],
        quiz: [
          { word: "this", options: ["/dɪs/", "/zɪs/", "/ðɪs/"], answerIndex: 2 },
          { word: "they", options: ["/ðeɪ/", "/deɪ/", "/zeɪ/"], answerIndex: 0 },
          { word: "mother", options: ["/ˈmʌdər/", "/ˈmʌðər/", "/ˈmʌzər/"], answerIndex: 1 },
          { word: "with", options: ["/wɪd/", "/wɪθ/", "/wɪð/"], answerIndex: 2 },
          { word: "weather", options: ["/ˈwedər/", "/ˈweðər/", "/ˈweθər/"], answerIndex: 1 },
        ],
      },
      {
        id: "L3-ʃ",
        title: "/ʃ/ — sh",
        symbol: "ʃ",
        category: "consonant",
        description: "Phụ âm vô thanh, môi tròn nhẹ, lưỡi cong.",
        mouthTip: "Tròn môi, lưỡi cong gần vòm miệng, thổi hơi. Như 'suỵt' trong tiếng Việt.",
        examples: [
          { word: "she", ipa: "/ʃiː/" },
          { word: "wash", ipa: "/wɒʃ/" },
          { word: "ocean", ipa: "/ˈəʊʃən/" },
          { word: "nation", ipa: "/ˈneɪʃən/" },
        ],
        minimalPairs: [
          { a: { word: "she", ipa: "/ʃiː/" }, b: { word: "see", ipa: "/siː/" } },
          { a: { word: "shoe", ipa: "/ʃuː/" }, b: { word: "Sue", ipa: "/suː/" } },
        ],
        quiz: [
          { word: "she", options: ["/siː/", "/ʃiː/", "/tʃiː/"], answerIndex: 1 },
          { word: "wash", options: ["/wɒʃ/", "/wɒs/", "/wɒtʃ/"], answerIndex: 0 },
          { word: "ocean", options: ["/ˈəʊsən/", "/ˈəʊʃən/", "/ˈəʊtʃən/"], answerIndex: 1 },
          { word: "shop", options: ["/ʃɒp/", "/sɒp/", "/tʃɒp/"], answerIndex: 0 },
          { word: "nation", options: ["/ˈneɪsən/", "/ˈneɪʃən/", "/ˈneɪtʃən/"], answerIndex: 1 },
        ],
      },
      {
        id: "L3-ʒ",
        title: "/ʒ/ — zh",
        symbol: "ʒ",
        category: "consonant",
        description: "Phụ âm hữu thanh, giống /ʃ/ nhưng RUNG dây thanh.",
        mouthTip: "Cùng vị trí với /ʃ/ nhưng có rung. Hiếm gặp ở đầu từ.",
        examples: [
          { word: "vision", ipa: "/ˈvɪʒən/" },
          { word: "measure", ipa: "/ˈmeʒər/" },
          { word: "pleasure", ipa: "/ˈpleʒər/" },
          { word: "garage", ipa: "/ˈɡærɑːʒ/" },
        ],
        quiz: [
          { word: "vision", options: ["/ˈvɪʃən/", "/ˈvɪʒən/", "/ˈvɪzən/"], answerIndex: 1 },
          { word: "measure", options: ["/ˈmeʃər/", "/ˈmezər/", "/ˈmeʒər/"], answerIndex: 2 },
          { word: "pleasure", options: ["/ˈpleʃər/", "/ˈpleʒər/", "/ˈplezər/"], answerIndex: 1 },
          { word: "usual", options: ["/ˈjuːʒuəl/", "/ˈjuːzuəl/", "/ˈjuːʃuəl/"], answerIndex: 0 },
          { word: "decision", options: ["/dɪˈsɪʒən/", "/dɪˈsɪʃən/", "/dɪˈsɪzən/"], answerIndex: 0 },
        ],
      },
      {
        id: "L3-tʃ",
        title: "/tʃ/ — ch",
        symbol: "tʃ",
        category: "consonant",
        description: "Phụ âm tắc-xát vô thanh. Như 'ch' trong 'church'.",
        mouthTip: "Đặt lưỡi như /t/ rồi nhả thành /ʃ/. Một âm liền mạch.",
        examples: [
          { word: "chair", ipa: "/tʃeə/" },
          { word: "watch", ipa: "/wɒtʃ/" },
          { word: "teacher", ipa: "/ˈtiːtʃər/" },
          { word: "match", ipa: "/mætʃ/" },
        ],
        minimalPairs: [
          { a: { word: "chip", ipa: "/tʃɪp/" }, b: { word: "ship", ipa: "/ʃɪp/" } },
        ],
        quiz: [
          { word: "chair", options: ["/ʃeə/", "/tʃeə/", "/dʒeə/"], answerIndex: 1 },
          { word: "watch", options: ["/wɒʃ/", "/wɒtʃ/", "/wɒt/"], answerIndex: 1 },
          { word: "teacher", options: ["/ˈtiːʃər/", "/ˈtiːtʃər/", "/ˈtiːsər/"], answerIndex: 1 },
          { word: "much", options: ["/mʌʃ/", "/mʌt/", "/mʌtʃ/"], answerIndex: 2 },
          { word: "kitchen", options: ["/ˈkɪʃən/", "/ˈkɪtʃən/", "/ˈkɪtən/"], answerIndex: 1 },
        ],
      },
      {
        id: "L3-dʒ",
        title: "/dʒ/ — j",
        symbol: "dʒ",
        category: "consonant",
        description: "Phụ âm tắc-xát hữu thanh. Như 'j' trong 'jam'.",
        mouthTip: "Cùng vị trí /tʃ/ nhưng rung dây thanh. Như chữ 'j' trong 'judge'.",
        examples: [
          { word: "job", ipa: "/dʒɒb/" },
          { word: "judge", ipa: "/dʒʌdʒ/" },
          { word: "bridge", ipa: "/brɪdʒ/" },
          { word: "magic", ipa: "/ˈmædʒɪk/" },
        ],
        quiz: [
          { word: "job", options: ["/jɒb/", "/dʒɒb/", "/tʃɒb/"], answerIndex: 1 },
          { word: "judge", options: ["/jʌdʒ/", "/tʃʌtʃ/", "/dʒʌdʒ/"], answerIndex: 2 },
          { word: "bridge", options: ["/brɪdʒ/", "/brɪtʃ/", "/brɪd/"], answerIndex: 0 },
          { word: "magic", options: ["/ˈmædʒɪk/", "/ˈmætʃɪk/", "/ˈmæɡɪk/"], answerIndex: 0 },
          { word: "page", options: ["/peɪʃ/", "/peɪdʒ/", "/peɪtʃ/"], answerIndex: 1 },
        ],
      },
      {
        id: "L3-ŋ",
        title: "/ŋ/ — ng",
        symbol: "ŋ",
        category: "consonant",
        description: "Phụ âm mũi, hữu thanh. Lưỡi sau chạm vòm mềm.",
        mouthTip: "Như 'ng' trong tiếng Việt 'ngon'. Lưỡi sau cuộn lên vòm mềm. KHÔNG bật ra /k/ hay /ɡ/.",
        examples: [
          { word: "sing", ipa: "/sɪŋ/" },
          { word: "long", ipa: "/lɒŋ/" },
          { word: "thinking", ipa: "/ˈθɪŋkɪŋ/" },
          { word: "morning", ipa: "/ˈmɔːnɪŋ/" },
        ],
        quiz: [
          { word: "sing", options: ["/sɪn/", "/sɪŋ/", "/sɪnɡ/"], answerIndex: 1 },
          { word: "long", options: ["/lɒŋ/", "/lɒn/", "/lɒnɡ/"], answerIndex: 0 },
          { word: "thinking", options: ["/ˈθɪnkɪn/", "/ˈθɪŋkɪŋ/", "/ˈθɪnkɪŋ/"], answerIndex: 1 },
          { word: "morning", options: ["/ˈmɔːnɪn/", "/ˈmɔːnɪnɡ/", "/ˈmɔːnɪŋ/"], answerIndex: 2 },
          { word: "young", options: ["/jʌn/", "/jʌŋ/", "/jʌnɡ/"], answerIndex: 1 },
        ],
      },
    ],
  },

  // ========================================================
  // LEVEL 4 — Word stress + schwa
  // ========================================================
  {
    level: 4,
    title: "Trọng âm + Schwa",
    summary: "Cách xác định âm tiết nhấn và sử dụng schwa /ə/.",
    estDuration: "~2 tuần",
    goal: "Đoán đúng trọng âm 80% từ mới gặp.",
    lessons: [
      {
        id: "L4-stress-2",
        title: "Trọng âm — từ 2 âm tiết",
        symbol: "ˈ",
        category: "stress",
        description: "Đa số danh từ/tính từ 2 âm tiết nhấn vào âm 1; động từ thường nhấn vào âm 2.",
        mouthTip: "Âm tiết nhấn: kéo dài hơn, to hơn, cao hơn. Các âm khác → schwa /ə/.",
        examples: [
          { word: "TEAcher", ipa: "/ˈtiːtʃər/" },
          { word: "HAPpy", ipa: "/ˈhæpi/" },
          { word: "preSENT (v)", ipa: "/prɪˈzent/" },
          { word: "PREsent (n)", ipa: "/ˈprezənt/" },
        ],
        quiz: [
          { word: "doctor", options: ["/ˈdɒktər/", "/dɒkˈtər/"], answerIndex: 0 },
          { word: "begin", options: ["/ˈbeɡɪn/", "/bɪˈɡɪn/"], answerIndex: 1 },
          { word: "happy", options: ["/ˈhæpi/", "/hæˈpi/"], answerIndex: 0 },
          { word: "decide", options: ["/ˈdesaɪd/", "/dɪˈsaɪd/"], answerIndex: 1 },
          { word: "table", options: ["/ˈteɪbəl/", "/teɪˈbəl/"], answerIndex: 0 },
        ],
      },
      {
        id: "L4-stress-3",
        title: "Trọng âm — từ 3+ âm tiết",
        symbol: "ˈ",
        category: "stress",
        description: "Các đuôi -tion, -ic, -ical, -ity → trọng âm trước đuôi đó.",
        mouthTip: "Quy tắc: -TION → âm liền trước. -IC → âm liền trước. -ITY → âm liền trước. -CY → 3 âm tiết về trước.",
        examples: [
          { word: "naTION", ipa: "/ˈneɪʃən/" },
          { word: "informATION", ipa: "/ˌɪnfərˈmeɪʃən/" },
          { word: "ecoNOMic", ipa: "/ˌiːkəˈnɒmɪk/" },
          { word: "uniVERsity", ipa: "/ˌjuːnɪˈvɜːrsəti/" },
        ],
        quiz: [
          { word: "education", options: ["/ˌedʒuˈkeɪʃən/", "/ˈedʒukeɪʃən/"], answerIndex: 0 },
          { word: "fantastic", options: ["/ˈfæntæstɪk/", "/fænˈtæstɪk/"], answerIndex: 1 },
          { word: "ability", options: ["/əˈbɪləti/", "/ˈæbɪləti/"], answerIndex: 0 },
          { word: "photograph", options: ["/ˈfəʊtəɡrɑːf/", "/fəˈtɒɡrɑːf/"], answerIndex: 0 },
          { word: "photographer", options: ["/ˈfəʊtəɡrɑːfər/", "/fəˈtɒɡrəfər/"], answerIndex: 1 },
        ],
      },
      {
        id: "L4-schwa",
        title: "Schwa /ə/ ở mọi nơi",
        symbol: "ə",
        category: "stress",
        description: "Mọi âm tiết KHÔNG nhấn đều có xu hướng giảm thành /ə/.",
        mouthTip: "Đừng đọc rõ từng nguyên âm. Âm không nhấn → mở miệng nhẹ, lưỡi giữa, ngắn.",
        examples: [
          { word: "banana", ipa: "/bəˈnɑːnə/" },
          { word: "support", ipa: "/səˈpɔːrt/" },
          { word: "America", ipa: "/əˈmerɪkə/" },
          { word: "computer", ipa: "/kəmˈpjuːtər/" },
        ],
        quiz: [
          { word: "banana", options: ["/bæˈnænæ/", "/bəˈnɑːnə/", "/bæˈnɑːnə/"], answerIndex: 1 },
          { word: "America", options: ["/eɪˈmerɪkæ/", "/əˈmerɪkə/", "/æˈmerɪkə/"], answerIndex: 1 },
          { word: "support", options: ["/sʌˈpɔːrt/", "/səˈpɔːrt/", "/suːˈpɔːrt/"], answerIndex: 1 },
          { word: "computer", options: ["/kɒmˈpjuːtər/", "/kəmˈpjuːtər/", "/kʌmˈpjuːtər/"], answerIndex: 1 },
          { word: "today", options: ["/ˈtuːdeɪ/", "/təˈdeɪ/", "/tʌˈdeɪ/"], answerIndex: 1 },
        ],
      },
      {
        id: "L4-weak-forms",
        title: "Weak forms (a, an, the, of, to, and...)",
        symbol: "ə",
        category: "stress",
        description: "Function words trong câu thường giảm âm thành schwa.",
        mouthTip: "to → /tə/, and → /ən/, of → /əv/, the → /ðə/, a → /ə/. Chỉ đọc đầy đủ khi nhấn mạnh.",
        examples: [
          { word: "a book", ipa: "/ə bʊk/" },
          { word: "to go", ipa: "/tə ɡəʊ/" },
          { word: "fish and chips", ipa: "/fɪʃ ən tʃɪps/" },
          { word: "cup of tea", ipa: "/kʌp əv tiː/" },
        ],
        quiz: [
          { word: "a book", options: ["/eɪ bʊk/", "/ə bʊk/"], answerIndex: 1 },
          { word: "to go", options: ["/tuː ɡəʊ/", "/tə ɡəʊ/"], answerIndex: 1 },
          { word: "and you", options: ["/ænd juː/", "/ən juː/"], answerIndex: 1 },
          { word: "cup of tea", options: ["/kʌp ɒv tiː/", "/kʌp əv tiː/"], answerIndex: 1 },
          { word: "for him", options: ["/fɔːr hɪm/", "/fər ɪm/"], answerIndex: 1 },
        ],
      },
    ],
  },

  // ========================================================
  // LEVEL 5 — Connected speech
  // ========================================================
  {
    level: 5,
    title: "Connected speech",
    summary: "Cách native nói: nối âm, đồng hóa, lược âm.",
    estDuration: "~2 tuần",
    goal: "Nghe và phiên âm được câu nói tự nhiên.",
    lessons: [
      {
        id: "L5-linking",
        title: "Linking — nối phụ âm với nguyên âm",
        symbol: "‿",
        category: "connected",
        description: "Phụ âm cuối từ + nguyên âm đầu từ kế → nối liền.",
        mouthTip: "Đọc liền, không có khoảng nghỉ. 'turn off' → 'tur-noff'.",
        examples: [
          { word: "turn off", ipa: "/tɜːr‿nɒf/" },
          { word: "an apple", ipa: "/ə‿ˈnæpəl/" },
          { word: "go on", ipa: "/ɡəʊ‿ɒn/" },
          { word: "look at", ipa: "/lʊ‿kæt/" },
        ],
        quiz: [
          { word: "turn off", options: ["/tɜːrn ɒf/", "/tɜːr‿nɒf/"], answerIndex: 1 },
          { word: "an apple", options: ["/æn æpəl/", "/ə‿ˈnæpəl/"], answerIndex: 1 },
          { word: "look at", options: ["/lʊk æt/", "/lʊ‿kæt/"], answerIndex: 1 },
          { word: "pick it up", options: ["/pɪk ɪt ʌp/", "/pɪ‿kɪ‿tʌp/"], answerIndex: 1 },
          { word: "thank you", options: ["/θæŋk juː/", "/θæŋ‿kjuː/"], answerIndex: 1 },
        ],
      },
      {
        id: "L5-assimilation",
        title: "Assimilation — đồng hóa âm",
        symbol: "→",
        category: "connected",
        description: "Phụ âm cuối thay đổi để khớp với phụ âm đầu kế tiếp.",
        mouthTip: "/t/ + /j/ → /tʃ/, /d/ + /j/ → /dʒ/. 'Did you' → 'Didju'.",
        examples: [
          { word: "did you", ipa: "/ˈdɪdʒu/" },
          { word: "would you", ipa: "/ˈwʊdʒu/" },
          { word: "got you", ipa: "/ˈɡɒtʃu/" },
          { word: "miss you", ipa: "/ˈmɪʃu/" },
        ],
        quiz: [
          { word: "did you", options: ["/dɪd juː/", "/ˈdɪdʒu/"], answerIndex: 1 },
          { word: "would you", options: ["/wʊd juː/", "/ˈwʊdʒu/"], answerIndex: 1 },
          { word: "got you", options: ["/ɡɒt juː/", "/ˈɡɒtʃu/"], answerIndex: 1 },
          { word: "what do you", options: ["/wɒt duː juː/", "/ˈwɒdəjə/"], answerIndex: 1 },
          { word: "miss you", options: ["/mɪs juː/", "/ˈmɪʃu/"], answerIndex: 1 },
        ],
      },
      {
        id: "L5-elision",
        title: "Elision — bỏ âm",
        symbol: "∅",
        category: "connected",
        description: "Một số âm bị lược bỏ khi nói nhanh.",
        mouthTip: "/t/ và /d/ giữa hai phụ âm thường bị bỏ. 'next day' → 'nex day'.",
        examples: [
          { word: "next day", ipa: "/neks deɪ/" },
          { word: "must be", ipa: "/mʌs biː/" },
          { word: "friendship", ipa: "/ˈfren ʃɪp/" },
          { word: "vegetable", ipa: "/ˈvedʒtəbəl/" },
        ],
        quiz: [
          { word: "next day", options: ["/nekst deɪ/", "/neks deɪ/"], answerIndex: 1 },
          { word: "must be", options: ["/mʌst biː/", "/mʌs biː/"], answerIndex: 1 },
          { word: "kindness", options: ["/ˈkaɪndnəs/", "/ˈkaɪnnəs/"], answerIndex: 1 },
          { word: "vegetable", options: ["/ˈvedʒətəbəl/", "/ˈvedʒtəbəl/"], answerIndex: 1 },
          { word: "comfortable", options: ["/ˈkʌmfərtəbəl/", "/ˈkʌmftəbəl/"], answerIndex: 1 },
        ],
      },
      {
        id: "L5-intrusion",
        title: "Intrusion — thêm âm /r/, /j/, /w/",
        symbol: "+",
        category: "connected",
        description: "Khi 2 nguyên âm gặp nhau, native thường chèn /r/, /j/, hoặc /w/ để nối.",
        mouthTip: "/iː/ + nguyên âm → thêm /j/. /uː/ + nguyên âm → thêm /w/. Cuối /ə/ + nguyên âm (UK) → /r/.",
        examples: [
          { word: "see it", ipa: "/siː‿jɪt/" },
          { word: "go on", ipa: "/ɡəʊ‿wɒn/" },
          { word: "law and order", ipa: "/lɔːr‿ən ˈɔːdə/" },
          { word: "I am", ipa: "/aɪ‿jæm/" },
        ],
        quiz: [
          { word: "see it", options: ["/siː ɪt/", "/siː‿jɪt/"], answerIndex: 1 },
          { word: "go on", options: ["/ɡəʊ ɒn/", "/ɡəʊ‿wɒn/"], answerIndex: 1 },
          { word: "I am", options: ["/aɪ æm/", "/aɪ‿jæm/"], answerIndex: 1 },
          { word: "do it", options: ["/duː ɪt/", "/duː‿wɪt/"], answerIndex: 1 },
          { word: "law and order", options: ["/lɔː ən ˈɔːdə/", "/lɔːr‿ən ˈɔːdə/"], answerIndex: 1 },
        ],
      },
    ],
  },
];

export function getLesson(levelNum: number, lessonId: string): IPALesson | null {
  const level = IPA_LEVELS.find((l) => l.level === levelNum);
  return level?.lessons.find((l) => l.id === lessonId) || null;
}
