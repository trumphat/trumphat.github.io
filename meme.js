/*
Meme.js
=======

Use one function to generate a meme.

You can call it all with strings:

     Meme('dog.jpg', 'canvasID', 'Buy pizza, 'Pay in snakes');

Or with a selected canvas element:

     var canvas = document.getElementById('canvasID');
     Meme('wolf.jpg', canvas, 'The time is now', 'to take what\'s yours');

Or with a jQuery/Zepto selection:

     Meme('spidey.jpg', $('#canvasID'), 'Did someone say', 'Spiderman JS?');

You can also pass in an image:

     var img = new Image();
     img.src = 'insanity.jpg';
     var can = document.getElementById('canvasID');
     Meme(img, can, 'you ignore my calls', 'I ignore your screams of mercy');

********************************************************************************

Copyright (c) 2012 BuddyMeme

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

function check_strip_last(stringIn,checkFor){
	output="";
	if(!(stringIn.indexOf(checkFor)==-1)){//found
		startPoint=stringIn.length-checkFor.length;
		tmp=stringIn.substr(startPoint,checkFor.length);
		if(tmp==checkFor){
			output=stringIn.substr(0,(stringIn.length-checkFor.length));}
		else{
			output=stringIn;}		
		return output;
	}else{
		return stringIn;}
}
function check_strip_first(stringIn,checkFor){
	output="";
	if(!(stringIn.indexOf(checkFor)==-1)){//found
		startPoint=stringIn.length-checkFor.length;
		tmp=stringIn.substr(0,checkFor.length);
		if(tmp==checkFor){
			output=stringIn.substr(checkFor.length,stringIn.length);}
		else{
			output=stringIn;}	
		return output;
	}else{
		return stringIn;}	
}
var splitKeep = function (thisText, splitter, ahead) {
	var self = thisText;
	var result = [];
	if (splitter != '') {
		var matches = [];
		// Getting mached value and its index
		var replaceName = splitter instanceof RegExp ? "replace" : "replaceAll";
		var r = self[replaceName](splitter, function (m, i, e) {
			matches.push({ value: m, index: i });
			return getSubst(m);
		});
		// Finds split substrings
		var lastIndex = 0;
		for (var i = 0; i < matches.length; i++) {
			var m = matches[i];
			var nextIndex = ahead == true ? m.index : m.index + m.value.length;
			if (nextIndex != lastIndex) {
				var part = self.substring(lastIndex, nextIndex);
				result.push(part);
				lastIndex = nextIndex;
			}
		};
		if (lastIndex < self.length) {
			var part = self.substring(lastIndex, self.length);
			result.push(part);
		};
		// Substitution of matched string
		function getSubst(value) {
			var substChar = value[0] == '0' ? '1' : '0';
			var subst = '';
			for (var i = 0; i < value.length; i++) {
				subst += substChar;
			}
			return subst;
		};
	}
	else {
		result.add(self);
	};
	return result;
};
window.Meme = function(image, canvas, top, bottom) {

	/*
	Default top and bottom
	*/
	var selfMeme=this,
		gFontAlign='center',
		gFontSize=21,
		gMaxWidth=302,
		gMaxHeight=93,
		gInitX=365,
		gInitY=25,
		gFontWeight='700',
		gLineHeight=1.375,
		gWidth=0,
		gHeight=0;
	top = top || '';
	bottom = bottom || '';

	/*
	Deal with the canvas
	*/

	// If it's nothing, set it to a dummy value to trigger error
	if (!canvas)
		canvas = 0;

	// If it's a string, conver it
	if (canvas.toUpperCase)
		canvas = document.getElementById(canvas);

	// If it's jQuery or Zepto, convert it
	if (($) && (canvas instanceof $))
		canvas = canvas[0];

	// Throw error
	if (!(canvas instanceof HTMLCanvasElement))
		throw new Error('No canvas selected');

	// Get context
	var context = canvas.getContext('2d');

	/*
	Deal with the image
	*/

	// If there's no image, set it to a dummy value to trigger an error
	if (!image)
		image = 0;

	// Convert it from a string
	if (image.toUpperCase) {
		var src = image;
		image = new Image();
		image.src = src;
	}

	// Set the proper width and height of the canvas
	var setCanvasDimensions = function(w, h) {
		canvas.width = w;
		canvas.height = h;
	};
	setCanvasDimensions(image.width, image.height);	

	/*
	Draw a centered meme string
	*/

	var wrapText=function(FS,LH,textIn, x, y, maxWidth, maxHeight,recDepth) {//w: 307 h:88
		context.font = check_strip_last(gFontWeight,' ') + ' ' + FS + 'px Libre Baskerville';
		context.textAlign = gFontAlign;
		context.textBaseline = 'alphabetic';
		//context.textBaseline = 'bottom';
		//context.textBaseline = 'hanging';
		//context.textBaseline = 'middle';
		//context.textBaseline = 'top';
		var x_init=x,
			y_init=y,
			lineHeight=LH * FS,
			recDepth=(typeof(recDepth)!=='number'?0:recDepth);

console.log('============maxHeight ',maxHeight,'========================');
console.log('============lineHeight ',lineHeight,'========================');
console.log('============FS ',FS,'========================');
console.log('============textIn ',textIn,' x ',x,' y ',y,'========================');

		if(!maxWidth){maxWidth=gMaxWidth;}
		if(!maxHeight){maxHeight=gMaxHeight;}
		var punct='\\['+ '\\!'+ '\\"'+ '\\#'+ '\\$'+   // since javascript does not http://stackoverflow.com/questions/6162600/how-do-you-split-a-javascript-string-by-spaces-and-punctuation
          '\\%'+ '\\&'+ '\\\''+ '\\('+ '\\)'+  // support POSIX character
          '\\*'+ '\\+'+ '\\,'+ '\\\\'+ '\\-'+  // classes, we'll need our
          '\\.'+ '\\/'+ '\\:'+ '\\;'+ '\\<'+   // own version of [:punct:]
          '\\='+ '\\>'+ '\\?'+ '\\@'+ '\\['+
          '\\]'+ '\\^'+ '\\_'+ '\\`'+ '\\{'+
          '\\|'+ '\\}'+ '\\~'+ '\\]';
		var words = textIn.trim().split(' ');
		//var words = textIn.split(new RegExp('[ \n\r'+punct+']+','gi'));
		//var words = textIn.split(new RegExp('[ \n\r]+','gi'));
//console.log('textIn ',textIn,' words ',textIn.match(new RegExp('[ \n\r]+','gi'));
		var word_obj=[];
		for(var n = 0; n < words.length; n++) {
			if(words[n].indexOf("\n")!==-1){
				var _ex=words[n].split("\n");
				for(var e = 0; e < _ex.length; e++) {
					word_obj.push({'str':_ex[e],'sep':(e===0?' ':"\n")});}
			}else{
				word_obj.push({'str':words[n],'sep':' '});
			}
		}
		var line = '',
			last_line_was_new=false,
			line_count=0,
			count=0,
			prev_width=0,
			x_mod=(context.textAlign.toLowerCase()==='center'?maxWidth/2:0);

console.log('word_obj: ',word_obj);
		for(var n = 0; n < word_obj.length; n++) {
			//var testLine = line + word_obj[n].str + ' ',
			var testLine = line + word_obj[n].str +  word_obj[n].sep,
				metrics = context.measureText(testLine),
				testWidth = metrics.width;
console.log(n,' - FOR ===(word_obj.length-1)['+(word_obj.length-1)+']: word_obj[n] ',word_obj[n],"\n",
	testWidth,' > ',maxWidth,"?",(testWidth > maxWidth?"TRUE":"FALSE"),"\n",
	'word_obj[n].sep===\\n',"?",(word_obj[n].sep==="\n"?"TRUE":"FALSE"),"\n",
	'prev_width: ',prev_width,
"");

			if ((testWidth > maxWidth && n > 0) || word_obj[n].sep==="\n" || n===(word_obj.length-1)) {
/*
console.log('maxWidth % ',testWidth/maxWidth*100);
				if((testWidth/maxWidth)>1.05 && 1==2){
console.log('-resize needed reform-',(testWidth/maxWidth),"\n",'prev_width: ',prev_width,"\n",'(testWidth-prev_width): ',(testWidth-prev_width),"\n",'(testWidth-prev_width)/maxWidth: ',(testWidth-prev_width)/maxWidth,"\n");
					var new_text='';
					for(var r=0;r<word_obj.length;r++) {
						var next_sep=false;
						if(r===n){
							var new_per=(testWidth-prev_width)/maxWidth,
								let_offset=0;
console.log('new_per: ',new_per,' word_obj[r].str: ',word_obj[r].str);
							//if(new_per<1){
								do{
									if(Math.abs(new_per)>=1){new_per--;let_offset++;}
								}while(Math.abs(new_per)>=1);
								var word_offset=(let_offset>0?let_offset:1) * (testLine.length - word_obj[r].str.length),
									wid_len=word_offset - Math.floor((testLine.length - word_obj[r].str.length) * new_per);//widow length
console.log('init wid_len: ',wid_len,' let_offset: ',let_offset, ' word_offset  ', word_offset);
								if(wid_len===1 && (word_offset-wid_len)==1){
									wid_len=2;}
								else if(wid_len===1){
									wid_len=2;}

								if(wid_len<word_obj[r].str.length){//make widow!
									var new_str_1=check_strip_last(check_strip_last(word_obj[r].str.substr(0, word_offset), '-'), "\n") +  "-\n",
										new_str_2=word_obj[r].str.substr(word_offset, word_obj[r].str.length);
console.log('-=-=-= '+new_per+'% ('+wid_len+')-=-=-=',"\n",
	'++++=======',word_obj[r].str,' ('+word_obj[r].str.length+')','=======++++',"\n",
	word_offset,"\n",
	word_offset - wid_len,"\n",
	new_str_1,"\n",
	new_str_2,"\n",
'-=-=-= '+new_per+'% ('+wid_len+')-=-=-=');

									new_text = new_text + new_str_1 ;
									new_text = new_text + new_str_2 + word_obj[r].sep;
								}else if(wid_len>=word_obj[r].str.length){//1.0-1.9
console.log('=====================wid_len>=word_obj[r].str.length '+wid_len,' >= ',word_obj[r].str.length+' =====================',"\n",'|'+word_obj[r].str+'|');
									new_text = new_text + word_obj[r].str + word_obj[r].sep;
									//new_text = new_text + "\n" + word_obj[r].str;
								}else{
console.log('===================== ELSE =====================');
								}
							//}else{
							//	new_text = new_text + "\n" + word_obj[r].str + word_obj[r].sep;
							//}
						}else{
							new_text=new_text + word_obj[r].str + word_obj[r].sep;
							next_sep=false;
						}
					}
					if(new_text!==textIn){
console.log('new_text',new_text);
if(maxHeight>=9000){return;}
					//wrapText(FS, LH, new_text, x_init, y_init+(diff_y/2), maxWidth, maxHeight, ++recDepth);//recurrsive
wrapText(FS, LH, new_text, x_init, y_init+(diff_y/2), maxWidth, 9000, ++recDepth);//recurrsive
return;
					}
				}
*/
				//console.log(line,': ',y,"\n",testWidth,' > ',maxWidth,"?",(testWidth > maxWidth?"TRUE":"FALSE"),"\n",'word_obj[n].sep===\\n',(word_obj[n].sep==="\n"?"TRUE":"FALSE"));
				if(n===(word_obj.length-1)){//last word!
					if((testWidth > maxWidth && n > 0) || word_obj[n].sep==="\n"){
						context.fillText(line, x+x_mod, y);
						line_count++;
						line='';
						y += lineHeight;
					}
					context.fillText(line + word_obj[n].str, x+x_mod, y);
					line_count++;
					y += lineHeight;
				}else{
					context.fillText(line, x+x_mod, y);
					line_count++;
					line = word_obj[n].str + ' ';
					y += lineHeight;
				}
				prev_width = 0;
console.log('------ y ',y);
			}else {
				//console.log('testLine('+testLine.length+'):  ',testLine);
				line = testLine;
			}
			prev_width = testWidth;
			count++;
		}
console.log('line_count: ',line_count,' y: ',y);
//console.log('=+-',line,': ',y,"\n",testWidth,' > ',maxWidth,"?",(testWidth > maxWidth?"TRUE":"FALSE"));
		y= y - FS;//baseline correction - weird canvas stuff.  textBaseline is the consideration
 		//y=y+(context.textBaseline.toLowerCase()==='alphabetic'?FS + ((LH * FS) - FS):0);
 		y=y-(context.textBaseline.toLowerCase()==='alphabetic'?FS:0);
//console.log('-line_count: ',line_count,' y: ',y,' --- IF: ',(context.textBaseline.toLowerCase()==='alphabetic'?'TRUE':'FALSE'));

//var drawVectors={'width':maxWidth,'height':maxHeight,'x_cord':x_init,'y_cord':y_init-FS};
var drawVectors={'width':gMaxWidth,'height':gMaxHeight,'x_cord':gInitX,'y_cord':gInitY};
var ctx=canvas.getContext("2d");
//ctx.strokeStyle="#ff0000";
ctx.lineWidth=1;
//ctx.strokeRect(drawVectors.x_cord,drawVectors.y_cord,drawVectors.width,drawVectors.height);

// console.log('====== RECT - ',"\n",
// 	'x_init: ',x_init,"\n",
// 	'y_init: ',y_init,"\n",
// 	'drawVectors.width: ',drawVectors.width,"\n",
// 	'drawVectors.height: ',drawVectors.height,"\n",' ==========');

// var drawVectors={'width':maxWidth,'height':maxHeight,'x_cord':x_init,'y_cord':y_init};
// var ctx2=canvas.getContext("2d");
// ctx2.strokeStyle="#00ff00";
// ctx2.lineWidth=1;
// ctx2.strokeRect(drawVectors.x_cord,drawVectors.y_cord,drawVectors.width,drawVectors.height);
//if(recDepth>=0){return;}

		if(Math.floor(y)<maxHeight){//vert center
			var diff_y=maxHeight-Math.floor(y);
console.log('y:',y,"\n",'diff_y',diff_y,' vs FS ',FS);
//return;
			if(diff_y>FS){
console.log('-diff_y',diff_y,' vs FS ',FS);
				var old_style=context.fillStyle;
				setCanvasDimensions(gWidth, gHeight);
				context.drawImage(image, 0, 0);// Draw the image
				context.fillStyle = old_style;
				context.lineWidth = new_LH * new_FS;

				wrapText(FS, LH, textIn, x_init, y_init+(diff_y/2), maxWidth, maxHeight, ++recDepth);//recurrsive
			}
			return;
		}
		if(Math.floor(y)>maxHeight && FS<=8){
			textIn=check_strip_last(textIn,word_obj[word_obj.length-1].str).trim()+"\u2026";
			FS=8;
		}
console.log("\n",'============y>maxHeight ',y,'>',maxHeight,' ---- FS: ',FS,' ---- lineHeight: ',lineHeight,'========================',"\n");
//return;
		if(Math.floor(y)>maxHeight && (Math.floor(y)-maxHeight)>lineHeight && FS>=8){
			var new_LH=LH-1,
				new_FS=Math.round(FS*0.75);
			if(new_LH>1){new_LH=1.05;}
			else{new_LH=1+(new_LH*0.75);}
console.log('new_LH',new_LH,'new_FS',new_FS);

			var old_style=context.fillStyle;
			setCanvasDimensions(gWidth, gHeight);//redraw
			context.drawImage(image, 0, 0);// Draw the image
			context.fillStyle = old_style;
			context.lineWidth = new_LH * new_FS;

			wrapText((new_FS<8?8:new_FS), new_LH, textIn, x_init, y_init, maxWidth, maxHeight, ++recDepth);//recurrsive
		}
	};

	/*
	Do everything else after image loads
	*/

	image.onload = function() {
//gFontAlign='left';

		// Set dimensions
		gWidth=this.width;
		gHeight=this.height;
		setCanvasDimensions(gWidth, gHeight);

		// Draw the image
		context.drawImage(image, 0, 0);

		// Set up text variables
		context.fillStyle = '#000000';
		//context.strokeStyle = 'black';
		//context.lineWidth = 2;
		context.lineWidth = gLineHeight * gFontSize;
		var fontSize = gFontSize,
			fontWeight=gFontWeight;
		context.font = fontWeight + fontSize + 'px Libre Baskerville';
		context.textAlign = gFontAlign;
console.log('========== top: ',top,'================');
		// Draw them!
		//drawText(top, 'top');
		//drawText(bottom, 'bottom');
		
		gInitX=365;
		gInitY=25-2;
		gInitY=42-2;
console.log('gInitY',gInitY,'gLineHeight' ,gLineHeight);
		wrapText(gFontSize,gLineHeight,top,gInitX,gInitY);
	};

};
