/**
 * super simple carousel
 * animation between panes happens with css transitions
 */
function Carousel(element) {
  var self = this;
  element = $(element);

  var panes = element.children(),
      paneHeight = element.height(),
      pane_count = panes.length,
      current_pane = 0;

  /**
   * show pane by index
   * @param   {Number}    index
   */
  this.showPane = function( index ) {
    // between the bounds
    index = Math.max(0, Math.min(index, pane_count - 1));
    current_pane = index;

    var offset = -((100 / pane_count) * current_pane);
    setContainerOffset(panes.eq(index), offset, true);
  };


  function setContainerOffset(target, percent, animate) {
    target.removeClass("animate");

    if (animate) {
      target.addClass("animate");
    }

    if (Modernizr.csstransforms3d) {
      target.css("transform", "translate3d(0, " + percent + "%, 0) scale3d(1, 1, 1)");
    } else if(Modernizr.csstransforms) {
      target.css("transform", "translate(0, "+ percent +"%)");
    } else {
      var px = ((paneHeight * pane_count) / 100) * percent;
      target.css("left", px + "px");
    }
  }

  this.next = function() { 
    return this.showPane(current_pane + 1, true);
  };
  this.prev = function() { 
    return this.showPane(current_pane - 1, true);
  };

  function handleHammer(event) {
    // disable browser scrolling
    event.gesture.preventDefault();

    switch(event.type) {
      case 'dragup':
      case 'dragdown':
        // stick to the finger
        var pane_offset = -(100 / pane_count) * current_pane;
        var drag_offset = ((100 / paneHeight) * event.gesture.deltaY) / pane_count;

        // slow down at the first and last pane
        if ((current_pane == 0 && event.gesture.direction == Hammer.DIRECTION_DOWN) ||
          (current_pane == pane_count - 1 && event.gesture.direction == Hammer.DIRECTION_UP)) {
          drag_offset *= .4;
        }

        setContainerOffset(event.target, drag_offset + pane_offset);
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
        if (Math.abs(event.gesture.deltaY) > paneHeight/2) {
          if(event.gesture.direction == Hammer.DIRECTION_DOWN) {
            self.prev();
          } else {
            self.next();
          }
        } else {
          self.showPane(current_pane, true);
        }
        break;
    }
  }

  element.hammer({ drag_lock_to_axis: true })
    .on("release dragup dragdown swipeup swipedown", handleHammer);
}