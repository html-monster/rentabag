/**
 * @author Vlasakh
 * @date 08.06.17.
 */

var App = {
	currentController: null, // current page controller class
};


// call admin order page scripts
if (G_CURRENT_CONTROLLER === 'sales_order' && G_CURRENT_ACTION === 'view') App.currentController = new AdminOrderPage();

jQuery(document).ready(function ()
{
});