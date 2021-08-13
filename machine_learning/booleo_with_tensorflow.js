'use strict';
/*********************************** Basic Helper Functions ***********************************/
const ranBool = () => { //returns 0 or 1
	return Math.floor(Math.random() + 0.5);
};

const boolToString = (bool) => {
  bool += '';
  if (bool == '1')
    return '💡';
  else if (bool == '0')
    return '🔌';
};

const ranInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return (Math.floor(Math.random() * (max - min+1)) + min);
};

const arySum = (ary, num) => {
  let n = 0;
  for (let i = 0; i < num; i++) {
    n += ary[i];
  }
  return n;
};

const getValue = (card) => {
  if (card !== '⚪') {
    card = parseInt(card);
    if ((card % 2) == 1)
      return 1;
    else
      return 0;
  }
  return '⚪';
};

const twoDArrayToPayload = (ary) => {
  let n = ary.length;
  let s = [];
  for (let i = 0; i < n; i++) {
    s[i] = ary[i].join('*');
  }
  return s.join(',');
};



/*******************************************Deck and Board Operations****************************/

/* the deck is a 6 element integer array of the form [#AND 0, #AND 1, #OR 0, #OR 1, #XOR 0, #XOR 1]. Function takes in deck and draws a random card from it. After calling this function, always remember to put deck[cardtype]--; after to update the deck. UPDATE: NEVERMIND, deck[cardtype]-- can be included here */

const drawCard = (deck) => {
  for (let i = 0; i < deck.length; i++) {
      deck[i] = parseInt(deck[i]);
  }
  let decksize = arySum(deck, deck.length);
  let card = ranInt(0, decksize-1);
  let j = 0;
  while (card >= 0) {
    card = card - deck[j];
    j++;
  }
  j--;
  deck[j]--;
  return (j);
};

const newOppBoard = (inputs) => {
  let oppInputs = [];
  for (let i = 0; i <inputs.length; i++) {
    oppInputs[i] = 1 - inputs[i];
  }

  let newPyramid = new Array(6);
  for (let i = 1; i < 6; i++) {
    newPyramid[i] = new Array(6-i).fill('⚪');
  }
  newPyramid[0] = oppInputs;
  return newPyramid;
};

const newBoard = () => {
  let inputs = [];
	for (let i = 0; i < 6; i++) {
    inputs[i] = ranBool();
  }
  let newPyramid = new Array(6);
  for (let i = 1; i < 6; i++) {
    newPyramid[i] = new Array(6-i).fill('⚪');
  }
  newPyramid[0] = inputs;
  return newPyramid;
};

const newStatus = () => {
  let status = [];
  for (let i = 0; i < 5; i++) {
    status[i] = new Array(5-i).fill(1);
  }
  return status;
};

/* If a position is made invalid and voided, gets the rest of the positions that must be made inactive. works under assumption roots is already cast as an integer array */
const getSubRow = (row, cols) => {
  let newCols = [];
  let n = cols.length;
  let j = 0;
  if (cols[0] != '0') {
    newCols[0] = cols[0]-1;
    j++;
  }
  for (let i = 0; i < n; i++) {
    newCols[i+j] = cols[i];
  }
  if (cols[n-1] == (5 - row)) {
    newCols.pop();
  }
  return newCols;
};

const getBranch = (row, cols) => {
  let branch = [];
  branch[0] = getSubRow(row, cols);
  let i = row + 1;
  let j = 1;
  while (i < 5) {
    branch[j] = getSubRow(i,branch[j-1]);
    j++;
    i++;
  }
  branch.pop();
  return branch;
};

/********************************************************************************************/

/*********************************************Verifying Valid Card Placement*****************/
const isGateValid = (input1, input2, card) => {
  input1 = input1 + '';
  input2 = input2 + '';
  card = card + '';
  if (input1 === '⚪' || input2 === '⚪') {
    return false;
  }
  else if (card == '0') {
    if ((input1 == '0') || (input2 == '0'))
      return true;
    else
      return false;
  }
  else if (card == '1') {
    if ((input1 == '1') && (input2 == '1'))
      return true;
    else
      return false;
  }
  else if (card == '2') {
    if ((input1 == '0') && (input2 == '0'))
      return true;
    else
      return false;
  }
  else if (card == '3') {
    if ((input1 == '1') || (input2 == '1'))
      return true;
    else
      return false;
  }
  else if (card == '4') {
    if (input1 == input2)
      return true;
    else
      return false;
  }
  else if (card == '5') {
    if (input1 != input2)
      return true;
    else
      return false;
  }
  return false;
};

const isPlaceValid = (board, status, row,col, card) => {
  if (card === '⚪')
    return true;
  else if (row == 1) {
    return isGateValid(board[0][col], board[0][col+1], card);
  }
  
  else if ((status[row-2][col] != '0') || (status[row-2][col+1] != '0')) {
    return false;
  }
  else return isGateValid(getValue(board[row-1][col]), getValue(board[row-1][col+1]), card);
};

const boardRestore = (board, status, rowPlayed, colPlayed) => {
  let branch = getBranch(rowPlayed, [colPlayed]);
  let n = branch.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < branch[i].length; j++) {
      if (isPlaceValid(board, status, i + rowPlayed + 1, branch[i][j], board[i + rowPlayed + 1][branch[i][j]])) {
        if (status[i + rowPlayed][branch[i][j]] == '2')
        status[i + rowPlayed][branch[i][j]] = 0; //reactivate gate
      }
    }
  }
  return [board,status];
};

const boardDamage = (board, status, deck, invalidRow, invalidCols) => {
  let n = invalidCols.length;
  for (let i = 0; i < n; i++) {
    deck[board[invalidRow][invalidCols[i]]]++;
    board[invalidRow][invalidCols[i]] = '⚪';
    status[invalidRow-1][invalidCols[i]] = 1; //1 for void
  }
  
  let branch = getBranch(invalidRow, invalidCols);
  n = branch.length;
  let j = 0;
  for (let i = 0; i < n; i++) {
    j = 0;
    for (;j < branch[i].length; j++) {
      if (status[i + invalidRow][branch[i][j]] == '0') {
        status[i+invalidRow][branch[i][j]] = 2; //deactivate active gate
      }
      if ((status[i+invalidRow-1][branch[i][j]] == '1') && (status[i + invalidRow-1][branch[i][j]+1] == '1')) {
        status[invalidRow+i][branch[i][j]] = 1;
        deck[board[i+invalidRow+1][branch[i][j]]]++;
        board[invalidRow+1+i][branch[i][j]] = '⚪';
      }
    }
  }
  return [board, status];
};
/*******************************************************************************************************************/

/****************************************Button, Payload string and display helpers *******************************/

const cardToString = (card) => {
  card = card + '';
  if (card == '0')
    return 'AND (0)';
  if (card == '1')
    return 'AND (1)';
  if (card == '2')
    return 'OR (0)';
  if (card == '3')
    return 'OR (1)';
  if (card == '4')
    return 'XOR (0)';
  if (card == '5')
    return 'XOR (1)';
  if (card == '6')
    return '⚠NOT⚠';
};

const cardDisplay = (card, cardStatus) => {
  card = card + '';
  let str = '';
  if (card == '0')
    str += 'a';
  else if (card == '1')
    str += 'A';
  else if (card == '2')
    str += 'o';
  else if (card == '3')
    str += 'O';
  else if (card == '4')
    str += 'e';
  else if (card == '5')
    str += 'E';
  else
    str += '⚪';
  if (cardStatus == '2') {
      str += '*';
      return str;
  }
  else
    return str;
};

const getOppBoardDisplay = (board, status) => {
  let s = '';
  let inputs = [boolToString(board[0][0]), boolToString(board[0][1]), boolToString(board[0][2]), boolToString(board[0][3]),boolToString(board[0][4]),boolToString(board[0][5])];
  s+= '          ' + cardDisplay(board[5][0], status[4][0]) + '\n';
  s+= '        ' + cardDisplay(board[4][0], status[3][0]) + '  ' + cardDisplay(board[4][1], status[3][1]) + '\n';
  s+= '      ' + cardDisplay(board[3][0], status[2][0]) + '  ' + cardDisplay(board[3][1], status[2][1]) + '  ' + cardDisplay(board[3][2], status[2][2]) + '\n';
  s+= '    ' + cardDisplay(board[2][0], status[1][0]) + '  ' + cardDisplay(board[2][1], status[1][1]) + '  ' + cardDisplay(board[2][2], status[1][2]) + '  ' + cardDisplay(board[2][3], status[1][3]) + '\n';
  s+= '  ' + cardDisplay(board[1][0], status[0][0]) + '  ' + cardDisplay(board[1][1], status[0][1]) + '  ' + cardDisplay(board[1][2], status[0][2]) + '  ' + cardDisplay(board[1][3], status[0][3]) + '  ' + cardDisplay(board[1][4], status[0][4]) + '\n';
  s+= inputs[0] + inputs[1] + inputs[2] + inputs[3] + inputs[4] + inputs[5] + '\n';
  return s;
};

const getBoardDisplay = (board, status) => {
  let s = '';
  let inputs = [boolToString(board[0][0]), boolToString(board[0][1]), boolToString(board[0][2]), boolToString(board[0][3]),boolToString(board[0][4]),boolToString(board[0][5])];
  s+= inputs[0] + inputs[1] + inputs[2] + inputs[3] + inputs[4] + inputs[5] + '\n';
  s+= '  ' + cardDisplay(board[1][0], status[0][0]) + '  ' + cardDisplay(board[1][1], status[0][1]) + '  ' + cardDisplay(board[1][2], status[0][2]) + '  ' + cardDisplay(board[1][3], status[0][3]) + '  ' + cardDisplay(board[1][4], status[0][4]) + '\n';
  s+= '    ' + cardDisplay(board[2][0], status[1][0]) + '  ' + cardDisplay(board[2][1], status[1][1]) + '  ' + cardDisplay(board[2][2], status[1][2]) + '  ' + cardDisplay(board[2][3], status[1][3]) + '\n';
  s+= '      ' + cardDisplay(board[3][0], status[2][0]) + '  ' + cardDisplay(board[3][1], status[2][1]) + '  ' + cardDisplay(board[3][2], status[2][2]) + '\n';
  s+= '        ' + cardDisplay(board[4][0], status[3][0]) + '  ' + cardDisplay(board[4][1], status[3][1]) + '\n';
  s+= '          ' + cardDisplay(board[5][0], status[4][0]);
  return s;
};

const getCardPickButtons = (board, status, hand, oppBoard, oppStatus, oppHand, deck, whichPlayer, oldBoard, oldStatus, oldOppBoard, oldOppStatus, oldDeck, col) => {
  let a = [];
  let uhand;
  if (whichPlayer == '0') {
    uhand = hand;
  }
  else {
    uhand = oppHand;
  }
  if (oldBoard.length == 1) {
    for (let i = 0; i < 4; i++) {
      a[i] = {title: cardToString(uhand[i]), payload: twoDArrayToPayload(board) + '-' + twoDArrayToPayload(status) + '-' + hand + '-' + 
      twoDArrayToPayload(oppBoard) + '-' + twoDArrayToPayload(oppStatus) + '-' + oppHand + '-' + deck + '-' + '2,' + whichPlayer + '-' + uhand[i]+',0,0,' + i};
    }
  }
  else {
    for (let i = 0; i < 4; i++) {
      a[i] = {title: cardToString(uhand[i]), payload: twoDArrayToPayload(board) + '-' + twoDArrayToPayload(status) + '-' + hand + '-' + 
      twoDArrayToPayload(oppBoard) + '-' + twoDArrayToPayload(oppStatus) + '-' + oppHand + '-' + deck + '-' + '4,' + whichPlayer + '-' + uhand[i]+',0,' + col + i + '-' +
      twoDArrayToPayload(oldBoard) + '-' + twoDArrayToPayload(oldStatus) + '-' + twoDArrayToPayload(oldOppBoard) + '-' + twoDArrayToPayload(oldOppStatus) + oldDeck};
    }
  }
  a.push({title: 'Exit Game', payload: 'junk'});
  return a;
};

const getCardPlacementButtons = (board, status, hand, oppBoard, oppStatus, oppHand, deck, lastMove, index, whichPlayer, oldBoard, oldStatus, oldOppBoard, oldOppStatus, oldDeck, col) => {
  let positions = [];
  let lButtons = [];
  let j = 0;
  let m = 0;
  let uboard;
  let ustatus;
  if (whichPlayer == '0') {
    uboard = board;
    ustatus = status;
  }
  else {
    uboard = oppBoard;
    ustatus = oppStatus;
  }
  if (lastMove == '6') {
    if (oldBoard.length == 1) {
      for (let i = 0; i < 6; i++) {
        lButtons.push({title: i+1, payload: twoDArrayToPayload(board) + '-' + twoDArrayToPayload(status) + '-' + hand + '-' +
        twoDArrayToPayload(oppBoard) + '-' + twoDArrayToPayload(oppStatus) + '-' + oppHand + '-' +
        deck + '-' + '3,' + whichPlayer + '-' + lastMove + ',0,' + i +',' + index});
      }
    }
    else {
      for (let i = 0; i < 6; i++) {
        if (i == col) {
          lButtons.push({title: i+1, payload: twoDArrayToPayload(oldBoard) + '-' + twoDArrayToPayload(oldStatus) + '-' + hand + '-' +
          twoDArrayToPayload(oldOppBoard) + '-' + twoDArrayToPayload(oldOppStatus) + '-' + oppHand + '-' +
          oldDeck + '-' + '5,' + whichPlayer + '-' + lastMove + ',0,' + i +',' + index});
        }
        else {
          lButtons.push({title: i+1, payload: twoDArrayToPayload(board) + '-' + twoDArrayToPayload(status) + '-' + hand + '-' +
          twoDArrayToPayload(oppBoard) + '-' + twoDArrayToPayload(oppStatus) + '-' + oppHand + '-' +
          deck + '-' + '3,' + whichPlayer + '-' + lastMove + ',0,' + i +',' + index});  
        }
      }  
    }
  }
  
  else {
    for (let i = 1; i < 6; i++) {
      m = 0;
      for (m = 0; m < 6-i; m++) {
        if (isPlaceValid(uboard, ustatus, i, m, lastMove)) {
          positions[j] = [i,m];
          j++;
        }
      }
    }
    for (let k = 0; k < j; k++) {
      lButtons[k] = {title: positions[k][0]+','+parseInt(positions[k][1]+1), payload: twoDArrayToPayload(board) + '-' + twoDArrayToPayload(status) + '-' + hand + '-' + 
      twoDArrayToPayload(oppBoard) + '-' + twoDArrayToPayload(oppStatus) + '-' + oppHand + '-' +
      deck + '-' + '1,' + whichPlayer + '-' + lastMove+','+ positions[k] + ',' + index};
    }
  }
  lButtons.push({title: 'Choose Different Card', payload: twoDArrayToPayload(board) + '-' + twoDArrayToPayload(status) + '-' + hand +'-'+ 
  twoDArrayToPayload(oppBoard) + '-' + twoDArrayToPayload(oppStatus) + '-' + oppHand + '-' + deck +'-'+'1,'+whichPlayer+'-'+'X,0,0,0'});
  return lButtons;
};

/************************************************Game*************************************************/

const start = (say, sendButton) => {
  let board = newBoard();
  let status = newStatus();
  let oppBoard = newOppBoard(board[0]);
  let oppStatus = newStatus();
  let deck = [8,8,8,8,8,8,8];
  let hand = [];
  let oppHand = [];

  for (let i = 0; i < 4; i++) {
    let ctype = drawCard(deck);
    hand[i] = ctype;
    let octype = drawCard(deck);
    oppHand[i] = octype;
  }
  //hand[0] = 6;
  //oppHand[0] = 6;
  //payload is : board, status, hand, board2, status2, hand2, playerActivity, lastMove
  let pload = twoDArrayToPayload(board) + '-' + twoDArrayToPayload(status) + '-' + hand + '-' + twoDArrayToPayload(oppBoard) + '-' + twoDArrayToPayload(oppStatus) + '-' + oppHand + '-' + deck + '-' + '1,0' + '-' + 'X,0,0,0';
  //say(['Here is your starting board:',getBoardDisplay(board), pload]).then(() => {
	  sendButton('Press the button to continue',[{title: 'Continue', payload: pload}]);
  //});
};

const state = (payload, say, sendButton) => {
  const ary = payload.split('-');
  let board = ary[0].split(','); let status = ary[1].split(','); let hand = ary[2].split(','); let oppBoard = ary[3].split(',');
  let oppStatus = ary[4].split(','); let oppHand = ary[5].split(','); let deck = ary[6].split(','); let playerActivity = ary[7].split(',');
  let lastMove = ary[8].split(',');
  let row = parseInt(lastMove[1]);  let col = parseInt(lastMove[2]);
  let handIndex = parseInt(lastMove[3]);
  
  for (let i = 0; i < 6; i++) {
    board[i] = board[i].split('*');
    oppBoard[i] = oppBoard[i].split('*');
    if (i < 5) {
      status[i] = status[i].split('*');
      oppStatus[i] = oppStatus[i].split('*');
    }
  }
  let pboard; let pstatus; let phand; 
  let a = getSubRow(row, [col]);
  let invalidCols = []; let invalidCols2 = [];
  
  if (playerActivity[1] == '0') {
    pboard = board; pstatus = status; phand = hand;
  }
  else {
    pboard = oppBoard; pstatus = oppStatus; phand = oppHand;
  }
  
  if (playerActivity[0] == '1') { //Player is picking card
    if (lastMove[0] != '⚪') { //If a card was placed last move, check if the game is won, then draw a new card to update the hand 
      if (pboard[row][col] != '⚪') {
        deck[pboard[row][col]]++;
      }
      phand[handIndex] = drawCard(deck);
      pboard[row][col] = lastMove[0];
      pstatus[row-1][col] = 0;
      if (playerActivity[1] == '0') {
        if (getValue(pboard[0][5]) == pboard[5][0]) {
          say(getOppBoardDisplay(oppBoard,oppStatus) + getBoardDisplay(board, status)).then(() => { 
            sendButton('Congratulations! You win the game!', [{title: 'Exit', payload: 'E'}]);
          });
          return;
        }
      }
      else if (playerActivity[1] == 1) {
        if (getValue(pboard[0][0]) == pboard[5][0]) {
          say(getOppBoardDisplay(oppBoard,oppStatus) + getBoardDisplay(board, status)).then(() => { 
            sendButton('Nemo wins!', [{title: 'Exit', payload: 'E'}]);
          });
          return;
        }
      }
      for (let i = 0; i < a.length; i++) {
        if (!isPlaceValid(pboard,pstatus,row+1, a[i], pboard[row+1][a[i]]) && (pboard[row][a[i]] != '⚪' && pboard[row][a[i]+1] != '⚪')) {
          invalidCols.push(a[i]);
        }
      }
      boardRestore(pboard, pstatus, row, col);
      boardDamage(pboard, pstatus, deck, row+1, invalidCols);
      playerActivity[1] = 1 - playerActivity[1];
    }
    say('Here is what the board currently looks like:\n' + getOppBoardDisplay(oppBoard,oppStatus) + getBoardDisplay(board, status)).then(() => {
      sendButton('Which card would you like to place? Pick from your hand below:', getCardPickButtons(board, status, hand, oppBoard, oppStatus, oppHand, deck, playerActivity[1],[''],'','','','',''));
    });
  }
  
  else if (playerActivity[0] == 2) { //Player is placing card
    sendButton('Where would you like to place the card?', getCardPlacementButtons(board, status, hand, oppBoard, oppStatus, oppHand, deck, lastMove[0], handIndex, playerActivity[1],[''],'','','','',''));
  }
  
  else if (playerActivity[0] == 3) { //Picking to counter NOT 
    let oldBoard = new Array(6); 
    let oldOppBoard = new Array(6);
    let oldStatus = new Array(5);
    let oldOppStatus = new Array(5);
    phand[handIndex] = drawCard(deck);
    let oldDeck = new Array(7);
    for (let i = 0; i < 7; i++) {
      oldDeck[i] = deck[i];
    }

    board[row][col] = 1 - board[row][col];
    oppBoard[row][col] = 1 - oppBoard[row][col];
    for (let i = 0; i < a.length; i++) {
        if (!isPlaceValid(board,status,row+1, a[i], board[row+1][a[i]]) && (board[row][a[i]] != '⚪' && board[row][a[i]+1] != '⚪')) {
          invalidCols.push(a[i]);
        }
        if (!isPlaceValid(oppBoard,oppStatus,row+1, a[i], oppBoard[row+1][a[i]]) && (oppBoard[row][a[i]] != '⚪' && oppBoard[row][a[i]+1] != '⚪')) {
          invalidCols2.push(a[i]);
        }
    }
    for (let i = 0; i < 5; i++) {
      oldBoard[i] = new Array(6-i);
      oldOppBoard[i] = new Array(6-i);
      oldStatus[i] = new Array(5-i);
      oldOppStatus[i] = new Array(5-i);
      for (let j = 0; j < 5-i; j++) {
        oldBoard[i][j] = board[i][j];
        oldOppBoard[i][j] = oppBoard[i][j]; 
        oldOppStatus[i][j] = oppStatus[i][j];
        oldStatus[i][j] = status[i][j];
      }
      oldBoard[i][5-i] = board[i][5-i];
      oldOppBoard[i][5-i] = oppBoard[i][5-i];
    }
    oldBoard[5] = []; oldOppBoard[5] = [];
    oldBoard[5][0] = board[5][0]; oldOppBoard[5][0] = oppBoard[5][0];
    
    boardDamage(board, status, deck, row+1, invalidCols);
    boardDamage(oppBoard, oppStatus, deck, row+1, invalidCols2);
    playerActivity[1] = 1 - playerActivity[1];

    say('Here is what the board currently looks like:\n' + getOppBoardDisplay(oppBoard,oppStatus) + getBoardDisplay(board, status)).then(() => {
    sendButton('Which card would you like to place? Pick from your hand below, and remember the effects of NOT can be undone if you place a NOT in the same column',
    getCardPickButtons(board, status, hand, oppBoard, oppStatus, oppHand, deck, playerActivity[1], oldBoard, oldStatus, oldOppBoard, oldOppStatus, oldDeck, col));
    });
  }
  
  else if (playerActivity[0] == 4) { //Placing to counter NOT
    let oldBoard = ary[9].split(',');
    let oldStatus = ary[10].split(',');
    let oldOppBoard = ary[11].split(',');
    let oldOppStatus = ary[12].split(',');
    let oldDeck = ary[13].split(',');
    for (let i = 0; i < 6; i++) {
      oldBoard[i] = oldBoard[i].split('*');
      oldOppBoard[i] = oldOppBoard[i].split('*');
      if (i < 5) {
        oldStatus[i] = oldStatus[i].split('*');
        oldOppStatus[i] = oldOppStatus[i].split('*');
      }
    }
    
    sendButton('Where would you like to place the card?',
    getCardPlacementButtons(board, status, hand, oppBoard, oppStatus, oppHand, deck, lastMove[0], handIndex, playerActivity[1], oldBoard, oldStatus, oldOppBoard, oldOppStatus,oldDeck, col));
  }

  else if (playerActivity[0] == 5) {//NOT countered, so don't do much
    let oldBoard = new Array(6); 
    let oldOppBoard = new Array(6);
    let oldStatus = new Array(5);
    let oldOppStatus = new Array(5);
    phand[handIndex] = drawCard(deck);
    let oldDeck = new Array(7);
    for (let i = 0; i < 7; i++) {
      oldDeck[i] = deck[i];
    }

    for (let i = 0; i < 5; i++) {
      oldBoard[i] = new Array(6-i);
      oldOppBoard[i] = new Array(6-i);
      oldStatus[i] = new Array(5-i);
      oldOppStatus[i] = new Array(5-i);
      for (let j = 0; j < 5-i; j++) {
        oldBoard[i][j] = board[i][j];
        oldOppBoard[i][j] = oppBoard[i][j]; 
        oldOppStatus[i][j] = oppStatus[i][j];
        oldStatus[i][j] = status[i][j];
      }
      oldBoard[i][5-i] = board[i][5-i];
      oldOppBoard[i][5-i] = oppBoard[i][5-i];
    }
    oldBoard[5] = []; oldOppBoard[5] = [];
    oldBoard[5][0] = board[5][0]; oldOppBoard[5][0] = oppBoard[5][0];

    playerActivity[1] = 1 - playerActivity[1];
    
    say('Here is what the board currently looks like:\n' + getOppBoardDisplay(oppBoard,oppStatus) + getBoardDisplay(board, status)).then(() => {
    sendButton('Which card would you like to place? Pick from your hand below, and remember the effects of NOT can be undone if you place a NOT in the same column',
    getCardPickButtons(board, status, hand, oppBoard, oppStatus, oppHand, deck, playerActivity[1], oldBoard, oldStatus, oldOppBoard, oldOppStatus, oldDeck, col));
    });
  }
};

/******************************************************************************************************/

module.exports = {
	filename: 'bubblesort',
	title: 'Booleo pyramid puzzle',
	introduction: [
	'Welcome to Logic Pyramid Challenge! This (will be) a player vs. A.I. game' +
    '\n\nYou will be given 6 binary inputs facing you (the bottom half of the board), and the opponent will be given the opposite inputs facing them (the top half of the board).' +
    '\n\nYou must place gate cards, such as AND, OR, or XOR in order to fill out a logical pyramid.' +
    '\n\nTo win the game, you must fill the bottom space with a gate resolving in a value equal to the rightmost input.' +
    '\n\nYou may replace your cards, but beware of invalidating and deleting your other gates. You may also use NOT cards to toggle one of the original inputs, affecting both your and the opponent\'s pyramids! Good luck!'
	],
	start: start,
	state: state,
};