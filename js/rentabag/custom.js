'use strict';

var G_CURRENTPAGE = '';

jQuery(document).ready(function () {
  if (G_CURRENTPAGE === 'admin/sales_order/view') new AdminOrderPage();
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdminOrderPage = function () {
    function AdminOrderPage() {
        _classCallCheck(this, AdminOrderPage);

        $("[data-js-send-pledge-email]").click(this.onSendEmail.bind(this));
    }

    _createClass(AdminOrderPage, [{
        key: 'onSendEmail',
        value: function onSendEmail() {
            var ajaxPromise = new AjaxSend().send({
                formData: values,
                message: 'Error while registering user, please, try again',

                url: $form.attr('action'),
                respCodeName: 'ErrorCode',
                respCodes: [{ code: 100, message: "" }]
            });

            ajaxPromise.then(function (result) {
                serverValidation({ message: 'Registration is successful' });
            }, function (result) {
                0 || console.log('result', result);
                switch (result.code) {
                    case -101:
                        serverValidation({ error: 'User name failed, correct it, please', FirstName: "User name failed" });
                        break;
                    default:
                        serverValidation({ error: 'User registration failed, please, refresh the page and try again' });
                }
            });
        }
    }]);

    return AdminOrderPage;
}();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS5qcyIsInBhZ2VzL0FkbWluT3JkZXJQYWdlLmpzIiwiQWpheFNlbmQuanMiXSwibmFtZXMiOlsiR19DVVJSRU5UUEFHRSIsImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCJBZG1pbk9yZGVyUGFnZSIsIiQiLCJjbGljayIsIm9uU2VuZEVtYWlsIiwiYWpheFByb21pc2UiLCJBamF4U2VuZCIsInNlbmQiLCJmb3JtRGF0YSIsInZhbHVlcyIsIm1lc3NhZ2UiLCJ1cmwiLCIkZm9ybSIsImF0dHIiLCJyZXNwQ29kZU5hbWUiLCJyZXNwQ29kZXMiLCJjb2RlIiwidGhlbiIsInNlcnZlclZhbGlkYXRpb24iLCJjb25zb2xlIiwibG9nIiwicmVzdWx0IiwiZXJyb3IiLCJGaXJzdE5hbWUiLCJiZWZvcmVDaGtSZXNwb25zZSIsImluUHJvcHMiLCJzZWxmIiwicHJvcHMiLCJvcHRpb25zIiwicHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYWpheCIsInR5cGUiLCJzdWNjZXNzIiwiZGF0YSIsIl9fTERFVl9fIiwiZGVidWciLCJFcnJvciIsImUiLCJ3YXJuIiwidmFsIiwiY2FsbGJhY2siLCJGb3JtRGF0YSIsImNhY2hlIl0sIm1hcHBpbmdzIjoiOztBQU9BLElBQUlBLGdCQUFnQixFQUFwQjs7QUFHQUMsT0FBT0MsUUFBUCxFQUFpQkMsS0FBakIsQ0FBdUIsWUFDdkI7QUFFQyxNQUFJSCxrQkFBa0Isd0JBQXRCLEVBQWdELElBQUlJLGNBQUo7QUFDaEQsQ0FKRDs7Ozs7OztJQ0pNQTtBQUVGLDhCQUNBO0FBQUE7O0FBQ0lDLFVBQUUsNkJBQUYsRUFBaUNDLEtBQWpDLENBQXlDLEtBQUtDLFdBQTlDLE1BQXlDLElBQXpDO0FBQ0g7Ozs7c0NBR0Q7QUFDSSxnQkFBTUMsY0FBZSxJQUFJQyxRQUFKLEVBQUQsQ0FBaUJDLElBQWpCLENBQXNCO0FBQ3RDQywwQkFBVUMsTUFENEI7QUFFdENDLDBFQUZzQzs7QUFJdENDLHFCQUFLQyxN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T0FBSixJQUFlZ0MsSUFBSUMsUUFBSixJQUFjRCxJQUFJQyxRQUFKLENBQWFQLElBQWIsQ0FBdkM7QUFDQTtBQUNIO0FBQ0o7QUFUTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUpKO0FBZUg7O0FBR0RkLGdDQUFRLENBQVIsR0FBWVUsT0FBTyxFQUFDaEIsTUFBTU0sS0FBUCxFQUFjWixnQkFBZCxFQUF1QjBCLFVBQXZCLEVBQVAsQ0FBWixHQUFtREwsUUFBUSxFQUFDZixNQUFNTSxLQUFQLEVBQWNaLGdCQUFkLEVBQXVCMEIsVUFBdkIsRUFBUixDQUFuRDtBQUNILHFCQWxFRTtBQW1FSGQsMkJBQU8saUJBQVc7QUFDZFUsK0JBQU8sRUFBQ2hCLE1BQU0sQ0FBQyxJQUFSLEVBQWNOLGdCQUFkLEVBQVA7QUFDSCxxQkFyRUU7O0FBdUVIMEIsMEJBQU1ULE1BQU1uQixRQUFOLElBQWtCLElBQUlvQyxRQUFKLEVBdkVyQjs7QUF5RUhDLDJCQUFPO0FBekVKLGlCQUFQLEVBNEVHLE1BNUVIO0FBZ0ZILGFBbEZhLENBQWQ7O0FBb0ZBLG1CQUFPaEIsT0FBUDtBQUNIIiwiZmlsZSI6ImN1c3RvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAYXV0aG9yIFZsYXNha2hcclxuICogQGRhdGUgMDguMDYuMTcuXHJcbiAqL1xyXG5cclxuXHJcbi8vIHNldCBjdXJyZW50IHBhZ2VcclxudmFyIEdfQ1VSUkVOVFBBR0UgPSAnJztcclxuXHJcblxyXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpXHJcbntcclxuXHQvLyBjYWxsIGFkbWluIG9yZGVyIHBhZ2Ugc2NyaXB0c1xyXG5cdGlmIChHX0NVUlJFTlRQQUdFID09PSAnYWRtaW4vc2FsZXNfb3JkZXIvdmlldycpIG5ldyBBZG1pbk9yZGVyUGFnZSgpO1xyXG59KTsiLCIvKipcclxuICogQGF1dGhvciBWbGFzYWtoXHJcbiAqIEBkYXRlIDA4LjA2LjE3LlxyXG4gKi9cclxuXHJcblxyXG5jbGFzcyBBZG1pbk9yZGVyUGFnZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgJChcIltkYXRhLWpzLXNlbmQtcGxlZGdlLWVtYWlsXVwiKS5jbGljayg6OnRoaXMub25TZW5kRW1haWwpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU2VuZEVtYWlsKClcclxuICAgIHtcclxuICAgICAgICBjb25zdCBhamF4UHJvbWlzZSA9IChuZXcgQWpheFNlbmQoKSkuc2VuZCh7XHJcbiAgICAgICAgICAgIGZvcm1EYXRhOiB2YWx1ZXMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBFcnJvciB3aGlsZSByZWdpc3RlcmluZyB1c2VyLCBwbGVhc2UsIHRyeSBhZ2FpbmAsXHJcbiAgICAgICAgICAgIC8vIHVybDogQUJwcC5iYXNlVXJsICsgJGZvcm0uYXR0cignYWN0aW9uJyksXHJcbiAgICAgICAgICAgIHVybDogJGZvcm0uYXR0cignYWN0aW9uJyksIC8vIERFQlVHOiByZW1vdmUgaXRcclxuICAgICAgICAgICAgcmVzcENvZGVOYW1lOiAnRXJyb3JDb2RlJyxcclxuICAgICAgICAgICAgcmVzcENvZGVzOiBbXHJcbiAgICAgICAgICAgICAgICB7Y29kZTogMTAwLCBtZXNzYWdlOiBcIlwifSxcclxuICAgICAgICAgICAgICAgIC8vIHtjb2RlOiAtMTAxLCBtZXNzYWdlOiBcIlNvbWUgY3VzdG9tIGVycm9yXCJ9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyBiZWZvcmVDaGtSZXNwb25zZTogKGRhdGEpID0+XHJcbiAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgLy8gICAgIC8vIERFQlVHOiBlbXVsYXRlXHJcbiAgICAgICAgICAgIC8vICAgICBkYXRhID0ge0Vycm9yOiAxMDF9O1xyXG4gICAgICAgICAgICAvLyAgICAgLy8gZGF0YS5QYXJhbTEgPSBcIlRPUi1QSEktMzE1MjAxN1wiOyAvLyBpZFxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICBhamF4UHJvbWlzZS50aGVuKCByZXN1bHQgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gMHx8Y29uc29sZS5sb2coICdzdWNjZXNzJywgcmVzdWx0ICk7XHJcbiAgICAgICAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHttZXNzYWdlOiAnUmVnaXN0cmF0aW9uIGlzIHN1Y2Nlc3NmdWwnfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAwfHxjb25zb2xlLmxvZyggJ3Jlc3VsdCcsIHJlc3VsdCApO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKCByZXN1bHQuY29kZSApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJWYWxpZGF0aW9uKHtlcnJvcjogJ1VzZXIgbmFtZSBmYWlsZWQsIGNvcnJlY3QgaXQsIHBsZWFzZScsIEZpcnN0TmFtZTogXCJVc2VyIG5hbWUgZmFpbGVkXCJ9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyVmFsaWRhdGlvbih7ZXJyb3I6ICdVc2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQsIHBsZWFzZSwgcmVmcmVzaCB0aGUgcGFnZSBhbmQgdHJ5IGFnYWluJ30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IFZsYXNha2ggb24gMDguMDMuMjAxNy5cclxuICovXHJcblxyXG4vLyB2YXIgX19MREVWX18gPSB0cnVlO1xyXG5cclxuY2xhc3MgQWpheFNlbmRcclxue1xyXG4gICAgLyoqQHByaXZhdGUqLyBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBmb3JtRGF0YTogbnVsbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJcIixcclxuICAgICAgICAgICAgdXJsOiBcIlwiLFxyXG4gICAgICAgICAgICByZXNwQ29kZU5hbWU6ICdFcnJvcicsXHJcbiAgICAgICAgICAgIHJlc3BDb2RlczogW10sXHJcbiAgICAgICAgICAgIGJlZm9yZUNoa1Jlc3BvbnNlOiBudWxsLFxyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgLyoqQHB1YmxpYyovIHNlbmQoaW5Qcm9wcylcclxuICAgIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHByb3BzID0gey4uLnRoaXMub3B0aW9ucywgLi4uaW5Qcm9wc307XHJcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBwcm9wcy5tZXNzYWdlO1xyXG5cclxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBwcm9wcy51cmwsXHJcbiAgICAgICAgICAgICAgICAvLyB1cmw6IE1haW5Db25maWcuQkFTRV9VUkwgKyBEUyArIE1haW5Db25maWcuQUpBWF9URVNULFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSAtMTAwMTtcclxuICAgICAgICAgICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fTERFVl9fJiZjb25zb2xlLmRlYnVnKCAnZGF0YSBBSkFYJywgZGF0YSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmVmb3JlIGNoZWNrIHJlc3BvbnNlIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5iZWZvcmVDaGtSZXNwb25zZSkgZGF0YSA9IHByb3BzLmJlZm9yZUNoa1Jlc3BvbnNlKGRhdGEpO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1c2VyIGRlZmluZWQgZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGRhdGFbcHJvcHMucmVzcENvZGVOYW1lXSA+IDEwMCAmJiBkYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV0gPCAyMDAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IC1kYXRhW3Byb3BzLnJlc3BDb2RlTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2F0Y2hlZCBzZXJ2ZXIgZXJyb3IsIGNvbW1vbiBlcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFbcHJvcHMucmVzcENvZGVOYW1lXSA9PSAxMDAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IC0xMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2Vzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFbcHJvcHMucmVzcENvZGVOYW1lXSA9PSAyMDAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlwiKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1bmRlZmluZGVkIGVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IC0xMDAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZGlmXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yIDwgMCAmJiBjb25zb2xlLndhcm4oICdFJywgZXJyb3IgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKCBlcnJvciApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTEwMDogOyAvLyBzb21lIGJhY2tlbmQgbm90IGNvbnRyb2xsZWQgZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTEwMDAgOiA7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuLy8gMHx8Y29uc29sZS5sb2coICdlcnJvciwgdmFsLmNvZGUnLCBlcnJvciwgc2VsZi5vcHRpb25zLnJlc3BDb2RlcyApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciggbGV0IHZhbCBvZiBwcm9wcy5yZXNwQ29kZXMgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGVycm9yID09IHZhbC5jb2RlIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IHZhbC5tZXNzYWdlIHx8IHZhbC5jYWxsYmFjayYmdmFsLmNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kaWZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPCAwID8gcmVqZWN0KHtjb2RlOiBlcnJvciwgbWVzc2FnZSwgZGF0YX0pIDogcmVzb2x2ZSh7Y29kZTogZXJyb3IsIG1lc3NhZ2UsIGRhdGF9KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHtjb2RlOiAtMTAwMiwgbWVzc2FnZX0pO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEZvcm0gZGF0YVxyXG4gICAgICAgICAgICAgICAgZGF0YTogcHJvcHMuZm9ybURhdGEgfHwgbmV3IEZvcm1EYXRhKCksXHJcbiAgICAgICAgICAgICAgICAvLyBPcHRpb25zIHRvIHRlbGwgalF1ZXJ5IG5vdCB0byBwcm9jZXNzIGRhdGEgb3Igd29ycnkgYWJvdXQgdGhlIGNvbnRlbnQtdHlwZVxyXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy9jb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvL3Byb2Nlc3NEYXRhOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCAnanNvbicpO1xyXG4gICAgICAgICAgICAvLyAuYWx3YXlzKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gICAgIC8vIGZvcm0uZmluZCgnLmxvYWRpbmctaWNvJykuZmFkZU91dCgyMDApO1xyXG4gICAgICAgICAgICAvLyB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxufSJdfQ==
