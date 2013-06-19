/**
 * super simple carousel
 * animation between panes happens with css transitions
 */
function Carousel(element) {
  var self = this,
      dir = 0,
      isPlaying = false,
      timeout = 0;
  element = $(element);

  var panes = element.children(),
      paneWidth = element.width(),
      paneHeight = element.height(),
      total = panes.length,
      current = 0,
      target;

  function setContainerOffset(target, percent, animate) {
    if (!target) {
      return;
    }

    if (animate) {
      isPlaying = true;
      target.addClass("animate");
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        target.removeClass("animate");
        current += dir;
        dir = 0;
        isPlaying = false;
        console.log(target.index(), 'cao');
      }, 400);
    }

    if (Modernizr.csstransforms3d) {
      target.css("transform", "translate3d(0, " + percent + "%, 0) scale3d(1, 1, 1)");
    } else if(Modernizr.csstransforms) {
      target.css("transform", "translate(0, "+ percent +"%)");
    } else {
      var px = paneHeight * percent;
      target.css("top", px + "px");
    }
    console.log(target.index(), percent);
  }

  this.prev = function() {
    console.log('prev');
    if (current === 0) {
      setContainerOffset(element, 0, true);
      return;
    }
    setContainerOffset(panes.eq(current - 1), 0, true);
    dir = -1;
  };
  this.next = function() {
    console.log('next');
    if (current === total - 1) {
      setContainerOffset(element, 0, true);
      return;
    }
    setContainerOffset(panes.eq(current), -100, true);
    dir = 1;
  };

  function handleHammer(event) {
    // disable browser scrolling
    event.gesture.preventDefault();
    if (isPlaying) {
      return;
    }
    console.log(event.type);
    var drag_offset = 100 / paneHeight * event.gesture.deltaY;

    switch(event.type) {
      case 'dragup':// slow down at the first and last pane
        target = $(event.target).closest('div');
        if (current === total - 1) {
          drag_offset *= .4;
          target = element;
        }
        setContainerOffset(target, drag_offset);
        break;

      case 'dragdown':
        // slow down at the first and last pane
        target = $(event.target).closest('div');
        if (current === 0) {
          drag_offset *= .4;
          target = element;
        } else {
          target = target.prev();
          drag_offset -= 100;
        }

        setContainerOffset(target, drag_offset);
        break;

      case 'swipeup':
        self.next();
        event.gesture.stopDetect();
        break;

      case 'swipedown':
        self.prev();
        event.gesture.stopDetect();
        break;

      case 'release':
        // more then 50% moved, navigate
        if (Math.abs(event.gesture.deltaY) > paneHeight / 3) {
          if(event.gesture.direction === Hammer.DIRECTION_DOWN) {
            self.prev();
          } else {
            self.next();
          }
        } else {
          setContainerOffset(target, 0, true);
        }
        target = null;
        break;
    }
  }
  function tapHandler(event) {
    var link = LINK[current];
    if (link && $.isArray(link)) {
      var width = paneHeight / 11 * 8,
          x = paneWidth - width >> 1,
          tapX = event.gesture.center.pageX,
          tapY = event.gesture.center.pageY;
      for (var i = 0, len = link.length; i < len; i++) {
        var left = x + width * link[i].x,
            right = x + width * (link[i].x + link[i].width),
            top = paneHeight * link[i].y,
            bottom = paneHeight * (link[i].y + link[i].height);
        console.log(tapX, left, right, tapY, top, bottom);
        if (tapX > left && tapX < right && tapY > top && tapY < bottom) {
          link = link[i].url;
          break;
        }
      }
    }
    if (!$.isArray(link)) {
      var win = window.open(link, '_blank');
      win.focus();
    }
  }

  element.hammer({ drag_lock_to_axis: true })
    .on("release dragup dragdown", handleHammer)
    .on('tap', tapHandler);
}