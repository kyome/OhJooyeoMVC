(()=>{
	let numberBallNameList = [
		1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20
	];
	let initSize = numberBallNameList.length;
	numberBallNameList.remove = function(target){
		let targetIndex = this.indexOf(target);
		return this.splice(targetIndex,1);
	};

	let basicTimeout = 10;
	let interval;
	let loopBallIndex = 0;

	function changeImage () {
		let image = document.getElementById('image');

		image.src = 'img/'+numberBallNameList[loopBallIndex]+'.png';
		loopBallIndex = loopBallIndex+1;
		if(loopBallIndex >= numberBallNameList.length) {
			loopBallIndex = 0;
		}
	}

	function startLoop(){
		controlButton('start',true);
		controlButton('stop',false);
		interval = setInterval(changeImage, basicTimeout);
	}

	function stopLoop() {
		controlButton('stop',true);
		controlButton('start',true);

		clearInterval(interval);
		interval = setInterval(changeImage, 50);

		setTimeout(function() {
			clearInterval(interval);
			if (loopBallIndex === 0 ){
				loopBallIndex = numberBallNameList.length;
			}
			let ballNumber = numberBallNameList[loopBallIndex-1];
				
			 appendContainer(ballNumber);
			 numberBallNameList.remove(ballNumber,1)
			 // console.log('자식 노드갯수'+document.getElementById('container').childNodes.length)
			if(document.getElementById('container').childNodes.length<8){
				controlButton('start',false);
			}
			let balls = document.getElementsByClassName('circle');
			balls[balls.length-1].addEventListener("click", function(){
				if(document.getElementById('container').childNodes.length==8){
					let inputValue = prompt("변경할 숫자를 입력해주세요.");
					
					if(String(inputValue).trim()){
//						if(inputValue&&/^[0-9]*$/.test(inputValue)){
					
						let changeCount = parseInt(this.parentElement.childNodes[1].innerHTML.split(':')[1]);
						if(/^[0-9]*$/.test(inputValue) && inputValue == 0){
							this.parentElement.childNodes[1].innerHTML = '쿠폰가:'+(changeCount-1);
						}
						else if(/^[0-9]*$/.test(inputValue) && inputValue <= initSize){
							this.innerHTML = inputValue;
							this.parentElement.childNodes[1].innerHTML = '쿠폰가:'+(changeCount+1);
//						}
						}
					}
				}
			});
	

		},3500);

		setTimeout(function() {
			clearInterval(interval);
			interval = setInterval(changeImage, 80);
		},300);
		
		setTimeout(function() {
			clearInterval(interval);
			interval = setInterval(changeImage, 100);
		},500);

		 setTimeout(function() {
		 	clearInterval(interval);
		 	interval = setInterval(changeImage, 200);
		 },1000);
		 
		 setTimeout(function() {
			 	clearInterval(interval);
			 	interval = setInterval(changeImage, 400);
		 },2000);
	}

	let startButton = document.getElementById('start');
	startButton.addEventListener('click',startLoop);

	let stopButton = document.getElementById('stop');
	stopButton.addEventListener("click", stopLoop);




})();

function controlButton(elementId,disabledOption){
	document.getElementById(elementId).disabled=disabledOption;
}

let appendContainer = function (ballNumber) {
	let divGroup = document.createElement('div');
	divGroup.classList.add('divGroup');
	let div = document.createElement('div');
	div.classList.add('circle');
	div.classList.add('c'+ballNumber%4);
	div.innerHTML=ballNumber;
	let divCount = document.createElement('div');
	divCount.classList.add('changeCount');
	divCount.innerHTML='쿠폰가:1';
	divGroup.appendChild(div);
	divGroup.appendChild(divCount);

	document.getElementById('container').appendChild(divGroup);
};

