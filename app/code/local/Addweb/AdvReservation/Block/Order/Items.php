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

                        $result[$id] = [
                            'id' => $id,
                            'name' => $Item->getName(),
                            'url' => $Item->getProductUrl(),
                            'img' => $Item->getImageUrl(),
                            'pledge' => number_format($itemData['pledge'], 2),
                            'tdate' => date('d M Y', strtotime($rentInfo[$id]['tdate'])),
                            'fdate' => date('d M Y', strtotime($rentInfo[$id]['fdate'])),
                            'price' => number_format($rentInfo[$id]['price'], 2),
                        ];
                    } // endif
                }
            }
        } // endif


        return [$order, $result];
    }



    function getSagePayPledgeFormData($order, $prodPledge)
    {
        $orderData = $order->getData();
        $CryptInfo = [
            'VendorTxCode' => "{$order->getRealOrderId()}-{$prodPledge['id']}-PL-".time(),
            'Amount' => $prodPledge['pledge'],
            'Currency' => 'GBP',
            'Description' => "{$order->getRealOrderId()} - {$prodPledge['name']} ({$prodPledge['fdate']}-{$prodPledge['tdate']})",
//            'SuccessURL' => 'http://rentabag.dev/test/test.php?success=1',
            'SuccessURL' => "http://{$_SERVER['SERVER_NAME']}/test/test.php?success=1",
            'FailureURL' => "http://{$_SERVER['SERVER_NAME']}/test/test.php?fail=1",
//            'FailureURL' => 'http://rentabag.dev/test/test.php?fail=1',
            'CustomerName' => "{$orderData['customer_firstname']} {$orderData['customer_lastname']}",
            'CustomerEMail' => $orderData['customer_email'],

            'VendorEMail' => '',
            'SendEMail' => '0',
            'eMailMessage' => '',
            'ApplyAVSCV2' => '0',
            'Apply3DSecure' => '0',
            'AllowGiftAid' => '0',
            'BillingAgreement' => '1',
            'VendorData' => '', //some my vendor data
            'BillingAddress2' => '-', //Frunse 55
//            'BillingPhone' => '44 (0)7933 000 000',
            'BillingState' => '',
            'DeliveryState' => '',
//            'DeliveryPhone' => '44 (0)7933 000 000',
//            'BasketXML' => '',

            'BillingSurname' => $orderData['customer_lastname'],
            'BillingFirstnames' => $orderData['customer_firstname'],
            'BillingAddress1' => '-',
            'BillingCity' => '-',
            'BillingPostCode' => '-', // W1A 1BL
            'BillingCountry' => 'GB',
            'DeliverySurname' => $orderData['customer_lastname'],
            'DeliveryFirstnames' => $orderData['customer_firstname'],
            'DeliveryAddress1' => '-',
            'DeliveryCity' => '-',
            'DeliveryPostCode' => '-',
            'DeliveryCountry' => 'GB',
        ];

        $pass = Mage::getStoreConfig('addweb/test_pass', 1);

        return [
            'data' => [
                'VendorTxCode' => "{$order->getRealOrderId()}-{$prodPledge['id']}-PLEDGE-".time(),
                'Amount' => $prodPledge['pledge'],
                'VPSProtocol' => '3.00',
                'TxType' => 'DEFERRED',
                'Vendor' => 'rentabag',
                'Crypt' => Mage::helper('advreservation')->encryptAes(Mage::helper('advreservation')->arrayToQueryString($CryptInfo), $pass),
            ]
        ];
    }
}