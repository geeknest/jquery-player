(function($) {
  var Player = function(){
    $.extend(this, {
      defaultSettings: {
        every: 3000,
        just: null,
        playing: true
      }
    });
  
    $.extend(Player.prototype, {
      schedule: function(options){
        var subscriber = new Subscriber ($.extend({every: this.defaultSettings.every}, options, {player: this}));
        this.subscribers.push(subscriber);
        subscriber.schedule();
        return subscriber;
      },
      subscribers: [],
      play: function(){
        if (this.isPlaying()) return;
        this.playing = true;
        this.scheduleAll();
        $(this).trigger('play');
      },
      pause: function(){
        if (this.isPaused()) return;
        this.playing = false;
        this.unscheduleAll();
        $(this).trigger('pause');
      },
      isPlaying: function()  { return this.playing == true  },
      isPaused:  function()  { return this.playing == false },
      ifPlaying: function(fn){ if (this.isPlaying()) fn()   },
      scheduleAll: function(){
        $.each(this.subscribers, function() {
          this.schedule();
        });
      },
      unscheduleAll: function(){
        $.each(this.subscribers, function(){
          this.unschedule();
        });
      },
      remove: function(toRemove) {
        this.subscribers = $.grep(this.subscribers, function(subscriber) {
          if (subscriber === toRemove) {
            subscriber.unschedule();
            return false;
          }
          return true;
        });
      },
      getSubscriber: function(options) {
        var options = $.extend({name: null}, options);
        if (options.name == null) return;
        var subscriber;
        $.each(this.subscribers, function(){
          if (this.name == options.name) {
            subscriber = this;
            return false;
          }
        });
        return subscriber;
      }
    });
    
    $.extend(this, this.defaultSettings);
  };

  var Subscriber = function(options){
    $.extend(this, {
      every: null,
      timeoutId: null,
      run: $.noop,
      timesRun: 0,
      name: null,
      isRunning: false,
      oneAtATime: false
    });
  
    $.extend(Subscriber.prototype, {
      timeoutId: null,

      fireNow: function(){
        this.unschedule();
        this.fire();
      },
      fire: function(){
        if (this.player.isPaused() || this.isRunning) return this.schedule();
        this.isRunning = true;
        ($.proxy(this.run, this))();
        if (!this.oneAtATime) this.isRunning = false;
        this.timesRun++;
        if (this.timesRun >= this.just) return this.player.remove(this);
        this.schedule();
      },
      finishedRunning: function() {
        this.isRunning = false;
      },
      schedule: function(){
        this.unschedule();
        this.timeoutId = setTimeout($.proxy(this.fire, this), this.every);
      },
      unschedule: function(){
        if (this.timeoutId) clearTimeout(this.timeoutId);
      }
    });

    $.extend(this, options);
  };
  
  $.extend({player: (new Player())});
})(jQuery);
