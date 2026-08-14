/*

Basic Workflow

    - User starts a set
    - User flips a card
    - We ask them if this was Easy or Hard
    - Save this info as bool hard or !hard
    - User continues with set like this
    - User finishes set
    - Set closes with the Hard cards by the top and Easy questions by the end

    - This set has reached a good Easy/Hard ratio
    - Prompt the User to take a test

Parts

    - Flashcard has attributes : "Front, Back, Diffifculty"
    - Green bordered cards are easy, no border are hard
    - show the user the previous difficulty; green-easy, red-hard, gray-null(never took flashcard set before)
    
    End Study 
    - After the user is at the last index (last card) the user will get redirected to flashcard 

Missing Features

    - Shuffle flashcards
    - Edit Flashcards

*/