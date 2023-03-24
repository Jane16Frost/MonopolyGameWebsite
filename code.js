
/************************************************************
 
 *           Declare Gameplay Variables

************************************************************/
var playerTurn = 1;
let playerTurnLoop = 0;

let numberOfPlayers = 2;
//Create a player object to store information
let Players = [{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player1div", amount: "player1amt", img: "images/thimble.png", jail:false, turnsInJail:0, alive:true}, 
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player2div", amount: "player2amt", img: "images/cat.png", jail:false, turnsInJail:0, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player3div", amount: "player3amt", img: "images/hat.png", jail:false, turnsInJail:0, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player4div", amount: "player4amt", img: "images/iron.png", jail:false, turnsInJail:0, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player5div", amount: "player5amt", img: "images/shoe.png", jail:false, turnsInJail:0, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player6div", amount: "player6amt", img: "images/boat.png", jail:false, turnsInJail:0, alive:true}];

//Create and array of players
//Create an array to store player color

/**************************************************************
 *        Chance/ Community Chest Variables
***************************************************************/
const takeAChanceText = ["Second Place in Beauty Contest: $10", "Bank Pays You Dividend of $50",
"Repair your Properties. You owe $250", "Speeding Fine: $15",
"Holiday Fund Matures: Receive $100", "Pay Hospital Fees: $100"];

const takeAChanceMoney = [10, 50, -250, -15, 100, -100];

/**************************************************************
 *    Declare Suite Characteristics
**************************************************************/
var suites = document.querySelectorAll("section");
let Suites = [{number: "1111", name: "go", monetaryValue: -200, owningPlayer: 0, timeLandedOn: 0}];


/***********************************************************
 
      Organize the Board and Display Monetary Value

***********************************************************/

let x = 1;
let y = 1;
let value = -1;
var playerSpot; 
var playerColors = ["#e04a59", "#76bbe3", "#dbc56b", "#b3dea6", "#b3ade0", "#e6aee3"];

for(let square = 0; square < suites.length; square++)
{
   suites[square].onclick = ShowRent;
   y = suites[square].getAttribute("suite").substring(0, 2);
   x = suites[square].getAttribute("suite").substring(2, 4);
   value = suites[square].getAttribute("val");
   
   suites[square].style.gridColumn = x;
   suites[square].style.gridRow = y;
 
   if(square != 0)
   {
      Suites.push({number: suites[square].getAttribute("suite"), name: suites[square].getAttribute("id"), monetaryValue: value, owningPlayer: 0, timeLandedOn:0});
   }  

   if(value > 50)
   {
      suites[square].innerHTML += "    $" + value + "<br>";
   }
   else
   {
      suites[square].innerHTML += "<br>";
   }
}


/************************************************
 * Ask for Number of players when Form Loads
***********************************************/
window.onload = LoadGame;

function LoadGame()
{
   do
   {
      numberOfPlayers = prompt("Select Number of Players: ", 2, 2);

   }while(numberOfPlayers < 2 || numberOfPlayers > 6);
   LoadPlayers();
}

function LoadPlayers()
{
   var playerGrid = document.getElementById("grid");
   playerGrid.innerHTML = "";
   
   //Assign each color to coresponding player
   for(let pl = 0; pl < numberOfPlayers; pl++)
   {
      playerSpot = "<div id='" + Players[pl].playerDiv + "' class = 'playerDiv'><div id='" + Players[pl].amount + "' class='amount'>$3000</div><div><img  class = 'playerIcon' style='width:60px;' src='./"+ Players[pl].img+"'></div></div>";
      playerGrid.innerHTML += playerSpot;
      Players[pl].color = playerColors[pl];
      document.getElementById(Players[pl].playerDiv).style.backgroundColor = Players[pl].color;
      document.getElementById("go").innerHTML += "<img class = 'player"+ (pl+1) +"Icon playerIcon' src='./"+ Players[pl].img+"'>";
   }
   
   switch(numberOfPlayers)
   {
      case '2':
         playerGrid.style.gridTemplateColumns = "1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto";
      break;
      case '3':
         playerGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto";
      break;
      case '4':
         playerGrid.style.gridTemplateColumns = "1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto auto";
      break;
      case '5':
         playerGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto auto";
      break;
      case '6':
            playerGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
            playerGrid.style.gridTemplateRows = "auto auto";
      break;
   }
      
      document.getElementById(Players[playerTurn-1].playerDiv).classList.add("activePlayer");
      
   }

/*****************************************************************
* 
*                          Game Play
* 
****************************************************************/
   document.getElementById("RollDice").onclick = ManagePlayerTurn;
   document.getElementById("EndTurn").onclick = IncrementPlayer;

/***********************************************
 *        Set timers for  Player Turn
************************************************/
function ManagePlayerTurn()
{
   //Disable Roll Dice Button
   document.getElementById("RollDice").onclick = null;
   document.getElementById("RollDice").style.color = "darkslategray";
   

   //Roll Dice and Parse Results
   let roll1 = RollDice();
   let roll2 = RollDice();
   document.getElementById("die1").innerHTML = "<img class='die' src='./images/dice" + roll1 + ".png'></img>";
   document.getElementById("die2").innerHTML = "<img class='die' src='./images/dice" + roll2 + ".png'></img>";

   //If Player Rolled Dice in Jail
   if(Players[playerTurn-1].jail && roll1 != roll2)
   {
      //Save player stayed in Jail
      Players[playerTurn - 1].turnsInJail++;
      
      //Enable End Turn Button
      document.getElementById("RollDice").innerHTML = "End Turn";
      document.getElementById("RollDice").style.color = "";
      document.getElementById("RollDice").onclick = IncrementPlayer;


      document.getElementById("subBtn").innerHTML = "Buy Houses";
      document.getElementById("subBtn").onclick = "";
   }
   else
   {
      //Move Player a corresponding amount of squares
      for(let move = 0; move < (roll1 + roll2); move++)
      {
         setTimeout(MovePlayer, 200 * move);
      }
      
      //Manage The square the player landed on
      setTimeout(ManageSquare, 200 * (roll1 + roll2));
      
      
      //Player Doesnt Go Again
      //If no doubles where rolled or if soubles where rolled from inside jail
      if(roll1 != roll2 || Players[playerTurn -1].jail)
      {
         //Set Player to not jailed
         Players[playerTurn -1].jail = false;
         //Tell Player to end turn
         setTimeout(function(){
            
            document.getElementById("RollDice").innerHTML = "End Turn";
            document.getElementById("RollDice").style.color = "";
            document.getElementById("RollDice").onclick = IncrementPlayer;
         }, 200 * (roll1 + roll2 + 1));
      }
      //Player Goes Again
      else{
         playerTurnLoop++;
         setTimeout(function(){
            
            if(!Players[playerTurn-1].alive || Players[playerTurn - 1].jail)
            {
               IncrementPlayer();
            }
            else
            {
               document.getElementById("RollDice").onclick = ManagePlayerTurn;
               document.getElementById("RollDice").style.color = "";
            }
         }, 200 * (roll1 + roll2 + 1));
      }
      
   }
}

/***********************************************
 * Control the square the player landed on
 ***********************************************/
function ManageSquare()
{
   //Get What square the player landed on
   let suiteLocation = FindSuite(AssembleSuite(Players[playerTurn - 1].spaceX, Players[playerTurn - 1].spaceY));

   //Player Lands on Chance or Community Chest
   if(Suites[suiteLocation].monetaryValue == -1)
   {  
      Players[playerTurn - 1].money += ManageChance();
      //Check if this makes player loose
      if(Players[playerTurn - 1].money < 0)
      {
         PlayerLost(playerTurn, 0);
      }
   }
   //Just Visiting Jail
   else if(Suites[suiteLocation].name == "jail")
   {
      
   }
   //Player Sent to jail
   else if(Suites[suiteLocation].name == "gotojail")
   {
      //Remove player from board
      document.getElementsByClassName("player"+ playerTurn +"Icon")[0].remove();
      //Update Player Location
      Players[playerTurn - 1].spaceX = 1;
      Players[playerTurn - 1].spaceY = 11;
      
      //Add Player back to board
      document.getElementById("jail").innerHTML += "<img class = 'player"+ playerTurn +"Icon playerIcon' src='./"+ Players[playerTurn - 1].img+"'>";
      alert("Go directly to jail! Do not pass go, do not collect $200");
      
      //alert Player theyre in Jail
      Players[playerTurn - 1].jail = true;
      
   }
   //If Player Landed on a Ownable Property
   else if (Suites[suiteLocation].name != "go" && Suites[suiteLocation].name != "freeparking")
   {
      //Check if Owned
      if(Suites[suiteLocation].owningPlayer == 0)
      {
         //If unowned Tax Square
         if(Suites[suiteLocation].name == "luxurytax" && Suites[suiteLocation].name == "incometax")
         {
            //Make Player Pay Tax
            Players[playerTurn - 1].money -= Suites[suiteLocation].monetaryValue;

            //Alert Player
            if(Suites[suiteLocation].name == "luxurytax")
            {
               alert("Luxury Tax: Pay $100");
            }
            else
            {
               alert("Income Tax: Pay $200");
            }
         }
         else
         {

            //Purchase and Set Property to Owned
            Players[playerTurn - 1].money -= Suites[suiteLocation].monetaryValue;
            Suites[suiteLocation].owningPlayer = playerTurn;
            document.getElementById(Suites[suiteLocation].name).style.backgroundColor = Players[playerTurn - 1].color;
            
         }

      }
      //If Property is owned Calculate and Pay Rent
      else
      {
         let amountToPay;
         //Calculate Rent
         if(Suites[suiteLocation].number.endsWith('06') || Suites[suiteLocation].number.startsWith('06'))
         {
            amountToPay = 0;
            if(Suites[5].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }
            if(Suites[15].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }
            if(Suites[25].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }
            if(Suites[35].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }

         }
         else if(Suites[suiteLocation].name == "electric" || Suites[suiteLocation].number == "water")
         {
            amountToPay = (roll1 + roll2) * 5;
         }
         else{
            
            amountToPay = Math.round((Suites[suiteLocation].monetaryValue) * 0.1);
            for(let land = 1; land < Suites[suiteLocation].timeLandedOn; land++)
            {
               amountToPay += Math.round(amountToPay * 0.2);
            }
         }
         Players[playerTurn - 1].money -= amountToPay;
         Players[Suites[suiteLocation].owningPlayer - 1].money += amountToPay;
      }

      if(Players[playerTurn - 1].money < 0)
      {
         if(Suites[suiteLocation].owningPlayer == playerTurn)
         {
            PlayerLost(playerTurn, 0);
         }
         else
         {
            PlayerLost(playerTurn, Suites[suiteLocation].owningPlayer);
         }
      }

      Suites[suiteLocation].timeLandedOn++;
   }

   for(let pl = 0; pl < numberOfPlayers; pl++)
   {
      document.getElementById(Players[pl].amount).innerHTML = "$" + Players[pl].money;
      
   }
   
}

/***********************************************
 *    Change Whos Turn it is
 **********************************************/
function IncrementPlayer()
{
   let deadCounter = 0;
   playerTurnLoop = 0;
   do
   {
      document.getElementById(Players[playerTurn-1].playerDiv).classList.remove("activePlayer");
      
      playerTurn++;
      if(playerTurn > numberOfPlayers)
      {
         playerTurn = 1;
      }
      
      document.getElementById(Players[playerTurn-1].playerDiv).classList.add("activePlayer");  
   
      deadCounter++;
   }while(!Players[playerTurn -1].alive && deadCounter < 10);
   
   if(deadCounter > 9)
   {
      document.getElementById(Players[playerTurn-1].playerDiv).classList.remove("activePlayer");
      document.getElementById("RollDice").onclick = null;
      document.getElementById("RollDice").style.color = "darkslategray";
   }
   else
   {
   
      //Check if Player is in Jail
   if(Players[playerTurn -1].jail)
   {
      document.getElementById("subBtn").innerHTML = "Pay Bail ($50)";
      document.getElementById("subBtn").onclick = PayBail;
      
   }
   else
   {
      document.getElementById("subBtn").innerHTML = "Buy Houses";
      document.getElementById("subBtn").onclick = "";
   }
   
   if(Players[playerTurn -1].turnsInJail >=3)
   {
      document.getElementById("RollDice").onclick = PayBail;
      document.getElementById("RollDice").innerText = "Pay Bail($50)"; 
   }
   else
   {
      document.getElementById("RollDice").onclick = ManagePlayerTurn;
      document.getElementById("RollDice").innerText = "Roll Dice";

   }

   }
   
}

/***********************************************
 *    Pay Bail Mechanic
 **********************************************/
function PayBail()
{
      //Set Player Free and Charge Money 
      Players[playerTurn -1].jail = false;
      Players[playerTurn - 1].money -= 50;
      Players[playerTurn -1].turnsInJail = 0;

      //Set Supplementray Button Back to buy houses
      document.getElementById("subBtn").innerHTML = "Buy Houses";
      document.getElementById("subBtn").onclick = "";
      //Set 
      document.getElementById("RollDice").onclick = ManagePlayerTurn;
      document.getElementById("RollDice").innerText = "Roll Dice";

      alert("Pay $50 to get out of jail");
      if(Players[playerTurn - 1].money < 0)
     {
        PlayerLost(playerTurn, 0);
     }
}


/***********************************************
 *    Dice Roll Mechanic
 **********************************************/
function RollDice()
{
   let roll = Math.floor(Math.random() * 6) + 1;
   return roll;
}

/**********************************************
 *    Control the Animation of the playe
 *********************************************/
function MovePlayer()
{
   let playerSuite;

      //Move Player total Number of Spaces
      if(Players[playerTurn - 1].spaceY == 11 && Players[playerTurn - 1].spaceX != 1)
      {
         Players[playerTurn - 1].spaceX--;
      }
      else if(Players[playerTurn - 1].spaceX == 11)
      {
         Players[playerTurn - 1].spaceY++;
      }
      else if(Players[playerTurn - 1].spaceY == 1)
      {
         Players[playerTurn - 1].spaceX++;
      }
      else if(Players[playerTurn - 1].spaceX == 1)
      {
         Players[playerTurn - 1].spaceY--;
      }

      //Add $200 to the player bank when passing go
      if(Players[playerTurn - 1].spaceX == 11 && Players[playerTurn - 1].spaceY == 11)
      {
         Players[playerTurn - 1].money += 200;
      }

      //Get suite #
      playerSuite = FindSuite(AssembleSuite(Players[playerTurn - 1].spaceX, Players[playerTurn - 1].spaceY ));
         
       
      //Remove Old Player Icon
      document.getElementsByClassName("player"+ playerTurn +"Icon")[0].remove();

      suites[playerSuite].innerHTML += "<img class = 'player"+ playerTurn +"Icon playerIcon' src='./"+ Players[playerTurn - 1].img+"'>";
   
}

/************************************************
 * Covert x and y cords to suite# and back
 ***********************************************/
function AssembleSuite(X, Y)
{
   if(X < 10 && Y < 10)
   {
      return "0" + Y.toString() + "0" + X.toString();
   }
   else if (Y < 10)
   {
      return "0" + Y.toString() + X.toString();
      
   }
   else if (X < 10)
   {
      return Y.toString() + "0" + X.toString();
   }
   else
   {
      return Y.toString() + X.toString();
      
   }
}

function ParseSuite(suiteNumber)
{
   spaceY = suiteNumber.substring(0, 2);
   spaceX = suiteNumber.getAttribute("suite").substring(2, 4);
   
   return {x: spaceX, y: spaceY};
}

function FindSuite(suiteNumber)
{
   for(let square = 0; square < suites.length; square++)
   {
      if(suites[square].getAttribute("suite") == suiteNumber)
      {
         return square;
      }
   }
}

/************************************************
 *    Managed the chance and comunity chest deck
 *************************************************/
function ManageChance()
{
   let luck = RollDice() - 1;
   alert(takeAChanceText[luck]);

   return takeAChanceMoney[luck];

}

/**************************************************
 *    Display Player Win Screen
 *************************************************/
function PlayerLost(badPlayer, winningPlayer)
{
   document.getElementById(Players[badPlayer-1].playerDiv).style.backgroundColor = "#6b6b6b";
   Players[badPlayer-1].alive = false;
   for(let square = 0; square < suites.length; square++)
   {
      if(Suites[square].owningPlayer == badPlayer)
      {
         Suites[square].owningPlayer = winningPlayer;
         if(winningPlayer != 0)
         {
            document.getElementById(Suites[square].name).style.backgroundColor = Players[winningPlayer - 1].color;
         }
         else
         {
            document.getElementById(Suites[square].name).style.backgroundColor = "";
         }
      }
   }
   alert("Player " + (badPlayer) + " lost!");
}

function ShowRent()
{
   var CurrentSpace = FindSuite(this.getAttribute("suite"));
   let amountToPay;
   if(Suites[CurrentSpace].owningPlayer != 0)
   {
      if(Suites[CurrentSpace].number.endsWith('06') || Suites[CurrentSpace].number.startsWith('06'))
      {
         amountToPay = 0;
         if(Suites[5].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         if(Suites[15].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         if(Suites[25].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         if(Suites[35].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         
      }
      else if(Suites[CurrentSpace].name == "electric" || Suites[CurrentSpace].number == "water")
      {
         amountToPay = -1;
      }
      else{
         
         amountToPay = Math.round((Suites[CurrentSpace].monetaryValue) * 0.1);
         for(let land = 1; land < Suites[CurrentSpace].timeLandedOn; land++)
         {
            amountToPay += Math.round(amountToPay * 0.2);
         }
      }
      
      if(amountToPay == -1)
      {
         alert("Rent will be 5x dice roll");
      }
      else
      {
         alert("Rent will be $" + amountToPay);
      }
   }
   
}

function CalculateRent(CurrentSpace, DiceTotal)
{
   let amountToPay;

      if(Suites[CurrentSpace].number.endsWith('06') || Suites[CurrentSpace].number.startsWith('06'))
      {
         amountToPay = 0;
         if(Suites[5].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            if(amountToPay == 0)
            {
               amountToPay += 25;
            }
            else
            {
               amountToPay *= 2;
            }
         }
         if(Suites[15].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            if(amountToPay == 0)
            {
               amountToPay += 25;
            }
            else
            {
               amountToPay *= 2;
            }
         }
         if(Suites[25].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            if(amountToPay == 0)
            {
               amountToPay += 25;
            }
            else
            {
               amountToPay *= 2;
            }
         }
         if(Suites[35].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            if(amountToPay == 0)
            {
               amountToPay += 25;
            }
            else
            {
               amountToPay *= 2;
            }
         }
         
      }
      else if(Suites[CurrentSpace].name == "electric" || Suites[CurrentSpace].number == "water")
      {

         if(Suites[CurrentSpace].name == "electric" && Suites[28].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay = 10 * DiceTotal;

         }
         else if(Suites[CurrentSpace].name == "water" && Suites[12].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay = 10 * DiceTotal;
         }
         else
         {
            amountToPay = 5 * DiceTotal;
         }
      }
      else{
         //Calculate Coloured Space Rent
         amountToPay = Math.round((Suites[CurrentSpace].monetaryValue) * 0.1);
         for(let land = 1; land < Suites[CurrentSpace].timeLandedOn; land++)
         {
            amountToPay += Math.round(amountToPay * 0.2);
         }
      }
      
   return amountToPay;
=======
/************************************************************
 
 *           Declare Gameplay Variables

************************************************************/
var playerTurn = 1;
let playerTurnLoop = 0;

let numberOfPlayers = 2;
//Create a player object to store information
let Players = [{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player1div", amount: "player1amt", img: "images/thimble.png", jail:false, alive:true}, 
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player2div", amount: "player2amt", img: "images/cat.png", jail:false, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player3div", amount: "player3amt", img: "images/hat.png", jail:false, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player4div", amount: "player4amt", img: "images/iron.png", jail:false, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player5div", amount: "player5amt", img: "images/shoe.png", jail:false, alive:true},
{money: 3000, spaceX: 11, spaceY: 11, color: "#eee",
playerDiv: "player6div", amount: "player6amt", img: "images/boat.png", jail:false, alive:true}];

//Create and array of players
//Create an array to store player color

/**************************************************************
 *        Chance/ Community Chest Variables
***************************************************************/
const takeAChanceText = ["Second Place in Beauty Contest: $10", "Bank Pays You Dividend of $50",
"Repair your Properties. You owe $250", "Speeding Fine: $15",
"Holiday Fund Matures: Receive $100", "Pay Hospital Fees: $100"];

const takeAChanceMoney = [10, 50, -250, -15, 100, -100];

/**************************************************************
 *    Declare Suite Characteristics
**************************************************************/
var suites = document.querySelectorAll("section");
let Suites = [{number: "1111", name: "go", monetaryValue: -200, owningPlayer: 0, timeLandedOn: 0}];


/***********************************************************
 
      Organize the Board and Display Monetary Value

***********************************************************/

let x = 1;
let y = 1;
let value = -1;
var playerSpot; 
var playerColors = ["#e04a59", "#76bbe3", "#dbc56b", "#b3dea6", "#b3ade0", "#e6aee3"];

for(let square = 0; square < suites.length; square++)
{
   suites[square].onclick = ShowRent;
   y = suites[square].getAttribute("suite").substring(0, 2);
   x = suites[square].getAttribute("suite").substring(2, 4);
   value = suites[square].getAttribute("val");
   
   suites[square].style.gridColumn = x;
   suites[square].style.gridRow = y;
 
   if(square != 0)
   {
      Suites.push({number: suites[square].getAttribute("suite"), name: suites[square].getAttribute("id"), monetaryValue: value, owningPlayer: 0, timeLandedOn:0});
   }  

   if(value > 50)
   {
      suites[square].innerHTML += "    $" + value + "<br>";
   }
   else
   {
      suites[square].innerHTML += "<br>";
   }
}

window.onload = LoadGame;

function LoadGame()
{
   do
   {
      numberOfPlayers = prompt("Select Number of Players: ", 2, 2);

   }while(numberOfPlayers < 2 || numberOfPlayers > 6);
   LoadPlayers();
}

function LoadPlayers()
{
   var playerGrid = document.getElementById("grid");
   playerGrid.innerHTML = "";
   
   //Assign each color to coresponding player
   for(let pl = 0; pl < numberOfPlayers; pl++)
   {
      playerSpot = "<div id='" + Players[pl].playerDiv + "' class = 'playerDiv'><div id='" + Players[pl].amount + "' class='amount'>$3000</div><div><img  class = 'playerIcon' style='width:60px;' src='./"+ Players[pl].img+"'></div></div>";
      playerGrid.innerHTML += playerSpot;
      Players[pl].color = playerColors[pl];
      document.getElementById(Players[pl].playerDiv).style.backgroundColor = Players[pl].color;
      document.getElementById("go").innerHTML += "<img class = 'player"+ (pl+1) +"Icon playerIcon' src='./"+ Players[pl].img+"'>";
   }
   
   switch(numberOfPlayers)
   {
      case '2':
         playerGrid.style.gridTemplateColumns = "1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto";
      break;
      case '3':
         playerGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto";
      break;
      case '4':
         playerGrid.style.gridTemplateColumns = "1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto auto";
      break;
      case '5':
         playerGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
         playerGrid.style.gridTemplateRows = "auto auto";
      break;
      case '6':
            playerGrid.style.gridTemplateColumns = "1fr 1fr 1fr";
            playerGrid.style.gridTemplateRows = "auto auto";
      break;
   }
      
      document.getElementById(Players[playerTurn-1].playerDiv).classList.add("activePlayer");
      
   }

/*****************************************************************
* 
*                          Game Play
* 
****************************************************************/
   document.getElementById("RollDice").onclick = ManagePlayerTurn;
   document.getElementById("EndTurn").onclick = IncrementPlayer;

/***********************************************
 *        Set timers for  Player Turn
************************************************/
function ManagePlayerTurn()
{
   //Disable Roll Dice Button
   document.getElementById("RollDice").onclick = null;
   document.getElementById("RollDice").style.color = "darkslategray";
   
   //Check if Player is in Jail
   if(Players[playerTurn -1 ].jail)
   {
      Players[playerTurn -1].jail = false;
      Players[playerTurn - 1].money -= 50;
      alert("Pay $50 to get out of jail");
      if(Players[playerTurn - 1].money < 0)
      {
         PlayerLost(playerTurn, 0);
      }
   }
   
   //Roll Dice and Parse Results
   let roll1 = RollDice();
   let roll2 = RollDice();
   document.getElementById("die1").innerHTML = "<img class='die' src='./images/dice" + roll1 + ".png'></img>";
   document.getElementById("die2").innerHTML = "<img class='die' src='./images/dice" + roll2 + ".png'></img>";

   //Move Player a corresponding amount of squares
   for(let move = 0; move < (roll1 + roll2); move++)
   {
      setTimeout(MovePlayer, 200 * move);
   }

   //Manage The quare the player landed on
   setTimeout(ManageSquare, 200 * (roll1 + roll2));

   
   //Player Doesnt Go Again
   if(roll1 != roll2)
   {
      //Tell Player to end turn
      setTimeout(function(){

         document.getElementById("RollDice").innerHTML = "End Turn";
         document.getElementById("RollDice").style.color = "";
         document.getElementById("RollDice").onclick = IncrementPlayer;
         //  setTimeout(IncrementPlayer, 200 * (roll1 + roll2 + 1));
      }, 200 * (roll1 + roll2 + 1));
   }
   //Player Goes Again
   else{
      playerTurnLoop++;
      setTimeout(function(){
         
         if(!Players[playerTurn-1].alive || Players[playerTurn - 1].jail)
         {
            IncrementPlayer();
         }
         else
         {
            document.getElementById("RollDice").onclick = ManagePlayerTurn;
            document.getElementById("RollDice").style.color = "";
         }
      }, 200 * (roll1 + roll2 + 1));
   }

}

/***********************************************
 * Control the square the player landed on
 ***********************************************/
function ManageSquare()
{
   //Get What square the player landed on
   let suiteLocation = FindSuite(AssembleSuite(Players[playerTurn - 1].spaceX, Players[playerTurn - 1].spaceY));

   //Player Lands on Chance or Community Chest
   if(Suites[suiteLocation].monetaryValue == -1)
   {  
      Players[playerTurn - 1].money += ManageChance();
      //Check if this makes player loose
      if(Players[playerTurn - 1].money < 0)
      {
         PlayerLost(playerTurn, 0);
      }
   }
   //Just Visiting Jail
   else if(Suites[suiteLocation].name == "jail")
   {
      
   }
   //Player Sent to jail
   else if(Suites[suiteLocation].name == "gotojail")
   {
      document.getElementsByClassName("player"+ playerTurn +"Icon")[0].remove();
      Players[playerTurn - 1].spaceX = 1;
      Players[playerTurn - 1].spaceY = 11;
      
      document.getElementById("jail").innerHTML += "<img class = 'player"+ playerTurn +"Icon playerIcon' src='./"+ Players[playerTurn - 1].img+"'>";
      
      Players[playerTurn - 1].jail = true;
      alert("Go directly to jail! Do not pass go, do not collect $200");
      
   }
   else if (Suites[suiteLocation].name != "go" && Suites[suiteLocation].name != "freeparking")
   {
      if(Suites[suiteLocation].owningPlayer == 0)
      {
         Players[playerTurn - 1].money -= Suites[suiteLocation].monetaryValue;
         
         if(Suites[suiteLocation].name != "luxurytax" && Suites[suiteLocation].name != "incometax")
         {
            Suites[suiteLocation].owningPlayer = playerTurn;
            document.getElementById(Suites[suiteLocation].name).style.backgroundColor = Players[playerTurn - 1].color;
         }
         else 
         {
            if(Suites[suiteLocation].name == "luxurytax")
            {
               alert("Luxury Tax: Pay $100");
            }
            else
            {
               alert("Income Tax: Pay $200");
            }
         }
      }
      else
      {
         let amountToPay;
         if(Suites[suiteLocation].number.endsWith('06') || Suites[suiteLocation].number.startsWith('06'))
         {
            amountToPay = 0;
            if(Suites[5].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }
            if(Suites[15].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }
            if(Suites[25].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }
            if(Suites[35].owningPlayer == Suites[suiteLocation].owningPlayer)
            {
               amountToPay += 25;
            }

         }
         else if(Suites[suiteLocation].name == "electric" || Suites[suiteLocation].number == "water")
         {
            amountToPay = (roll1 + roll2) * 5;
         }
         else{
            
            amountToPay = Math.round((Suites[suiteLocation].monetaryValue) * 0.1);
            for(let land = 1; land < Suites[suiteLocation].timeLandedOn; land++)
            {
               amountToPay += Math.round(amountToPay * 0.2);
            }
         }
         Players[playerTurn - 1].money -= amountToPay;
         Players[Suites[suiteLocation].owningPlayer - 1].money += amountToPay;
      }

      if(Players[playerTurn - 1].money < 0)
      {
         if(Suites[suiteLocation].owningPlayer == playerTurn)
         {
            PlayerLost(playerTurn, 0);
         }
         else
         {
            PlayerLost(playerTurn, Suites[suiteLocation].owningPlayer);
         }
      }

      Suites[suiteLocation].timeLandedOn++;
   }

   for(let pl = 0; pl < numberOfPlayers; pl++)
   {
      document.getElementById(Players[pl].amount).innerHTML = "$" + Players[pl].money;
      
   }
   
}

/***********************************************
 *    Change Whos Turn it is
 **********************************************/
function IncrementPlayer()
{
   let deadCounter = 0;
   playerTurnLoop = 0;
   do
   {
      document.getElementById(Players[playerTurn-1].playerDiv).classList.remove("activePlayer");
      
      playerTurn++;
      if(playerTurn > numberOfPlayers)
      {
         playerTurn = 1;
      }
      
      document.getElementById(Players[playerTurn-1].playerDiv).classList.add("activePlayer");  
   
      deadCounter++;
   }while(!Players[playerTurn -1].alive && deadCounter < 10);
   
   if(deadCounter > 9)
   {
      document.getElementById(Players[playerTurn-1].playerDiv).classList.remove("activePlayer");
      document.getElementById("RollDice").onclick = null;
      document.getElementById("RollDice").style.color = "darkslategray";
   }
   else
   {
      document.getElementById("RollDice").onclick = ManagePlayerTurn;
      document.getElementById("RollDice").innerText = "Roll Dice";

   }
   
}

/***********************************************
 *    Dice Roll Mechanic
 **********************************************/
function RollDice()
{
   let roll = Math.floor(Math.random() * 6) + 1;
   return roll;
}

/**********************************************
 *    Control the Animation of the playe
 *********************************************/
function MovePlayer()
{
   let playerSuite;

      //Move Player total Number of Spaces
      if(Players[playerTurn - 1].spaceY == 11 && Players[playerTurn - 1].spaceX != 1)
      {
         Players[playerTurn - 1].spaceX--;
      }
      else if(Players[playerTurn - 1].spaceX == 11)
      {
         Players[playerTurn - 1].spaceY++;
      }
      else if(Players[playerTurn - 1].spaceY == 1)
      {
         Players[playerTurn - 1].spaceX++;
      }
      else if(Players[playerTurn - 1].spaceX == 1)
      {
         Players[playerTurn - 1].spaceY--;
      }

      //Add $200 to the player bank when passing go
      if(Players[playerTurn - 1].spaceX == 11 && Players[playerTurn - 1].spaceY == 11)
      {
         Players[playerTurn - 1].money += 200;
      }

      //Get suite #
      playerSuite = FindSuite(AssembleSuite(Players[playerTurn - 1].spaceX, Players[playerTurn - 1].spaceY ));
         
       
      //Remove Old Player Icon
      document.getElementsByClassName("player"+ playerTurn +"Icon")[0].remove();

      suites[playerSuite].innerHTML += "<img class = 'player"+ playerTurn +"Icon playerIcon' src='./"+ Players[playerTurn - 1].img+"'>";
   
}

/************************************************
 * Covert x and y cords to suite# and back
 ***********************************************/
function AssembleSuite(X, Y)
{
   if(X < 10 && Y < 10)
   {
      return "0" + Y.toString() + "0" + X.toString();
   }
   else if (Y < 10)
   {
      return "0" + Y.toString() + X.toString();
      
   }
   else if (X < 10)
   {
      return Y.toString() + "0" + X.toString();
   }
   else
   {
      return Y.toString() + X.toString();
      
   }
}

function ParseSuite(suiteNumber)
{
   spaceY = suiteNumber.substring(0, 2);
   spaceX = suiteNumber.getAttribute("suite").substring(2, 4);
   
   return {x: spaceX, y: spaceY};
}

function FindSuite(suiteNumber)
{
   for(let square = 0; square < suites.length; square++)
   {
      if(suites[square].getAttribute("suite") == suiteNumber)
      {
         return square;
      }
   }
}

/************************************************
 *    Managed the chance and comunity chest deck
 *************************************************/
function ManageChance()
{
   let luck = RollDice() - 1;
   alert(takeAChanceText[luck]);

   return takeAChanceMoney[luck];

}

/**************************************************
 *    Display Player Win Screen
 *************************************************/
function PlayerLost(badPlayer, winningPlayer)
{
   document.getElementById(Players[badPlayer-1].playerDiv).style.backgroundColor = "#6b6b6b";
   Players[badPlayer-1].alive = false;
   for(let square = 0; square < suites.length; square++)
   {
      if(Suites[square].owningPlayer == badPlayer)
      {
         Suites[square].owningPlayer = winningPlayer;
         if(winningPlayer != 0)
         {
            document.getElementById(Suites[square].name).style.backgroundColor = Players[winningPlayer - 1].color;
         }
         else
         {
            document.getElementById(Suites[square].name).style.backgroundColor = "";
         }
      }
   }
   alert("Player " + (badPlayer) + " lost!");
}

function ShowRent()
{
   var CurrentSpace = FindSuite(this.getAttribute("suite"));
   let amountToPay;
   if(Suites[CurrentSpace].owningPlayer != 0)
   {
      if(Suites[CurrentSpace].number.endsWith('06') || Suites[CurrentSpace].number.startsWith('06'))
      {
         amountToPay = 0;
         if(Suites[5].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         if(Suites[15].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         if(Suites[25].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         if(Suites[35].owningPlayer == Suites[CurrentSpace].owningPlayer)
         {
            amountToPay += 25;
         }
         
      }
      else if(Suites[CurrentSpace].name == "electric" || Suites[CurrentSpace].number == "water")
      {
         amountToPay = -1;
      }
      else{
         
         amountToPay = Math.round((Suites[CurrentSpace].monetaryValue) * 0.1);
         for(let land = 1; land < Suites[CurrentSpace].timeLandedOn; land++)
         {
            amountToPay += Math.round(amountToPay * 0.2);
         }
      }
      
      if(amountToPay == -1)
      {
         alert("Rent will be 5x dice roll");
      }
      else
      {
         alert("Rent will be $" + amountToPay);
      }
   }

}
