ls = (function(){
	
	var ls = localStorage;

	var _metaData = localStorage.metaData ? JSON.parse(localStorage.metaData) : {}, _tos_time = +localStorage.tos_time || 0, cron = null;

	localStorage.setItem('metaData', JSON.stringify(_metaData));
	localStorage.setItem('tos_time', _tos_time);

	

	window.metaData = _metaData;
	window.tos_time = _tos_time;
	

	var deleteMetaData = function(key){
		for (var j in metaData){ 
			
			if(typeof metaData[j] == 'object' && typeof metaData[j].indexOf == 'function'){
				// its an array
				var _arr = metaData[j], _len = _arr.length;
				for (var i = _len - 1; i >= 0; i--) {
						if(_arr[i] == key){
							_arr.splice(i,1);
							break;

						}		

					};	
			}else if(metaData[j] == key){
	
				delete metaData[j];
				break;
			
			}
		}

		if(tos_time = key){

			resetTosTime();
		}

		//reset settimeout if it is actie
	};

	var setItem = function(key, value, time){ 


		//if the key already exists
		//delte its metadata or update it ... also see the consequence
		if(localStorage.getItem(key) && time){   //if key is already present and expiry time is specified

 			//remove the key
			console.log('key already present deleting it');
			deleteMetaData(key);
		}



		ls.setItem(key, value);

		if(!time){
			return;
		}

		var _abs_time = new Date().getTime() + time;		

		if(typeof metaData[_abs_time] == 'object' && typeof metaData[_abs_time].indexOf == 'function'){ 
				metaData[_abs_time].push(key);

		}else if(metaData[_abs_time]){ 
			var tempVal = metaData[_abs_time];	
			metaData[_abs_time] = [tempVal, key];	
		}else{ 

			metaData[_abs_time] = key;	
		}
		
		

		if(_abs_time < tos_time || tos_time == 0){   
			tos_time = _abs_time;
			
			cron_fn(tos_time);
			localStorage.setItem('tos_time', tos_time);	
		}

		localStorage.setItem('metaData', JSON.stringify(metaData));

		
	};

	var cron_fn = function(abs_time){

		

		var _curr_time = new Date().getTime();
		if(cron){
				
			window.clearTimeout(cron);
		}

		

		cron = window.setTimeout(kill_item, abs_time - _curr_time );
	};


	var resetTosTime = function(){

		tos_time = 0;
		var j;
		for(j in metaData){
			if(tos_time == 0 || j < tos_time){
				tos_time = j;

			}

		}

		cron_fn(tos_time);



	};

	var kill_item = function(){

		
		
		var _key = metaData[tos_time];

		if(typeof _key == 'object' && typeof _key.indexOf == 'function'){
			var _length = _key.length;
			for (var i = _len - 1; i >= 0; i--) {

				localStorage.removeItem(_key[i]);
				console.log('Killing Item: '+_key[i]+ 'Expire Time: '+ tos_time + "Current time: "+ new Date().getTime() );	
				
			};

		}else{

			localStorage.removeItem(_key);
			console.log('Killing Item: '+_key+ 'Expire Time: '+ tos_time + "Current time: "+ new Date().getTime() );	
		}

		delete metaData[tos_time];


		tos_time = 0;
		var j;
		for(j in metaData){
			if(tos_time == 0 || j < tos_time){
				tos_time = j;

			}

		}

		
		if(tos_time > 0  && metaData[tos_time]  && (typeof localStorage[metaData[tos_time]] !== 'undefined') ){

			cron_fn(tos_time);		
		}

		localStorage.setItem('metaData', JSON.stringify(metaData));
		localStorage.setItem('tos_time', tos_time);
		
	};


	if(tos_time > 0){

		
		cron_fn(tos_time);
	}

	return {

		'setItem': setItem
	}
})();