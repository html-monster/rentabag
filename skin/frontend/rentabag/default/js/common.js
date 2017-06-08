'use strict';

var G_CURRENTPAGE = '';
var G_VARS = {
  isrentProduct: 0,
  rentRanges: []
};

$j(document).ready(function () {

  var windowWidth = $j(window).width();

  $j(window).resize(function () {

    windowWidth = $j(this).width();
  });

  $j('.btn-search').click(function () {

    if ($j('.btn-search') && $j('.btn-search').hasClass('active')) {

      $j(this).removeClass('active');

      $j(this).next().removeClass('active');
    } else if ($j('.btn-search')) {

      $j('#header-cart').removeClass('skip-active');

      $j('#header-account').removeClass('skip-active');

      $j(this).addClass('active');

      $j(this).next().addClass('active');
    }
  });

  if ($j('.btn-search')) {
    var closeSearch = function closeSearch() {

      $j('.btn-search').removeClass('active');

      $j('form#search_mini_form').removeClass('active');
    };

    $j(document).click(function (event) {

      if ($j(event.target).closest(".btn-search").length || $j(event.target).closest("#search_mini_form").length) return;

      if ($j(event.target).closest(".skip-account").length || $j(event.target).closest("#header-cart").length) {

        closeSearch();

        return;
      }

      if ($j(event.target).closest(".skip-cart").length) {

        closeSearch();

        return;
      }

      $j('#header-cart').removeClass('skip-active');

      $j('#header-account').removeClass('skip-active');

      closeSearch();

      event.stopPropagation();
    });
  }

  $j(window).resize(function () {

    resizeMenuItems();
  });

  resizeMenuItems();

  function resizeMenuItems() {

    if (windowWidth > 770) {

      $j('ul.level0').each(function () {

        if ($j(this).find('li.parent').length != 0) $j(this).css('width', '500px');
      });
    } else {

      $j('ul.level0').each(function () {

        if ($j(this).find('li.parent').length != 0) $j(this).css('width', 'auto');
      });
    }
  }

  $j('.level0').each(function () {

    var link = $j(this).children('a');

    if (link.attr('href') === 'https://www.rent-a-bag.club/home') link.attr('href', '/how-it-works-rent-a-bag');

    if (link.attr('href') === 'http://rentabag.loca/home') link.attr('href', '/how-it-works-rent-a-bag');
  });

  $j('.level1.view-all').each(function () {

    var link = $j(this).children('a');

    if (link.attr('href') === 'https://www.rent-a-bag.club/home') $j(this).hide();

    if (link.attr('href') === 'http://rentabag.loca/home') $j(this).hide();
  });

  $j('.sidebar').on('click', '.fme-filter .block-subtitle--filter', function () {

    $j(this).toggleClass('active');

    $j(this).parents('.block-content').toggleClass('active');
  });

  function setEqualHeight(columns) {

    var tallestcolumn = 0;

    columns.each(function () {

      var currentHeight = $j(this).height();

      if (currentHeight > tallestcolumn) {

        tallestcolumn = currentHeight;
      }
    });

    columns.height(tallestcolumn);
  }

  if ($j('body').hasClass('cms-home')) {
    var carousel = function carousel() {

      var owl = $j(".slider0");

      owl.owlCarousel({

        items: 3,

        loop: true,

        navigation: true,

        autoHeight: true,

        dots: true,

        singleItem: false,

        slideSpeed: 600,

        paginationSpeed: 600,

        rewindSpeed: 600,

        scrollPerPage: false,

        margin: 50,

        stopOnHover: true

      });

      $j(".next_button").click(function () {

        owl.trigger("owl.next");
      });

      $j(".prev_button").click(function () {

        owl.trigger("owl.prev");
      });

      owl.on("resized.owl.carousel", function (event) {

        var $jthis = $j(this);

        $jthis.find(".owl-height").css("height", $jthis.find(".owl-item.active").height());
      });

      setTimeout(function () {

        owl.find(".owl-height").css("height", owl.find(".owl-item.active").height());
      }, 5000);
    };

    ;

    carousel();
  }

  var today = moment(+moment().format('x') + 86400000 * 2).format('DD/MM/YYYY');

  var today_unix = +moment(moment(today, 'DD/MM/YYYY')).format('x');

  var some_date_range = G_VARS.rentRanges;

  var input_date = $j('input[name="daterange"]');

  var jj = 1;

  input_date.daterangepicker({

    locale: {

      format: 'DD/MM/YYYY'

    },

    "showWeekNumbers": true,

    "autoApply": true,

    "opens": "center",

    "minDate": today,

    "dateLimit": { days: 13 },

    "isInvalidDate": function isInvalidDate(date) {

      for (var ii = 0; ii < some_date_range.length; ii++) {

        if (some_date_range[ii][0] * 1000 - 122800000 <= +moment(date).format('x') && +moment(date).format('x') <= some_date_range[ii][1] * 1000 + 122800000 || +moment(date).format('x') == today_unix && today_unix + 209200000 >= some_date_range[ii][0] * 1000) {

          if (jj < some_date_range.length - 1) {

            jj++;
          }

          return true;
        }
      }
    }

  });

  input_date.on('apply.daterangepicker', function (ev, picker) {

    var some_date_min = 0;

    for (var ii = 0; ii < some_date_range.length; ii++) {

      var some_date = some_date_range[ii][0] * 1000;

      var startDate = +picker.startDate.format('x') - 122800000;

      var endDate = +picker.endDate.format('x') + 122800000;

      if (some_date > startDate && some_date < endDate) {

        if (some_date_min > some_date || some_date_min === 0) {

          some_date_min = some_date;
        }

        var min_date = moment(some_date_min - 122800000, "x");

        min_date = moment(min_date).format('DD-MM-YYYY');

        input_date.data('daterangepicker').setEndDate(min_date);
      }
    }
  });

  $j(input_date).change(function () {

    var val = $j(this).val().split(' ');

    if (val[0] == val[2]) {

      input_date.val('');

      $j('#error').text('Rent is possible for at least two days');
    } else {

      $j('.options_from_date').val(val[0]);

      $j('.options_to_date').val(val[2]);

      $j('#error').text('');
    }
  });

  $j('.add-to-cart-buttons .btn-cart').click(function () {

    var val = input_date.val();

    if (val == '') {

      $j('#error').text('The field must not be empty');
    } else {

      productAddToCartForm.submit(this);
    }
  });

  $j('.question').click(function () {

    $j(this).next().slideToggle(400);
  });
});
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxSend = function () {
    function AjaxSend() {
        _classCallCheck(this, AjaxSend);

        Object.defineProperty(this, "options", {
            enumerable: true,
            writable: true,
            value: {
                formData: null,
                message: "",
                url: "",
                respCodeName: 'Error',
                respCodes: [],
                beforeChkResponse: null
            }
        });
    }

    _createClass(AjaxSend, [{
        key: "send",
        value: function send(inProps) {
            var self = this;
            var props = _extends({}, this.options, inProps);
            var message = props.message;

            var promise = new Promise(function (resolve, reject) {
                $.ajax({
                    url: props.url,

                    type: 'POST',
                    success: function success(data) {
                        var error = -1001;
                        try {
                            __LDEV__ && console.debug('data AJAX', data);

                            if (props.beforeChkResponse) data = props.beforeChkResponse(data);

                            if (data[props.respCodeName] > 100 && data[props.respCodeName] < 200) {
                                error = -data[props.respCodeName];
                                throw new Error(message);
                            } else if (data[props.respCodeName] == 100) {
                                error = -100;
                                throw new Error(message);
                            } else if (data[props.respCodeName] == 200) {
                                error = 100;
                                throw new Error("");
                            } else {
                                error = -1000;
                                throw new Error(message);
                            }
                        } catch (e) {
                            error < 0 && console.warn('E', error);
                            switch (error) {
                                case -100:
                                    ;
                                case -1000:
                                    ;break;
                                default:
                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                        for (var _iterator = props.respCodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                            var val = _step.value;

                                            if (error == val.code) {
                                                message = val.message || val.callback && val.callback(data);
                                                break;
                                            }
                                        }
                                    } catch (err) {
                                        _didIteratorError = true;
                                        _iteratorError = err;
                                    } finally {
                                        try {
                                            if (!_iteratorNormalCompletion && _iterator.return) {
                                                _iterator.return();
                                            }
                                        } finally {
                                            if (_didIteratorError) {
                                                throw _iteratorError;
                                            }
                                        }
                                    }

                            }
                        }

                        error < 0 ? reject({ code: error, message: message, data: data }) : resolve({ code: error, message: message, data: data });
                    },
                    error: function error() {
                        reject({ code: -1002, message: message });
                    },

                    data: props.formData || new FormData(),

                    cache: false
                }, 'json');
            });

            return promise;
        }
    }]);

    return AjaxSend;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi5qcyIsIkFqYXhTZW5kLmpzIl0sIm5hbWVzIjpbIkdfQ1VSUkVOVFBBR0UiLCJHX1ZBUlMiLCJpc3JlbnRQcm9kdWN0IiwicmVudFJhbmdlcyIsIiRqIiwiZG9jdW1lbnQiLCJyZWFkeSIsIndpbmRvd1dpZHRoIiwid2luZG93Iiwid2lkdGgiLCJyZXNpemUiLCJjbGljayIsImhhc0NsYXNzIiwicmVtb3ZlQ2xhc3MiLCJuZXh0IiwiYWRkQ2xhc3MiLCJjbG9zZVNlYXJjaCIsImV2ZW50IiwidGFyZ2V0IiwiY2xvc2VzdCIsImxlbmd0aCIsInN0b3BQcm9wYWdhdGlvbiIsInJlc2l6ZU1lbnVJdGVtcyIsImVhY2giLCJmaW5kIiwiY3NzIiwibGluayIsImNoaWxkcmVuIiwiYXR0ciIsImhpZGUiLCJvbiIsInRvZ2dsZUNsYXNzIiwicGFyZW50cyIsInNldEVxdWFsSGVpZ2h0IiwiY29sdW1ucyIsInRhbGxlc3Rjb2x1bW4iLCJjdXJyZW50SGVpZ2h0IiwiaGVpZ2h0IiwiY2Fyb3VzZWwiLCJvd2wiLCJvd2xDYXJvdXNlbCIsIml0ZW1zIiwibG9vcCIsIm5hdmlnYXRpb24iLCJhdXRvSGVpZ2h0IiwiZG90cyIsInNpbmdsZUl0ZW0iLCJzbGlkZVNwZWVkIiwicGFnaW5hdGlvblNwZWVkIiwicmV3aW5kU3BlZWQiLCJzY3JvbGxQZXJQYWdlIiwibWFyZ2luIiwic3RvcE9uSG92ZXIiLCJ0cmlnZ2VyIiwiJGp0aGlzIiwic2V0VGltZW91dCIsInRvZGF5IiwibW9tZW50IiwiZm9ybWF0IiwidG9kYXlfdW5peCIsInNvbWVfZGF0ZV9yYW5nZSIsImlucHV0X2RhdGUiLCJqaiIsImRhdGVyYW5nZXBpY2tlciIsImxvY2FsZSIsImRheXMiLCJkYXRlIiwiaWkiLCJldiIsInBpY2tlciIsInNvbWVfZGF0ZV9taW4iLCJzb21lX2RhdGUiLCJzdGFydERhdGUiLCJlbmREYXRlIiwibWluX2RhdGUiLCJkYXRhIiwic2V0RW5kRGF0ZSIsImNoYW5nZSIsInZhbCIsInNwbGl0IiwidGV4dCIsInByb2R1Y3RBZGRUb0NhcnRGb3JtIiwic3VibWl0Iiwic2xpZGVUb2dnbGUiLCJBamF4U2VuZCIsImZvcm1EYXRhIiwibWVzc2FnZSIsInVybCIsInJlc3BDb2RlTmFtZSIsInJlc3BDb2RlcyIsImJlZm9yZUNoa1Jlc3BvbnNlIiwiaW5Qcm9wcyIsInNlbGYiLCJwcm9wcyIsIm9wdGlvbnMiLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCIkIiwiYWpheCIsInR5cGUiLCJzdWNjZXNzIiwiZXJyb3IiLCJfX0xERVZfXyIsImNvbnNvbGUiLCJkZWJ1ZyIsIkVycm9yIiwiZSIsIndhcm4iLCJjb2RlIiwiY2FsbGJhY2siLCJGb3JtRGF0YSIsImNhY2hlIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGdCQUFnQixFQUFwQjtBQUNBLElBQUlDLFNBQVM7QUFDWkMsaUJBQWUsQ0FESDtBQUVaQyxjQUFZO0FBRkEsQ0FBYjs7QUFPQUMsR0FBR0MsUUFBSCxFQUFhQyxLQUFiLENBQW1CLFlBQVk7O0FBRTlCLE1BQUlDLGNBQWNILEdBQUdJLE1BQUgsRUFBV0MsS0FBWCxFQUFsQjs7QUFFQUwsS0FBR0ksTUFBSCxFQUFXRSxNQUFYLENBQWtCLFlBQVU7O0FBRTNCSCxrQkFBZUgsR0FBRyxJQUFILEVBQVNLLEtBQVQsRUFBZjtBQUVBLEdBSkQ7O0FBWUFMLEtBQUcsYUFBSCxFQUFrQk8sS0FBbEIsQ0FBd0IsWUFBWTs7QUFFbkMsUUFBSVAsR0FBRyxhQUFILEtBQXFCQSxHQUFHLGFBQUgsRUFBa0JRLFFBQWxCLENBQTJCLFFBQTNCLENBQXpCLEVBQStEOztBQUU5RFIsU0FBRyxJQUFILEVBQVNTLFdBQVQsQ0FBcUIsUUFBckI7O0FBRUFULFNBQUcsSUFBSCxFQUFTVSxJQUFULEdBQWdCRCxXQUFoQixDQUE0QixRQUE1QjtBQUVBLEtBTkQsTUFRSyxJQUFJVCxHQUFHLGFBQUgsQ0FBSixFQUF1Qjs7QUFFM0JBLFNBQUcsY0FBSCxFQUFtQlMsV0FBbkIs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QUFDQTtBQUNIO0FBQ0o7QUFUTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUpKO0FBZUg7O0FBR0Q0QixnQ0FBUSxDQUFSLEdBQVlMLE9BQU8sRUFBQ1ksTUFBTVAsS0FBUCxFQUFjakIsZ0JBQWQsRUFBdUJYLFVBQXZCLEVBQVAsQ0FBWixHQUFtRHNCLFFBQVEsRUFBQ2EsTUFBTVAsS0FBUCxFQUFjakIsZ0JBQWQsRUFBdUJYLFVBQXZCLEVBQVIsQ0FBbkQ7QUFDSCxxQkFsRUU7QUFtRUg0QiwyQkFBTyxpQkFBVztBQUNkTCwrQkFBTyxFQUFDWSxNQUFNLENBQUMsSUFBUixFQUFjeEIsZ0JBQWQsRUFBUDtBQUNILHFCQXJFRTs7QUF1RUhYLDBCQUFNa0IsTUFBTVIsUUFBTixJQUFrQixJQUFJMkIsUUFBSixFQXZFckI7O0FBeUVIQywyQkFBTztBQXpFSixpQkFBUCxFQTRFRyxNQTVFSDtBQWdGSCxhQWxGYSxDQUFkOztBQW9GQSxtQkFBT2xCLE9BQVA7QUFDSCIsImZpbGUiOiJjb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgR19DVVJSRU5UUEFHRSA9ICcnO1xydmFyIEdfVkFSUyA9IHtcclx0aXNyZW50UHJvZHVjdDogMCxcclx0cmVudFJhbmdlczogW10sXHJ9O1xyXHJcclxyJGooZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxyXHR2YXIgd2luZG93V2lkdGggPSAkaih3aW5kb3cpLndpZHRoKCk7XHJcclx0JGood2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXtcclxyXHRcdHdpbmRvd1dpZHRoID0gKCRqKHRoaXMpLndpZHRoKCkpO1xyXHJcdH0pO1xyXHJcdC8vIGhlYWRlcj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcclxyXHJcdC8vc2VhcmNoIGhpZGUvc2hvd1xyXHJcdCRqKCcuYnRuLXNlYXJjaCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxyXHRcdGlmICgkaignLmJ0bi1zZWFyY2gnKSAmJiAkaignLmJ0bi1zZWFyY2gnKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxyXHRcdFx0JGoodGhpcykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXHJcdFx0XHQkaih0aGlzKS5uZXh0KCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXHJcdFx0fVxyXHJcdFx0ZWxzZSBpZiAoJGooJy5idG4tc2VhcmNoJykpIHtcclxyXHRcdFx0JGooJyNoZWFkZXItY2FydCcpLnJlbW92ZUNsYXNzKCdza2lwLWFjdGl2ZScpO1xyXHJcdFx0XHQkaignI2hlYWRlci1hY2NvdW50JykucmVtb3ZlQ2xhc3MoJ3NraXAtYWN0aXZlJyk7XHJcclx0XHRcdCRqKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxyXHRcdFx0JGoodGhpcykubmV4dCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxyXHRcdH1cclxyXHR9KTtcclxyXHRpZiAoJGooJy5idG4tc2VhcmNoJykpIHtcclxyXHRcdCRqKGRvY3VtZW50KS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcclxyXHRcdFx0aWYgKCRqKGV2ZW50LnRhcmdldCkuY2xvc2VzdChcIi5idG4tc2VhcmNoXCIpLmxlbmd0aCB8fCAkaihldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIjc2VhcmNoX21pbmlfZm9ybVwiKS5sZW5ndGgpXHJcclx0XHRcdFx0cmV0dXJuO1xyXHJcdFx0XHRpZiAoJGooZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLnNraXAtYWNjb3VudFwiKS5sZW5ndGggfHwgJGooZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiI2hlYWRlci1jYXJ0XCIpLmxlbmd0aCkge1xyXHJcdFx0XHRcdGNsb3NlU2VhcmNoKCk7XHJcclx0XHRcdFx0cmV0dXJuO1xyXHJcdFx0XHR9XHJcclx0XHRcdGlmICgkaihldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIuc2tpcC1jYXJ0XCIpLmxlbmd0aCl7XHJcclx0XHRcdFx0Y2xvc2VTZWFyY2goKTtcclxyXHRcdFx0XHRyZXR1cm47XHJcclx0XHRcdH1cclxyXHRcdFx0JGooJyNoZWFkZXItY2FydCcpLnJlbW92ZUNsYXNzKCdza2lwLWFjdGl2ZScpO1xyXHJcdFx0XHQkaignI2hlYWRlci1hY2NvdW50JykucmVtb3ZlQ2xhc3MoJ3NraXAtYWN0aXZlJyk7XHJcclx0XHRcdGNsb3NlU2VhcmNoKCk7XHJcclx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXHJcdFx0fSk7XHJcclx0XHRmdW5jdGlvbiBjbG9zZVNlYXJjaCgpe1xyXHJcdFx0XHQkaignLmJ0bi1zZWFyY2gnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcclx0XHRcdCRqKCdmb3JtI3NlYXJjaF9taW5pX2Zvcm0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcclx0XHR9XHJcclx0fVxyXHJcdCRqKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCl7XHJcclx0XHRyZXNpemVNZW51SXRlbXMoKTtcclxyXHR9KTtcclxyXHRyZXNpemVNZW51SXRlbXMoKTtcclxyXHRmdW5jdGlvbiAgcmVzaXplTWVudUl0ZW1zKCl7XHJcclx0XHRpZih3aW5kb3dXaWR0aCA+IDc3MCl7XHJcclx0XHRcdCRqKCd1bC5sZXZlbDAnKS5lYWNoKGZ1bmN0aW9uKCl7XHJcclx0XHRcdFx0aWYoJGoodGhpcykuZmluZCgnbGkucGFyZW50JykubGVuZ3RoICE9IDApXHJcclx0XHRcdFx0XHQkaih0aGlzKS5jc3MoJ3dpZHRoJywgJzUwMHB4Jyk7XHJcclx0XHRcdH0pO1xyXHJcdFx0fVxyXHJcdFx0ZWxzZXtcclxyXHRcdFx0JGooJ3VsLmxldmVsMCcpLmVhY2goZnVuY3Rpb24oKXtcclxyXHRcdFx0XHRpZigkaih0aGlzKS5maW5kKCdsaS5wYXJlbnQnKS5sZW5ndGggIT0gMClcclxyXHRcdFx0XHRcdCRqKHRoaXMpLmNzcygnd2lkdGgnLCAnYXV0bycpO1xyXHJcdFx0XHR9KTtcclxyXHRcdH1cclxyXHR9XHJcclxyXHJcdC8vTWVudVxyXHJcdCRqKCcubGV2ZWwwJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcclx0XHR2YXJcdGxpbmsgPSAkaih0aGlzKS5jaGlsZHJlbignYScpO1xyXHJcdFx0aWYobGluay5hdHRyKCdocmVmJykgPT09ICdodHRwczovL3d3dy5yZW50LWEtYmFnLmNsdWIvaG9tZScpXHJcclx0XHRcdFx0bGluay5hdHRyKCdocmVmJywgJy9ob3ctaXQtd29ya3MtcmVudC1hLWJhZycpO1xyXHJcdFx0aWYobGluay5hdHRyKCdocmVmJykgPT09ICdodHRwOi8vcmVudGFiYWcubG9jYS9ob21lJylcclxyXHRcdFx0bGluay5hdHRyKCdocmVmJywgJy9ob3ctaXQtd29ya3MtcmVudC1hLWJhZycpO1xyXHR9KTtcclxyXHQkaignLmxldmVsMS52aWV3LWFsbCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXHJcdFx0dmFyXHRsaW5rID0gJGoodGhpcykuY2hpbGRyZW4oJ2EnKTtcclxyXHRcdGlmKGxpbmsuYXR0cignaHJlZicpID09PSAnaHR0cHM6Ly93d3cucmVudC1hLWJhZy5jbHViL2hvbWUnKVxyXHJcdFx0XHQkaih0aGlzKS5oaWRlKCk7XHJcclx0XHRpZihsaW5rLmF0dHIoJ2hyZWYnKSA9PT0gJ2h0dHA6Ly9yZW50YWJhZy5sb2NhL2hvbWUnKVxyXHJcdFx0XHQkaih0aGlzKS5oaWRlKCk7XHJcclx0fSk7XHJcclxyXHJcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcclxyXHJcdC8vIHNpZGViYXI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcclx0JGooJy5zaWRlYmFyJykub24oJ2NsaWNrJywgJy5mbWUtZmlsdGVyIC5ibG9jay1zdWJ0aXRsZS0tZmlsdGVyJywgZnVuY3Rpb24oKXtcclxyXHRcdCRqKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxyXHRcdCRqKHRoaXMpLnBhcmVudHMoJy5ibG9jay1jb250ZW50JykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xyXHJcdH0pO1xyXHJcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcclxyXHJcclxyXHQgLy9wcm9kdWN0IGNvbnRlbnQ9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXHJcdCAvL2hlaWdodCBvZiBjb2x1bW5zXHJcclx0ZnVuY3Rpb24gc2V0RXF1YWxIZWlnaHQoY29sdW1ucylcclxyXHR7XHJcclx0XHR2YXIgdGFsbGVzdGNvbHVtbiA9IDA7XHJcclx0XHRjb2x1bW5zLmVhY2goXHJcclx0XHRcdFx0ZnVuY3Rpb24oKVxyXHJcdFx0XHRcdHtcclxyXHRcdFx0XHRcdHZhciBjdXJyZW50SGVpZ2h0ID0gJGoodGhpcykuaGVpZ2h0KCk7XHJcclx0XHRcdFx0XHRpZihjdXJyZW50SGVpZ2h0ID4gdGFsbGVzdGNvbHVtbilcclxyXHRcdFx0XHRcdHtcclxyXHRcdFx0XHRcdFx0dGFsbGVzdGNvbHVtbiA9IGN1cnJlbnRIZWlnaHQ7XHJcclx0XHRcdFx0XHR9XHJcclx0XHRcdFx0fVxyXHJcdFx0KTtcclxyXHRcdGNvbHVtbnMuaGVpZ2h0KHRhbGxlc3Rjb2x1bW4pO1xyXHJcdH1cclxyXHJcclx0Ly8gJGooJyNmbWVfbGF5ZXJlZF9jb250YWluZXInKS5iaW5kKFwiRE9NU3VidHJlZU1vZGlmaWVkXCIsZnVuY3Rpb24oKXtcclx0Ly9cclx0Ly8gXHRzZXRFcXVhbEhlaWdodCgkaihcIi5wcm9kdWN0cy1ncmlkICA+IC5pdGVtIC5wcm9kdWN0LWluZm9cIikpO1xyXHQvL1xyXHQvLyB9KTtcclxyXHQgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXHJcclxyXHJcclx0Ly9ob21lIHBhZ2UgY29udGVudD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcclx0aWYoJGooJ2JvZHknKS5oYXNDbGFzcygnY21zLWhvbWUnKSl7XHJcclx0XHRmdW5jdGlvbiBjYXJvdXNlbCgpIHtcclxyXHRcdFx0dmFyIG93bCA9ICRqKFwiLnNsaWRlcjBcIik7XHJcclx0XHRcdC8vIHZhciBvd2wyID0gJGooXCIuc2xpZGVyMVwiKTtcclxyXHRcdFx0Ly8gb3dsMi5vd2xDYXJvdXNlbCh7XHJcdFx0XHQvL1xyXHRcdFx0Ly8gXHRpdGVtcyA6IDMsXHJcdFx0XHQvL1xyXHRcdFx0Ly8gXHRsb29wIDogdHJ1ZSxcclx0XHRcdC8vXHJcdFx0XHQvLyBcdG5hdmlnYXRpb24gOiB0cnVlLFxyXHRcdFx0Ly9cclx0XHRcdC8vIFx0YXV0b0hlaWdodCA6IHRydWUsXHJcdFx0XHQvL1xyXHRcdFx0Ly8gXHRkb3RzIDogdHJ1ZSxcclx0XHRcdC8vXHJcdFx0XHQvLyBcdHNpbmdsZUl0ZW0gOiBmYWxzZSxcclx0XHRcdC8vXHJcdFx0XHQvLyBcdHNsaWRlU3BlZWQgOiA2MDAsXHJcdFx0XHQvL1xyXHRcdFx0Ly8gXHRwYWdpbmF0aW9uU3BlZWQgOiA2MDAsXHJcdFx0XHQvL1xyXHRcdFx0Ly8gXHQvLyBhdXRvUGxheSA6IDM1MDAsXHJcdFx0XHQvL1xyXHRcdFx0Ly8gXHRyZXdpbmRTcGVlZCA6IDYwMCxcclx0XHRcdC8vXHJcdFx0XHQvLyBcdHNjcm9sbFBlclBhZ2UgOiBmYWxzZSxcclx0XHRcdC8vXHJcdFx0XHQvLyBcdG1hcmdpbiA6IDUwLFxyXHRcdFx0Ly9cclx0XHRcdC8vIFx0c3RvcE9uSG92ZXIgOiB0cnVlXHJcdFx0XHQvL1xyXHRcdFx0Ly8gfSk7XHJcclx0XHRcdG93bC5vd2xDYXJvdXNlbCh7XHJcclx0XHRcdFx0aXRlbXMgOiAzLFxyXHJcdFx0XHRcdGxvb3AgOiB0cnVlLFxyXHJcdFx0XHRcdG5hdmlnYXRpb24gOiB0cnVlLFxyXHJcdFx0XHRcdGF1dG9IZWlnaHQgOiB0cnVlLFxyXHJcdFx0XHRcdGRvdHMgOiB0cnVlLFxyXHJcdFx0XHRcdHNpbmdsZUl0ZW0gOiBmYWxzZSxcclxyXHRcdFx0XHRzbGlkZVNwZWVkIDogNjAwLFxyXHJcdFx0XHRcdHBhZ2luYXRpb25TcGVlZCA6IDYwMCxcclxyXHRcdFx0XHQvLyBhdXRvUGxheSA6IDMwMDAsXHJcclx0XHRcdFx0cmV3aW5kU3BlZWQgOiA2MDAsXHJcclx0XHRcdFx0c2Nyb2xsUGVyUGFnZSA6IGZhbHNlLFxyXHJcdFx0XHRcdG1hcmdpbiA6IDUwLFxyXHJcdFx0XHRcdHN0b3BPbkhvdmVyIDogdHJ1ZVxyXHJcdFx0XHR9KTtcclxyXHRcdFx0JGooXCIubmV4dF9idXR0b25cIikuY2xpY2soZnVuY3Rpb24oKSB7XHJcclx0XHRcdFx0b3dsLnRyaWdnZXIoXCJvd2wubmV4dFwiKTtcclxyXHRcdFx0XHQvLyBvd2wyLnRyaWdnZXIoXCJvd2wubmV4dFwiKTtcclxyXHRcdFx0fSk7XHJcclx0XHRcdCRqKFwiLnByZXZfYnV0dG9uXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXHJcdFx0XHRcdG93bC50cmlnZ2VyKFwib3dsLnByZXZcIik7XHJcclx0XHRcdFx0Ly8gb3dsMi50cmlnZ2VyKFwib3dsLnByZXZcIik7XHJcclx0XHRcdH0pO1xyXHJcdFx0XHRvd2wub24oXCJyZXNpemVkLm93bC5jYXJvdXNlbFwiLCBmdW5jdGlvbihldmVudCkge1xyXHJcdFx0XHRcdHZhciAkanRoaXMgPSAkaih0aGlzKTtcclxyXHRcdFx0XHQkanRoaXMuZmluZChcIi5vd2wtaGVpZ2h0XCIpLmNzcyhcImhlaWdodFwiLCAkanRoaXMuZmluZChcIi5vd2wtaXRlbS5hY3RpdmVcIikuaGVpZ2h0KCkpO1xyXHJcdFx0XHR9KTtcclxyXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxyXHRcdFx0XHRvd2wuZmluZChcIi5vd2wtaGVpZ2h0XCIpLmNzcyhcImhlaWdodFwiLCBvd2wuZmluZChcIi5vd2wtaXRlbS5hY3RpdmVcIikuaGVpZ2h0KCkpO1xyXHJcdFx0XHRcdC8vIG93bDIuZmluZChcIi5vd2wtaGVpZ2h0XCIpLmNzcyhcImhlaWdodFwiLCBvd2wyLmZpbmQoXCIub3dsLWl0ZW0uYWN0aXZlXCIpLmhlaWdodCgpKTtcclxyXHRcdFx0fSwgNTAwMCk7XHJcclx0XHR9O1xyXHJcdFx0Y2Fyb3VzZWwoKTtcclxyXHR9XHJcclx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcclx0Ly9zaW5nbGUgcHJvZHVjdCBwYWdlPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxyXHR2YXIgdG9kYXkgPSBtb21lbnQoKCttb21lbnQoKS5mb3JtYXQoJ3gnKSArIDg2NDAwMDAwICoyKSkuZm9ybWF0KCdERC9NTS9ZWVlZJyk7XHJcclx0dmFyIHRvZGF5X3VuaXggPSArbW9tZW50KG1vbWVudCh0b2RheSwgJ0REL01NL1lZWVknKSkuZm9ybWF0KCd4Jyk7XHJcclx0dmFyIHNvbWVfZGF0ZV9yYW5nZSA9IEdfVkFSUy5yZW50UmFuZ2VzO1xyXHJcdHZhciBpbnB1dF9kYXRlID0gJGooJ2lucHV0W25hbWU9XCJkYXRlcmFuZ2VcIl0nKTtcclxyXHR2YXIgamogPSAxO1xyXHJcdGlucHV0X2RhdGUuZGF0ZXJhbmdlcGlja2VyKHtcclxyXHRcdGxvY2FsZToge1xyXHJcdFx0XHRmb3JtYXQ6ICdERC9NTS9ZWVlZJ1xyXHJcdFx0fSxcclxyXHRcdFwic2hvd1dlZWtOdW1iZXJzXCI6IHRydWUsXHJcclx0XHRcImF1dG9BcHBseVwiOiB0cnVlLFxyXHJcdFx0XCJvcGVuc1wiOiBcImNlbnRlclwiLFxyXHJcdFx0XCJtaW5EYXRlXCI6IHRvZGF5LFxyXHJcdFx0XCJkYXRlTGltaXRcIjogeyBkYXlzOiAxMyB9LFxyXHJcdFx0XCJpc0ludmFsaWREYXRlXCIgOiBmdW5jdGlvbihkYXRlKXtcclxyXHRcdFx0Zm9yKHZhciBpaSA9IDA7IGlpIDwgc29tZV9kYXRlX3JhbmdlLmxlbmd0aDsgaWkrKyApe1xyXHJcdFx0XHRcdGlmKHNvbWVfZGF0ZV9yYW5nZVtpaV1bMF0gKiAxMDAwIC0gMTIyODAwMDAwIDw9ICttb21lbnQoZGF0ZSkuZm9ybWF0KCd4JykgJiYgK21vbWVudChkYXRlKS5mb3JtYXQoJ3gnKSA8PSBzb21lX2RhdGVfcmFuZ2VbaWldWzFdICogMTAwMCArIDEyMjgwMDAwMFxyXHJcdFx0XHRcdFx0XHQvL3x8IHNvbWVfZGF0ZV9yYW5nZVtqal1bMF0gKiAxMDAwID09ICttb21lbnQoZGF0ZSkuZm9ybWF0KCd4JykgKyAxMjI4MDAwMDAgJiYgK21vbWVudChkYXRlKS5mb3JtYXQoJ3gnKSAtIDEyMjgwMDAwMCA9PSBzb21lX2RhdGVfcmFuZ2VbaWldWzFdICogMTAwMFxyXHJcdFx0XHRcdFx0XHR8fCAoK21vbWVudChkYXRlKS5mb3JtYXQoJ3gnKSA9PSB0b2RheV91bml4KSAmJiB0b2RheV91bml4ICsgMjA5MjAwMDAwID49IHNvbWVfZGF0ZV9yYW5nZVtpaV1bMF0gKiAxMDAwKVxyXHJcdFx0XHRcdHtcclxyXHRcdFx0XHRcdGlmKGpqIDwgc29tZV9kYXRlX3JhbmdlLmxlbmd0aCAtIDEpe1xyXHJcdFx0XHRcdFx0XHRqaisrO1xyXHJcdFx0XHRcdFx0fVxyXHJcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcclx0XHRcdFx0fVxyXHJcdFx0XHR9XHJcclx0XHR9XHJcclx0fSk7XHJcclx0aW5wdXRfZGF0ZS5vbignYXBwbHkuZGF0ZXJhbmdlcGlja2VyJywgZnVuY3Rpb24oZXYsIHBpY2tlcikge1xyXHJcdFx0dmFyIHNvbWVfZGF0ZV9taW4gPSAwO1xyXHJcdFx0Zm9yKHZhciBpaSA9IDA7IGlpIDwgc29tZV9kYXRlX3JhbmdlLmxlbmd0aDsgaWkrKyl7XHJcclx0XHRcdHZhciBzb21lX2RhdGUgPSBzb21lX2RhdGVfcmFuZ2VbaWldWzBdICogMTAwMDtcclxyXHRcdFx0dmFyIHN0YXJ0RGF0ZSA9ICtwaWNrZXIuc3RhcnREYXRlLmZvcm1hdCgneCcpIC0gMTIyODAwMDAwO1xyXHJcdFx0XHR2YXIgZW5kRGF0ZSA9ICtwaWNrZXIuZW5kRGF0ZS5mb3JtYXQoJ3gnKSArIDEyMjgwMDAwMDtcclxyXHRcdFx0aWYgKHNvbWVfZGF0ZSA+IHN0YXJ0RGF0ZSAmJiBzb21lX2RhdGUgPCBlbmREYXRlKXtcclxyXHRcdFx0XHRpZihzb21lX2RhdGVfbWluID4gc29tZV9kYXRlIHx8IHNvbWVfZGF0ZV9taW4gPT09IDApe1xyXHJcdFx0XHRcdFx0c29tZV9kYXRlX21pbiA9IHNvbWVfZGF0ZTtcclxyXHRcdFx0XHR9XHJcclx0XHRcdFx0dmFyIG1pbl9kYXRlID0gbW9tZW50KHNvbWVfZGF0ZV9taW4gLSAxMjI4MDAwMDAsIFwieFwiKTtcclxyXHRcdFx0XHRtaW5fZGF0ZSA9IG1vbWVudChtaW5fZGF0ZSkuZm9ybWF0KCdERC1NTS1ZWVlZJyk7XHJcclx0XHRcdFx0aW5wdXRfZGF0ZS5kYXRhKCdkYXRlcmFuZ2VwaWNrZXInKS5zZXRFbmREYXRlKG1pbl9kYXRlKTtcclxyXHRcdFx0fVxyXHJcdFx0fVxyXHJcdH0pO1xyXHJcdCRqKGlucHV0X2RhdGUpLmNoYW5nZShmdW5jdGlvbigpe1xyXHJcdFx0dmFyIHZhbCA9ICRqKHRoaXMpLnZhbCgpLnNwbGl0KCcgJyk7XHJcclx0XHRpZih2YWxbMF0gPT0gdmFsWzJdKVxyXHJcdFx0e1xyXHJcdFx0XHRpbnB1dF9kYXRlLnZhbCgnJyk7XHJcclx0XHRcdCRqKCcjZXJyb3InKS50ZXh0KCdSZW50IGlzIHBvc3NpYmxlIGZvciBhdCBsZWFzdCB0d28gZGF5cycpO1xyXHJcdFx0fVxyXHJcdFx0ZWxzZVxyXHJcdFx0e1xyXHJcdFx0XHQkaignLm9wdGlvbnNfZnJvbV9kYXRlJykudmFsKHZhbFswXSk7XHJcclx0XHRcdCRqKCcub3B0aW9uc190b19kYXRlJykudmFsKHZhbFsyXSk7XHJcclx0XHRcdCRqKCcjZXJyb3InKS50ZXh0KCcnKTtcclxyXHRcdH1cclxyXHR9KTtcclxyXHQkaignLmFkZC10by1jYXJ0LWJ1dHRvbnMgLmJ0bi1jYXJ0JykuY2xpY2soZnVuY3Rpb24oKXtcclxyXHRcdHZhciB2YWwgPSBpbnB1dF9kYXRlLnZhbCgpO1xyXHJcdFx0aWYodmFsID09ICcnKVxyXHJcdFx0e1xyXHJcdFx0XHQkaignI2Vycm9yJykudGV4dCgnVGhlIGZpZWxkIG11c3Qgbm90IGJlIGVtcHR5Jyk7XHJcclx0XHR9XHJcclx0XHRlbHNlXHJcclx0XHR7XHJcclx0XHRcdHByb2R1Y3RBZGRUb0NhcnRGb3JtLnN1Ym1pdCh0aGlzKTtcclxyXHRcdH1cclxyXHR9KTtcclxyXHQvL2lmKHR5cGVvZiBzb21lX2RhdGVfcmFuZ2UgIT09ICd1bmRlZmluZWQnICYmIHNvbWVfZGF0ZV9yYW5nZS5sZW5ndGggPiAwKXtcclxyXHQvL1x0dmFyIGNvbnRhaW5lciA9ICRqKCcuc2hvcnQtZGVzY3JpcHRpb24gLnN0ZCcpO1xyXHJcdC8vXHRjb250YWluZXIuYXBwZW5kKCc8cD5SZW50ZWQgZm9yIHRob3NlIGRhdGVzOjwvcD4nKTtcclxyXHQvL1x0Zm9yKHZhciBpaSA9IDA7IGlpIDwgc29tZV9kYXRlX3JhbmdlLmxlbmd0aDsgaWkrKylcclxyXHQvL1x0e1xyXHJcdC8vXHRcdHZhciBmcm9tID0gbW9tZW50KHNvbWVfZGF0ZV9yYW5nZVtpaV1bMF0gKiAxMDAwIC0gODY0MDAwMDAsIFwieFwiKS5mb3JtYXQoJ0REL01NL1lZWVknKTtcclxyXHQvL1x0XHR2YXIgdG8gPSBtb21lbnQoc29tZV9kYXRlX3JhbmdlW2lpXVsxXSAqIDEwMDAgKyA4NjQwMDAwMCwgXCJ4XCIpLmZvcm1hdCgnREQvTU0vWVlZWScpO1xyXHJcdC8vXHRcdGNvbnRhaW5lci5hcHBlbmQoJzxzcGFuPicgKyBmcm9tICsgJyAtICcgKyB0byArICc8L3NwYW4+PGJyPicpXHJcclx0Ly9cdH1cclxyXHQvL1x0dmFyIGJ1dHRvbiA9ICRqKCcuc2hvcnQtZGVzY3JpcHRpb24gLnN0ZCAuYnV0dG9uJykuZGV0YWNoKCk7XHJcclx0Ly9cdGNvbnRhaW5lci5hcHBlbmQoYnV0dG9uKTtcclxyXHQvL31cclxyXHJcclx0Ly89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcclx0Ly9jYXJ0IHBhZ2UgY29udGVudD09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcci8qXHJcdCRqKCcucHJvZHVjdC1jYXJ0LWluZm8nKS5lYWNoKGZ1bmN0aW9uKCl7XHJcclx0XHQvLyBjb25zb2xlLmxvZygvWzAtOV17Miw0fVsvXVswLTldezIsNH1bL11bMC05XXsyLDR9L2dpLnRlc3QoJGoodGhpcykuY2hpbGRyZW4oJy5pdGVtLW9wdGlvbnMnKS5maW5kKCdkZCcpLnRleHQoKSkpO1xyXHJcdFx0aWYoL1swLTldezIsNH1bL11bMC05XXsyLDR9Wy9dWzAtOV17Miw0fS9naS50ZXN0KCRqKHRoaXMpLmNoaWxkcmVuKCcuaXRlbS1vcHRpb25zJykuZmluZCgnZGQnKS50ZXh0KCkpKVxyXHJcdFx0e1xyXHJcdFx0XHQkaih0aGlzKS5uZXh0KCkubmV4dCgpLmh0bWwoJzxwPi0gIDwvcD4nKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xyXHJcdFx0fVxyXHJcdFx0ZWxzZVxyXHJcdFx0e1xyXHJcdFx0XHQkaih0aGlzKS5uZXh0KCkubmV4dCgpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XHJcclx0XHR9XHJcclx0fSk7XHIqL1xyXHJcdC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXHJcclxyXHQvL0ZBUT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxyXHQkaignLnF1ZXN0aW9uJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXHJcdFx0JGoodGhpcykubmV4dCgpLnNsaWRlVG9nZ2xlKDQwMCk7XHJcclx0fSk7XHJcclx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJccn0pO1xyXHIiLCIvKipcclxuICogQ3JlYXRlZCBieSBWbGFzYWtoIG9uIDA4LjAzLjIwMTcuXHJcbiAqL1xyXG5cclxuLy8gdmFyIF9fTERFVl9fID0gdHJ1ZTtcclxuXHJcbmNsYXNzIEFqYXhTZW5kXHJcbntcclxuICAgIC8qKkBwcml2YXRlKi8gb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgZm9ybURhdGE6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiXCIsXHJcbiAgICAgICAgICAgIHVybDogXCJcIixcclxuICAgICAgICAgICAgcmVzcENvZGVOYW1lOiAnRXJyb3InLFxyXG4gICAgICAgICAgICByZXNwQ29kZXM6IFtdLFxyXG4gICAgICAgICAgICBiZWZvcmVDaGtSZXNwb25zZTogbnVsbCxcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIC8qKkBwdWJsaWMqLyBzZW5kKGluUHJvcHMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwcm9wcyA9IHsuLi50aGlzLm9wdGlvbnMsIC4uLmluUHJvcHN9O1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gcHJvcHMubWVzc2FnZTtcclxuXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIHVybDogcHJvcHMudXJsLFxyXG4gICAgICAgICAgICAgICAgLy8gdXJsOiBNYWluQ29uZmlnLkJBU0VfVVJMICsgRFMgKyBNYWluQ29uZmlnLkFKQVhfVEVTVCxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gLTEwMDE7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfX0xERVZfXyYmY29uc29sZS5kZWJ1ZyggJ2RhdGEgQUpBWCcsIGRhdGEgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlZm9yZSBjaGVjayByZXNwb25zZSBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMuYmVmb3JlQ2hrUmVzcG9uc2UpIGRhdGEgPSBwcm9wcy5iZWZvcmVDaGtSZXNwb25zZShkYXRhKTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlciBkZWZpbmVkIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBkYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV0gPiAxMDAgJiYgZGF0YVtwcm9wcy5yZXNwQ29kZU5hbWVdIDwgMjAwIClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAtZGF0YVtwcm9wcy5yZXNwQ29kZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhdGNoZWQgc2VydmVyIGVycm9yLCBjb21tb24gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV0gPT0gMTAwIClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAtMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV0gPT0gMjAwIClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIik7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5kZWZpbmRlZCBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAtMTAwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmRpZlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA8IDAgJiYgY29uc29sZS53YXJuKCAnRScsIGVycm9yICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCggZXJyb3IgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xMDA6IDsgLy8gc29tZSBiYWNrZW5kIG5vdCBjb250cm9sbGVkIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xMDAwIDogOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbi8vIDB8fGNvbnNvbGUubG9nKCAnZXJyb3IsIHZhbC5jb2RlJywgZXJyb3IsIHNlbGYub3B0aW9ucy5yZXNwQ29kZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGxldCB2YWwgb2YgcHJvcHMucmVzcENvZGVzIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBlcnJvciA9PSB2YWwuY29kZSApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSB2YWwubWVzc2FnZSB8fCB2YWwuY2FsbGJhY2smJnZhbC5jYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZGlmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmRmb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yIDwgMCA/IHJlamVjdCh7Y29kZTogZXJyb3IsIG1lc3NhZ2UsIGRhdGF9KSA6IHJlc29sdmUoe2NvZGU6IGVycm9yLCBtZXNzYWdlLCBkYXRhfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogLTEwMDIsIG1lc3NhZ2V9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBGb3JtIGRhdGFcclxuICAgICAgICAgICAgICAgIGRhdGE6IHByb3BzLmZvcm1EYXRhIHx8IG5ldyBGb3JtRGF0YSgpLFxyXG4gICAgICAgICAgICAgICAgLy8gT3B0aW9ucyB0byB0ZWxsIGpRdWVyeSBub3QgdG8gcHJvY2VzcyBkYXRhIG9yIHdvcnJ5IGFib3V0IHRoZSBjb250ZW50LXR5cGVcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy9wcm9jZXNzRGF0YTogZmFsc2VcclxuICAgICAgICAgICAgfSwgJ2pzb24nKTtcclxuICAgICAgICAgICAgLy8gLmFsd2F5cyhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAvLyBmb3JtLmZpbmQoJy5sb2FkaW5nLWljbycpLmZhZGVPdXQoMjAwKTtcclxuICAgICAgICAgICAgLy8gfSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcbn0iXX0=
