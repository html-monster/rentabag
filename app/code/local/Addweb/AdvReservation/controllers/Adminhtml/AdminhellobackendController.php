<?php
/**
 * Created by PhpStorm.
 * User: tianna
 * Date: 23.05.17
 * Time: 10:11
 */

//class Addweb_AdvReservation_Adminhtml_AdminhellobackendController extends Mage_Adminhtml_Controller_Action
class Addweb_AdvReservation_Adminhtml_AdminhellobackendController extends Mage_Adminhtml_Controller_Action
{
//    public function pledgenotifyemailAction()
    public function indexAction()
    {
        $aa = "here";

        $this->loadLayout()
            ->_setActiveMenu('mycustomtab')
            ->_title($this->__('Index Action'));
        $this->renderLayout();
    }
}