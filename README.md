# ls.js

Localstorage wrapper with a support of time to live.

Usage:-

### To save an item in localStorage with a ttl(time to live).

``ls.setItem(key, value, timeinmilliseconds);``

``ls.setItem('a', 'b', 1000);``

when you dont want any ttl: ```ls.setItem('a','b');```

### To get item from localStorage.

``ls.getItem('a');``

### To remove and item from localStorage.

``ls.removeItem('a');``

##### NOTE: The ttl will persist even if the browser is closed. 
