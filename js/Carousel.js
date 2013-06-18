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
      current_pane = 0,
      target;

  function setContainerOffset(target, percent, animate) {
    if (!target) {
      return;
    }
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
      target.css("top", px + "px");
    }
  }

  this.next = function() {
    if (current_pane === pane_count - 1) {
      setContainerOffset(element, 0, true);
      return;
    }
    setContainerOffset(panes.eq(current_pane), -100, true);
    current_pane += 1;
  };
  this.prev = function() {
    if (current_pane === 0) {
      setContainerOffset(element, 0, true);
      return;
    }
    setContainerOffset(panes.eq(current_pane - 1), 0, true);
    current_pane -= 1;
  };

  function handleHammer(event) {
    // disable browser scrolling
    event.gesture.preventDefault();
    var drag_offset = 100 / paneHeight * event.gesture.deltaY;

    switch(event.type) {
      case 'dragup':// slow down at the first and last pane
        target = $(event.target).closest('div');
        if (current_pane === pane_count - 1) {
          drag_offset *= .4;
          target = element;
        }
        setContainerOffset(target, drag_offset);
        break;

      case 'dragdown':
        // slow down at the first and last pane
        target = $(event.target).closest('div');
        if (current_pane === 0) {
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
          setContainerOffset(target, 0);
        }
        target = null;
        break;
    }
  }

  element.hammer({ drag_lock_to_axis: true })
    .on("release dragup dragdown swipeup swipedown", handleHammer);
}