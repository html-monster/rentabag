<?php
/**
 * Sales order view items block
 *
 * @author     Vlasakh
 */
class Addweb_AdvReservation_Block_Order_Items extends Mage_Sales_Block_Items_Abstract
{
    /**
     * Retrieve current order rent
     */
    public function getOrder()
    {
        $order = Mage::registry('current_order');

        $result = [];
        if( $order->getData()['state'] == 'processing' )
        {
            // *** Get prod pledge payment info ***
            $resource = Mage::getSingleton('core/resource');
            $readConnection = $resource->getConnection('core_read');

            $query = "SELECT
                  id, mailletters, price, id_prod,
                  DATE_FORMAT(fdate, '%Y-%m-%d') fdate,
                  DATE_FORMAT(tdate, '%Y-%m-%d') tdate
                FROM adv_rent
                WHERE id_order = {$this->getRequest()->getParams()['order_id']} 
                  AND mailletters < 4";
            $results = $readConnection->fetchAll($query);

            foreach ($results as $key => $val) {
                $rentInfo[$val['id_prod']] = $val;
            } // end foreach

//
//        // process orders product without pledge
//        $orders = Mage::getResourceModel('sales/order_collection')
//            ->addFieldToSelect('*')
////            ->addFieldToFilter('customer_id', Mage::getSingleton('customer/session')->getCustomer()->getId())
//            ->addFieldToFilter('entity_id', Mage::app()->getRequest()->getParams('o'));
//
//        $result = [];
//        $this->setOrders($orders);
//        foreach ($orders as $order)
//        {
//            $order_id = $order->getRealOrderId();
//            $order = Mage::getModel('sales/order')->load($order_id, 'increment_id');
            $order->getAllVisibleItems();
            $orderItems = $order->getItemsCollection()
                ->addAttributeToSelect('*')
                ->addAttributeToFilter('product_type', array('eq' => 'simple'))
                ->load();


            foreach ($orderItems as $Item) {
                $Item = Mage::getModel('catalog/product')->setStoreId($Item->getStoreId())->load($Item->getProductId());
                // check each product
                if (($id = $Item->getId()) && count($rentInfo[$id])) {
                    $datetime1 = new DateTime("now");
                    $datetime2 = (new DateTime())->createFromFormat('Y-m-d', $rentInfo[$id]['fdate']);

                    if ($datetime1->getTimestamp() < $datetime2->getTimestamp()) {
                        $itemData = $Item->getData();

                        $result[$id] = ['name' => $Item->getName(),
                            'url' => $Item->getProductUrl(),
                            'img' => $Item->getImageUrl(),
                            'pledge' => number_format($itemData['pledge'], 2),
                            'fdate' => date('d M Y', strtotime($rentInfo[$id]['fdate'])),
                            'price' => number_format($rentInfo[$id]['price'], 2),
                        ];
                    } // endif
                }
            }
        } // endif


        return [$order, $result];
    }



    function getSagePayPledgeFormData()
    {
        $CryptInfo = [
            'VendorTxCode' => 'rentabag-DEFERRED-10000084-4-Test',
            'Amount' => 350,
            'Currency' => 'GBP',
            'Description' => 'Some payment test 100084',
//            'SuccessURL' => 'http://rentabag.dev/test/test.php?success=1',
            'SuccessURL' => 'http://rentabagdev.rucheek.in.ua/test/test.php?success=1',
            'FailureURL' => 'http://rentabagdev.rucheek.in.ua/test/test.php?fail=1',
//            'FailureURL' => 'http://rentabag.dev/test/test.php?fail=1',
            'CustomerName' => 'Fedor Boyarin',
            'CustomerEMail' => 'fe@boya.rin',

            'VendorEMail' => '',
            'SendEMail' => '0',
            'eMailMessage' => '',
            'ApplyAVSCV2' => '0',
            'Apply3DSecure' => '0',
            'AllowGiftAid' => '0',
            'BillingAgreement' => '1',
            'VendorData' => 'some my vendor data',
            'BillingAddress2' => 'Frunse 55',
            'BillingPhone' => '44 (0)7933 000 000',
            'BillingState' => '',
            'DeliveryState' => '',
            'DeliveryPhone' => '44 (0)7933 000 000',
            'BasketXML' => '',

            'BillingSurname' => 'Boyarin',
            'BillingFirstnames' => 'Fedorka',
            'BillingAddress1' => 'Frunse 55',
            'BillingCity' => 'Pervomaisk',
//            'BillingPostCode' => '39610',
            'BillingPostCode' => 'W1A 1BL',
            'BillingCountry' => 'GB',
            'DeliverySurname' => 'Boyarin',
            'DeliveryFirstnames' => 'Fedorka',
            'DeliveryAddress1' => 'Frunse 55',
            'DeliveryCity' => 'Pervomaisk',
            'DeliveryPostCode' => '39610',
            'DeliveryCountry' => 'GB',
        ];
//VendorTxCode=rentabag-DEFERRED-1494902510-255249023&Amount=57.29&Currency=GBP&Description=DVDs from Sagepay Demo Page&CustomerName=Fname Mname Surname&CustomerEMail=customer@example.com&VendorEMail=&SendEMail=0&eMailMessage=&BillingSurname=Surname&BillingFirstnames=Fname Mname&BillingAddress1=BillAddress Line 1&BillingAddress2=BillAddress Line 2&BillingCity=BillCity&BillingPostCode=W1A 1BL&BillingCountry=GB&BillingPhone=44 (0)7933 000 000&ApplyAVSCV2=0&Apply3DSecure=0&AllowGiftAid=1&BillingAgreement=1&BillingState=&customerEmail=customer@example.com&DeliveryFirstnames=Fname Mname&DeliverySurname=Surname&DeliveryAddress1=BillAddress Line 1&DeliveryAddress2=BillAddress Line 2&DeliveryCity=BillCity&DeliveryPostCode=W1A 1BL&DeliveryCountry=GB&DeliveryState=&DeliveryPhone=44 (0)7933 000 000&VendorData=some my vendor data&BasketXML=<basket><item><description>Batman - The Dark Knight</description><productSku>DVD2SKU</productSku><productCode>9256370</productCode><quantity>1</quantity><unitNetAmount>10.99</unitNetAmount><unitTaxAmount>0.50</unitTaxAmount><unitGrossAmount>11.49</unitGrossAmount><totalGrossAmount>11.49</totalGrossAmount></item><item><description>IronMan</description><productSku>DVD3SKU</productSku><productCode>84661832</productCode><quantity>5</quantity><unitNetAmount>8.75</unitNetAmount><unitTaxAmount>0.10</unitTaxAmount><unitGrossAmount>8.85</unitGrossAmount><totalGrossAmount>44.25</totalGrossAmount></item><deliveryNetAmount>1.50</deliveryNetAmount><deliveryTaxAmount>0.05</deliveryTaxAmount><deliveryGrossAmount>1.55</deliveryGrossAmount></basket>&SurchargeXML=<surcharges><surcharge><paymentType>MC</paymentType><percentage>5</percentage></surcharge><surcharge><paymentType>VISA</paymentType><fixed>3.5</fixed></surcharge></surcharges>&SuccessURL=http://rentabag.dev/VspPHPKit/demo/form/success&FailureURL=http://rentabag.dev/VspPHPKit/demo/form/failure

        $pass = Mage::getStoreConfig('addweb/test_pass', 1);

        return [
            'data' => ['VPSProtocol' => '3.00',
                'TxType' => 'DEFERRED',
                'Vendor' => 'rentabag',
                'Crypt' => Mage::helper('advreservation')->encryptAes(Mage::helper('advreservation')->arrayToQueryString($CryptInfo), $pass),
            ]
        ];
    }
}
