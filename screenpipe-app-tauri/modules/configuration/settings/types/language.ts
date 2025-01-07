export const AvailableLanguages = {
    english: "english",
    chinese: "chinese",
    german: "german",
    spanish: "spanish",
    russian: "russian",
    korean: "korean",
    french: "french",
    japanese: "japanese",
    portuguese: "portuguese",
    turkish: "turkish",
    polish: "polish",
    catalan: "catalan",
    dutch: "dutch",
    arabic: "arabic",
    swedish: "swedish",
    italian: "italian",
    indonesian: "indonesian",
    hindi: "hindi",
    finnish: "finnish",
    hebrew: "hebrew",
    ukrainian: "ukrainian",
    greek: "greek",
    malay: "malay",
    czech: "czech",
    romanian: "romanian",
    danish: "danish",
    hungarian: "hungarian",
    norwegian: "norwegian",
    thai: "thai",
    urdu: "urdu",
    croatian: "croatian",
    bulgarian: "bulgarian",
    lithuanian: "lithuanian",
    latin: "latin",
    malayalam: "malayalam",
    welsh: "welsh",
    slovak: "slovak",
    persian: "persian",
    latvian: "latvian",
    bengali: "bengali",
    serbian: "serbian",
    azerbaijani: "azerbaijani",
    slovenian: "slovenian",
    estonian: "estonian",
    macedonian: "macedonian",
    nepali: "nepali",
    mongolian: "mongolian",
    bosnian: "bosnian",
    kazakh: "kazakh",
    albanian: "albanian",
    swahili: "swahili",
    galician: "galician",
    marathi: "marathi",
    punjabi: "punjabi",
    sinhala: "sinhala",
    khmer: "khmer",
    afrikaans: "afrikaans",
    belarusian: "belarusian",
    gujarati: "gujarati",
    amharic: "amharic",
    yiddish: "yiddish",
    lao: "lao",
    uzbek: "uzbek",
    faroese: "faroese",
    pashto: "pashto",
    maltese: "maltese",
    sanskrit: "sanskrit",
    luxembourgish: "luxembourgish",
    myanmar: "myanmar",
    tibetan: "tibetan",
    tagalog: "tagalog",
    assamese: "assamese",
    tatar: "tatar",
    hausa: "hausa",
    javanese: "javanese",
  } as const
  
  export type AvailableLanguagesEnum = (typeof AvailableLanguages)[keyof typeof AvailableLanguages]
  