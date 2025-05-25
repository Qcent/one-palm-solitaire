var CARDCOUNT=0
var litcombo
var score=0
var bookendwin=0
var winflag=0
var multi=1

var GAMBLIN=false
var PUSHEND=0
var SPLITEND=0
var gamblincash=100
var gamblindebt=0
var gamblinbet=20
var gamblingames=0
var gamblinwins=0
var gamblinpushes=0
var avgpayout=0

var card_combo_chain = new Array()
var score_combo = new Array()

var cardBack = localStorage.getItem("cardBack") || "back-1.png";
var spread = new Array()
var pile = new Array()
var deck = new Array( "HA","H2","H3","H4","H5","H6","H7","H8","H9","H0","HJ","HQ","HK",
			"SA","S2","S3","S4","S5","S6","S7","S8","S9","S0","SJ","SQ","SK",
			"DA","D2","D3","D4","D5","D6","D7","D8","D9","D0","DJ","DQ","DK",
			"CA","C2","C3","C4","C5","C6","C7","C8","C9","C0","CJ","CQ","CK"	)

function shuffleClick(){
  let icon = document.getElementById('shuffle-icon');
  icon.classList.remove('animate');
  void icon.offsetWidth;
  icon.classList.add('animate');
  shuffle_deck();
}

function getUniqueSuits(r){
   var u = {}, a = [];
   for(var i = 0, l = r.length; i < l; ++i){
      if(u.hasOwnProperty(r[i].charAt(0))) {
         continue;
      }
      a.push(r[i].charAt(0));
      u[r[i].charAt(0)] = 1;
   }
   return a.length;
};
function getUniqueRanks(r){
   var u = {}, a = [];
   for(var i = 0, l = r.length; i < l; ++i){
      if(u.hasOwnProperty(r[i].charAt(1))) {
         continue;
      }
      a.push(r[i].charAt(1));
      u[r[i].charAt(1)] = 1;
   }
   return a.length;
};

function sortval(a,b) { return b[1] - a[1]; }
function sortord(a,b) { return a[2] - b[2]; }

function detect_runs()
{
	var run = new Array()
	var breakdown = new Array()
	var doubleflag
	var c=0

 if( spread.length<52 ){
	for(i=0;i<spread.length;i++)
	{	
		doubleflag=0

		for (y=0;y<run.length;y++)
		{
			if(spread[spread.length-1-run.length].charAt(1) == run[y][0].charAt(1))
			{
				doubleflag++
			}
		}
		run[run.length] = new Array( 
		spread[spread.length-1 - run.length]  , 
		value_of(spread[spread.length-1 - run.length]) + doubleflag*13 , i )
	}
	
	while( run.length > 3)
	{
		breakdown=run.slice()
		breakdown.sort(sortval)

		while (breakdown[0][1] - breakdown[run.length-1][1] > 11 && run.length < 13 && breakdown[0][1] <= 13)
		{

			breakdown[0][1] -= 13
			breakdown.sort(sortval)
		}

		if(breakdown[0][1] - breakdown[run.length-1][1] == run.length-1)
		{ 
			//score_combo[c]= run.length*(20+(run.length-4)*run.length) ///score is now computed in analyze_spread()

			card_combo_chain[c] = new Array()
			breakdown.sort(sortord)

			for (y=0;y<run.length;y++)
			{
				card_combo_chain[c][y] = breakdown[y][0]				
			}
			c++
 
		}
		
		run.pop()
	}
}};


function analyze_spread()
{	
    var runlong=0
	var multi4cards=0

	card_combo_chain.length=0

	detect_runs(); var c=card_combo_chain.length;

	var textOutput_moves = ObjById("pamov").innerHTML;

  if (c)	{  // if run was detected
	runlong = (card_combo_chain[0].length);	

	if ( getUniqueSuits(spread.slice(-runlong)) == 1 ) /// if also a flush
	  {
		score_combo[0]= (runlong*185);
		textOutput_moves = runlong+" Card Straight Flush <br>";	  }
	else{
		score_combo[0]= (runlong*105);
		textOutput_moves = runlong+" Card Straight <br>";	  }
    }
  else 	{	textOutput_moves = ''; }

if (spread.length >= 4){
    if (spread[spread.length-1].charAt(1) == spread[(spread.length-2)].charAt(1) && spread[spread.length-1].charAt(1) == spread[(spread.length-3)].charAt(1))
    {//Four of a Kind
        textOutput_moves += "Four of A Kind <br>"
        score_combo[c] = 950

        card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
        c++
    }
	else if (spread[spread.length-1].charAt(1) == spread[(spread.length-3)].charAt(1) && spread[spread.length-2].charAt(1) == spread[(spread.length-4)].charAt(1))
	{//One-Two One-Two

		textOutput_moves += "One-Two One-Two <br>"

		score_combo[c] = 550

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		multi4cards++; if (multi4cards>1){score_combo[c-1]+=score_combo[c]*1.5;}
		c++
	}
	else if (spread[spread.length-1].charAt(1) == spread[(spread.length-4)].charAt(1))
    	{//Split Pair
    			//Mirror Mirror
    			if (spread[spread.length-2].charAt(1) == spread[(spread.length-3)].charAt(1))
    			  {
    					textOutput_moves += "Mirror Mirror <br>"
    					score_combo[c] = 600
    					multi4cards++;
    			  }
    			//THE SHOCKER
    			else if (spread[spread.length-2].charAt(1) == spread[spread.length-1].charAt(1) || spread[(spread.length-3)].charAt(1)== spread[spread.length-1].charAt(1))
    			  {
    					textOutput_moves += name_of(spread[spread.length-1])+"'s Shocker \u26A1<br>"
    					score_combo[c] = 500
    			  }
    		else {
    		textOutput_moves += "Split Pair <br>"
    		score_combo[c] = 200	}

    		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
    		c++
            multi4cards++; if (multi4cards>1) {score_combo[c-1]+=score_combo[c]*1.5;}
        }
        else if (spread[spread.length-4].charAt(1) == spread[(spread.length-2)].charAt(1) && spread[spread.length-4].charAt(0) == spread[(spread.length-3)].charAt(0) && spread[spread.length-2].charAt(0) == spread[(spread.length-1)].charAt(0))
    	{//Double Date
    		textOutput_moves += "Double Date <br>" ///Brothers & Bitches
    		score_combo[c] = 550

    		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
    		multi4cards++; if (multi4cards>1) {score_combo[c-1]+=score_combo[c]*1.5;}
    		c++
    	}

        else if (spread[spread.length-3].charAt(1) == spread[(spread.length-1)].charAt(1) && spread[spread.length-4].charAt(0) == spread[(spread.length-3)].charAt(0) && spread[spread.length-2].charAt(0) == spread[(spread.length-1)].charAt(0))
    	{//Double Date
    		textOutput_moves += "Double Date <br>" ///Sisters W/ Misters
    		score_combo[c] = 550

    		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
    		multi4cards++; if (multi4cards>1) {score_combo[c-1]+=score_combo[c]*1.5;}
    		c++
    	}
	if (spread[spread.length-1].charAt(0) == spread[(spread.length-4)].charAt(0))
	{ // Split Suits

		textOutput_moves += "Split Suits <br>"
 
		score_combo[c] = 105
		
		card_combo_chain[c] = new Array(spread[spread.length-2],spread[spread.length-3])
		c++

	if (spread[spread.length-1].charAt(0) == spread[(spread.length-2)].charAt(0) && spread[spread.length-1].charAt(0) == spread[(spread.length-3)].charAt(0))
	{//Four Card Flush

		//if ( runlong >= 4) /// if also a straight
		//  {
		//	textOutput_moves += "Four Card Flush/Straight <br>"
		//	score_combo[c] = 600
		//  }

		//else {

		  textOutput_moves += "Four Card Flush <br>"

		  score_combo[c] = 400
		//}

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		multi4cards++; if (multi4cards>1) {score_combo[c-1]+=score_combo[c]*1.5;}
		c++
	}}

    if ( getUniqueSuits(spread.slice(-4)) == 4)
    {//Rainbow
       //if ( spread.length==4 && CARDCOUNT==52){ null; } /// not allowed to win with a rainbow
       //else{

        multi4cards++;
        score_combo[c] = 50*(multi)*multi4cards;
        textOutput_moves += '<span style="color:red;">R</span><span style="color:orange;">a</span><span style="color:yellow;">i</span><span style="color:green;">n</span><span style="color:blue;">b</span><span style="color:indigo;">o</span><span style="color:violet;">w</span><br>'

        card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
        if (multi4cards>1){score_combo[c-1]+=score_combo[c]*1.5;}
        c++

      //}
    }

}

if (spread.length >=3 && spread[spread.length-1].charAt(1) == spread[(spread.length-3)].charAt(1) && spread[spread.length-1].charAt(1) == spread[(spread.length-2)].charAt(1))
	{//Three of a Kind
	
		textOutput_moves += "Three of a Kind <br>"
		score_combo[c] = 775

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3])
		c++

	}

if (spread.length >=2){
	if (spread[spread.length-1].charAt(1) == spread[(spread.length-2)].charAt(1))
	{//Pair

		textOutput_moves += "Pair <br>"
		score_combo[c] = 100

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2])
		c++
	}
}


////////
	
	if (ObjById('pamov').innerHTML!=''){
	  //ObjById('pamov').style.zIndex= CARDCOUNT+53
	  if (window.innerWidth < 1030) {
        ObjById('pamov').style.backgroundColor= document.body.style.backgroundColor
      }
      else{
        ObjById('pamov').style.backgroundColor="transparent";
      }
	}

 	if (multi4cards>1) { textOutput_moves += "<span class='golden-text'>Multi Hand Bonus!!</span><br>" }
 	ObjById("pamov").innerHTML = textOutput_moves;
////////
		


if( CARDCOUNT==52 && spread.length > 2 && card_combo_chain.length == 0 && spread[spread.length-1].charAt(1) == spread[0].charAt(1) )
{ /////alert("Bookend Finish... You Win!!");

		bookendwin=1;

		ObjById(spread[spread.length-1]).style.top = 185;
		ObjById(spread[0]).style.top = 325;
}


if( (CARDCOUNT==52 && spread.length <=4 && card_combo_chain.length == 0) || bookendwin )
{	winflag=1; 
	ObjById('winning').innerHTML = "Winner!!!";
	gamblincash = parseInt(document.getElementById("gamblecash").innerText);

	if(bookendwin){ ObjById('winning').innerHTML = "Push"; PUSHEND=1; ObjById("displaytext").firstChild.nodeValue= "A Bookend Finish!"; }
	else if(spread.length==0){ 
		ObjById("displaytext").firstChild.nodeValue= "!-Deck Breaker-!"; score*=2;
	}
	else if(spread.length==1){ ObjById("displaytext").firstChild.nodeValue= "The Han Solo..."; score*=1.75;
    }
	else if(spread.length==2)
	{
	    winflag=1;
    	ObjById('winning').innerHTML = "Winner!!!";
		if (spread[spread.length-1].charAt(0) == spread[0].charAt(0)){ ObjById("displaytext").firstChild.nodeValue= "The Two Amigos..."; score*=1.5;}
		else { 
			ObjById("displaytext").firstChild.nodeValue= "Two Can Tango...";
			//ObjById('winning').innerHTML = "-Stalemate-";
			//SPLITEND=1;

			//if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }
		}
	}	
	else if(spread.length==3)
	{
	    winflag=1;
	    score*=1.25;
       	ObjById('winning').innerHTML = "Winner!!!";
		if (getUniqueSuits(spread) == 1){ ObjById("displaytext").firstChild.nodeValue= "The Three Musketeers..." ; }

		if (getUniqueSuits(spread) == 2){ 

		   if (spread[spread.length-1].charAt(0) == spread[spread.length-2].charAt(0) || 
			spread[spread.length-2].charAt(0) == spread[spread.length-3].charAt(0)){ // Odd Man Out
			ObjById("displaytext").firstChild.nodeValue= "Odd Ball" ;
			//ObjById('winning').innerHTML = "-Stalemate-";
			//SPLITEND=1;
	  	    }
		   else if (spread[spread.length-1].charAt(0) == spread[spread.length-3].charAt(0)){ // Wingers
			ObjById("displaytext").firstChild.nodeValue= "Wingers" ; 
			//ObjById('winning').innerHTML = "-Stalemate-";
			//SPLITEND=1;

	  	    }
		   //if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }
		 }
        else { 										// Looser... not
            ObjById("displaytext").firstChild.nodeValue= "Pot Luck";
            //ObjById('losing').innerHTML = "-Stalemate-";
            //if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }
        }
	}
	else{
       ObjById('winning').innerHTML = "-Stalemate-";
       SPLITEND=1;
       if(GAMBLIN){
         gamblincash += parseInt(gamblinbet);
       }
       if (getUniqueSuits(spread) == 2){
         if ( (spread[0].charAt(0) == spread[1].charAt(0) && spread[0].charAt(0) == spread[2].charAt(0) ) ||
           (spread[1].charAt(0) == spread[2].charAt(0) && spread[3].charAt(0) == spread[2].charAt(0) ) ){ // Three in a row
             ObjById("displaytext").firstChild.nodeValue= "Ugly Duckling" ;
         }
         else if (spread[spread.length-4].charAt(0) == spread[spread.length-3].charAt(0)){ // Thick Stripes
            ObjById("displaytext").firstChild.nodeValue= "Skid Marked" ;
         }else{ // Thin strips
            ObjById("displaytext").firstChild.nodeValue= "Slasher" ;
         }
       }
       else{ // more then 2 suits
           if (spread[spread.length-1].charAt(0) == spread[spread.length-3].charAt(0) ||
             spread[spread.length-4].charAt(0) == spread[spread.length-2].charAt(0) ){ // Striped
                ObjById("displaytext").firstChild.nodeValue= "Tossed Salad" ;
            }
           else if (spread[spread.length-2].charAt(0) == spread[spread.length-3].charAt(0)){ // In the Middle
            ObjById("displaytext").firstChild.nodeValue= "Bogged Down" ;
            }
           else if (spread[0].charAt(0) == spread[1].charAt(0) || spread[3].charAt(0) == spread[2].charAt(0)){ // On the Side
            ObjById("displaytext").firstChild.nodeValue= "Lopsided" ;
            }
           else{ ObjById("displaytext").firstChild.nodeValue= "Awkward Situation"; }
       }

	}


}


if(CARDCOUNT==52 && card_combo_chain.length == 0 && !winflag)
{
    gamblincash = parseInt(document.getElementById("gamblecash").innerText);
	if (spread.length > 8 ) 	{ ObjById('losing').innerHTML = "<span style='color:#000000;'>&#139;<span style='color:#ffffff;'>&#139;</span>&#139;SKUNKED&#155;<span style='color:#ffffff;'>&#155;</span>&#155;</span>"; }
		else 			{ ObjById('losing').innerHTML = "<span style='color:#ee3322;'>:( Drawn Out ):</span>"; }

	document.getElementById('losing').style.display='block';
 
  if(GAMBLIN){
    gamblingames++
    payout = parseInt(-gamblinbet);
    if (avgpayout !=0){
       avgpayout =(avgpayout+payout)/2;
     }	 else {avgpayout=payout;}
   }

}

if(GAMBLIN && winflag )
{	gamblingames++
	if ( PUSHEND ) { gamblincash += parseInt(gamblinbet);  gamblinpushes++; }
	else if ( SPLITEND ) { gamblinpushes++;
	    if (avgpayout !==0){
          avgpayout =(avgpayout+0)/2;
        }
    }
	else {
	  gamblinwins++;
      payout = parseFloat(score/1000)*gamblinbet;
      if (avgpayout !=0){
         avgpayout =(avgpayout+payout)/2;
      }	 else {avgpayout=payout;}
	  gamblincash += payout;
	  showPayout(payout)
	  // ObjById("displaytext").firstChild.nodeValue += " Payout: " + parseInt(payout);
	}
	ObjById("gamblecash").firstChild.nodeValue=gamblincash.toFixed(2);
}

 if(GAMBLIN && CARDCOUNT==52 )
 {	
	ObjById("gamblegames").firstChild.nodeValue= gamblingames ;
	ObjById("gamblewins").firstChild.nodeValue= gamblinwins ;
	ObjById("gamblepushes").firstChild.nodeValue= gamblinpushes ;
	ObjById("avpay").firstChild.nodeValue= avgpayout.toFixed(2);
	saveGambleStats();
 }
};

function update_stats()
{

	   ObjById("cardsleftindeck").firstChild.nodeValue=deck.length-CARDCOUNT

	   ObjById("cardsleftinspread").firstChild.nodeValue=spread.length

	   ObjById("playerscore").firstChild.nodeValue=parseInt(score)

	if ( winflag ){document.getElementById('winning').style.display='block';}

	if ( multi > 2 ){ObjById('multo').innerHTML = "<span class='golden-text'>"+ multi +"x multiplier</span>";}
	else if ( multi > 1 && card_combo_chain.length ){ObjById('multo').innerHTML = "<span class='golden-text'>"+ multi +"x multiplier</span>";}
	else if ( multi == 1 ){ObjById('multo').innerHTML = '';}
}
 

function refresh_spread()
{
	var leftmar=0
	for (i=0;i<spread.length;i++)
	{
		if(i){
		if ((spread.length-i) < 4) leftmar=leftmar+35
		else leftmar=leftmar + 25-(28*(spread.length-i)/deck.length)
		}

		ObjById(spread[i]).style.left= 250 + leftmar 
		ObjById(spread[i]).style.background="#EDEDED"
	}

	analyze_spread()

	update_stats()
}

function card_click(card)
{
  if ( ObjById('optbox').style.display != 'none' ) { toggleOptbox() }
	if ( in_spread(card) && litcombo >=0)
	{	
		
		var x= litcombo
		spread.removeItems(card_combo_chain[x]);

		for (i = 0; i < card_combo_chain[x].length; i++) {
            let cardId = card_combo_chain[x][i];
            let cardEl = ObjById(cardId);

            pile[pile.length] = cardId;
            flip_card(cardId);

            // Position and stacking
            cardEl.style.zIndex = pile.length;
            cardEl.style.top = (15 + Math.floor(Math.random() * 8) - 4) + "px";
            cardEl.style.left = (550 + Math.floor(Math.random() * 200) - 100) + "px";

            // Random rotation between -26 and +26 degrees
            let rotation = Math.floor(Math.random() * 53) - 26; // -26 to +26
            cardEl.style.transform = `rotate(${rotation}deg)`;
        }


		score += (score_combo[x] * multi)
		if(spread.length==0 && CARDCOUNT > 1 && score_combo[x] > 0){score += 50 * multi} 
		
		if (score_combo[x] > 0) { multi++ }
		litcombo = (-1)
		refresh_spread()

	}
	else if ( in_pile(card) )
	{
		//alert(card+" is in the pile!")
	}

	else if(in_spread(card)<1)  // in deck
	{

  if(GAMBLIN && CARDCOUNT==0) { //start gamblin'
	gamblinbet=ObjById("gamblebet").value;
	gamblincash-=gamblinbet; 
	ObjById("gamblecash").firstChild.nodeValue=parseInt(gamblincash);
   }
		multi = 1

		spread[spread.length]=deck[CARDCOUNT]
		flip_card(deck[CARDCOUNT])
		ObjById(deck[CARDCOUNT]).style.zIndex= CARDCOUNT+52
		ObjById(deck[CARDCOUNT]).style.top = 260 + Math.floor( Math.random() * 8)-4
		CARDCOUNT++
		
		///if (isTouchScreen() && CARDCOUNT==52) { spooftouch( ObjById(pile[pile.length-1]) ); } // to fix error on mobile not yet working

		refresh_spread()
	}
}

function pos_of(card)
{

	for (i=0;i<spread.length;i++)
	{ if (card == spread[i]) return i }
	return (-1)
}

function in_spread(card)
{

	for (i=0;i<spread.length;i++)
	{ if (card == spread[i]) return 1}
	return 0
}
function in_pile(card)
{

	for (i=0;i<pile.length;i++)
	{ if (card == pile[i]) return 1}
	return 0
}

function value_of(card)
{
switch (card.charAt(1))
{
case "A":
  return 1
case "2":
  return 2
case "3":
  return 3
case "4":
  return 4
case "5":
  return 5
case "6":
  return 6
case "7":
  return 7
case "8":
  return 8
case "9":
  return 9
case "0":
  return 10
case "J":
  return 11
case "Q":
  return 12
case "K":
  return 13
}

}

function name_of(card)
{
switch (card.charAt(1))
{
case "A":
  return 'Ace'
case "2":
  return 'Two'
case "3":
  return 'Three'
case "4":
  return 'Four'
case "5":
  return 'Five'
case "6":
  return 'Six'
case "7":
  return 'Seven'
case "8":
  return 'Eight'
case "9":
  return 'Nine'
case "0":
  return 'Ten'
case "J":
  return 'Jack'
case "Q":
  return 'Queen'
case "K":
  return 'King'
}

}

function shuffle_deck()
{
  var i = deck.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = deck[i];
     var tempj = deck[j];
     deck[i] = tempj;
     deck[j] = tempi;
   }	
	reset_deck()

//// SET UP DECK FOR TESTING ////
//const fresh-deck = [
//  "CA","C2","C3","C4","C5","C6","C7","C8","C9","C0","CJ","CQ","CK",
//  "DA","D2","D3","D4","D5","D6","D7","D8","D9","D0","DJ","DQ","DK",
//  "HA","H2","H3","H4","H5","H6","H7","H8","H9","H0","HJ","HQ","HK",
//  "SA","S2","S3","S4","S5","S6","S7","S8","S9","S0","SJ","SQ","SK" ];
/////////////////////////////////
}


function reset_deck()
{
const rotations = ['rotate', 'no-rotate'];
const flips = ['no-flip', 'flip-x'];

	for (i=0;i<52;i++)
	{
	    const card = ObjById(deck[i]);
		card.style.left= (i*.2)+10
		card.style.top=260 - (.2*i)
		card.style.display='block'
		card.style.zIndex= i

		  // Add random rotation and flip to texture
		  card.classList.remove(...rotations, ...flips);
          const rotationClass = rotations[Math.floor(Math.random() * rotations.length)];
          const flipClass = flips[Math.floor(Math.random() * flips.length)];
          card.classList.add(rotationClass, flipClass);

        swap_face_to_back(card);
        card.style.transform = "rotate(0deg)";

        var crd = card.getElementsByTagName("div");
        card.getElementsByTagName("td")[0].style.opacity='0'
		for (x=0;x<crd.length;x++){crd[x].style.display='none'}
	}


////// RESET STATS /////
document.getElementById('winning').style.display='none';
document.getElementById('losing').style.display='none';
//ObjById('gambleBox').style.zIndex=1;
ObjById("displaytext").firstChild.nodeValue=' '; 
ObjById('multo').innerHTML = '';   
ObjById("pamov").innerHTML='';
//ObjById("pdmov").firstChild.nodeValue=' '; // not currently used
hidePayout();

if ( ObjById('optbox').style.display != 'none' ) { toggleOptbox() }

	CARDCOUNT = 0
	pile.length = 0
	spread.length = 0
	score = 0
	multi = 1
	bookendwin = 0
	winflag = 0
	PUSHEND = 0
	SPLITEND = 0
/////////////////////////


	update_stats()
}


function flip_card(card)
{
		var crd = ObjById(card).getElementsByTagName("div")

		if (crd[0].style.display=='none'){
			ObjById(card).style.backgroundImage='none'

			for (x=0;x<crd.length;x++){crd[x].style.display='block'}
			ObjById(card).getElementsByTagName("td")[0].style.opacity='1'
		}
		else {
            var face = ObjById(card);
            swap_face_to_back(face);
			for (x=0;x<crd.length;x++){crd[x].style.display='none'}
			face.getElementsByTagName("td")[0].style.opacity='0'
		}
}

function swap_face_to_back(face){
    face.style.backgroundImage = "url(" + cardBack + ")";
    face.style.backgroundSize = "100%";
    face.style.backgroundPosition = "center";
    face.style.backgroundRepeat = "no-repeat";
    face.style.backgroundColor = "#EDEDED";
}

function show_combo(card)
{	
for (i=0;i<card_combo_chain.length;i++)
{
	if(card_combo_chain[i][0] == card || card_combo_chain[i][card_combo_chain[i].length-1] == card )
	{
		litcombo=i
		for (y=0;y<card_combo_chain[i].length;y++)
		{
			ObjById(card_combo_chain[i][y]).style.background="#00C6FF"

			if(y>3){ 
				ObjById(card_combo_chain[i][y]).style.left = parseInt( ObjById(card_combo_chain[i][y-1]).style.left) -35 
			
			}
		}

	}
	if(litcombo >= 0) {  i=card_combo_chain.length } 
}

}

function no_combo(card)
{
	var leftmar=0
	for (i=0;i<spread.length;i++)
	{
		if(i){
		if ((spread.length-i) < 4) leftmar=leftmar+35
		else leftmar=leftmar + 25-(28*(spread.length-i)/deck.length)
		}

		ObjById(spread[i]).style.left= 250 + leftmar
		ObjById(spread[i]).style.background="#EDEDED"
	}

	litcombo=(-1)

}
///////

function set_deck_color(value) {
	const colors = {
		1: { heart: '#a01609', diamond: '#a01609', spade: '#111111', club: '#111111' },
		2: { heart: '#a01609', diamond: '#0c296d', spade: '#111111', club: '#0c6d19' },
		3: {
			heart: document.getElementById("cusdekcolor1").value,
			diamond: document.getElementById("cusdekcolor2").value,
			spade: document.getElementById("cusdekcolor3").value,
			club: document.getElementById("cusdekcolor4").value,
		}
	};

	const selectedColors = colors[value];
	if (!selectedColors) return;

	for (const suit in selectedColors) {
		const elements = document.querySelectorAll(`.${suit}`);
		elements.forEach(el => el.style.color = selectedColors[suit]);
	}
}
 
function set_table_color(value)
{
	document.body.style.backgroundColor = value

	const { highlight, shadow } = generateHighlightShadow(value);
      document.documentElement.style.setProperty('--table-color-base', value);
      document.documentElement.style.setProperty('--table-color-highlight', highlight);
      document.documentElement.style.setProperty('--table-color-shadow', shadow);

    setMidsDarks(value);
    adjustTextContrast(value, shadow);

};
/////////////////////////
function ObjById( id ) 
{ 
    if (document.getElementById) 
        var returnVar = document.getElementById(id); 
    else if (document.all) 
        var returnVar = document.all[id]; 
    else if (document.layers) 
        var returnVar = document.layers[id]; 
    return returnVar; 
} 

Array.prototype.removeItems = function(itemsToRemove) {

    if (!/Array/.test(itemsToRemove.constructor)) {
        itemsToRemove = [ itemsToRemove ];
    }

    var j;
    for (var i = 0; i < itemsToRemove.length; i++) {
        j = 0;
        while (j < this.length) {
            if (this[j] == itemsToRemove[i]) {
                this.splice(j, 1);
            } else {
                j++;
            }
        }
    }
}


//////

function spooftouch(targetElement){
	/// targetElement = document.elementFromPoint(655, 20);
    
    var evt = document.createEvent('TouchEvent');
    evt.initTouchEvent('touchstart', true, true);

     targetElement.dispatchEvent(evt);
}

function isTouchScreen( ){
	if(typeof window.orientation !== 'undefined'){ return(true);}
	return (false);
}

function set_new_deck_back(){
  for (i=0;i<52;i++){
      var crd = ObjById(deck[i]).getElementsByTagName("div")
      if (crd[0].style.display=='none'){
        swap_face_to_back(ObjById(deck[i]));
      }
  }
}

function toggleOptbox() {
  const box = document.getElementById('optbox');
  if (box.classList.contains('show')) {
    box.classList.remove('show');
    setTimeout(() => {
      box.style.display = 'none';
    }, 400); // match transition
  } else {
    box.style.display = 'block';
    setTimeout(() => {
      box.classList.add('show');
      //box.style.zIndex= CARDCOUNT+53; // keep ontop of gambleBox
    }, 10); // small delay allows transition to trigger
  }
}


/////// GAMBLIN
function gamble_toggle(){
  if(GAMBLIN === 'false'){
    GAMBLIN = true;
    document.getElementById('gambleBox').style.display = 'block';
    document.getElementById('gamblin-opts').style.display = 'block';
  }else{
    GAMBLIN = false;
    document.getElementById('gambleBox').style.display = 'none';
    document.getElementById('gamblin-opts').style.display = 'none';
  }
}
function loadGambleStats() {
 const defaults = {
   gamblecash: 100,
   gamblegames: 0,
   gamblewins: 0,
   gamblepushes: 0,
   avpay: 0
 };

 for (const key in defaults) {
   const val = localStorage.getItem(key);
   document.getElementById(key).innerText = val !== null ? val : defaults[key];
 }

 gamblincash=parseInt(document.getElementById("gamblecash").innerText);
 gamblingames=parseInt(document.getElementById("gamblegames").innerText);
 gamblinwins=parseInt(document.getElementById("gamblewins").innerText);
 gamblinpushes=parseInt(document.getElementById("gamblepushes").innerText);
 avgpayout=parseFloat(document.getElementById("avpay").innerText);
}

function saveGambleStats() {
  const keys = ['gamblecash', 'gamblegames', 'gamblewins', 'gamblepushes', 'avpay'];
  keys.forEach(id => {
    localStorage.setItem(id, document.getElementById(id).innerText);
  });
}

function showPayout(amount) {
  const box = document.getElementById("payoutBox");
  const value = document.getElementById("payoutAmount");
  value.textContent = amount.toFixed(2);
  box.style.display = "block";
}

function hidePayout() {
  const box = document.getElementById("payoutBox");
  box.style.display = "none";
}

///////// Responsive Gambling
function wrapElements(elements, wrapperClass) {
  if (!elements.length) return null;

  const wrapper = document.createElement('div');
  wrapper.className = wrapperClass;
  const parent = elements[0].parentNode;
  parent.insertBefore(wrapper, elements[0]);

  elements.forEach(el => wrapper.appendChild(el));
  return wrapper;
}



function unwrapElements(wrapperClass) {
  const wrapper = document.querySelector(`.${wrapperClass}`);
  if (!wrapper) return;

  const parent = wrapper.parentNode;
  while (wrapper.firstChild) {
    parent.insertBefore(wrapper.firstChild, wrapper);
  }
  parent.removeChild(wrapper);
}





/////// Color Transfomation
function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }

  return [h, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c/2;
  let r=0, g=0, b=0;

  if (0 <= h && h < 60)      [r, g, b] = [c, x, 0];
  else if (h < 120)          [r, g, b] = [x, c, 0];
  else if (h < 180)          [r, g, b] = [0, c, x];
  else if (h < 240)          [r, g, b] = [0, x, c];
  else if (h < 300)          [r, g, b] = [x, 0, c];
  else                       [r, g, b] = [c, 0, x];

  const toHex = x => {
    const hex = Math.round((x + m) * 255).toString(16).padStart(2, '0');
    return hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Base, highlight, and shadow color references
const base = hexToHSL("#006200");
const highlight = hexToHSL("#3cb371");
const shadow = hexToHSL("#1e482f");

// Delta calculation
const deltaHighlight = [
  highlight[0] - base[0],
  highlight[1] - base[1],
  highlight[2] - base[2],
];

const deltaShadow = [
  shadow[0] - base[0],
  shadow[1] - base[1],
  shadow[2] - base[2],
];

// Apply delta to any input hex color
function generateHighlightShadow(hex) {
  let [h, s, l] = hexToHSL(hex);

  let hl = [
    (h + deltaHighlight[0] + 360) % 360,
    Math.min(Math.max(s + deltaHighlight[1], 0), 100),
    Math.min(Math.max(l + deltaHighlight[2], 0), 100)
  ];

  let sh = [
    (h + deltaShadow[0] + 360) % 360,
    Math.min(Math.max(s + deltaShadow[1], 0), 100),
    Math.min(Math.max(l + deltaShadow[2], 0), 100)
  ];

  return {
    highlight: tuneBrightness(hex, hslToHex(...hl)),
    shadow: hslToHex(...sh)
  };
}

function adjustWhiteText(){
   whiteText = getComputedStyle(ObjById('shuffle-button')).color.toLowerCase();
 //  if (whiteText === "rgb(255, 255, 255)" || whiteText === '#ffffff') {
   //  whiteText = blendTowards(hexToRgb('#ffffff'),hexToRgb('#008800'), whiteBalanceSlider.value*1.5 );
   //  whiteText = blendTowards(whiteText,hexToRgb('#000000'), whiteBalanceSlider.value/1*whiteBalanceSlider.value );
    ObjById('shuffle-button').style.color = valueToColor(whiteBalanceSlider.value);
  // }

}

function adjustTextContrast(baseHex, shadowHex ){
   var returnedHex = tuneBrightness('#000', baseHex);
   if(returnedHex != baseHex){
      ObjById('shuffle-button').style.color = returnedHex;
   }
   returnedHex = tuneBrightness('#111', shadowHex);
   if(returnedHex != shadowHex){  document.documentElement.style.setProperty('--table-color-shadow', returnedHex); }

  whiteText = getComputedStyle(ObjById('shuffle-button')).color.toLowerCase();;
  if (whiteText === "rgb(255, 255, 255)" || whiteText === '#ffffff') {
    whiteText = blendTowards(hexToRgb('#ffffff'),hexToRgb('#000000'), whiteBalanceSlider.value*1.5 );
    ObjById('shuffle-button').style.color = rgbToHex(whiteText);
  }
}

function valueToColor(val) {
  // Clamp between 0 and 0.48
  val = Math.max(0, Math.min(val, 0.48));

    let rgb;
    const mid = 0.44;        // Midpoint
    const darkGrey = 136;     // Dark grey midpoint

    if (val <= mid) {
      // White to dark grey
      const t = val / mid;
      const shade = Math.round(255 - t * (255 - darkGrey));
      rgb = `rgb(${shade}, ${shade}, ${shade})`;
    } else {
      // Dark grey to black
      const t = (val - mid) / (0.48 - mid);
      const shade = Math.round(darkGrey - t * darkGrey);
      rgb = `rgb(${shade}, ${shade}, ${shade})`;
    }

  return rgb;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => {
    const hex = Math.max(0, Math.min(255, Math.round(v))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function getBrightness({ r, g, b }) {
  // Standard luminance formula
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Adjusts the highlight if it's too bright by returning a darker color closer to the base.
function tuneBrightness(baseHex, highlightHex) {
  const baseRGB = hexToRgb(baseHex);
  const hlRGB = hexToRgb(highlightHex);
  const brightness = getBrightness(hlRGB);

  const threshold = 252; // Near-white threshold

  if (brightness >= threshold) {
    // Blend with base color to darken it
    const tuned = {
      r: (baseRGB.r + hlRGB.r) / 2,
      g: (baseRGB.g + hlRGB.g) / 2,
      b: (baseRGB.b + hlRGB.b) / 2
    };
    return rgbToHex(tuned);
  }

  return highlightHex; // Return original if not too bright
}

function blendTowards(rgb, target, factor) {
  return {
    r: rgb.r + (target.r - rgb.r) * factor,
    g: rgb.g + (target.g - rgb.g) * factor,
    b: rgb.b + (target.b - rgb.b) * factor
  };
}

function setMidsDarks(baseHex) {
  const baseRGB = hexToRgb(baseHex);
  const white = { r: 230, g: 230, b: 230 };
  const black = { r: 0, g: 0, b: 0 };

  var midHighlight  = getComputedStyle(document.documentElement).getPropertyValue('--table-color-highlight').trim();
  midHighlight = blendTowards(hexToRgb(midHighlight), baseRGB, 0.6);
  const darkShadow    = blendTowards(baseRGB, black, 0.6);  // Very dark

  document.documentElement.style.setProperty('--table-color-mid-highlight', rgbToHex(midHighlight));
  document.documentElement.style.setProperty('--table-color-dark-shadow', rgbToHex(darkShadow));
}
