<?php
/**
 * User: Wallinole
 * Date: 21.04.2016
 */


 class Addweb_AdvReservation_SearchController extends Mage_Core_Controller_Front_Action
{
     /**
      * Current rent
      */
    public function indexAction()
    {
        $this->loadLayout();
        $this->renderLayout();
    }
}