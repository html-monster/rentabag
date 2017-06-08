/**
 * @author Vlasakh
 * @date 08.06.17.
 */


// set current page
var G_CURRENTPAGE = '';


jQuery(document).ready(function ()
{
	// call admin order page scripts
	if (G_CURRENTPAGE === 'admin/sales_order/view') new AdminOrderPage();
});