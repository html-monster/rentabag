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
}
