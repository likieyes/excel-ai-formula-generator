import { FormulaItem } from '@/types'

export const FORMULA_LIBRARY: FormulaItem[] = [
  {
    slug: 'extract-email-excel',
    title: 'How to Extract Email Addresses from Text in Excel',
    description: 'Learn how to extract email addresses from text strings in Excel using powerful formulas. Perfect for cleaning contact lists and data processing.',
    question: 'How do I extract email addresses from a cell that contains mixed text?',
    formula: '=MID(A1,FIND("@",A1)-FIND(" ",SUBSTITUTE(A1," ",REPT(" ",100)),ROW(INDIRECT("1:"&LEN(A1)-LEN(SUBSTITUTE(A1," ",""))+1)))+1,FIND(" ",A1&" ",FIND("@",A1))-FIND("@",A1)+FIND("@",A1)-FIND(" ",SUBSTITUTE(A1," ",REPT(" ",100)),ROW(INDIRECT("1:"&LEN(A1)-LEN(SUBSTITUTE(A1," ",""))+1)))-1)',
    explanation: [
      'Uses FIND function to locate the @ symbol in the text',
      'SUBSTITUTE and REPT functions help identify word boundaries',
      'MID function extracts the email address between spaces',
      'Works with multiple emails in the same cell',
      'Handles various text formats and spacing'
    ],
    difficulty: 'Advanced',
    category: 'Text Processing',
    published: true
  },
  {
    slug: 'calculate-percentage-change',
    title: 'Calculate Percentage Change Between Two Values in Excel',
    description: 'Master the percentage change formula in Excel. Learn how to calculate growth rates, decline percentages, and variance analysis.',
    question: 'How do I calculate the percentage change between two numbers?',
    formula: '=(New Value - Old Value) / Old Value * 100',
    explanation: [
      'Subtract the old value from the new value',
      'Divide the result by the old value',
      'Multiply by 100 to get the percentage',
      'Use absolute references when copying the formula',
      'Format the result as percentage for better readability'
    ],
    difficulty: 'Beginner',
    category: 'Math & Statistics',
    published: true
  },
  {
    slug: 'remove-duplicates-formula',
    title: 'Remove Duplicates in Excel Using Formulas (Dynamic Method)',
    description: 'Discover how to remove duplicates in Excel using dynamic formulas. No more manual data cleaning - automate the process.',
    question: 'How can I remove duplicate values from a list using formulas?',
    formula: '=UNIQUE(A1:A100)',
    explanation: [
      'UNIQUE function automatically removes duplicate values',
      'Returns only the first occurrence of each value',
      'Works with both text and numbers',
      'Updates automatically when source data changes',
      'Available in Excel 365 and Excel 2021'
    ],
    difficulty: 'Intermediate',
    category: 'Data Cleaning',
    published: true
  },
  {
    slug: 'conditional-sum-multiple-criteria',
    title: 'Sum with Multiple Conditions in Excel (SUMIFS Formula)',
    description: 'Learn how to sum values based on multiple criteria using SUMIFS. Perfect for complex data analysis and reporting.',
    question: 'How do I sum values that meet multiple conditions?',
    formula: '=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2)',
    explanation: [
      'SUMIFS allows multiple criteria for summing',
      'First argument is the range to sum',
      'Following arguments are criteria range and criteria pairs',
      'Can handle up to 127 criteria pairs',
      'Supports wildcards and comparison operators'
    ],
    difficulty: 'Intermediate',
    category: 'Math & Statistics',
    published: true
  },
  {
    slug: 'dynamic-dropdown-list',
    title: 'Create Dynamic Dropdown Lists in Excel (Data Validation)',
    description: 'Build smart dropdown lists that update automatically. Learn advanced data validation techniques for better data entry.',
    question: 'How do I create a dropdown list that updates automatically?',
    formula: '=INDIRECT("Table"&A1&"[Column]")',
    explanation: [
      'INDIRECT function creates dynamic references',
      'References change based on cell values',
      'Works with Excel Tables for automatic expansion',
      'Combines with data validation for dropdowns',
      'Updates when source data is modified'
    ],
    difficulty: 'Advanced',
    category: 'Data Validation',
    published: true
  },
  {
    slug: 'lookup-multiple-columns',
    title: 'VLOOKUP with Multiple Columns (Return Multiple Values)',
    description: 'Master advanced VLOOKUP techniques to return multiple columns of data. Boost your data lookup efficiency.',
    question: 'How can I return multiple columns of data with one lookup?',
    formula: '=INDEX(return_array,MATCH(lookup_value,lookup_array,0),{1;2;3})',
    explanation: [
      'INDEX and MATCH combination is more flexible than VLOOKUP',
      'Array constant {1;2;3} specifies which columns to return',
      'MATCH finds the row position of the lookup value',
      'INDEX returns values from multiple columns',
      'Works in any direction (left or right lookup)'
    ],
    difficulty: 'Advanced',
    category: 'Lookup Functions',
    published: true
  },
  {
    slug: 'count-cells-with-text',
    title: 'Count Cells Containing Specific Text in Excel',
    description: 'Learn multiple methods to count cells containing specific text or partial matches. Essential for data analysis.',
    question: 'How do I count cells that contain specific text?',
    formula: '=COUNTIF(range,"*text*")',
    explanation: [
      'COUNTIF function counts cells meeting criteria',
      'Wildcards (*) allow partial text matching',
      'Case-insensitive by default',
      'Can count exact matches without wildcards',
      'Supports multiple criteria with COUNTIFS'
    ],
    difficulty: 'Beginner',
    category: 'Counting Functions',
    published: true
  },
  {
    slug: 'convert-text-to-date',
    title: 'Convert Text to Date in Excel (Multiple Methods)',
    description: 'Transform text strings into proper Excel dates. Handle various date formats and fix date conversion issues.',
    question: 'How do I convert text that looks like a date into an actual date?',
    formula: '=DATEVALUE(A1)',
    explanation: [
      'DATEVALUE converts text to Excel date serial number',
      'Works with most common date formats',
      'Use VALUE function for numbers stored as text',
      'TEXT function can reformat the result',
      'Combine with error handling for robust solutions'
    ],
    difficulty: 'Intermediate',
    category: 'Date Functions',
    published: true
  },
  {
    slug: 'split-text-into-columns',
    title: 'Split Text into Separate Columns Using Excel Formulas',
    description: 'Break apart text strings into multiple columns using powerful Excel formulas. No more manual text splitting.',
    question: 'How can I split text in one cell into multiple columns?',
    formula: '=TEXTSPLIT(A1," ")',
    explanation: [
      'TEXTSPLIT function divides text by delimiter',
      'Specify delimiter (space, comma, etc.)',
      'Automatically creates multiple columns',
      'Available in Excel 365',
      'Use LEFT, MID, RIGHT for older versions'
    ],
    difficulty: 'Intermediate',
    category: 'Text Processing',
    published: true
  },
  {
    slug: 'rank-values-excel',
    title: 'Rank Values in Excel (Handle Ties and Duplicates)',
    description: 'Learn how to rank data in Excel, handle tied values, and create dynamic rankings that update automatically.',
    question: 'How do I rank values from highest to lowest in Excel?',
    formula: '=RANK(value, array, [order])',
    explanation: [
      'RANK function assigns position based on value',
      'Order parameter: 0 for descending, 1 for ascending',
      'Tied values receive the same rank',
      'Use RANK.EQ for exact ties, RANK.AVG for average',
      'Combine with sorting for better visualization'
    ],
    difficulty: 'Beginner',
    category: 'Math & Statistics',
    published: false
  },
  {
    slug: 'nested-if-statements',
    title: 'Master Nested IF Statements in Excel (Multiple Conditions)',
    description: 'Build complex logical formulas using nested IF statements. Learn best practices and alternatives for cleaner formulas.',
    question: 'How do I create IF statements with multiple conditions?',
    formula: '=IF(condition1, result1, IF(condition2, result2, IF(condition3, result3, default_result)))',
    explanation: [
      'Nested IFs allow multiple condition testing',
      'Each IF can have its own TRUE and FALSE results',
      'Limit to 7 levels for readability',
      'Consider IFS function for simpler syntax',
      'Use AND/OR for complex condition combinations'
    ],
    difficulty: 'Intermediate',
    category: 'Logical Functions',
    published: false
  },
  {
    slug: 'calculate-working-days',
    title: 'Calculate Working Days Between Dates (Exclude Weekends)',
    description: 'Calculate business days between two dates, excluding weekends and holidays. Perfect for project planning.',
    question: 'How do I calculate working days between two dates?',
    formula: '=NETWORKDAYS(start_date, end_date, [holidays])',
    explanation: [
      'NETWORKDAYS excludes weekends automatically',
      'Optional holidays parameter for custom exclusions',
      'Returns the number of working days',
      'Use NETWORKDAYS.INTL for custom weekend days',
      'Negative result if start date is after end date'
    ],
    difficulty: 'Intermediate',
    category: 'Date Functions',
    published: false
  },
  {
    slug: 'find-last-occurrence',
    title: 'Find Last Occurrence of Text in Excel Cell',
    description: 'Locate the last occurrence of specific text or character in a cell. Essential for advanced text processing.',
    question: 'How do I find the position of the last occurrence of a character?',
    formula: '=FIND("~",SUBSTITUTE(A1,char,REPT("~",100)),1)',
    explanation: [
      'SUBSTITUTE replaces the last occurrence with tildes',
      'REPT creates a long string of tildes',
      'FIND locates the position of the tilde string',
      'Works with any character or text string',
      'Useful for extracting file extensions or names'
    ],
    difficulty: 'Advanced',
    category: 'Text Processing',
    published: false
  },
  {
    slug: 'conditional-formatting-formulas',
    title: 'Advanced Conditional Formatting with Custom Formulas',
    description: 'Create dynamic conditional formatting rules using custom formulas. Highlight data based on complex criteria.',
    question: 'How do I create conditional formatting with custom conditions?',
    formula: '=AND($B2>100,$C2<50)',
    explanation: [
      'Custom formulas enable complex formatting rules',
      'Use absolute and relative references correctly',
      'AND/OR functions combine multiple conditions',
      'Formula must return TRUE/FALSE',
      'Apply to entire ranges for consistent formatting'
    ],
    difficulty: 'Advanced',
    category: 'Formatting',
    published: false
  },
  {
    slug: 'generate-random-data',
    title: 'Generate Random Data in Excel (Numbers, Text, Dates)',
    description: 'Create random sample data for testing and analysis. Learn various random generation techniques in Excel.',
    question: 'How do I generate random sample data in Excel?',
    formula: '=RANDBETWEEN(1,100)',
    explanation: [
      'RANDBETWEEN generates random integers in range',
      'RAND() creates decimal numbers between 0 and 1',
      'Combine with other functions for complex data',
      'Use RANDARRAY for multiple random values',
      'Press F9 to recalculate random values'
    ],
    difficulty: 'Beginner',
    category: 'Math & Statistics',
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