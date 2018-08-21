function ajax(options){
  var xhr = null;
  try{
    xhr = new XMLHttpRequest();
  }catch(e){
    xhr = ActiveXobject('Microsoft.XMLHTTP');
  }

  var method = options.method || 'get';
  var url = method === 'get'? options.url + "?" + options.data: options.url;
  xhr.open(method, url, true);

  if(method === 'get'){
    xhr.send();
  }else{
    xhr.setRequestHeader("Content-Type", options.contentType);
    xhr.send(options.data);
  }

  // awake this function when data sent to the server
  xhr.onreadystatechange = function(ev){
    if(xhr.readyState === 4 && xhr.status === 200){
      var arr = JSON.parse(xhr.responseText);
      options.receiverListener && options.receiverListener(options.trigger, arr, options.callbackFunction);
    }else if(xhr.readyState === 2){
      options.sendListener && options.sendListener(options.trigger, options.data);
    }
  }
}
