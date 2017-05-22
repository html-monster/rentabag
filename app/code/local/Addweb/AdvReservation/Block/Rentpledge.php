<?php
/**
 * Created by Vlasakh
 * Date: 06.04.2017
 */


class Addweb_AdvReservation_Block_Rentpledge extends Mage_Core_Block_Template
{
    private $productsPledges;
    private $currentOrder;


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
     * Pledge mails notification
     * @return array
     */
    public function getOrdersNoPlege()
    {
        // *** Get not payed rents ***
        $resource = Mage::getSingleton('core/resource');
        $readConnection = $resource->getConnection('core_read');

        $query = "SELECT
                  id, mailletters, price, id_prod, id_order,
                  DATE_FORMAT(fdate, '%Y-%m-%d') fdate,
                  DATE_FORMAT(tdate, '%Y-%m-%d') tdate
                FROM adv_rent
                WHERE fdate >= CURDATE() 
                  AND fdate <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
                  AND status < 2
                  AND mailletters < 4
                ORDER BY fdate ";
        $rents = $readConnection->fetchAll($query);

//        foreach ($results as $key => $val)
//        {
//            $rents[$val['id_prod']] = $val;
//        } // end foreach



        // process orders product without pledge
        $orders = Mage::getResourceModel('sales/order_collection')
            ->addFieldToSelect('*')
//            ->addFieldToFilter('customer_id', Mage::getSingleton('customer/session')->getCustomer()->getId())
            ->addFieldToFilter('state', array('in' => Mage::getSingleton('sales/order_config')->getVisibleOnFrontStates()))
            ->addFieldToFilter('status', 'processing')
            ->setOrder('created_at', 'desc');

        $result = [];
        $this->setOrders($orders);
        foreach ($orders as $order)
        {
            $order_id = $order->getRealOrderId();
            $order = Mage::getModel('sales/order')->load($order_id, 'increment_id');
            $email = $order->getCustomerEmail();
            $order->getAllVisibleItems();
            $orderItems = $order->getItemsCollection()
                ->addAttributeToSelect('*')
                ->addAttributeToFilter('product_type', array('eq' => 'simple'))
                ->load();

            $result[$order_id] = ['email' => $email, 'id' => $order->getId()];
            foreach ($orderItems as $Item)
            {
                $Item = Mage::getModel('catalog/product')->setStoreId($Item->getStoreId())->load($Item->getProductId());
                // check each product
                if ($id = $Item->getId())
                {
                    if( (int)$Item->getData()['pledge'] > 0 && ($prod = $this->searchProduct($rents, $id, $order->getId())) )
                    {
//                        $timezone = new DateTimeZone("Europe/Kiev");
                        $datetime1 = new DateTime("now");
                        $datetime2 = (new DateTime())->createFromFormat('Y-m-d', $prod['fdate']);
                        $interval = $datetime1->diff($datetime2);

                        // check 7 days
                        $mailletter = false;
                        if( $prod['mailletters'] == 0 && $interval->y == 0 && $interval->m == 0
                            && $interval->d <= 7 && $interval->d > 2 )
                        {
                            $mailletter = 1;
//			i. Вставляем данные пользователя
//			ii. Вставляем номер заказа
//			iii. Описываем товар и залоговую стоимость
//			iv. Пишем, что заказ на такоето число для получ. товара необходимо внести залог + ссылка на функционал оплаты залога
//			v. Данное уведомление было прислано вам в связи с тем, что у вас был оплачена оренда заказа, но не внесен залог. После внесения суммы залога данное письмо больше не будет приходить.Если вы хотите отказаться от этих уведомлений - также можно связаться с нами и отменить заказ, перейти на страницу контактов (ссылка)



                        // check 2 days
                        } elseif ($prod['mailletters'] < 2 && $interval->y == 0 && $interval->m == 0
                            && $interval->d == 2 )
                        {
                            $mailletter = 2;




                        // check 1 days
                        } elseif ($prod['mailletters'] < 3 && $interval->y == 0 && $interval->m == 0
                            && $interval->d == 1 )
                        {
                            $mailletter = 3;




                        // check 0 days
                        } elseif ($prod['mailletters'] < 4 && $interval->y == 0 && $interval->m == 0
                            && $interval->d == 0 )
                        {
                            $mailletter = 4;
                        }



                        if( $mailletter )
                        {
                            $itemData = $Item->getData();


                            $resource = Mage::getSingleton('core/resource');
                            /** @var Magento_Db_Adapter_Pdo_Mysql */
                            $readConnection = $resource->getConnection('core_write');

                            $query = "UPDATE adv_rent SET mailletters = {$mailletter} WHERE id_order = {$order->getId()} AND id_prod = {$prod['id_prod']}";
                            $results = $readConnection->query($query);


//                            $emailTemplate  = Mage::getModel('core/email_template')->loadDefault(1);
                            $emailTemplate  = Mage::getModel('core/email_template')->loadByCode($mailletter < 4 ? 'rent_notify' : 'rent_refuse');


                            $emailTemplateVariables = array();
                            $emailTemplateVariables['baseUrl'] = Mage::getBaseUrl();
                            $emailTemplateVariables['orderDate'] = date('d M Y', strtotime($itemData['created_at']));
                            $emailTemplateVariables['orderNum'] = $order->getIncrementId();
                            $emailTemplateVariables['goodsName'] = trim($itemData['name']);
                            $emailTemplateVariables['rentStart'] = date('d M Y', strtotime($prod['fdate']));
                            $emailTemplateVariables['pledge'] = $itemData['pledge'];
                            $emailTemplateVariables['orderId'] = $order->getId();
                            $emailTemplateVariables['prodId'] = $id;

                            $processedTemplate = $emailTemplate->getProcessedTemplate($emailTemplateVariables, true);

//                            $emailTemplate->send('Zotaper@yandex.ru', 'John Doe', $emailTemplateVariables);
                            $data = $emailTemplate->getData();
                            $emailTemplate->setSenderName($data['template_sender_name']);
                            $emailTemplate->setSenderEmail($data['template_sender_email']);
                            $emailTemplate->setTemplateSubject($data['template_subject']);

                            $emailTemplate->send($order->getCustomerEmail(), $order->getCustomerFirstname() . " " . $order->getCustomerLastname(), $emailTemplateVariables);
/*
                            $mail = Mage::getModel('core/email');
                            $mail->setToName('Test name');
                            $mail->setToEmail('Zotaper@yandex.ru');
                            $mail->setBody('Mail Text / Mail Content');
                            $mail->setSubject('Mail Subject test');
                            $mail->setFromEmail('autoMailer@rentbg.com');
                            $mail->setFromName("Msg to Show on Subject");
                            $mail->setType('html');// YOu can use Html or text as Mail format

                            try {
                                $mail->send();
//                                Mage::getSingleton('core/session')->addSuccess('Your request has been sent');
//                                $this->_redirect('');
                            } catch (Exception $e) {
//                                Mage::getSingleton('core/session')->addError('Unable to send.');
//                                $this->_redirect('');
                            }*/
                        } // endif
                    } // endif

                    $result[$order_id]['items'][] = [$Item->getName(), $Item->getPrice(), $Item->getProductUrl(), $Item->getImageUrl(), $Item->getData()['pledge'], date('d M Y', strtotime($prod['fdate']))];
                }
            }
        }

        return $result;
    }



    /**
     * Get product info for pledge payment page
     * @return array
     */
    public function getProdPlege()
    {
        $this->currentOrder = $order = Mage::getModel('sales/order')->load(Mage::app()->getRequest()->getParams()['o']);

        $model = Mage::getModel('advreservation/pledge');
        $this->productsPledges = $result = $model->getOrderProductsPledge($order);

        return $result[Mage::app()->getRequest()->getParams()['g']];
    }



    function getSagePayPledgeFormData()
    {
        $model = Mage::getModel('advreservation/pledge');
        return $model->getSagePayPledgeFormData($this->currentOrder, $this->productsPledges[Mage::app()->getRequest()->getParams()['g']]);
    }



    /**
     * If pledge payment fails - show result for user
     * @return array
     */
    public function getFailResult()
    {
        $model = Mage::getModel('advreservation/pledge');
        $paymentData = $model->getPaymentResultInfo(Mage::app()->getRequest()->getParams()['crypt']);

//        Mage::getSingleton('core/session')->addError("Pledge payment fails 1111");

        return ['StatusDetail' => $paymentData['StatusDetail']];
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



    private function searchProduct($inProducts, $inProdId, $inOrderId)
    {
        foreach ($inProducts as $key => $val)
        {
            if( $val['id_prod'] == $inProdId && $val['id_order'] == $inOrderId )
            {
                return $val;
            } // endif
        } // end foreach

        return false;
    }
}