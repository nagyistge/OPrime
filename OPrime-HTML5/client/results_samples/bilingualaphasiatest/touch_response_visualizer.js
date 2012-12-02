

	
	var myMooFlowPage = {	
		start: function(){
			/* MooFlow instance with the complete UI and dbllick-callback */
			mf = new MooFlow($('MooFlowieze'), {
				useSlider: true,
				useAutoPlay: false,
				useCaption: true,
				bgColor: '#fff',
				useResize: true,
				useMouseWheel: true,
				useKeyInput: true,
				useViewer: true,
				'onClickView': function(mixedObject){
					//myMooFlowPage.log(JSON.encode(currentSubExperiment[mixedObject.stimulus]));
					//console.log(mixedObject);
					if(mixedObject.stimulus >=0){
						//myMooFlowPage.log(JSON.encode(currentSubExperiment.stimuli[mixedObject.stimulus]));
						currentSubExperiment.stimuli[mixedObject.stimulus].draw();
					}else{
						console.log("no stimulus number");
					}
				},
				'onStart': function(){
					document.getElementById("pagetitle").innerHTML = titleLabel+ " ::: Displaying "+currentSubExperiment.label+".<p> (Double click on a stimuli image in the gallery, it will plot the touch response results in real time so you can see the speed of the touches.)";
					//myMooFlowPage.log("Displaying stimuli from "+currentSubExperiment.label+". Double click on a stimuli to plot the touch response results.");
				},
				'onChancel': function(error){
					myMooFlowPage.log(error);
				},
				'onAutoPlay': function(){
					myMooFlowPage.log("AutoPlay started");
				},
				'onAutoStop': function(){
					myMooFlowPage.log("AutoPlay stoped");
				},
				'onResized': function(isFull){
					myMooFlowPage.log("onResized Fullscreen: " + isFull);
				}
			});
			$$('.loadexternalsubexperiment').addEvent('click', function(){
				//mf.loadJSON(this.get('href'));
				currentSubExperiment = new SubExperiment();
				currentSubExperiment.loadJSON(this.get('href'));
				return false;
			});
			$$('.loadtouchresponses').addEvent('click', function(){
        //mf.loadJSON(this.get('href'));
        loadTouchResponses(this.get('href'));
        console.log("loading touch data from "+this.get('href'));
				return false;
      });
			$$('.loadjson').addEvent('click', function(){
				mf.loadJSON(this.get('href'));
				return false;
			});
			$$('.loadremote').addEvent('click', function(){
				mf.loadHTML(this.get('href'), this.get('rel'));
				return false;
			});
		},
		log: function(result){
			new Element('p',{html:result}).inject($('callback'), 'top');
		}
	};
	


	var addResponses;
	var addStimuli;
	var pressButton;
	var addSubExperiments;
	var setCurrentSubExperiment;
  var subExperiments = [];
	var stimuliimages = [];
	var currentSubExperiment = [];
	var currentStimulus =[];
	var loadTouchResponses;
	var allTouchResponses = [];
	var allUserIds = [];
	var tempdata = [];
	tempdata.images = [];
	var titleFont = "14 pt 'Merienda One', cursive";
	var titleLabel;
	var labelFont;
	var viewstimulus;
	var ctx;

  /*
    Code to detect long clicks on nodes. 
    Generally if longclick >500 its a long click
  */
  var downclick;
  var upclick;
  var longclick;
  var longClickDrawStimuli = function(){
    var d = new Date();
    upclick = d.getTime();
    longclick=upclick-downclick;
    if (longclick > 500){

    }
  }


	var pause = false;
	var timer;
	var stopLooping = function() {
		clearInterval(timer);
	}
	var buttonRadiusForClicking = 10;
	var pushButton = function(id) {
		//to be defined later
	}
	var getPositionAsButton = function(x, y) {
		//to be defined later
	}
	var mf;
	var participantCodes;
	var setReplayParticipantCode;
	var subExperimentLabels = [];
	var xImage = new Image();
	xImage.src = "images/x.jpg";
	var auditoryLabels = [];
	var auditorySrc = [];
	var menuShape = "arc"; //arc or circle

	var randomColor = function() {
		//return 'hs1('+Math.floor(Math.random() * 360) + ',100%,50%)';
		//return '#'+Math.floor(Math.random() * 360);
		return '#000000'.replace(/0/g, function() {
			return (~~(Math.random() * 10)).toString(16);
		})
		//return '#'+Math.floor(Math.random()*16777215).toString(16);
	}
	var randomBlueGreenColor = function() {
		return 'hs1(' + Math.floor(Math.random() * 100 + 100) + ',100%,50%)';
	}
	var srandom = function() {
		return Math.random() * 2 - 1;
	}
	User = function(){
		this.id = 0;
		this.userid = 0;
		this.color = "#000000";
		this.init = function(i){
			this.id = i;
			//this.color = randomColor();
		}
	}
	Response = function() {
		this.id = 0;
		this.x = 0;
		this.y = 0;
		this.userid = 0;
		this.reactionTime = 0;
		this.encodedResponse = "unknown";
		this.label = "";
		this.labelx = 0;
		this.labely= 0;
		this.stimulus = "";
		this.init = function(i) {
			this.id = i;
			this.color = randomColor();
			var maxButtonSize = Math.max(buttonRadiusForClicking - 10, 3);
			this.r = 10;//Math.random() * (8) + maxButtonSize;
		}
		this.draw = function() {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fill();
		}
	}
	Stimulus = function() {
		this.id = 0;
		this.label = "";
		this.normalResponse = "unknown";
		this.correctResponseGold = "unknown";
		this.responseCount = [];
		this.topquarter = 200;
		this.tophalf = 400;
		this.topthreequarters = 600;
		this.lefthalf = 640;
		this.xhalf = 0;
		this.imagex = "";
		this.image = new Image();
		this.imageScaleFactor = 1;
		this.offset = 0;
		this.title =  "Filler";
		this.windowxsize = 0;
		this.windowysize = 0;
		this.responses = [];
		this.init = function(i) {
			this.id = i;
			this.image.title = "Filler";
			this.image.src = "images/androids_experimenter_kids.png";
		}
		this.draw = function(){
			currentStimulus = this;
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			imageScaleFactor = canvasHeight/this.image.height;
			if(this.image.width*imageScaleFactor > canvasWidth){
				imageScaleFactor=canvasWidth/this.image.width;
			}
			if(currentSubExperiment.id === 6){
				imageScaleFactor = canvasWidth/2/this.image.width;
				this.offset = 10;//(canvasWidth-xImage.width*imageScaleFactor-subExperiments[7].stimuli[3].image.width*imageScaleFactor )/2;
				this.xhalf = 640;
				this.lefthalf = 640 + this.image.width*imageScaleFactor/2;
				window.ctx.drawImage(xImage, this.offset, 0, xImage.width, xImage.height);
				window.ctx.drawImage(this.image, canvasWidth/2, 0, this.image.width*imageScaleFactor, this.image.height*imageScaleFactor);	
			}else{
				 window.ctx.drawImage(this.image, canvasWidth/2-this.image.width/2, 0, this.image.width*imageScaleFactor, this.image.height*imageScaleFactor); 
			}
			window.ctx.font = titleFont;
			window.ctx.fillText("Drawing participant's touches in real time (reaction times)",20,20);
			window.ctx.fillText(this.title, 20,60);
			for ( var r = 0; r < this.responses.length; r++){
				var index = allTouchResponses.indexOf(this.responses[r]);
				//this.responses[r].draw();
				var pic= "unknown";
				this.responseCount.push({"code":"X","count":0});
        this.responseCount.push({"code":"A","count":0});
        this.responseCount.push({"code":"AA","count":0});
				this.responseCount.push({"code":"B","count":0});
        this.responseCount.push({"code":"BB","count":0});
				this.responseCount.push({"code":"C","count":0});
        this.responseCount.push({"code":"CC","count":0});
        this.responseCount.push({"code":"D","count":0});
				this.responseCount.push({"code":"DD","count":0});
					
				if(this.responses[r].encodedResponse == "unknown"){
					console.log("calculating response accuracy");
					if(this.responses[r].x < this.xhalf){
						pic = "X";
						this.responseCount[0].count++;
					}else if(this.responses[r].y < this.topquarter){
							if(this.responses[r].x < this.lefthalf){
								pic = "A";
								this.responseCount[1].count++;
							}else{
								pic = "B";
								this.responseCount[3].count++;
							}
					 }else 	if(this.responses[r].y < this.tophalf){
							if(this.responses[r].x < this.lefthalf){
									pic = "AA";
									this.responseCount[2].count++;
							}else{
									pic = "BB";
									this.responseCount[4].count++;
							}
						}else	if(this.responses[r].y < this.topthreequarters){
							if(this.responses[r].y < this.lefthalf){
										pic = "C";
										this.responseCount[5].count++;
							}else{
										pic = "D";
										this.responseCount[7].count++;
							}
						}else{
							if(this.responses[r].y < this.lefthalf){
									pic = "CC";
									this.responseCount[6].count++;
							}else{
									pic = "DD";
									this.responseCount[8].count++;
							}
						}
					this.responses[r].encodedResponse = pic;
				}
				var timedelay = this.responses[r].reactionTime;
				//console.log(timedelay);
				setTimeout("drawTouchesByReactionTime(allTouchResponses["+index+"]);", timedelay);
			}
			
 		  myMooFlowPage.log(" SubExperiment "+currentSubExperiment.id+" item: "+this.id +" will appear above this line.");
      myMooFlowPage.log("<font color='#ff0000'>ReactionTime, ParticipantCode, AutoEncodedResponse");
			this.normalResponse = "";
			//Extract autodetermined normallly correct answer (if 50% of participants chose that answer)
			for (var w = 0; w < this.responseCount.length; w++){
				if ( this.responseCount[w].count/this.responses.length > .3){
				this.normalResponse = this.normalResponse+", "+this.responseCount[w].code+":"+this.responseCount[w].count+"/"+this.responses.length;
				}
			}
			myMooFlowPage.log("Automatically determined 'normal' response(s) over 30%:"+this.normalResponse);


		}
	}
	drawTouchesByReactionTime = function(r){
		r.draw();
		myMooFlowPage.log("<font color='"+r.color+"'>"+r.reactionTime +"ms, "+r.userid+", "+r.encodedResponse );	
	}
	SubExperiment = function() {
		this.id = 0;
		this.label = "";
		this.stimuli = [];
		this.init = function(i) {
			this.id = i;
		}
		this.draw = function(){
			
		}
		this.setAsImageGallery = function(){
			tempdata = [];
			tempdata.images = [];
			for (var t = 0; t < this.stimuli.length; t++){
				tempdata.images[t] = {"src": this.stimuli[t].image.src, "title": this.stimuli[t].image.title, "stimulus":t};
			}
			mf.master = tempdata;
      mf.clearMain();
      mf.fireEvent('request', tempdata);
		}
		this.loadJSON = function(url){
		if(!url || this.isLoading) return;
		this.isLoading = true;
		new Request.JSON({
			'onComplete': function(data){
				if($chk(data)){
					//console.log(data);
					//mf =null;
					//myMooFlowPage.start();
					this.label = data.label;
					for(var t = 0; t < data.stimuli.length; t++){
						var h = new Stimulus();
						h.init(t);
						h.label = data.stimuli[t].label;
						//h.image = new Image();
						//h.image.src = data.stimuli[0].image.src;
						tempdata.images[t] = {"src": data.stimuli[t].image.src, "title": data.stimuli[t].image.title, "stimulus":t};
						tempimg = new Image();
						tempimg.src = data.stimuli[t].image.src;
						tempimg.title = data.stimuli[t].image.title;
						h.image = tempimg;
						//tempdata.images.push(tempimg);
						console.log("tempdata"+tempdata);
						for (var s = 0; s < data.stimuli[t].responses.length; s++){
							var r = new Response();
							r.init(s);
							r.label = data.stimuli[t].responses[s].label;
							r.x = data.stimuli[t].responses[s].x;
							r.y = data.stimuli[t].responses[s].y;
							h.responses.push(r);
						}
						this.stimuli.push(h);
					}		
					console.log(tempdata);
					mf.master = tempdata;
					mf.clearMain();
					mf.fireEvent('request', tempdata);
				}
			}.bind(this)
		 }, this).get(url);
		}
	}

	function addResponses(n, stimulus) {
		stimulus.responses =[];
		for ( var i = 0; i < n; i++) {
			var e = new Response();
			e.init(i);
			stimulus.responses.push(e);
		}
	}
	function addStimuli(subexperiment,imagesrcs,imagetitles) {
		subexperiment.stimuli = [];
		for ( var i = 0; i < imagesrcs.length; i++) {
			var e = new Stimulus();
			e.init(i);
			e.label = imagetitles[i];
			e.image = null;
			e.image = new Image();
			e.image.title = imagetitles[i];
			e.image.src = "images/"+imagesrcs[i];
			e.title=imagetitles[i];
			//addResponses(2,e);
			subexperiment.stimuli.push(e);
		}
	}
	function setCurrentSubExperiment(id){
		console.log("in set sub experiment" + id);
		currentSubExperiment = new SubExperiment();
		currentSubExperiment = subExperiments[id];
		currentSubExperiment.setAsImageGallery();
	}
	function addSubExperimentButtons(){
		if(document.getElementById("buttonArea").getElementsByTagName('*').length > 4){
			return;
		}
		for ( var p = 0; p < subExperimentLabels.length; p++) {
        var playButtn = document.createElement("input");
        playButtn.setAttribute("type", "button");
        playButtn.setAttribute("id", subExperimentLabels[p]);
        playButtn.setAttribute("value", p+" "+subExperimentLabels[p]);
        playButtn.setAttribute("name", subExperimentLabels[p]);
        playButtn.setAttribute("class", "groovybutton");
        playButtn.setAttribute("onClick", "setCurrentSubExperiment('"+p+"')");
        document.getElementById("buttonArea").appendChild(playButtn);

        document.getElementById("buttonArea").appendChild( document.createElement('br'));
      }
	}
	function addSubExperiments(n) {
		subExperiments = [];
		for ( var i = 0; i < n; i++) {
			var e = new SubExperiment();
			e.init(i);
			e.label = window.subExperimentLabels[i];
			addStimuli(e,stimuliimages[i].imagesrcs,stimuliimages[i].imagetitles);	
			subExperiments.push(e);
		}
	}
	loadTouchResponses = function(url){
    if(!url || this.isLoading) return;
    this.isLoading = true;
    new Request.JSON({
      'onComplete': function(data){
        if($chk(data)){
          //console.log(data);
					allTouchResponses = null;
					allTouchResponses = [];
					allUserIds = [];
					for(var i = 1; i < data.responses.length; i++){
						//console.log(data.responses[i]);
						var r = new Response();
            r.init(i);
						try{
            	r.x = data.responses[i].x;
            	r.y = data.responses[i].y;
							r.userid = data.responses[i].userid;
							//console.log(allUserIds);
							/*set the color of the touch response according
							to the participant code userid
							*/	
							var found = "x";
							if(allUserIds != null){	
								for(var l = 0; l < allUserIds.length; l++){
									if (r.userid === allUserIds[l].userid){
										found = l;
										break;
									}
								}
							}
							//console.log(found);
				
							if(found != "x"){
								r.color = allUserIds[found].color;
							}else{
								u = new User();
								u.init(allUserIds.length);
								u.userid = r.userid;
								r.color = randomColor();
								u.color = r.color;
								allUserIds.push(u);
							}
							
							r.reactionTime = data.responses[i].reactionTime;
							subex = data.responses[i].subexperiment.replace(/en/g, "");
            	stim = data.responses[i].stimulus;
							r.stimulus = subex+"_"+stim;
							subExperiments[subex].stimuli[stim].responses.push(r);
							allTouchResponses.push(r);
							//console.log(subExperiments[subex]);
						}catch(err){
							//skip the response
							console.log("There was a problem with");
							console.log(data.responses[i]);
							console.log(r);
						}	
					}
					var url = window.location.href;
					var qparts = url.split("?");
					if (qparts.length > 0 && qparts.indexOf(".html") != -1){
						console.log(qparts);
						var query = qparts[1];
						var vars = query.split("&");
						var value = "";
						for (i=0;i<vars.length;i++){
							var parts = vars[i].split("=");
							if (parts[0] === "subexperiment"){
								value = parts[1];
								break;
							}
						}
						value = unescape(value);
						value.replace(/\+/g," ");
						//display the value from the requested subexperiment
						if(value >0 && value < subExperiments.length){
							setCurrentSubExperiment(value);
							if(currentSubExperiment.stimuli.length > 1){
    						currentSubExperiment.stimuli[2].draw();	
							}else{
								currentSubExperiment.stimuli[0].draw();
							}
						}	
					}else{
						//display the sample setup
						setTimeout("displaySampleSetUp();", 1000);
					}
        }
      }.bind(this)
     }, this).get(url);
    }


	function clearBubbles(bubbleType) {
		var n = bubbleType.length;
		for ( var i = 0; i < n; i++) {
			bubbleType.pop();
		}
	}

	function isNativeAndroidApp() {
		return /BilingualAphasiaTest\/[0-9\.]+$/.test(navigator.userAgent);
	}
	if (isNativeAndroidApp()) {
		window.pressButton = function(id, label) {
			if (label === "Start" || label === "Commencer") {
				Android.setAutoAdvanceJS("1");
			}
			Android.launchSubExperimentJS(id);
		}
		fetchSubExperimentsArray = function() {
			result = Android.fetchSubExperimentsArrayJS();
			result = result.replace(/\]/g, "").replace(/\[/g, "");
			subExperimentLabels = result.split(", ");//"History of Bilingualism","English Background","Spontaneous Speech","Pointing","Simple and Semi-complex Commands","Complex Commands","Verbal Auditory Discrimination","Syntactic Comprehension","Semantic Categories","Synonyms","Antonyms","Grammaticality Judgement","Semantic Acceptability","Lexical Decision","Series","Verbal Fluency","Naming","Sentence Construction","Semantic Opposites","Derivational Morphology","Morphological Opposites","Description","Mental Arithmetic","Listening Comprehension","Reading","Copying","Dictation for Words","Dictation for Sentences","Reading Comprehension for Words","Reading Comprehension for Sentences","Writing");
			console.log(subExperimentLabels);
			fetchStimuliImages();
			//Android.showToast(subExperimentLabels);
		}
		fetchStimuliImages = function(){
			stimuliimages = null; //[];
			for (var i = 0; i < subExperimentLabels.length; i++){
				stimuliimages[i] = [];
				stimuliimages[i].imagesrcs = "androids_experimenter_kids.png".split(",");
				stimuliimages[i].imagetitles = "Filler".split(",");
			}
			stimuliimages[6].imagesrcs = "androids_experimenter_kids.png,e048_0.jpg,e048_e408.jpg,e049_e409.jpg,ef050.jpg,e051.jpg,e052_e410.jpg,e053_e411.jpg,e054_e412.jpg,e055.jpg,e056.jpg,ef057.jpg,e058_e413.jpg,e059_e414.jpg,e060_e415.jpg,ef061.jpg,e062_e416.jpg,e063.jpg,e064_e417.jpg,e065.jpg".split(",");
      stimuliimages[7].imagesrcs = "androids_experimenter_kids.png,ef066_0_66.jpg,e066_and_f066_to_f070_ef418_67.jpg,e066_and_f066_to_f070_ef418_68.jpg,e066_and_f066_to_f070_ef418_69.jpg,e066_and_f066_to_f070_ef418_70.jpg,e066_and_f066_to_f070_ef418_71.jpg,e071_e419_72.jpg,e071_e419_73.jpg,e071_e419_74.jpg,e071_e419_75.jpg,e071_e419_76.jpg,e071_e419_77.jpg,e077_and_f077_to_f080_ef425_78.jpg,e077_and_f077_to_f080_ef425_79.jpg,e077_and_f077_to_f080_ef425_80.jpg,e077_and_f077_to_f080_ef425_81.jpg,e081_and_f081_to_f088_ef426_f0419_82.jpg,e081_and_f081_to_f088_ef426_f0419_83.jpg,e081_and_f081_to_f088_ef426_f0419_84.jpg,e081_and_f081_to_f088_ef426_f0419_85.jpg,e081_and_f081_to_f088_ef426_f0419_86.jpg,e081_and_f081_to_f088_ef426_f0419_87.jpg,e081_and_f081_to_f088_ef426_f0419_88.jpg,e081_and_f081_to_f088_ef426_f0419_89.jpg,e089_f089_a_f096_90.jpg,e089_f089_a_f096_91.jpg,e089_f089_a_f096_92.jpg,e089_f089_a_f096_93.jpg,e089_f089_a_f096_94.jpg,e089_f089_a_f096_95.jpg,e089_f089_a_f096_96.jpg,e089_f089_a_f096_97.jpg,e097_and_f071_to_f076_98.jpg,e097_and_f071_to_f076_99.jpg,e097_and_f071_to_f076_100.jpg,e097_and_f071_to_f076_101.jpg,e097_and_f071_to_f076_102.jpg,e097_and_f071_to_f076_103.jpg,e097_and_f071_to_f076_104.jpg,e097_and_f071_to_f076_105.jpg,e105_106.jpg,e105_107.jpg,e105_108.jpg,e105_109.jpg,e105_110.jpg,e105_111.jpg,e111_f0111_to_f0114_112.jpg,e111_f0111_to_f0114_113.jpg,e111_f0111_to_f0114_114.jpg,e111_f0111_to_f0114_115.jpg,e115_f0115_to_f0120b.jpg,e115_f0115_to_f0120_116.jpg,e115_f0115_to_f0120_117.jpg,e115_f0115_to_f0120_118.jpg,e115_f0115_to_f0120_119.jpg,e115_f0115_to_f0120_120.jpg,e121_f0121_a_f0124_121.jpg,e121_f0121_a_f0124_122.jpg,e121_f0121_a_f0124_123.jpg,e121_f0121_a_f0124_124.jpg,e125_f0125_to_f0128_125.jpg,e125_f0125_to_f0128_126.jpg,e125_f0125_to_f0128_127.jpg,e125_f0125_to_f0128_128.jpg,e129_f0129_a_f0132_129.jpg,e129_f0129_a_f0132_130.jpg,e129_f0129_a_f0132_131.jpg,e129_f0129_a_f0132_132.jpg,e427_ef0133_to_ef0136_133.jpg,e427_ef0133_to_ef0136_134.jpg,e427_ef0133_to_ef0136_135.jpg,e427_ef0133_to_ef0136_136.jpg,e137_e145_137.jpg,e138_e146_138.jpg,e139_e147_139.jpg,e140_e148_f0137_et_f0145_140.jpg,e141_e149_141.jpg,e142_e150_142.jpg,e143_e151_143.jpg,e144_e152_f0141_et_f0149_144.jpg,e137_e145_145.jpg,e138_e146_146.jpg,e139_e147_147.jpg,e140_e148_f0137_et_f0145_148.jpg,e141_e149_149.jpg,e142_e150_150.jpg,e143_e151_151.jpg,e144_e152_f0141_et_f0149_152.jpg".split(",");
      stimuliimages[21].imagesrcs = "androids_experimenter_kids.png,e344_f0344.jpg".split(",");
      stimuliimages[24].imagesrcs = "androids_experimenter_kids3.png,e367.jpg,e372.jpg,androids_experimenter_kids.png,e377.jpg,e379.jpg,e381.jpg,e383.jpg,e385.jpg,androids_experimenter_kids1.png,e387_0.jpg,androids_experimenter_kids2.png".split(",");
      stimuliimages[25].imagesrcs = "androids_experimenter_kids.png,e393.jpg".split(",");
      stimuliimages[28].imagesrcs = "androids_experimenter_kids.png,e408_0.jpg,e048_e408.jpg,e409_0.jpg,e049_e409.jpg,e410_0.jpg,e052_e410.jpg,e411_0.jpg,e053_e411.jpg,e412_0.jpg,e054_e412.jpg,e413_0.jpg,e058_e413.jpg,e414_0.jpg,e059_e414.jpg,e415_0.jpg,e060_e415.jpg,e416_0.jpg,e062_e416.jpg,e417_0.jpg,e064_e417.jpg".split(",");

      stimuliimages[29].imagesrcs = "androids_experimenter_kids.png,e418_0.jpg,e066_and_f066_to_f070_ef418.jpg,e419_0.jpg,e071_e419.jpg,e420_0.jpg,ef420.jpg,e421_0.jpg,ef421.jpg,e422_0.jpg,ef422.jpg,e423_0.jpg,ef423.jpg,e424_0.jpg,ef424.jpg,e425_0.jpg,e077_and_f077_to_f080_ef425.jpg,e426_0.jpg,e081_and_f081_to_f088_ef426_f0419.jpg,e427_0.jpg,e427_ef0133_to_ef0136.jpg".split(",");

      stimuliimages[6].imagetitles = "androids_experimenter_kids.png,Mat,e048_e408.jpg,e049_e409.jpg,ef050.jpg,e051.jpg,e052_e410.jpg,e053_e411.jpg,e054_e412.jpg,e055.jpg,Chin,ef057.jpg,e058_e413.jpg,e059_e414.jpg,e060_e415.jpg,ef061.jpg,e062_e416.jpg,e063.jpg,e064_e417.jpg,e065.jpg".split(",");
      stimuliimages[7].imagetitles = "androids_experimenter_kids.png,ef066_0_66.jpg,e066_and_f066_to_f070_ef418_67.jpg,e066_and_f066_to_f070_ef418_68.jpg,e066_and_f066_to_f070_ef418_69.jpg,e066_and_f066_to_f070_ef418_70.jpg,e066_and_f066_to_f070_ef418_71.jpg,e071_e419_72.jpg,e071_e419_73.jpg,e071_e419_74.jpg,e071_e419_75.jpg,e071_e419_76.jpg,e071_e419_77.jpg,e077_and_f077_to_f080_ef425_78.jpg,e077_and_f077_to_f080_ef425_79.jpg,e077_and_f077_to_f080_ef425_80.jpg,e077_and_f077_to_f080_ef425_81.jpg,e081_and_f081_to_f088_ef426_f0419_82.jpg,e081_and_f081_to_f088_ef426_f0419_83.jpg,e081_and_f081_to_f088_ef426_f0419_84.jpg,e081_and_f081_to_f088_ef426_f0419_85.jpg,e081_and_f081_to_f088_ef426_f0419_86.jpg,e081_and_f081_to_f088_ef426_f0419_87.jpg,e081_and_f081_to_f088_ef426_f0419_88.jpg,e081_and_f081_to_f088_ef426_f0419_89.jpg,e089_f089_a_f096_90.jpg,e089_f089_a_f096_91.jpg,e089_f089_a_f096_92.jpg,e089_f089_a_f096_93.jpg,e089_f089_a_f096_94.jpg,e089_f089_a_f096_95.jpg,e089_f089_a_f096_96.jpg,e089_f089_a_f096_97.jpg,e097_and_f071_to_f076_98.jpg,e097_and_f071_to_f076_99.jpg,e097_and_f071_to_f076_100.jpg,e097_and_f071_to_f076_101.jpg,e097_and_f071_to_f076_102.jpg,e097_and_f071_to_f076_103.jpg,e097_and_f071_to_f076_104.jpg,e097_and_f071_to_f076_105.jpg,e105_106.jpg,e105_107.jpg,e105_108.jpg,e105_109.jpg,e105_110.jpg,e105_111.jpg,e111_f0111_to_f0114_112.jpg,e111_f0111_to_f0114_113.jpg,e111_f0111_to_f0114_114.jpg,e111_f0111_to_f0114_115.jpg,e115_f0115_to_f0120b.jpg,e115_f0115_to_f0120_116.jpg,e115_f0115_to_f0120_117.jpg,e115_f0115_to_f0120_118.jpg,e115_f0115_to_f0120_119.jpg,e115_f0115_to_f0120_120.jpg,e121_f0121_a_f0124_121.jpg,e121_f0121_a_f0124_122.jpg,e121_f0121_a_f0124_123.jpg,e121_f0121_a_f0124_124.jpg,e125_f0125_to_f0128_125.jpg,e125_f0125_to_f0128_126.jpg,e125_f0125_to_f0128_127.jpg,e125_f0125_to_f0128_128.jpg,e129_f0129_a_f0132_129.jpg,e129_f0129_a_f0132_130.jpg,e129_f0129_a_f0132_131.jpg,e129_f0129_a_f0132_132.jpg,e427_ef0133_to_ef0136_133.jpg,e427_ef0133_to_ef0136_134.jpg,e427_ef0133_to_ef0136_135.jpg,e427_ef0133_to_ef0136_136.jpg,e137_e145_137.jpg,e138_e146_138.jpg,e139_e147_139.jpg,e140_e148_f0137_et_f0145_140.jpg,e141_e149_141.jpg,e142_e150_142.jpg,e143_e151_143.jpg,e144_e152_f0141_et_f0149_144.jpg,e137_e145_145.jpg,e138_e146_146.jpg,e139_e147_147.jpg,e140_e148_f0137_et_f0145_148.jpg,e141_e149_149.jpg,e142_e150_150.jpg,e143_e151_151.jpg,e144_e152_f0141_et_f0149_152.jpg".split(",");
      stimuliimages[21].imagetitles = "androids_experimenter_kids.png,e344_f0344.jpg".split(",");
      stimuliimages[24].imagetitles = "androids_experimenter_kids3.png,e367.jpg,e372.jpg,androids_experimenter_kids.png,e377.jpg,e379.jpg,e381.jpg,e383.jpg,e385.jpg,androids_experimenter_kids1.png,e387_0.jpg,androids_experimenter_kids2.png".split(",");
      stimuliimages[25].imagetitles = "androids_experimenter_kids.png,e393.jpg".split(",");
      stimuliimages[28].imagetitles = "androids_experimenter_kids.png,e408_0.jpg,e048_e408.jpg,e409_0.jpg,e049_e409.jpg,e410_0.jpg,e052_e410.jpg,e411_0.jpg,e053_e411.jpg,e412_0.jpg,e054_e412.jpg,e413_0.jpg,e058_e413.jpg,e414_0.jpg,e059_e414.jpg,e415_0.jpg,e060_e415.jpg,e416_0.jpg,e062_e416.jpg,e417_0.jpg,e064_e417.jpg".split(",");
      stimuliimages[29].imagetitles = "androids_experimenter_kids.png,e418_0.jpg,e066_and_f066_to_f070_ef418.jpg,e419_0.jpg,e071_e419.jpg,e420_0.jpg,ef420.jpg,e421_0.jpg,ef421.jpg,e422_0.jpg,ef422.jpg,e423_0.jpg,ef423.jpg,e424_0.jpg,ef424.jpg,e425_0.jpg,e077_and_f077_to_f080_ef425.jpg,e426_0.jpg,e081_and_f081_to_f088_ef426_f0419.jpg,e427_0.jpg,e427_ef0133_to_ef0136.jpg".split(",");




		}
		fetchExperimentTitle = function() {
			titleLabel = Android.fetchExperimentTitleJS();
		}
		fetchParticipantCodes = function() {
			result = Android.fetchParticipantCodesJS();
			result = result.replace(/\]/g, "").replace(/\[/g, "");
			if (result.length > 0) {
				participantCodes = result.split(", ");//"ET1AM4mc, SAMPLE".split(",");
			} else {
				participantCodes = "";
			}
		}
		setReplayParticipantCode = function(code) {
			Android.setReplayParticipantCodeJS(code);
		}
	} else {
		//alert("in a browser");
		window.pressButton = function(id, label) {
			if (label === "Start" || label === "Commencer") {
				alert("Starting AutoAdvance - pressed experiment button " + id);
			} else {
				//alert("Touch response: " + label);
			}
		}
		fetchSubExperimentsArray = function() {
			var javaArrayListToString = "[History of Bilingualism, English Background, Spontaneous Speech, Pointing, Simple and Semi-complex Commands, Complex Commands, Verbal Auditory Discrimination, Syntactic Comprehension, Semantic Categories, Synonyms, Antonyms, Grammaticality Judgement, Semantic Acceptability, Lexical Decision, Series, Verbal Fluency, Naming, Sentence Construction, Semantic Opposites, Derivational Morphology, Morphological Opposites, Description, Mental Arithmetic, Listening Comprehension, Reading, Copying, Dictation for Words, Dictation for Sentences, Reading Comprehension for Words, Reading Comprehension for Sentences, Writing]";
			javaArrayListToString = javaArrayListToString.replace(/\]/g, "")
					.replace(/\[/g, "");
			subExperimentLabels = javaArrayListToString.split(", ");
			auditoryLabels = "rain,mat,ball".split(",");
			auditorySrc = "e048_0.jpg,e048_e408.jpg,e049_e409.jpg,ef050.jpg,e051.jpg,e052_e410.jpg,e053_e411.jpg,e054_e412.jpg,e055.jpg,e056.jpg,ef057.jpg,e058_e413.jpg,e059_e414.jpg,e060_e415.jpg,ef061.jpg,e062_e416.jpg,e063.jpg,e064_e417.jpg,e065.jpg".split(",");
			console.log(subExperimentLabels);
			fetchStimuliImages();
			addSubExperiments(subExperimentLabels.length);
			addSubExperimentButtons();
			loadTouchResponses("touch-responses.json");
		}
		fetchStimuliImages = function(){
      stimuliimages = [];
      for (var i = 0; i < subExperimentLabels.length; i++){
        stimuliimages[i] = [];
        stimuliimages[i].imagesrcs = "androids_experimenter_kids.png".split(",");
        stimuliimages[i].imagetitles = "Filler".split(",");
      }
			stimuliimages[6].imagesrcs = "androids_experimenter_kids.png,e048_0.jpg,e048_e408.jpg,e049_e409.jpg,ef050.jpg,e051.jpg,e052_e410.jpg,e053_e411.jpg,e054_e412.jpg,e055.jpg,e056.jpg,ef057.jpg,e058_e413.jpg,e059_e414.jpg,e060_e415.jpg,ef061.jpg,e062_e416.jpg,e063.jpg,e064_e417.jpg,e065.jpg".split(",");
			stimuliimages[7].imagesrcs = "androids_experimenter_kids.png,ef066_0_66.jpg,e066_and_f066_to_f070_ef418_67.jpg,e066_and_f066_to_f070_ef418_68.jpg,e066_and_f066_to_f070_ef418_69.jpg,e066_and_f066_to_f070_ef418_70.jpg,e066_and_f066_to_f070_ef418_71.jpg,e071_e419_72.jpg,e071_e419_73.jpg,e071_e419_74.jpg,e071_e419_75.jpg,e071_e419_76.jpg,e071_e419_77.jpg,e077_and_f077_to_f080_ef425_78.jpg,e077_and_f077_to_f080_ef425_79.jpg,e077_and_f077_to_f080_ef425_80.jpg,e077_and_f077_to_f080_ef425_81.jpg,e081_and_f081_to_f088_ef426_f0419_82.jpg,e081_and_f081_to_f088_ef426_f0419_83.jpg,e081_and_f081_to_f088_ef426_f0419_84.jpg,e081_and_f081_to_f088_ef426_f0419_85.jpg,e081_and_f081_to_f088_ef426_f0419_86.jpg,e081_and_f081_to_f088_ef426_f0419_87.jpg,e081_and_f081_to_f088_ef426_f0419_88.jpg,e081_and_f081_to_f088_ef426_f0419_89.jpg,e089_f089_a_f096_90.jpg,e089_f089_a_f096_91.jpg,e089_f089_a_f096_92.jpg,e089_f089_a_f096_93.jpg,e089_f089_a_f096_94.jpg,e089_f089_a_f096_95.jpg,e089_f089_a_f096_96.jpg,e089_f089_a_f096_97.jpg,e097_and_f071_to_f076_98.jpg,e097_and_f071_to_f076_99.jpg,e097_and_f071_to_f076_100.jpg,e097_and_f071_to_f076_101.jpg,e097_and_f071_to_f076_102.jpg,e097_and_f071_to_f076_103.jpg,e097_and_f071_to_f076_104.jpg,e097_and_f071_to_f076_105.jpg,e105_106.jpg,e105_107.jpg,e105_108.jpg,e105_109.jpg,e105_110.jpg,e105_111.jpg,e111_f0111_to_f0114_112.jpg,e111_f0111_to_f0114_113.jpg,e111_f0111_to_f0114_114.jpg,e111_f0111_to_f0114_115.jpg,e115_f0115_to_f0120b.jpg,e115_f0115_to_f0120_116.jpg,e115_f0115_to_f0120_117.jpg,e115_f0115_to_f0120_118.jpg,e115_f0115_to_f0120_119.jpg,e115_f0115_to_f0120_120.jpg,e121_f0121_a_f0124_121.jpg,e121_f0121_a_f0124_122.jpg,e121_f0121_a_f0124_123.jpg,e121_f0121_a_f0124_124.jpg,e125_f0125_to_f0128_125.jpg,e125_f0125_to_f0128_126.jpg,e125_f0125_to_f0128_127.jpg,e125_f0125_to_f0128_128.jpg,e129_f0129_a_f0132_129.jpg,e129_f0129_a_f0132_130.jpg,e129_f0129_a_f0132_131.jpg,e129_f0129_a_f0132_132.jpg,e427_ef0133_to_ef0136_133.jpg,e427_ef0133_to_ef0136_134.jpg,e427_ef0133_to_ef0136_135.jpg,e427_ef0133_to_ef0136_136.jpg,e137_e145_137.jpg,e138_e146_138.jpg,e139_e147_139.jpg,e140_e148_f0137_et_f0145_140.jpg,e141_e149_141.jpg,e142_e150_142.jpg,e143_e151_143.jpg,e144_e152_f0141_et_f0149_144.jpg,e137_e145_145.jpg,e138_e146_146.jpg,e139_e147_147.jpg,e140_e148_f0137_et_f0145_148.jpg,e141_e149_149.jpg,e142_e150_150.jpg,e143_e151_151.jpg,e144_e152_f0141_et_f0149_152.jpg".split(",");
			stimuliimages[21].imagesrcs = "androids_experimenter_kids.png,e344_f0344.jpg".split(",");
			stimuliimages[24].imagesrcs = "androids_experimenter_kids3.png,e367.jpg,e372.jpg,androids_experimenter_kids.png,e377.jpg,e379.jpg,e381.jpg,e383.jpg,e385.jpg,androids_experimenter_kids1.png,e387_0.jpg,androids_experimenter_kids2.png".split(",");
			stimuliimages[25].imagesrcs = "androids_experimenter_kids.png,e393.jpg".split(",");
			stimuliimages[28].imagesrcs = "androids_experimenter_kids.png,e408_0.jpg,e048_e408.jpg,e409_0.jpg,e049_e409.jpg,e410_0.jpg,e052_e410.jpg,e411_0.jpg,e053_e411.jpg,e412_0.jpg,e054_e412.jpg,e413_0.jpg,e058_e413.jpg,e414_0.jpg,e059_e414.jpg,e415_0.jpg,e060_e415.jpg,e416_0.jpg,e062_e416.jpg,e417_0.jpg,e064_e417.jpg".split(",");

			stimuliimages[29].imagesrcs = "androids_experimenter_kids.png,e418_0.jpg,e066_and_f066_to_f070_ef418.jpg,e419_0.jpg,e071_e419.jpg,e420_0.jpg,ef420.jpg,e421_0.jpg,ef421.jpg,e422_0.jpg,ef422.jpg,e423_0.jpg,ef423.jpg,e424_0.jpg,ef424.jpg,e425_0.jpg,e077_and_f077_to_f080_ef425.jpg,e426_0.jpg,e081_and_f081_to_f088_ef426_f0419.jpg,e427_0.jpg,e427_ef0133_to_ef0136.jpg".split(",");

			stimuliimages[6].imagetitles = "androids_experimenter_kids.png,Mat,e048_e408.jpg,e049_e409.jpg,ef050.jpg,e051.jpg,e052_e410.jpg,e053_e411.jpg,e054_e412.jpg,e055.jpg,Chin,ef057.jpg,e058_e413.jpg,e059_e414.jpg,e060_e415.jpg,ef061.jpg,e062_e416.jpg,e063.jpg,e064_e417.jpg,e065.jpg".split(",");
      stimuliimages[7].imagetitles = "androids_experimenter_kids.png,ef066_0_66.jpg,e066_and_f066_to_f070_ef418_67.jpg,e066_and_f066_to_f070_ef418_68.jpg,e066_and_f066_to_f070_ef418_69.jpg,e066_and_f066_to_f070_ef418_70.jpg,e066_and_f066_to_f070_ef418_71.jpg,e071_e419_72.jpg,e071_e419_73.jpg,e071_e419_74.jpg,e071_e419_75.jpg,e071_e419_76.jpg,e071_e419_77.jpg,e077_and_f077_to_f080_ef425_78.jpg,e077_and_f077_to_f080_ef425_79.jpg,e077_and_f077_to_f080_ef425_80.jpg,e077_and_f077_to_f080_ef425_81.jpg,e081_and_f081_to_f088_ef426_f0419_82.jpg,e081_and_f081_to_f088_ef426_f0419_83.jpg,e081_and_f081_to_f088_ef426_f0419_84.jpg,e081_and_f081_to_f088_ef426_f0419_85.jpg,e081_and_f081_to_f088_ef426_f0419_86.jpg,e081_and_f081_to_f088_ef426_f0419_87.jpg,e081_and_f081_to_f088_ef426_f0419_88.jpg,e081_and_f081_to_f088_ef426_f0419_89.jpg,e089_f089_a_f096_90.jpg,e089_f089_a_f096_91.jpg,e089_f089_a_f096_92.jpg,e089_f089_a_f096_93.jpg,e089_f089_a_f096_94.jpg,e089_f089_a_f096_95.jpg,e089_f089_a_f096_96.jpg,e089_f089_a_f096_97.jpg,e097_and_f071_to_f076_98.jpg,e097_and_f071_to_f076_99.jpg,e097_and_f071_to_f076_100.jpg,e097_and_f071_to_f076_101.jpg,e097_and_f071_to_f076_102.jpg,e097_and_f071_to_f076_103.jpg,e097_and_f071_to_f076_104.jpg,e097_and_f071_to_f076_105.jpg,e105_106.jpg,e105_107.jpg,e105_108.jpg,e105_109.jpg,e105_110.jpg,e105_111.jpg,e111_f0111_to_f0114_112.jpg,e111_f0111_to_f0114_113.jpg,e111_f0111_to_f0114_114.jpg,e111_f0111_to_f0114_115.jpg,e115_f0115_to_f0120b.jpg,e115_f0115_to_f0120_116.jpg,e115_f0115_to_f0120_117.jpg,e115_f0115_to_f0120_118.jpg,e115_f0115_to_f0120_119.jpg,e115_f0115_to_f0120_120.jpg,e121_f0121_a_f0124_121.jpg,e121_f0121_a_f0124_122.jpg,e121_f0121_a_f0124_123.jpg,e121_f0121_a_f0124_124.jpg,e125_f0125_to_f0128_125.jpg,e125_f0125_to_f0128_126.jpg,e125_f0125_to_f0128_127.jpg,e125_f0125_to_f0128_128.jpg,e129_f0129_a_f0132_129.jpg,e129_f0129_a_f0132_130.jpg,e129_f0129_a_f0132_131.jpg,e129_f0129_a_f0132_132.jpg,e427_ef0133_to_ef0136_133.jpg,e427_ef0133_to_ef0136_134.jpg,e427_ef0133_to_ef0136_135.jpg,e427_ef0133_to_ef0136_136.jpg,e137_e145_137.jpg,e138_e146_138.jpg,e139_e147_139.jpg,e140_e148_f0137_et_f0145_140.jpg,e141_e149_141.jpg,e142_e150_142.jpg,e143_e151_143.jpg,e144_e152_f0141_et_f0149_144.jpg,e137_e145_145.jpg,e138_e146_146.jpg,e139_e147_147.jpg,e140_e148_f0137_et_f0145_148.jpg,e141_e149_149.jpg,e142_e150_150.jpg,e143_e151_151.jpg,e144_e152_f0141_et_f0149_152.jpg".split(",");
			stimuliimages[21].imagetitles = "androids_experimenter_kids.png,e344_f0344.jpg".split(",");
      stimuliimages[24].imagetitles = "androids_experimenter_kids3.png,e367.jpg,e372.jpg,androids_experimenter_kids.png,e377.jpg,e379.jpg,e381.jpg,e383.jpg,e385.jpg,androids_experimenter_kids1.png,e387_0.jpg,androids_experimenter_kids2.png".split(",");
      stimuliimages[25].imagetitles = "androids_experimenter_kids.png,e393.jpg".split(",");
      stimuliimages[28].imagetitles = "androids_experimenter_kids.png,e408_0.jpg,e048_e408.jpg,e409_0.jpg,e049_e409.jpg,e410_0.jpg,e052_e410.jpg,e411_0.jpg,e053_e411.jpg,e412_0.jpg,e054_e412.jpg,e413_0.jpg,e058_e413.jpg,e414_0.jpg,e059_e414.jpg,e415_0.jpg,e060_e415.jpg,e416_0.jpg,e062_e416.jpg,e417_0.jpg,e064_e417.jpg".split(",");
      stimuliimages[29].imagetitles = "androids_experimenter_kids.png,e418_0.jpg,e066_and_f066_to_f070_ef418.jpg,e419_0.jpg,e071_e419.jpg,e420_0.jpg,ef420.jpg,e421_0.jpg,ef421.jpg,e422_0.jpg,ef422.jpg,e423_0.jpg,ef423.jpg,e424_0.jpg,ef424.jpg,e425_0.jpg,e077_and_f077_to_f080_ef425.jpg,e426_0.jpg,e081_and_f081_to_f088_ef426_f0419.jpg,e427_0.jpg,e427_ef0133_to_ef0136.jpg".split(",");



    }
		fetchExperimentTitle = function() {
			titleLabel = "Bilingual Aphasia Test - English";
		}
		fetchParticipantCodes = function() {
			participantCodes = 'ET1AM4mc, SAMPLE'.split(",");
		}
		setReplayParticipantCode = function(code) {
			console.log("IN set replay button");
			alert("Set replay participant to " + code);
		}
	}

	loadButton = function() {
		//fetchSubExperimentsArray();
		//fetchExperimentTitle();
		//addSubExperiments(subExperimentLabels.length);
		console.log(subExperiments);
		getPositionAsButton = function(x, y, buttonid, responses) {
			responses = allTouchResponses;
			/*
			If recieved a button id, flash that button
			and press it 500ms later
			 */
			console.log("checking touch at "+x+" "+y);
			if (buttonid != null) {
				for ( var k = 0; k < responses.length; k++) {
					if (responses[k].id === buttonid) {
						responses[k].color = "#999999";
						responses[k].r = buttonRadiusForClicking;
						responses[k].draw()
						ctx.textAlign = responses[k].textAlign;
						ctx.fillText(responses[k].label, responses[k].labelx,
								responses[k].labely);
						//alert("Clicked "+responses[k].id);
						setTimeout("window.pressButton(allTouchResponses[" + k
								+ "].id,allTouchResponses[" + k + "].label);", 500);
						return;//dont click on multiple buttons
					} else {
						//alert(" distance to this position "+d);
						//alert("Position filled is at "+responses[k].x+" "+responses[k].y);
					}
				}
			}
			/*
			Otherwise check to see if the x,y match a button
			 */

			for ( var k = 0; k < responses.length; k++) {
				var dx = x - responses[k].x;
				var dy = y - responses[k].y;
				var d = Math.sqrt(dx * dx + dy * dy);
				var R = 30;//buttonRadiusForClicking;// responses[k].r + 5;//added 10 pixles to click around the buton
				var exstim = responses[k].stimulus.split("_");
				var ex = exstim[0];
				var sti = exstim[1];		
				if (d <  200){	
					//console.log(ex+"  "+sti+" x:"+x+" touchx:"+responses[k].x+" y: "+y+" touchy:"+responses[k].y +" delta" +d);	
				}
				if ( currentSubExperiment.id == ex && currentStimulus.id == sti && d < R) {
					//responses[k].color = "#aaaaaa";
					responses[k].r = buttonRadiusForClicking;
					responses[k].draw();
					responses[k].label=responses[k].encodedResponse+" :  "+responses[k].userid+" @ "+responses[k].reactionTime/1000+"sec";
					responses[k].labelx=responses[k].x+10;
					responses[k].labely=responses[k].y+10;
					ctx.textAlign = "left";
					ctx.fillText(responses[k].label, responses[k].labelx,
							responses[k].labely);
					//alert("Participant "+responses[k].userid);
					setTimeout("window.pressButton(allTouchResponses[" + k
							+ "].id,allTouchResponses[" + k + "].label);", 0);
					return;//dont click on multiple buttons
				} else {
					//alert(" distance to this position "+d);
					//alert("Position filled is at "+responses[k].x+" "+responses[k].y);
				}
			}
		}
		ctx.canvas.addEventListener('touchstart', function(e) {
			//alert(e.changedresponses[0].pageX + " " + e.changedresponses[0].pageY);
			getPositionAsButton(e.pageX, e.pageY);
		});
		ctx.canvas.addEventListener('mousedown', function(e) {
			console.log(e);
			//alert(e.pageX + " " + e.pageY);
			getPositionAsButton(e.pageX, e.pageY);
		});

	}
	initCanvas = function() {
		canvasWidth = 1280;
		canvasHeight = 800;
		viewstimulus = document.getElementById("viewStimulus");
		viewstimulus.setAttribute("width", canvasWidth);
		viewstimulus.setAttribute("height", canvasHeight);
		//viewstimulus.setAtt.ibute('style', 'background-color: #999;');
		viewstimulus.style.position = "relative";
		viewstimulus.style.zindex = 1;
		window.ctx = viewstimulus.getContext("2d");
		
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		//loadButton();
	}
	loadData = function() {
		var u = new User();
		u.init(0);
		allUserIds.push(u);
		initCanvas();
		fetchSubExperimentsArray();
		fetchExperimentTitle();
		//addSubExperiments(subExperimentLabels.length);
		loadButton();
		//displaySampleSetUp();
  }
  displaySampleSetUp = function(){
		setCurrentSubExperiment(6);
		currentSubExperiment.stimuli[2].draw();
	}
	window.addEvent('domready', myMooFlowPage.start);
	window.addEvent('domready', loadData);
	