/*
 * @ls.js
 * Wrapper for modifying Local Storage.
 *
 * Supports ttl.(Time to live).
 *
 * @description
 *
 * {Object} metaData: This data structure stores an associative array of expiry times(Epoch) and keys expiring at those times.
 *                    So if x is expiring at epoch = 10, y is at epoch = 15 and z is at epoch 10. metadata will be {10: [x,z], 15:y}
 *
 * {String} tosTime: Minimum epoch time that is stored in metaData. The time of key that will be deleted first.
 *
 * A cron(using setTimeout) is registerd to delete the key with death time equal tosTime. And this is set when the function is executed.
 *
 */
var ls = (function(){
  'use strict';

  /*
   *  Variables.
   *  @metaData: For storing metaData in localstorage.
   *  @tosTime: The latest time at which some localStorage variable is to be deleted.
   *  @cron: For storing instance of window.setTimeout.
   *
   */
  var ls = window.localStorage,
    metaData,
  tosTime,
  cron;

  /*
   *  Check if we aleady have metaData in localStorage.
   *  If not create and object and set it to localStorage.
   *
   */
  if(metaData = ls.getItem('__metaData')){
    metaData = JSON.parse(metaData);
  }else{
    metaData = {};
    ls.setItem('__metaData', JSON.stringify(metaData));
  }

  /*
   *
   * Check if we already have tosTime in localStorage.
   * If not initialize it with 0 and also save in localStorage.
   *
   */

  if(tosTime = ls.getItem('__tosTime')){
    x = +x;
  }else{
    tosTime = 0;
    ls.setItem('__tosTime', tosTime);
  }


  /*
   *  @deleteMetaData
   *
   *  Function to delete metaData stored for a key.
   *
   *  @param: key - Key whose metaData is to be deleted.
   *
   */
  var deleteMetaData = function(key){
    for (var j in metaData){
      if(typeof metaData[j] == 'object' && typeof metaData[j].indexOf == 'function'){
        var arr = metaData[j],
          len = arr.length;
        for (var i = len - 1; i >= 0; i--) {
          if(arr[i] == key){
            arr.splice(i,1);
            break;
          }		
        };	
      }else if(metaData[j] == key){
        delete metaData[j];
        break;
      }
    }
    if(tosTime = key){
      resetTosTime();
    }
  };

  /*
   *  @setItem
   *
   *  Function to set key/value in localStorage and saving a trigger to delete the key at an specified time.
   *
   *  @param key - Key to save in localStorage.
   *  @param value - Value of the key.
   *  @param time - Time to live for the key. Provided in milliseconds.
   *
   */
  var setItem = function(key, value, time){
    if(ls.getItem(key) && time){
      deleteMetaData(key);
    }
    ls.setItem(key, value);
    if(!time){
      return;
    }
    var absTime = new Date().getTime() + time;
    if(typeof metaData[absTime] == 'object' && typeof metaData[absTime].indexOf == 'function'){
      metaData[absTime].push(key);
    }else if(metaData[absTime]){
      var tempVal = metaData[absTime];
      metaData[absTime] = [tempVal, key];
    }else{
      metaData[absTime] = key;
    }
    if(absTime < tosTime || tosTime == 0){
      tosTime = absTime;
      cronFn(tosTime);
      ls.setItem('__tosTime', tosTime);
    }
    ls.setItem('__metaData', JSON.stringify(metaData));
  };

  /*
   * @cronFn
   *
   * Function to set a cron using setTimeout, this is responsible for deleting the key/s which have death time equals to tosTime.
   *
   *
   */
  var cronFn = function(absTime){
    var currTime = new Date().getTime();
    if(cron){
      window.clearTimeout(cron);
    }
    cron = window.setTimeout(killItem, absTime - currTime );
  };


  /*
   * @resetTosTime
   *
   * Function to set tosTime. This is the minimum of all Epoch times in metaData.
   *
   */
  var resetTosTime = function(){
    tosTime = 0;
    var j;
    for(j in metaData){
      if(tosTime == 0 || j < tosTime){
        tosTime = j;
      }
    }
    cronFn(tosTime);
  };

  /*
   *  @killItem
   *
   *  Function responsible for killing the item(deleteting it from localStorage), when its time to live if over.
   *  It kills the object with death time(Epoch) equal to tosTime.
   *
   */
  var killItem = function(){
    var key = metaData[tosTime];
    if(typeof key == 'object' && typeof key.indexOf == 'function'){
      var length = key.length;
      for (var i = len - 1; i >= 0; i--) {
        ls.removeItem(key[i]);
      };
    }else{
      ls.removeItem(key);
    }
    delete metaData[tosTime];
    tosTime = 0;
    var j;
    for(j in metaData){
      if(tosTime == 0 || j < tosTime){
        tosTime = j;
      }
    }
    if(tosTime > 0  && metaData[tosTime]  && (typeof ls[metaData[tosTime]] !== 'undefined') ){
      cronFn(tosTime);
    }
    ls.setItem('metaData', JSON.stringify(metaData));
    ls.setItem('tosTime', tosTime);
  };

  /*
   *  Initialize the cron to kill an item with lowest tosTime.
   *
   */
  if(tosTime > 0){
    cronFn(tosTime);
  }

  return {
    'setItem': setItem,
    'getItem': ls.getItem,
    'removeItem': ls.removeItem
  }
})();
