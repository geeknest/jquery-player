## Schedule a job to run every few seconds.

```javascript
$.player.schedule({
  run: function() {
    $('<div>Run number ' + this.timesRun + '</div>').appendTo('body');
  }
});
```

## Schedule a job to run every minute.

```javascript
$.player.schedule({
  run: function() { /* ... */ },
  every: 60 * 1000
});
```

## Schedule a job to run only three times.

```javascript
$.player.schedule({
  run: function() { /* ... */ },
  just: 3
});
```

## Pause or play all jobs.

```javascript
$.player.pause();

$.player.play();
```