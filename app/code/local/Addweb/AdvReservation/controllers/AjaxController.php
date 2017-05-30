<?php
/**
 * User: Vlasakh
 * Date: 23.05.2017
 */


 class Addweb_AdvReservation_AjaxController extends Mage_Core_Controller_Front_Action
{
     /**
      * Current rent
      */
    public function pledgenotifyemailAction()
    {
        $aa = "here";

        $this->loadLayout();
        $this->renderLayout();
    }


/*    public function preDispatch()
    {
        parent::preDispatch();
        $action = $this->getRequest()->getActionName();
        $loginUrl = Mage::helper('customer')->getLoginUrl();

        if (!Mage::getSingleton('customer/session')->authenticate($this, $loginUrl)) {
            $this->setFlag('', self::FLAG_NO_DISPATCH, true);
        }
    }*/
}