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
var gamblinbet=20
var gamblingames=0
var gamblinwins=0
var gamblinpushes=0
var avgpayout=0

var card_combo_chain = new Array()
var score_combo = new Array()

var spread = new Array()
var pile = new Array()
var deck = new Array( "HA","H2","H3","H4","H5","H6","H7","H8","H9","H0","HJ","HQ","HK",
			"SA","S2","S3","S4","S5","S6","S7","S8","S9","S0","SJ","SQ","SK",
			"DA","D2","D3","D4","D5","D6","D7","D8","D9","D0","DJ","DQ","DK",
			"CA","C2","C3","C4","C5","C6","C7","C8","C9","C0","CJ","CQ","CK"	)


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

  if (c)	{  // if run was detected
	runlong = (card_combo_chain[0].length);	

	if ( getUniqueSuits(spread.slice(-runlong)) == 1 ) /// if also a flush
	  {
		score_combo[0]= (runlong*77);
		ObjById("pamov").innerHTML = runlong+" Card Straight Flush <br>";	  }
	else{
		score_combo[0]= (runlong*31);
		ObjById("pamov").innerHTML = runlong+" Card Straight <br>";	  }
    }
  else 	{	ObjById("pamov").innerHTML = ''; }

if (spread.length >= 4){

	if (spread[spread.length-1].charAt(1) == spread[(spread.length-3)].charAt(1) && spread[spread.length-2].charAt(1) == spread[(spread.length-4)].charAt(1))
	{//One-Two One-Two

		ObjById("pamov").innerHTML+= "One-Two One-Two <br>"

		score_combo[c] = 113

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		c++
		multi4cards++; if (multi4cards>1) {score_combo[c-1]*=1.75;}

	}
	if (spread[spread.length-1].charAt(0) == spread[(spread.length-4)].charAt(0))
	{ // Split Suits

		ObjById("pamov").innerHTML+= "Split Suits <br>" 
 
		score_combo[c] = 57
		
		card_combo_chain[c] = new Array(spread[spread.length-2],spread[spread.length-3])
		c++

	if (spread[spread.length-1].charAt(0) == spread[(spread.length-2)].charAt(0) && spread[spread.length-1].charAt(0) == spread[(spread.length-3)].charAt(0))
	{//Four Card Flush

		if ( runlong >= 4) /// if also a straight
		  {
			ObjById("pamov").innerHTML+= "Four Card Flush/Straight <br>"
			score_combo[c] = 305		
		  }

		else {

		  ObjById("pamov").innerHTML+= "Four Card Flush <br>" 

		  score_combo[c] = 177
		}

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		c++
		multi4cards++; if (multi4cards>1) {score_combo[c-1]*=1.75;}
	}}
	else if (spread[spread.length-1].charAt(1) == spread[(spread.length-4)].charAt(1))
	{//Split Pair
			//Mirror Mirror
			if (spread[spread.length-2].charAt(1) == spread[(spread.length-3)].charAt(1))
			  {
					ObjById("pamov").innerHTML+= "Mirror Mirror <br>"
					score_combo[c] = 191
			  }
			//THE SHOCKER
			else if (spread[spread.length-2].charAt(1) == spread[spread.length-1].charAt(1) || spread[(spread.length-3)].charAt(1)== spread[spread.length-1].charAt(1))
			  {
					ObjById("pamov").innerHTML+= name_of(spread[spread.length-1])+"'s Shocker \u26A1<br>"
					score_combo[c] = 183
			  }
		else {
		ObjById("pamov").innerHTML+= "Split Pair <br>"
		score_combo[c] = 136	}

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		c++

	if (spread[spread.length-1].charAt(1) == spread[(spread.length-2)].charAt(1) && spread[spread.length-1].charAt(1) == spread[(spread.length-3)].charAt(1))
	{//Four of a Kind

		ObjById("pamov").innerHTML+= "Four of A Kind <br>"

		score_combo[c] = 451

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		c++
	}}
				
	else if ( getUniqueSuits(spread.slice(-4)) == 4  && getUniqueRanks(spread.slice(-4)) == 4 && c==0)
	{//Rainbow
	   if ( spread.length==4 && CARDCOUNT==52){ null; } /// not allowed to win with a rainbow
	   else{
		score_combo[c] = -250/(multi)
		ObjById("pamov").innerHTML+= "<span style='color:red;'>Rainbow -250</span> <br>"
		
		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		c++
		multi4cards++

	  }
	}
else if (spread[spread.length-4].charAt(1) == spread[(spread.length-2)].charAt(1) && spread[spread.length-4].charAt(0) == spread[(spread.length-3)].charAt(0) && spread[spread.length-2].charAt(0) == spread[(spread.length-1)].charAt(0))
	{//Double Date
		ObjById("pamov").innerHTML+= "Double Date <br>" ///Brothers & Bitches
		score_combo[c] = 183

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		c++
		multi4cards++; if (multi4cards>1) {score_combo[c-1]*=1.75;}
	}

else if (spread[spread.length-3].charAt(1) == spread[(spread.length-1)].charAt(1) && spread[spread.length-4].charAt(0) == spread[(spread.length-3)].charAt(0) && spread[spread.length-2].charAt(0) == spread[(spread.length-1)].charAt(0))
	{//Double Date
		ObjById("pamov").innerHTML+= "Double Date <br>" ///Sisters W/ Misters 
		score_combo[c] = 183

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3],spread[spread.length-4])
		c++
		multi4cards++; if (multi4cards>1) {score_combo[c-1]*=1.75;}
	}

}

if (spread.length >=3 && spread[spread.length-1].charAt(1) == spread[(spread.length-3)].charAt(1) && spread[spread.length-1].charAt(1) == spread[(spread.length-2)].charAt(1))
	{//Three of a Kind
	
		ObjById("pamov").innerHTML+= "Three of a Kind <br>"
		score_combo[c] = 275

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2],spread[spread.length-3])
		c++

	}

if (spread.length >=2){
	if (spread[spread.length-1].charAt(1) == spread[(spread.length-2)].charAt(1))
	{//Pair

		ObjById("pamov").innerHTML+= "Pair <br>"
		score_combo[c] = 73

		card_combo_chain[c] = new Array(spread[spread.length-1],spread[spread.length-2])
		c++

	}


}

////////
	
	if (ObjById('pamov').innerHTML!='')ObjById('pamov').style.zIndex= CARDCOUNT+53
	  else { ObjById("pamov").style.zIndex=0 }
	ObjById('pamov').style.backgroundColor= document.body.style.backgroundColor

	ObjById('gamblemode').style.zIndex= CARDCOUNT+53

 	if (multi4cards>1) { ObjById("pamov").innerHTML+= "Multi Hand Bonus!! <br>" }
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

	if(bookendwin){ ObjById('winning').innerHTML = "Push"; PUSHEND=1; ObjById("displaytext").firstChild.nodeValue= "A Bookend Finish!"; }
	else if(spread.length==0){ 
		ObjById("displaytext").firstChild.nodeValue= "A Perfect Natural!"; score*=2;
	}
	else if(spread.length==1){ ObjById("displaytext").firstChild.nodeValue= "The Han Solo..."; score*=1.5;
}
	else if(spread.length==2)
	{ 
		if (spread[spread.length-1].charAt(0) == spread[0].charAt(0)){ ObjById("displaytext").firstChild.nodeValue= "The Two Amigos..."; score*=1.25;}	
		else { 
			ObjById("displaytext").firstChild.nodeValue= "Two Can't Tango..."; 
			ObjById('winning').innerHTML = "-Split-"; 
			SPLITEND=1;

			if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }
		}
	}	
	else if(spread.length==3)
	{ 
		if (getUniqueSuits(spread) == 1){ ObjById("displaytext").firstChild.nodeValue= "The Three Musketeers..." ; score*=1.25;}

		if (getUniqueSuits(spread) == 2){ 

		   if (spread[spread.length-1].charAt(0) == spread[spread.length-2].charAt(0) || 
			spread[spread.length-2].charAt(0) == spread[spread.length-3].charAt(0)){ // Odd Man Out
			ObjById("displaytext").firstChild.nodeValue= "Odd Man Out" ; 
			ObjById('winning').innerHTML = "-Split-"; 
			SPLITEND=1;

	  	    }
		   else if (spread[spread.length-1].charAt(0) == spread[spread.length-3].charAt(0)){ // Wingers

			ObjById("displaytext").firstChild.nodeValue= "Wingers" ; 
			ObjById('winning').innerHTML = "-Split-"; 
			SPLITEND=1;

	  	    }

		   if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }	
		 }
			else { 										// Looser
				ObjById("displaytext").firstChild.nodeValue= "Three's a Crowd..."; 
				ObjById('losing').innerHTML = "Try Again"; winflag=0;
			      }
	}
	else{ 

		   if ( (spread[0].charAt(0) == spread[1].charAt(0) && spread[0].charAt(0) == spread[2].charAt(0) ) || 
			(spread[1].charAt(0) == spread[2].charAt(0) && spread[3].charAt(0) == spread[2].charAt(0) ) ){ // Three in a row

			ObjById("displaytext").firstChild.nodeValue= "Odd Man Out" ; 
			ObjById('winning').innerHTML = "-Split-"; 
			SPLITEND=1;

			if(GAMBLIN){ gamblincash += parseInt(gamblinbet*.75); }
		    }
		   else if (spread[spread.length-1].charAt(0) == spread[spread.length-3].charAt(0) ||
			    spread[spread.length-4].charAt(0) == spread[spread.length-2].charAt(0) ){ // Striped

			ObjById("displaytext").firstChild.nodeValue= "Stripes and Bars" ; 
			ObjById('winning').innerHTML = "-Split-"; 
			SPLITEND=1;

		  	if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }

	  	    }
		   else if (spread[spread.length-2].charAt(0) == spread[spread.length-3].charAt(0)){ // In the Middle

			ObjById("displaytext").firstChild.nodeValue= "In the Middle" ; 
			ObjById('winning').innerHTML = "-Split-";
			SPLITEND=1; 

		  	if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }

	  	    }
		   else if (spread[0].charAt(0) == spread[1].charAt(0) || spread[3].charAt(0) == spread[2].charAt(0)){ // On the Side
			ObjById("displaytext").firstChild.nodeValue= "A Little on the Side" ; 
			ObjById('winning').innerHTML = "-Split-";
			SPLITEND=1; 

		  	if(GAMBLIN){ gamblincash += parseInt(gamblinbet/2); }

	  	    }
				

		else{ ObjById("displaytext").firstChild.nodeValue= "Four's Company!"; ObjById('losing').innerHTML = "Try Again"; winflag=0; }


	}
}


if(CARDCOUNT==52 && card_combo_chain.length == 0 && !winflag)
{

	if (spread.length > 8 ) 	{ ObjById('losing').innerHTML = "<span style='color:#000000;'>&#139;<span style='color:#ffffff;'>&#139;</span>&#139;SKUNKED&#155;<span style='color:#ffffff;'>&#155;</span>&#155;</span>"; }
		else 			{ ObjById('losing').innerHTML = "<span style='color:#ee3322;'>:( Game Over ):</span>"; }


	document.getElementById('losing').style.display='block';
 
  if(GAMBLIN){gamblingames++}

}

if(GAMBLIN && winflag )
{	gamblingames++
	if ( PUSHEND ) { gamblincash += parseInt(gamblinbet);  gamblinpushes++; }
	else if ( SPLITEND ) { gamblinpushes++; }
	else { 	gamblinwins++; 
		  if (avgpayout >0){
		     avgpayout =(avgpayout+parseFloat(score/1000))/2;
		   }	 else {avgpayout=parseFloat(score/1000);}
	        gamblincash += gamblinbet*(parseFloat(score)/1000);  
		ObjById("displaytext").firstChild.nodeValue+=" Payout: "+parseInt( gamblinbet*( parseFloat(score)/1000) ); 
	  }

	ObjById("gamblecash").firstChild.nodeValue=parseInt(gamblincash);
 
}
 if(GAMBLIN && CARDCOUNT==52 )
 {	
	ObjById("gamblegames").firstChild.nodeValue= gamblingames ;
	ObjById("gamblewins").firstChild.nodeValue= gamblinwins ;
	ObjById("gamblepushes").firstChild.nodeValue= gamblinpushes ;
	ObjById("avpay").firstChild.nodeValue= avgpayout.toFixed(2);
 }
};

function update_stats()
{

	   ObjById("cardsleftindeck").firstChild.nodeValue=deck.length-CARDCOUNT

	   ObjById("cardsleftinspread").firstChild.nodeValue=spread.length

	   ObjById("playerscore").firstChild.nodeValue=parseInt(score)

	if ( winflag ){document.getElementById('winning').style.display='block';}

	if ( multi > 2 ){ObjById('multo').innerHTML = multi +"x multiplier";}
	else if ( multi > 1 && card_combo_chain.length ){ObjById('multo').innerHTML = multi +"x multiplier";}
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
  if ( ObjById('optbox').style.display != 'none' ) { ObjById('optbox').style.display = 'none' }
	if ( in_spread(card) && litcombo >=0)
	{	
		
		var x= litcombo
		spread.removeItems(card_combo_chain[x]);

		for (i=0;i<card_combo_chain[x].length;i++)
		{
		pile[pile.length]=card_combo_chain[x][i] 
		flip_card(card_combo_chain[x][i])
		ObjById(card_combo_chain[x][i]).style.zIndex= pile.length
		ObjById(card_combo_chain[x][i]).style.top = 15 + Math.floor( Math.random() * 8)-4
		ObjById(card_combo_chain[x][i]).style.left = 550 + Math.floor( Math.random() * 200)-100
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
//deck = [ "HA","CA","H2","SA","H3","H4","H5","H6","H7","H8","H9","H0","HJ","HQ","HK","S2","S3","S4","S5","S6","S7","S8","S9","S0","SJ","SQ","SK",
//	"DA","D2","D3","D4","D5","D6","D7","D8","D9","D0","DJ","DQ","DK","C2","C3","C4","C5","C6","C7","C8","C9","C0","CJ","CQ","CK"	]
/////////////////////////////////
}


function reset_deck()
{
	for (i=0;i<52;i++)
	{
		ObjById(deck[i]).style.left= (i*.2)+10
		ObjById(deck[i]).style.top=260 - (.2*i)
		ObjById(deck[i]).style.display='block'
		ObjById(deck[i]).style.zIndex= i

		var crd = ObjById(deck[i]).getElementsByTagName("div");
		ObjById(deck[i]).style.backgroundImage="url('back.jpg')"

ObjById(deck[i]).getElementsByTagName("td")[0].style.opacity='0'

		for (x=0;x<crd.length;x++){crd[x].style.display='none'}
	}


////// RESET STATS /////
document.getElementById('winning').style.display='none';
document.getElementById('losing').style.display='none';
ObjById('gamblemode').style.zIndex=1;  
ObjById("displaytext").firstChild.nodeValue=' '; 
ObjById('multo').innerHTML = '';   
ObjById("pamov").innerHTML=' '; 
//ObjById("pdmov").firstChild.nodeValue=' '; // not currently used

if ( ObjById('optbox').style.display != 'none' ) { ObjById('optbox').style.display = 'none' }

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
			ObjById(card).style.background="#EDEDED"
			ObjById(card).style.backgroundImage="url('back.jpg')"
			for (x=0;x<crd.length;x++){crd[x].style.display='none'}
			ObjById(card).getElementsByTagName("td")[0].style.opacity='0'
		}
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
function cssrules(){
  var rules={}; var ds=document.styleSheets,dsl=ds.length;
  for (var i=0;i<dsl;++i){
    var dsi=ds[i].cssRules,dsil=dsi.length;
    for (var j=0;j<dsil;++j) rules[dsi[j].selectorText]=dsi[j];
  }
  return rules;
};
function css_getclass(name,createifnotfound){
  var rules=cssrules();
  //if (!rules.hasOwnProperty(name)) throw 'todo:deal_with_notfound_case';
  return rules[name];
};
function set_deck_color(value)
{
	
if (value == 1){ //red and black
	css_getclass('.heart').style.color='a01609';
	css_getclass('.diamond').style.color='a01609';
	css_getclass('.spade').style.color='111111';
	css_getclass('.club').style.color='111111';
}

if (value == 2){ //red, black, blue & green
	css_getclass('.heart').style.color='a01609';
	css_getclass('.diamond').style.color='0c296d';
	css_getclass('.spade').style.color='111111';
	css_getclass('.club').style.color='0c6d19';
}

if (value == 3){ // CUSTOM  
	css_getclass('.heart').style.color= ObjById("cusdekcolor1").value;
	css_getclass('.diamond').style.color= ObjById("cusdekcolor2").value;
	css_getclass('.spade').style.color= ObjById("cusdekcolor3").value;
	css_getclass('.club').style.color= ObjById("cusdekcolor4").value;
}
};
function set_table_color(value)
{
	document.body.style.backgroundColor = value
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
