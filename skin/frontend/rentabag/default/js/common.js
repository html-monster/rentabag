G_VARS = {	isrentProduct: 0,	rentRanges: []}$j(document).ready(function () {	var windowWidth = $j(window).width();	$j(window).resize(function(){		windowWidth = ($j(this).width());	});	// header===========================================================================================================	//search hide/show	$j('.btn-search').click(function () {		if ($j('.btn-search') && $j('.btn-search').hasClass('active')) {			$j(this).removeClass('active');			$j(this).next().removeClass('active');		}		else if ($j('.btn-search')) {			$j('#header-cart').removeClass('skip-active');			$j('#header-account').removeClass('skip-active');			$j(this).addClass('active');			$j(this).next().addClass('active');		}	});	if ($j('.btn-search')) {		$j(document).click(function (event) {			if ($j(event.target).closest(".btn-search").length || $j(event.target).closest("#search_mini_form").length)				return;			if ($j(event.target).closest(".skip-account").length || $j(event.target).closest("#header-cart").length) {				closeSearch();				return;			}			if ($j(event.target).closest(".skip-cart").length){				closeSearch();				return;			}			$j('#header-cart').removeClass('skip-active');			$j('#header-account').removeClass('skip-active');			closeSearch();			event.stopPropagation();		});		function closeSearch(){			$j('.btn-search').removeClass('active');			$j('form#search_mini_form').removeClass('active');		}	}	$j(window).resize(function(){		resizeMenuItems();	});	resizeMenuItems();	function  resizeMenuItems(){		if(windowWidth > 770){			$j('ul.level0').each(function(){				if($j(this).find('li.parent').length != 0)					$j(this).css('width', '500px');			});		}		else{			$j('ul.level0').each(function(){				if($j(this).find('li.parent').length != 0)					$j(this).css('width', 'auto');			});		}	}	//Menu	$j('.level0').each(function () {		var	link = $j(this).children('a');		if(link.attr('href') === 'https://www.rent-a-bag.club/home')				link.attr('href', '/how-it-works-rent-a-bag');		if(link.attr('href') === 'http://rentabag.loca/home')			link.attr('href', '/how-it-works-rent-a-bag');	});	$j('.level1.view-all').each(function () {		var	link = $j(this).children('a');		if(link.attr('href') === 'https://www.rent-a-bag.club/home')			$j(this).hide();		if(link.attr('href') === 'http://rentabag.loca/home')			$j(this).hide();	});	// =================================================================================================================	// sidebar==========================================================================================================	$j('.sidebar').on('click', '.fme-filter .block-subtitle--filter', function(){		$j(this).toggleClass('active');		$j(this).parents('.block-content').toggleClass('active');	});	// =================================================================================================================	 //product content==================================================================================================	 //height of columns	function setEqualHeight(columns)	{		var tallestcolumn = 0;		columns.each(				function()				{					var currentHeight = $j(this).height();					if(currentHeight > tallestcolumn)					{						tallestcolumn = currentHeight;					}				}		);		columns.height(tallestcolumn);	}	// $j('#fme_layered_container').bind("DOMSubtreeModified",function(){	//	// 	setEqualHeight($j(".products-grid  > .item .product-info"));	//	// });	 //=================================================================================================================	//home page content==================================================================================================	if($j('body').hasClass('cms-home')){		function carousel() {			var owl = $j(".slider0");			// var owl2 = $j(".slider1");			// owl2.owlCarousel({			//			// 	items : 3,			//			// 	loop : true,			//			// 	navigation : true,			//			// 	autoHeight : true,			//			// 	dots : true,			//			// 	singleItem : false,			//			// 	slideSpeed : 600,			//			// 	paginationSpeed : 600,			//			// 	// autoPlay : 3500,			//			// 	rewindSpeed : 600,			//			// 	scrollPerPage : false,			//			// 	margin : 50,			//			// 	stopOnHover : true			//			// });			owl.owlCarousel({				items : 3,				loop : true,				navigation : true,				autoHeight : true,				dots : true,				singleItem : false,				slideSpeed : 600,				paginationSpeed : 600,				// autoPlay : 3000,				rewindSpeed : 600,				scrollPerPage : false,				margin : 50,				stopOnHover : true			});			$j(".next_button").click(function() {				owl.trigger("owl.next");				// owl2.trigger("owl.next");			});			$j(".prev_button").click(function() {				owl.trigger("owl.prev");				// owl2.trigger("owl.prev");			});			owl.on("resized.owl.carousel", function(event) {				var $jthis = $j(this);				$jthis.find(".owl-height").css("height", $jthis.find(".owl-item.active").height());			});			setTimeout(function() {				owl.find(".owl-height").css("height", owl.find(".owl-item.active").height());				// owl2.find(".owl-height").css("height", owl2.find(".owl-item.active").height());			}, 5000);		};		carousel();	}	//===================================================================================================================	//single product page==================================================================================================	var today = moment((+moment().format('x') + 86400000 *2)).format('DD/MM/YYYY');	var today_unix = +moment(moment(today, 'DD/MM/YYYY')).format('x');	var some_date_range = G_VARS.rentRanges;	var input_date = $j('input[name="daterange"]');	var jj = 1;	input_date.daterangepicker({		locale: {			format: 'DD/MM/YYYY'		},		"showWeekNumbers": true,		"autoApply": true,		"opens": "center",		"minDate": today,		"isInvalidDate" : function(date){			for(var ii = 0; ii < some_date_range.length; ii++ ){				if(some_date_range[ii][0] * 1000 - 122800000 <= +moment(date).format('x') && +moment(date).format('x') <= some_date_range[ii][1] * 1000 + 122800000						//|| some_date_range[jj][0] * 1000 == +moment(date).format('x') + 122800000 && +moment(date).format('x') - 122800000 == some_date_range[ii][1] * 1000						|| (+moment(date).format('x') == today_unix) && today_unix + 209200000 >= some_date_range[ii][0] * 1000)				{					if(jj < some_date_range.length - 1){						jj++;					}					return true;				}			}		}	});	input_date.on('apply.daterangepicker', function(ev, picker) {		var some_date_min = 0;		for(var ii = 0; ii < some_date_range.length; ii++){			var some_date = some_date_range[ii][0] * 1000;			var startDate = +picker.startDate.format('x') - 122800000;			var endDate = +picker.endDate.format('x') + 122800000;			if (some_date > startDate && some_date < endDate){				if(some_date_min > some_date || some_date_min === 0){					some_date_min = some_date;				}				var min_date = moment(some_date_min - 122800000, "x");				min_date = moment(min_date).format('DD-MM-YYYY');				input_date.data('daterangepicker').setEndDate(min_date);			}		}	});	$j(input_date).change(function(){		var val = $j(this).val().split(' ');		if(val[0] == val[2])		{			input_date.val('');			$j('#error').text('Rent is possible for at least two days');		}		else		{			$j('.options_from_date').val(val[0]);			$j('.options_to_date').val(val[2]);			$j('#error').text('');		}	});	$j('.add-to-cart-buttons .btn-cart').click(function(){		var val = input_date.val();		if(val == '')		{			$j('#error').text('The field must not be empty');		}		else		{			productAddToCartForm.submit(this);		}	});	//if(typeof some_date_range !== 'undefined' && some_date_range.length > 0){	//	var container = $j('.short-description .std');	//	container.append('<p>Rented for those dates:</p>');	//	for(var ii = 0; ii < some_date_range.length; ii++)	//	{	//		var from = moment(some_date_range[ii][0] * 1000 - 86400000, "x").format('DD/MM/YYYY');	//		var to = moment(some_date_range[ii][1] * 1000 + 86400000, "x").format('DD/MM/YYYY');	//		container.append('<span>' + from + ' - ' + to + '</span><br>')	//	}	//	var button = $j('.short-description .std .button').detach();	//	container.append(button);	//}	//===================================================================================================================	//cart page content==================================================================================================	$j('.product-cart-info').each(function(){		console.log($j(this).children('.item-options').find('dt').text().indexOf('From') == -1);		if($j(this).children('.item-options').find('dt').text().indexOf('From') == -1)		{			$j(this).next().next().css('visibility', 'visible');		}		else		{			$j(this).next().next().html('<p>-  </p>').css('visibility', 'visible');		}	});	//===================================================================================================================	//FAQ================================================================================================================	$j('.question').click(function () {		$j(this).next().slideToggle(400);	});	// ==================================================================================================================});