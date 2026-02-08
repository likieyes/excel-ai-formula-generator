import { FormulaItem } from '@/types'

export const FORMULA_LIBRARY: FormulaItem[] = [
  {
    slug: "excel-formula-extract-email-from-text",
    title: "Excel Formula to Extract Email Address from Text",
    description: "Learn how to extract email addresses from a text string using TEXTBEFORE and TEXTAFTER functions.",
    question: "I have a cell containing text and an email address (e.g., 'Contact john@example.com for info'). I want to extract just the email.",
    formula: "=TEXTBEFORE(TEXTAFTER(A1, \" \"), \" \")",
    explanation: [
      "TEXTAFTER finds the space before the email address.",
      "TEXTBEFORE stops extracting at the space after the email address.",
      "Note: This assumes the email is surrounded by spaces. For more complex extraction, Regex is needed."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-remove-spaces-trim",
    title: "How to Remove Extra Spaces in Excel",
    description: "Use the TRIM function to remove leading, trailing, and double spaces from text in Excel.",
    question: "My data has weird spacing issues (spaces at the start or end). How do I clean it up?",
    formula: "=TRIM(A1)",
    explanation: [
      "The TRIM function removes all spaces from text except for single spaces between words.",
      "It is the fastest way to clean copy-pasted data."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-count-words-in-cell",
    title: "Excel Formula to Count Words in a Cell",
    description: "A clever trick to count the number of words in a cell using LEN and SUBSTITUTE.",
    question: "I need to know how many words are in a specific sentence in cell A1.",
    formula: "=LEN(TRIM(A1))-LEN(SUBSTITUTE(A1,\" \",\"\"))+1",
    explanation: [
      "First, we calculate the total length of the text.",
      "Then we remove all spaces and calculate the length again.",
      "The difference tells us how many spaces there are. Adding 1 gives the word count."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-capitalize-first-letter",
    title: "How to Capitalize the First Letter of Each Word",
    description: "Convert text to Proper Case (Title Case) in Excel instantly.",
    question: "My list of names is all lowercase (e.g., 'john doe'). I want to make them 'John Doe'.",
    formula: "=PROPER(A1)",
    explanation: [
      "PROPER capitalizes the first letter of each word and lowercases the rest.",
      "Useful for cleaning up name lists."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-extract-first-word",
    title: "Extract the First Word from a Cell in Excel",
    description: "Get the first word of a string using LEFT and SEARCH functions.",
    question: "I want to pull just the first name from a full name string.",
    formula: "=LEFT(A1, SEARCH(\" \", A1) - 1)",
    explanation: [
      "SEARCH finds the position of the first space.",
      "LEFT grabs all characters from the start up to that space."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-extract-last-word",
    title: "Extract the Last Word from a Text String",
    description: "How to get the last word (e.g., Last Name) from a cell using TEXTAFTER.",
    question: "I need to extract the last word from a sentence or name.",
    formula: "=TEXTAFTER(A1, \" \", -1)",
    explanation: [
      "The -1 argument tells TEXTAFTER to search from the end of the string.",
      "It grabs everything after the last space found."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-remove-line-breaks",
    title: "How to Remove Line Breaks in Excel",
    description: "Clean up your data by removing unwanted line breaks with the CLEAN function.",
    question: "I copied data from a website and it has weird line breaks inside the cells.",
    formula: "=CLEAN(A1)",
    explanation: [
      "The CLEAN function removes all non-printable characters, including line breaks.",
      "Combine with TRIM for best results: =TRIM(CLEAN(A1))"
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-combine-cells-with-comma",
    title: "Combine Multiple Cells with a Comma",
    description: "Join text from multiple cells separated by a delimiter using TEXTJOIN.",
    question: "I want to combine values from A1, B1, and C1 into one cell, separated by commas.",
    formula: "=TEXTJOIN(\", \", TRUE, A1:C1)",
    explanation: [
      "TEXTJOIN combines a range of cells.",
      "The first argument is the delimiter (comma and space).",
      "TRUE tells Excel to ignore empty cells."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-extract-domain-from-url",
    title: "Extract Domain Name from URL in Excel",
    description: "Parse URLs to get just the domain name (e.g., google.com) using text functions.",
    question: "I have a list of full URLs (https://www.google.com/search). I just want 'google.com'.",
    formula: "=TEXTBEFORE(TEXTAFTER(A1, \"//\"), \"/\")",
    explanation: [
      "First, TEXTAFTER removes the 'https://' part.",
      "Then, TEXTBEFORE stops at the next '/' to isolate the domain."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-check-if-cell-contains-text",
    title: "Check If Cell Contains Specific Text (Case Insensitive)",
    description: "Return TRUE or FALSE if a cell contains a specific substring.",
    question: "I want to flag rows that contain the word 'Error' anywhere in the text.",
    formula: "=ISNUMBER(SEARCH(\"Error\", A1))",
    explanation: [
      "SEARCH looks for 'Error' and returns a position number (case-insensitive).",
      "ISNUMBER returns TRUE if a number is found, and FALSE if not."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: true
  },
  {
    slug: "excel-formula-split-text-to-rows",
    title: "Split Text by Delimiter into New Rows",
    description: "Advanced formula to split comma-separated values into separate rows.",
    question: "I have 'Apple, Banana, Orange' in one cell. I want them in 3 separate rows.",
    formula: "=TEXTSPLIT(A1, , \", \")",
    explanation: [
      "TEXTSPLIT breaks text into an array.",
      "Leaving the column delimiter empty and setting the row delimiter to comma puts items in new rows."
    ],
    difficulty: "Advanced",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-remove-first-character",
    title: "Remove the First Character from a String",
    description: "How to delete the first letter or symbol from a cell.",
    question: "My data has a leading symbol (like '#102'). I want to remove the '#'.",
    formula: "=RIGHT(A1, LEN(A1)-1)",
    explanation: [
      "We calculate the total length of the string.",
      "We subtract 1 to exclude the first character.",
      "RIGHT extracts the remaining characters from the end."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-remove-last-character",
    title: "Remove the Last Character from a String",
    description: "Delete the last character of a text string using LEFT and LEN.",
    question: "I want to remove the last digit from a serial number.",
    formula: "=LEFT(A1, LEN(A1)-1)",
    explanation: [
      "Identify the total length of the text.",
      "Subtract 1 from the length.",
      "Use LEFT to grab everything except that last character."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-pad-numbers-with-zeros",
    title: "Pad Numbers with Leading Zeros",
    description: "Convert numbers like '5' into '005' using the TEXT function.",
    question: "My product IDs need to be 3 digits long (e.g., 001, 010).",
    formula: "=TEXT(A1, \"000\")",
    explanation: [
      "The TEXT function converts a number to text.",
      "The string \"000\" forces the format to always show at least 3 digits."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-extract-text-between-parentheses",
    title: "Extract Text Between Parentheses",
    description: "Get the text inside brackets () using TEXTBETWEEN.",
    question: "I want to get the SKU code from 'Product Name (SKU123)'.",
    formula: "=TEXTBETWEEN(A1, \"(\", \")\")",
    explanation: [
      "TEXTBETWEEN extracts everything between the two specified delimiters.",
      "Much simpler than the old FIND/MID method."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-convert-text-to-date",
    title: "Convert Text String to Date Format",
    description: "Fix dates stored as text (e.g., '2023.12.25') using DATEVALUE.",
    question: "My dates are not recognized by Excel. They are just text strings.",
    formula: "=DATEVALUE(SUBSTITUTE(A1, \".\", \"/\"))",
    explanation: [
      "First, SUBSTITUTE changes dots to slashes so Excel recognizes the format.",
      "DATEVALUE converts that string into a proper Excel serial date number."
    ],
    difficulty: "Intermediate",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-replace-text-partial",
    title: "Replace Part of a Text String",
    description: "Swap out specific words or characters using SUBSTITUTE.",
    question: "I need to change all instances of 'OldCompany' to 'NewCompany' in a column.",
    formula: "=SUBSTITUTE(A1, \"OldCompany\", \"NewCompany\")",
    explanation: [
      "SUBSTITUTE searches for specific text and replaces it with new text.",
      "It is case-sensitive."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-repeat-text",
    title: "Repeat Text Multiple Times",
    description: "Create visual bars or repeated patterns using REPT.",
    question: "I want to create a simple in-cell bar chart by repeating the pipe symbol '|'.",
    formula: "=REPT(\"|\", B1)",
    explanation: [
      "REPT repeats a string a specified number of times.",
      "If B1 contains 5, you get '|||||'."
    ],
    difficulty: "Beginner",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-count-specific-character",
    title: "Count Occurrences of a Specific Character",
    description: "Count how many times a symbol appears in a cell.",
    question: "I want to count how many commas are in a cell.",
    formula: "=LEN(A1)-LEN(SUBSTITUTE(A1,\",\",\"\"))",
    explanation: [
      "Compare the length of the original string vs. the string with commas removed.",
      "The difference equals the number of commas."
    ],
    difficulty: "Advanced",
    category: "Text Manipulation",
    published: false
  },
  {
    slug: "excel-formula-generate-random-password",
    title: "Generate Random Alphanumeric String",
    description: "Create random codes or passwords using modern Excel functions.",
    question: "I need a random 6-character code for user IDs.",
    formula: "=TEXTJOIN(\"\",,CHAR(RANDARRAY(6,,65,90,TRUE)))",
    explanation: [
      "RANDARRAY generates 6 random numbers between 65 and 90 (ASCII for A-Z).",
      "CHAR converts numbers to letters.",
      "TEXTJOIN combines them into one string."
    ],
    difficulty: "Advanced",
    category: "Text Manipulation",
    published: false
  }
]

// Helper function to get only published formulas
export const getPublishedFormulas = (): FormulaItem[] => {
  return FORMULA_LIBRARY.filter(formula => formula.published)
}

// Helper function to get formulas by category
export const getFormulasByCategory = (category: string): FormulaItem[] => {
  return FORMULA_LIBRARY.filter(formula => 
    formula.published && formula.category === category
  )
}

// Helper function to get formulas by difficulty
export const getFormulasByDifficulty = (difficulty: FormulaItem['difficulty']): FormulaItem[] => {
  return FORMULA_LIBRARY.filter(formula => 
    formula.published && formula.difficulty === difficulty
  )
}

// Get all unique categories
export const getCategories = (): string[] => {
  const categories = FORMULA_LIBRARY
    .filter(formula => formula.published)
    .map(formula => formula.category)
  return Array.from(new Set(categories))
}