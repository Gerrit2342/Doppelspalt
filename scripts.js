var currentLaser = "laser1";


class Laser {
  constructor(lenght,active) {
    this._wavelenght = lenght;
    this._active = active;
  }

  get color () {
    return wavelenghtToColor(this._wavelenght);
  }

  get active () {
    return this._active;
  }

/*set thewavelenght (wave) {
    this._wavelenght = wave;
  }

  get thewavelenght () {
    return this._wavelenght;
  }*/
}

function wavelenghtToColor (lenght) { // http://scienceprimer.com/javascript-code-convert-light-wavelength-color

  var r,
      g,
      b,
      alpha,
      colorSpace,
      wl = lenght,
      gamma = 1;


  if (wl >= 380 && wl < 440) {
      R = -1 * (wl - 440) / (440 - 380);
      G = 0;
      B = 1;
 } else if (wl >= 440 && wl < 490) {
     R = 0;
     G = (wl - 440) / (490 - 440);
     B = 1;
  } else if (wl >= 490 && wl < 510) {
      R = 0;
      G = 1;
      B = -1 * (wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
      R = (wl - 510) / (580 - 510);
      G = 1;
      B = 0;
  } else if (wl >= 580 && wl < 645) {
      R = 1;
      G = -1 * (wl - 645) / (645 - 580);
      B = 0.0;
  } else if (wl >= 645 && wl <= 780) {
      R = 1;
      G = 0;
      B = 0;
  } else {
      R = 0;
      G = 0;
      B = 0;
  }

  // intensty is lower at the edges of the visible spectrum.
  if (wl > 780 || wl < 380) {
      alpha = 0;
  } else if (wl > 700) {
      alpha = (780 - wl) / (780 - 700);
  } else if (wl < 420) {
      alpha = (wl - 380) / (420 - 380);
  } else {
      alpha = 1;
  }

  colorSpace = "rgba(" + (R * 100) + "%," + (G * 100) + "%," + (B * 100) + "%, " + alpha + ")"

  // colorSpace is an array with 5 elements.
  // The first element is the complete code as a string.
  // Use colorSpace[0] as is to display the desired color.
  // use the last four elements alone or together to access each of the individual r, g, b and a channels.

  return colorSpace;

}

var laserArray = new Array;


var board;
var ctx;
var gradient;

var i = 0;
var timerId;
var screenMiddle;


var doppelspaltY = 460	; //270 = 5 m
var spaltmitte1 = 227;
var spaltmitte2 = spaltmitte1 + 40;

function setWavelenght(wavelenght) {

   document.getElementById("wavelenghtOutput").innerHTML = wavelenght.value +" nm"; //Text wird auf Value gesetzt

   var laserGroup = document.getElementById("laserSelect"); //Welcher Laser ist ausgewählt
   var laser = laserGroup.options[laserGroup.selectedIndex].value;

   wl = parseInt(wavelenght.value);

   if (laser == "laser1") {
     laserArray[0]._wavelenght = wl; // Update Wellenlänge
     setFieldsetBorderColor(1); // Setzte Rahmenfarbe auf Wert
   }

   if (laser == "laser2") {
     laserArray[1]._wavelenght = wl; // Update Wellenlänge
     setFieldsetBorderColor(2);

   }

   if (laser == "laser3") {
     laserArray[2]._wavelenght = wl; // Update Wellenlänge
     setFieldsetBorderColor(3);

   }



}

function setFieldsetBorderColor (laserSelect) {

  if (laserSelect == 1) {

    document.getElementById("laser1Fieldset").style.borderColor = laserArray[0].color;

  }

  if (laserSelect == 2) {

    document.getElementById("laser2Fieldset").style.borderColor = laserArray[1].color;

  }

  if (laserSelect == 3) {

    document.getElementById("laser3Fieldset").style.borderColor = laserArray[2].color;

  }


}

function setGapwidth(gapwidth) {
   document.getElementById("gapwidthOutput").innerHTML = gapwidth.value +" nm";
}

function setDistance(distance) {
   document.getElementById("distanceOutput").innerHTML = distance.value/100 +" m";

   moveScreen(distance);

}

function setTime(slider) {
   document.getElementById("timeOutput").innerHTML = slider.value; //Setzt Text auf Slider Value


   if (slider.value > 0) //Startet neue Animation wenn Zeit größer 0
   {
     stopAnimationWavelines();  //Stoppt aktuelle Animation
	 time = 10-slider.value;
	 startAnimationWavelines(time); //Startet eine neue Animation mit neuem Intervall

   }

   else {

   stopAnimationWavelines();  //Stoppt aktuelle Animation

   }
}

function openIntensityWindow(time) {
}



//-------------------------Doppelspalt Animation im Canvas---------------------------------------//
function initializeBoard () { // Initialisiere Board

initializeCanvas();
initializeLasers();
timerId = setInterval(drawMaxima, 1000/60);

}


function initializeCanvas() { // Initialisiert Canvas mit Doppelspalt und Schirm

board = document.getElementById("canvasDoppelspalt")
ctx = board.getContext("2d");

gradient = ctx.createLinearGradient(0,0,0,170);
gradient.addColorStop("0","white");
gradient.addColorStop("1","black");

ctx.beginPath();
// Schirm
ctx.moveTo(50, 225); // Unten links
ctx.lineTo(44, 175); // nach oben links
ctx.lineTo(450, 175); // Nach rechts
ctx.lineTo(444, 225); // Nach unten rechts
ctx.lineTo(50, 225); // Zum Start
ctx.stroke();


// Doppelspalt
ctx.beginPath();
ctx.fillStyle = "rgba(122, 122, 122, 0.5)";


ctx.rect(132,doppelspaltY,90,20);
ctx.rect(232,doppelspaltY,30,20);
ctx.rect(272,doppelspaltY,90,20);
ctx.fill();

ctx.beginPath();
ctx.moveTo(132, doppelspaltY+20); // Zum Perpesktivenverzerren links
ctx.lineTo(128, doppelspaltY);
ctx.lineTo(132, doppelspaltY);

ctx.moveTo(362, doppelspaltY+20); // Zum Perpesktivenverzerren rechts
ctx.lineTo(366, doppelspaltY);
ctx.lineTo(362, doppelspaltY);
ctx.fill();


//drawWaves ();


//startAnimationWavelines(3);

}

function initializeLasers () { // Initialisiert Laser

  var laser1 = new Laser(560,true);
  var laser2 = new Laser(560,false);
  var laser3 = new Laser(560,false);

  laserArray.push(laser1);
  laserArray.push(laser2);
  laserArray.push(laser3);

}

function moveScreen(distance) { // 1m = 34 punkte

  var Y = 1/(distance.value/100)*450;

  ctx.clearRect(0, 0, board.width, 451);
  ctx.beginPath();

  ctx.moveTo(50, Y); // Schirm
  ctx.lineTo(44, Y-50);
  ctx.lineTo(450, Y-50);
  ctx.lineTo(444, Y);
  ctx.lineTo(50, Y);
  ctx.stroke();

  screenMiddle = Y; // Updatet Y koordinate des Bildschirms

}

/*function drawWaves () {

	ctx.beginPath();
	ctx.arc(spaltmitte1,doppelspaltY,10,1*Math.PI,2*Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(spaltmitte2,doppelspaltY,10,1*Math.PI,2*Math.PI);
	ctx.stroke();
}*/

function drawMaxima () {
  var acLaser = [], wavLasers = [];

  acLaser = getActiveLasers(); // Holt sich angeschaltete Laser

  for (var i = 0; i < acLaser.length; i++) { // Iteriert durch akitve Laser
    if (acLaser[i]) { // Wenn Laser aktiv
      ctx.strokeStyle = laserArray[i].color;
      ctx.lineWidth = 5;
      // Erst einmal das nullte Maximum zeichnen
      ctx.beginPath();
      ctx.moveTo(247, screenMiddle); // Unten links
      ctx.lineTo(247, screenMiddle-50); // Unten links
      ctx.stroke();
      ctx.closePath();
      
      ctx.lineWidth = 1;  // Resetten weil sonst Alles in dem Stil
      ctx.strokeStyle = "#000000";

    }

  }

  //x=l*d*k/g ; // Zeichnet die Maxima guckt wie viele auf den Schirm passen und zeichnet nur die


}

function drawOnScreen (wl) {



}

function getActiveLasers () {

  var activeLasers = [];

  for (var i = 0; i < laserArray.length; i++) {

      if (laserArray[i].active) {
        activeLasers[i] = true;
      }

      else {
        activeLasers[i] = false;
      }
  }

  return activeLasers;

}

function getWavelenghtLasers () {

  var wavelenghtLasers = [];

  for (var i = 0; i < laserArray.length; i++) {

    wavelenghtLasers[i]=laserArray[i]._wavelenght;
  }

  return wavelenghtLasers;

}





function drawMovingWavelines() { // Bewegte Wellen werden von unten nach oben gezeichnet


	ctx.beginPath();
	ctx.moveTo(spaltmitte1-50,doppelspaltY+35-i);
	ctx.lineTo(spaltmitte2+50,doppelspaltY+35-i);
	ctx.stroke();
	ctx.clearRect(spaltmitte1-50,doppelspaltY+35-i+1,spaltmitte1-50+spaltmitte2+50,1); //Löscht alte Welle

	ctx.beginPath();
	ctx.moveTo(spaltmitte1-50,doppelspaltY+30-i);
	ctx.lineTo(spaltmitte2+50,doppelspaltY+30-i);
	ctx.clearRect(spaltmitte1-50,doppelspaltY+30-i+1,spaltmitte1-50+spaltmitte2+50,1);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(spaltmitte1-50,doppelspaltY+25-i);
	ctx.lineTo(spaltmitte2+50,doppelspaltY+25-i);
	ctx.clearRect(spaltmitte1-50,doppelspaltY+25-i+1,spaltmitte1-50+spaltmitte2+50,1);
	ctx.stroke();



	i++;


    if(i >= 5) { //Welle ist am Doppelspalt
        i = 0;
		//ctx.clearRect(spaltmitte1-50,doppelspaltY+20,spaltmitte1-50+spaltmitte2+50,35);


    }





}


function startAnimationWavelines(time) {
    //timerId = setInterval(drawMovingWavelines, time*(1000/60));
}



function stopAnimationWavelines() {
    clearInterval(timerId);
}
