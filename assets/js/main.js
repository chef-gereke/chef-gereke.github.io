/*
	Hyperbolic by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

var settings = {
	impressionsBanner: {
		// Indicators (= the clickable dots at the bottom).
		indicators: true,

		// Transition speed (in ms)
		// For timing purposes only. It *must* match the transition speed of "#impressions-banner > article".
		speed: 1500,

		// Transition delay (in ms)
		delay: 4000
	}
};


(function ($) {

    var $window = $(window),
        $body = $('body'),
        $header = $('#header'),
        $nav = $('#nav'),
		$impressionsBanner = $('#impressions-banner'),
        $banner = $('#banner');

    // Breakpoints.
    breakpoints({
        default: ['1681px', null],
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Dropdowns.
    $('#nav > ul').dropotron({
        alignment: 'right',
        hideDelay: 350,
        baseZIndex: 100000
    });

    // Menu.
    $('<a href="#navPanel" class="navPanelToggle">Menu</a>')
        .appendTo($header);

    $('<div id="navPanel">' +
        '<nav>' +
        $nav.navList() +
        '</nav>' +
        '<a href="#navPanel" class="close"></a>' +
        '</div>')
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            target: $body,
            visibleClass: 'is-navPanel-visible',
            side: 'right'
        });

    // Scrolly.
    $('.scrolly').scrolly({
        offset: function () {
            return $header.outerHeight() - 5 - 64;
        }
    });

    // Header.
    if ($banner.length > 0
        && $header.hasClass('alt')) {

        $body.addClass('header-alt');

        $window.on('resize', function () {
            $window.trigger('scroll');
        });

        $banner.scrollex({
            bottom: $header.outerHeight() - 64,
            terminate: function () {
                $header.removeClass('alt');
                $body.removeClass('header-alt');
            },
            enter: function () {
                $header.addClass('alt');
                $body.addClass('header-alt');
            },
            leave: function () {
                $header.removeClass('alt');
                $body.removeClass('header-alt');
                $header.addClass('reveal');
            }
        });

    }

    // Banner.

    // Hack: Fix flex min-height on IE.
    if (browser.name == 'ie') {
        $window.on('resize.ie-banner-fix', function () {

            var h = $banner.height();

            if (h > $window.height())
                $banner.css('height', 'auto');
            else
                $banner.css('height', h);

        }).trigger('resize.ie-banner-fix');
    }



	/**
	 * Custom banner slider for Slate.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._slider = function(options) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._slider(options);

			return $this;

		}

		// Vars.
		var	current = 0, pos = 0, lastPos = 0,
			slides = [], indicators = [],
			$indicators,
			$slides = $this.children('article'),
			intervalId,
			isLocked = false,
			i = 0;

		// Turn off indicators if we only have one slide.
		if ($slides.length == 1)
			options.indicators = false;

		// Functions.
		$this._switchTo = function(x, stop) {

			if (isLocked || pos == x)
				return;

			isLocked = true;

			if (stop)
				window.clearInterval(intervalId);

			// Update positions.
			lastPos = pos;
			pos = x;

			// Hide last slide.
			slides[lastPos].removeClass('top');

			if (options.indicators)
				indicators[lastPos].removeClass('visible');

			// Show new slide.
			const slide = slides[pos];
			const correspondingImage = slide.find('img');

			slide.css('background-image', 'url("' + correspondingImage.attr('fakeSrc') + '")');
			slide.addClass('visible').addClass('top');

			if (options.indicators)
				indicators[pos].addClass('visible');

			// Finish hiding last slide after a short delay.
			window.setTimeout(function() {

				slides[lastPos].addClass('instant').removeClass('visible');

				window.setTimeout(function() {

					slides[lastPos].removeClass('instant');
					isLocked = false;

				}, 100);

			}, options.speed);

		};

		// Indicators.
		if (options.indicators)
			$indicators = $('<ul class="indicators"></ul>').appendTo($this);

		// Slides.
		$slides
			.each(function() {

				var $slide = $(this),
					$img = $slide.find('img');

				// Slide.
				$slide.css('background-position', ($slide.data('position') ? $slide.data('position') : 'center'));

				if (slides.length == 0) {
					// first entry; load image directly
					$slide.css('background-image', 'url("' + $img.attr('fakeSrc') + '")');
				}

				// Add to slides.
				slides.push($slide);

				// Indicators.
				if (options.indicators) {

					var $indicator_li = $('<li>' + i + '</li>').appendTo($indicators);

					// Indicator.
					$indicator_li
						.data('index', i)
						.on('click', function() {
							$this._switchTo($(this).data('index'), true);
						});

					// Add to indicators.
					indicators.push($indicator_li);

				}

				i++;

			});

		// Initial slide.
		slides[pos].addClass('visible').addClass('top');

		if (options.indicators)
			indicators[pos].addClass('visible');

		// Bail if we only have a single slide.
		if (slides.length == 1)
			return;

		// Main loop.
		intervalId = window.setInterval(function() {

			current++;

			if (current >= slides.length)
				current = 0;

			$this._switchTo(current);

		}, options.delay);

	};

	// Slider.
	$impressionsBanner
		._slider(settings.impressionsBanner);
})(jQuery);
