(function($) {
 
  var o = $({});
 
  $.subscribe = function() {
    o.on.apply(o, arguments);
  };
 
  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };
 
  $.publish = function() {
    o.trigger.apply(o, arguments);
  };
 
}(jQuery));

function Slider(container, nav){
	this.container = container;
	this.clone(this.container);
	this.nav = nav;
	this.imgs = this.container.find('.slider-image');
	this.imgsLen = this.imgs.length;

	this._resize();
	
	this.current=0;
}

Slider.prototype._resize = function() {
	this.imgWidth = this.container.width();
	this.container.find('.slider-image').css('width',this.imgWidth);
	this.slider = this.container.children('.slider').css('width', this.imgWidth * this.imgsLen);
	this.slider.css('marginLeft', - (this.imgsLen-1) * this.imgWidth)

}

Slider.prototype.slide = function( dir ) {
	this.dir = dir;
	this.fadeOut();
};

Slider.prototype.transition = function (coords) {
	this.setCurrent();
	this.slider.animate({
		'margin-left': coords || -(this.current * this.imgWidth)
	},2000, this.fadeIn.bind(this) );
};

Slider.prototype.setCurrent = function( ) {
	if(this.dir === 'prev') {
		if (this.current === 0) {
			this.slider.css('marginLeft', - (this.imgsLen-1) * this.imgWidth);
			this._decrement();
			this.randomBgColor();
		};
		this._decrement();
		this.randomBgColor();
	} else{
		if (this.current === this.imgsLen - 1 ) {
			this.slider.css('marginLeft', 0);
			this._increment();
			this.randomBgColor();
		};
		this._increment();
		this.randomBgColor();
	}
};

Slider.prototype.clone = function (container){
	
	
	this.slider = this.container.children('div.slider');


	var length = this.slider.children().length;
	this.slider.children().first().clone().insertAfter(this.slider.children().eq( length - 1 ));
};

Slider.prototype._increment = function() {
	this.current = (this.current + 1 ) % this.imgsLen;
};

Slider.prototype._decrement = function() {
	this.current -- ;
	if ( this.current < 0 ) 
		this.current = this.imgsLen - 1 ;
};

Slider.prototype.randomBgColor = function() {
	var randColor = 'rgb(' + (Math.floor(Math.random() * 256))
	  + ',' + (Math.floor(Math.random() * 256)) 
	  + ',' + (Math.floor(Math.random() * 256)) + ')';
		$( ".homepage" ).css( "background-color", randColor );
}

Slider.prototype.fadeOut = function() {
	this.nav.addClass('pointer-hidden');
	this.slider.children().eq(this.current).children().animate({
		opacity : 1 
	},this.transition.bind(this));
};

Slider.prototype.fadeIn = function() {
	this.slider.children().eq(this.current).children().animate({
		opacity : 1 
	});
	this.nav.removeClass('pointer-hidden');
};





function Gallery(container){
	this.container = container;
	this.buttons = this.container.find('.item-selectors');
	this.items = this.container.find('.items');

	this.buttons.on('click', function(ev) {
		ev.preventDefault();
		var currentButton = $(ev.target);
		var dataType = currentButton.data('type');

		if ( !currentButton.hasClass('active')) {
				this.buttons.removeClass('active');
				currentButton.addClass('active');
				this.filter(dataType);
		}
	}.bind(this));

	this.buttons.on('click', function() {
	  	var datatype = $(this).data('type');
	  	$.publish('dataChanged', datatype);
	});
};

Gallery.prototype.filter = function( category ) {
	if( category == 'All') {
		this.items
				.not(':visible')
				.fadeIn();
	}
	else {
		this.items
			.stop(true,true)
			.fadeOut(0)
			.filter(function() {
				var dataFilter = $(this).data('itemfilter');
	            for(var i = 0; i < dataFilter.length; i++) {
	                if (dataFilter[i] == category)
	                    return true;
	            }
			})
			.fadeIn(1000);
	}
};



(function(){
	var slider = new Slider( $('div.slider-container'), $('.slider-nav') );
	var x = new Gallery($('.gallery'));

	slider.nav.on('click', function(ev){
		slider.slide( $(ev.target).data('dir'));
	});	



	$(function() {
		$(".fancybox").fancybox();
	});


	$.subscribe('dataChanged', function(ev, datatype) {
 	 $('.datachange').text(datatype);
	});

	$(window).on('resize',function(){
		slider._resize();
	})
})();




















