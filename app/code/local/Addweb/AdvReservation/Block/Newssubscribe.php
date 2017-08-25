<?php
/**
 * Created by Vlasakh
 * Date: 06.04.2017
 */


class Addweb_AdvReservation_Block_Newssubscribe extends Mage_Core_Block_Template
{

    public function __construct()
    {
        parent::__construct();
    }

    protected function _prepareLayout()
    {
        parent::_prepareLayout();

        return $this;
    }


    /**
     * If pledge payment succeeded - show result for user and set DB
     * @return array
     */
    public function getSuccessResult()
    {
        $model = Mage::getModel('advreservation/pledge');
        $paymentData = $model->getPaymentResultInfo(Mage::app()->getRequest()->getParams()['crypt']);

        // set success payment into DB
        $products = [];
        if( $paymentData['Status'] == 'OK' )
        {
            //100000083-76-48-1495220596
            list($idOrder, $idProd) = $model->setPledgePayment($paymentData);

            $products = $model->getOrderProductsPledge($idOrder);

        } // endif

//        Mage::getSingleton('core/session')->addError("Pledge payment fails 1111");

        return $products[$idProd];
    }
}