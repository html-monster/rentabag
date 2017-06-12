"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __DEBUG__ = true;

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
                jQuery.ajax({
                    url: props.url,

                    type: 'POST',
                    success: function success(data) {
                        var error = -1001;
                        try {
                            __DEBUG__ && console.log('data AJAX', data);

                            data = JSON.parse(data);

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
                });
            });

            return promise;
        }
    }]);

    return AjaxSend;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loading = function () {
    function Loading() {
        _classCallCheck(this, Loading);
    }

    _createClass(Loading, null, [{
        key: "show",
        value: function show() {
            $j(this.loaderSelector).fadeIn(200);
        }
    }, {
        key: "hide",
        value: function hide() {
            $j(this.loaderSelector).fadeOut(200);
        }
    }]);

    return Loading;
}();

Object.defineProperty(Loading, "loaderSelector", {
    enumerable: true,
    writable: true,
    value: "#loading-mask"
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdminOrderPage = function () {
    function AdminOrderPage() {
        _classCallCheck(this, AdminOrderPage);

        Object.defineProperty(this, 'orderId', {
            enumerable: true,
            writable: true,
            value: 0
        });
    }

    _createClass(AdminOrderPage, [{
        key: 'bindSendEmail',
        value: function bindSendEmail() {
            var _this = this;

            $j("[data-js-send-pledge-email]").click(function (ee) {
                return _this.onSendEmail(ee);
            });
        }
    }, {
        key: 'setOrderId',
        value: function setOrderId(inId) {
            this.orderId = inId;
        }
    }, {
        key: 'onSendEmail',
        value: function onSendEmail(ee) {
            var $that = ee.currentTarget;
            0 || console.log('clicked', $that, $that.dataset['url']);

            Loading.show();

            var ajaxPromise = new AjaxSend().send({
                formData: { orderId: this.orderId },
                message: 'Error while registering user, please, try again',

                url: $that.dataset['url'],
                respCodeName: 'ErrorCode',
                respCodes: [{ code: 100, message: "" }],
                beforeChkResponse: function beforeChkResponse(data) {
                    Loading.hide();

                    return data;
                }
            });

            ajaxPromise.then(function (result) {
                serverValidation({ message: 'Registration is successful' });
            }, function (result) {
                0 || console.log('result', result);
                switch (result.code) {
                    case -101:
                        break;
                    default:
                }
            });
        }
    }]);

    return AdminOrderPage;
}();
'use strict';

var App = {
  currentController: null };

if (G_CURRENT_CONTROLLER === 'sales_order' && G_CURRENT_ACTION === 'view') App.currentController = new AdminOrderPage();

jQuery(document).ready(function () {});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhTZW5kLmpzIiwiTG9hZGluZy5qcyIsIkFkbWluT3JkZXJQYWdlLmpzIiwiY3VzdG9tLmpzIl0sIm5hbWVzIjpbIl9fREVCVUdfXyIsIkFqYXhTZW5kIiwiZm9ybURhdGEiLCJtZXNzYWdlIiwidXJsIiwicmVzcENvZGVOYW1lIiwicmVzcENvZGVzIiwiYmVmb3JlQ2hrUmVzcG9uc2UiLCJpblByb3BzIiwic2VsZiIsInByb3BzIiwib3B0aW9ucyIsInByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImpRdWVyeSIsImFqYXgiLCJ0eXBlIiwic3VjY2VzcyIsImRhdGEiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJKU09OIiwicGFyc2UiLCJFcnJvciIsImUiLCJ3YXJuIiwidmFsIiwiY29kZSIsImNhbGxiYWNrIiwiRm9ybURhdGEiLCJjYWNoZSIsIkxvYWRpbmciLCIkaiIsImxvYWRlclNlbGVjdG9yIiwiZmFkZUluIiwiZmFkZU91dCIsIkFkbWluT3JkZXJQYWdlIiwiY2xpY2siLCJlZSIsIm9uU2VuZEVtYWlsIiwiaW5JZCIsIm9yZGVySWQiLCIkdGhhdCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0Iiwic2hvdyIsImFqYXhQcm9taXNlIiwic2VuZCIsImhpZGUiLCJ0aGVuIiwic2VydmVyVmFsaWRhdGlvbiIsInJlc3VsdCIsIkFwcCIsImN1cnJlbnRDb250cm9sbGVyIiwiR19DVVJSRU5UX0NPTlRST0xMRVIiLCJHX0NVUlJFTlRfQUNUSU9OIiwiZG9jdW1lbnQiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFJQSxJQUFNQSxZQUFZLElBQWxCOztJQUdNQzs7Ozs7OzttQkFFc0I7QUFDaEJDLDBCQUFVLElBRE07QUFFaEJDLHlCQUFTLEVBRk87QUFHaEJDLHFCQUFLLEVBSFc7QUFJaEJDLDhCQUFjLE9BSkU7QUFLaEJDLDJCQUFXLEVBTEs7QUFNaEJDLG1DQUFtQjtBQU5IOzs7Ozs7NkJBVU5DLFNBQ2xCO0FB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QUdtQixRQUFRQyxHQUFSLENBQWEsUUFBYixFQUF1QitCLE1BQXZCLENBQUg7QUFDQSx3QkFBUUEsT0FBT3hCLElBQWY7QUFFSSx5QkFBSyxDQUFDLEdBQU47QUFFSTtBQUNKO0FBTEo7QUFRSCxhQWZMO0FBZ0JIOzs7Ozs7O0FDakVMLElBQUl5QixNQUFNO0FBQ1RDLHFCQUFtQixJQURWLEVBQVY7O0FBTUEsSUFBSUMseUJBQXlCLGFBQXpCLElBQTBDQyxxQkFBcUIsTUFBbkUsRUFBMkVILElBQUlDLGlCQUFKLEdBQXdCLElBQUlqQixjQUFKLEVBQXhCOztBQUUzRXZCLE9BQU8yQyxRQUFQLEVBQWlCQyxLQUFqQixDQUF1QixZQUN2QixDQUNDLENBRkQiLCJmaWxlIjoiY3VzdG9tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgVmxhc2FraCBvbiAwOC4wMy4yMDE3LlxyXG4gKi9cclxuXHJcbmNvbnN0IF9fREVCVUdfXyA9IHRydWU7XHJcblxyXG5cclxuY2xhc3MgQWpheFNlbmRcclxue1xyXG4gICAgLyoqQHByaXZhdGUqLyBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBmb3JtRGF0YTogbnVsbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJcIixcclxuICAgICAgICAgICAgdXJsOiBcIlwiLFxyXG4gICAgICAgICAgICByZXNwQ29kZU5hbWU6ICdFcnJvcicsXHJcbiAgICAgICAgICAgIHJlc3BDb2RlczogW10sXHJcbiAgICAgICAgICAgIGJlZm9yZUNoa1Jlc3BvbnNlOiBudWxsLFxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgIC8qKkBwdWJsaWMqLyBzZW5kKGluUHJvcHMpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwcm9wcyA9IHsuLi50aGlzLm9wdGlvbnMsIC4uLmluUHJvcHN9O1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gcHJvcHMubWVzc2FnZTtcclxuXHJcbiAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgalF1ZXJ5LmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBwcm9wcy51cmwsXHJcbiAgICAgICAgICAgICAgICAvLyB1cmw6IE1haW5Db25maWcuQkFTRV9VUkwgKyBEUyArIE1haW5Db25maWcuQUpBWF9URVNULFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSAtMTAwMTtcclxuICAgICAgICAgICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fREVCVUdfXyYmY29uc29sZS5sb2coICdkYXRhIEFKQVgnLCBkYXRhICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlZm9yZSBjaGVjayByZXNwb25zZSBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMuYmVmb3JlQ2hrUmVzcG9uc2UpIGRhdGEgPSBwcm9wcy5iZWZvcmVDaGtSZXNwb25zZShkYXRhKTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlciBkZWZpbmVkIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBkYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV0gPiAxMDAgJiYgZGF0YVtwcm9wcy5yZXNwQ29kZU5hbWVdIDwgMjAwIClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAtZGF0YVtwcm9wcy5yZXNwQ29kZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhdGNoZWQgc2VydmVyIGVycm9yLCBjb21tb24gZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV0gPT0gMTAwIClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAtMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV0gPT0gMjAwIClcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIik7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5kZWZpbmRlZCBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSAtMTAwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmRpZlxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA8IDAgJiYgY29uc29sZS53YXJuKCAnRScsIGVycm9yICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCggZXJyb3IgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xMDA6IDsgLy8gc29tZSBiYWNrZW5kIG5vdCBjb250cm9sbGVkIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xMDAwIDogOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbi8vIDB8fGNvbnNvbGUubG9nKCAnZXJyb3IsIHZhbC5jb2RlJywgZXJyb3IsIHNlbGYub3B0aW9ucy5yZXNwQ29kZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGxldCB2YWwgb2YgcHJvcHMucmVzcENvZGVzIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBlcnJvciA9PSB2YWwuY29kZSApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSB2YWwubWVzc2FnZSB8fCB2YWwuY2FsbGJhY2smJnZhbC5jYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZGlmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmRmb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yIDwgMCA/IHJlamVjdCh7Y29kZTogZXJyb3IsIG1lc3NhZ2UsIGRhdGF9KSA6IHJlc29sdmUoe2NvZGU6IGVycm9yLCBtZXNzYWdlLCBkYXRhfSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh7Y29kZTogLTEwMDIsIG1lc3NhZ2V9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBGb3JtIGRhdGFcclxuICAgICAgICAgICAgICAgIGRhdGE6IHByb3BzLmZvcm1EYXRhIHx8IG5ldyBGb3JtRGF0YSgpLFxyXG4gICAgICAgICAgICAgICAgLy8gT3B0aW9ucyB0byB0ZWxsIGpRdWVyeSBub3QgdG8gcHJvY2VzcyBkYXRhIG9yIHdvcnJ5IGFib3V0IHRoZSBjb250ZW50LXR5cGVcclxuICAgICAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy9wcm9jZXNzRGF0YTogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIC5hbHdheXMoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gZm9ybS5maW5kKCcubG9hZGluZy1pY28nKS5mYWRlT3V0KDIwMCk7XHJcbiAgICAgICAgICAgIC8vIH0pXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdGlhbm5hIG9uIDExLjA2LjE3LlxyXG4gKi9cclxuXHJcbmNsYXNzIExvYWRpbmdcclxue1xyXG4gICAgLyoqQHByaXZhdGUqLyBzdGF0aWMgbG9hZGVyU2VsZWN0b3IgPSBcIiNsb2FkaW5nLW1hc2tcIjtcclxuXHJcblxyXG4gICAgLyoqQHB1YmxpYyovIHN0YXRpYyBzaG93KClcclxuICAgIHtcclxuICAgICAgICAkaih0aGlzLmxvYWRlclNlbGVjdG9yKS5mYWRlSW4oMjAwKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqQHB1YmxpYyovIHN0YXRpYyBoaWRlKClcclxuICAgIHtcclxuICAgICAgICAkaih0aGlzLmxvYWRlclNlbGVjdG9yKS5mYWRlT3V0KDIwMCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogQGF1dGhvciBWbGFzYWtoXHJcbiAqIEBkYXRlIDA4LjA2LjE3LlxyXG4gKi9cclxuXHJcblxyXG5jbGFzcyBBZG1pbk9yZGVyUGFnZVxyXG57XHJcbiAgICAvKipAcHJpdmF0ZSovIG9yZGVySWQgPSAwO1xyXG5cclxuXHJcbiAgICAvKipAcHVibGljKi8gYmluZFNlbmRFbWFpbCgpXHJcbiAgICB7XHJcbiAgICAgICAgLy8gYmluZCBzZW5kIGVtYWlsIGJ0blxyXG4gICAgICAgICRqKFwiW2RhdGEtanMtc2VuZC1wbGVkZ2UtZW1haWxdXCIpLmNsaWNrKChlZSkgPT4gdGhpcy5vblNlbmRFbWFpbChlZSkpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipAcHVibGljKi8gc2V0T3JkZXJJZChpbklkKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub3JkZXJJZCA9IGluSWQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKkBwcml2YXRlKi8gb25TZW5kRW1haWwoZWUpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc3QgJHRoYXQgPSBlZS5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgIDB8fGNvbnNvbGUubG9nKCAnY2xpY2tlZCcsICR0aGF0LCAkdGhhdC5kYXRhc2V0Wyd1cmwnXSApO1xyXG5cclxuICAgICAgICBMb2FkaW5nLnNob3coKTtcclxuXHJcbiAgICAgICAgY29uc3QgYWpheFByb21pc2UgPSAobmV3IEFqYXhTZW5kKCkpLnNlbmQoe1xyXG4gICAgICAgICAgICBmb3JtRGF0YToge29yZGVySWQ6IHRoaXMub3JkZXJJZH0sXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBFcnJvciB3aGlsZSByZWdpc3RlcmluZyB1c2VyLCBwbGVhc2UsIHRyeSBhZ2FpbmAsXHJcbiAgICAgICAgICAgIC8vIHVybDogQUJwcC5iYXNlVXJsICsgJGZvcm0uYXR0cignYWN0aW9uJyksXHJcbiAgICAgICAgICAgIHVybDogJHRoYXQuZGF0YXNldFsndXJsJ10sIC8vIERFQlVHOiByZW1vdmUgaXRcclxuICAgICAgICAgICAgcmVzcENvZGVOYW1lOiAnRXJyb3JDb2RlJyxcclxuICAgICAgICAgICAgcmVzcENvZGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7Y29kZTogMTAwLCBtZXNzYWdlOiBcIlwifSxcclxuICAgICAgICAgICAgICAgIC8vIHtjb2RlOiAtMTAxLCBtZXNzYWdlOiBcIlNvbWUgY3VzdG9tIGVycm9yXCJ9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBiZWZvcmVDaGtSZXNwb25zZTogKGRhdGEpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIExvYWRpbmcuaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERFQlVHOiBlbXVsYXRlXHJcbiAgICAgICAgICAgICAgICAvLyBkYXRhID0ge0Vycm9yOiAxMDF9O1xyXG4gICAgICAgICAgICAgICAgLy8gZGF0YS5QYXJhbTEgPSBcIlRPUi1QSEktMzE1MjAxN1wiOyAvLyBpZFxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgYWpheFByb21pc2UudGhlbiggcmVzdWx0ID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIDB8fGNvbnNvbGUubG9nKCAnc3VjY2VzcycsIHJlc3VsdCApO1xyXG4gICAgICAgICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7bWVzc2FnZTogJ1JlZ2lzdHJhdGlvbiBpcyBzdWNjZXNzZnVsJ30pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgMHx8Y29uc29sZS5sb2coICdyZXN1bHQnLCByZXN1bHQgKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCggcmVzdWx0LmNvZGUgKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgLTEwMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VydmVyVmFsaWRhdGlvbih7ZXJyb3I6ICdVc2VyIG5hbWUgZmFpbGVkLCBjb3JyZWN0IGl0LCBwbGVhc2UnLCBGaXJzdE5hbWU6IFwiVXNlciBuYW1lIGZhaWxlZFwifSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNlcnZlclZhbGlkYXRpb24oe2Vycm9yOiAnVXNlciByZWdpc3RyYXRpb24gZmFpbGVkLCBwbGVhc2UsIHJlZnJlc2ggdGhlIHBhZ2UgYW5kIHRyeSBhZ2Fpbid9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogQGF1dGhvciBWbGFzYWtoXHJcbiAqIEBkYXRlIDA4LjA2LjE3LlxyXG4gKi9cclxuXHJcbnZhciBBcHAgPSB7XHJcblx0Y3VycmVudENvbnRyb2xsZXI6IG51bGwsIC8vIGN1cnJlbnQgcGFnZSBjb250cm9sbGVyIGNsYXNzXHJcbn07XHJcblxyXG5cclxuLy8gY2FsbCBhZG1pbiBvcmRlciBwYWdlIHNjcmlwdHNcclxuaWYgKEdfQ1VSUkVOVF9DT05UUk9MTEVSID09PSAnc2FsZXNfb3JkZXInICYmIEdfQ1VSUkVOVF9BQ1RJT04gPT09ICd2aWV3JykgQXBwLmN1cnJlbnRDb250cm9sbGVyID0gbmV3IEFkbWluT3JkZXJQYWdlKCk7XHJcblxyXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpXHJcbntcclxufSk7Il19
