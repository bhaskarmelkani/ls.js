ls = (function(){

  var ls = localStorage;

  var metaData = localStorage.metaData ? JSON.parse(localStorage.metaData) : {}, tos_time = localStorage.tos_time ||0, cron = null;

  localStorage.setItem('metaData', JSON.stringify(metaData));

  metaData = JSON.parse(localStorage.getItem('metaData'));

  window.metaData = metaData;


  var setItem = function(key, value, time){

    ls.setItem(key, value);

    var _abs_time = new Date().getTime() + time;		

    metaData[key] = _abs_time;

    localStorage.setItem('metaData', JSON.stringify(metaData));

    cron_fn(_abs_time);
  };

  var cron_fn = function(abs_time){

    var _curr_time = new Date().getTime();":windw"
    cron = window.setTimeout(kill_item, abs_time - _curr_time );
  };

  var kill_item = function(){

    console.log('kill item called');	
    localStorage.clear();

  };


  var temp_key = null;
  if(temp_key = Object.keys(metaData)[0]){

    var timeSpan = metaData[temp_key] - new Date().getTime();
    if( timeSpan <= 0){

      kill_item();
    }else{


      cron = window.setTimeout(kill_item, timeSpan);	
    }


  }

  return {

    'setItem': setItem
  }
})();
