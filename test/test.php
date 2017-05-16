<?php
  error_reporting(0);
?>
<?php if( $_GET['success'] ): ?>
    <div style="padding: 10px; color: green;"><b>Payment successfull</b></div>
<?php endif; ?>
<?php if( $_GET['fail'] ): ?>
    <div style="padding: 10px; color: red;"><b>Payment fails</b></div>
<?php endif; ?>
<?php
    include "util.php";

    $Payment = new Payment();
?>
<form action="https://test.sagepay.com/gateway/service/vspform-register.vsp" method="post" id="SagePayForm" name="SagePayForm">
    <?php
    foreach ($Payment->getFormData() as $key => $value)
    {
        ?>
        <input type="hidden" name="<?php echo $key; ?>" value="<?php echo htmlentities($value); ?>" />
    <?php } ?>
    <input type="submit" value="Proceed to Form registration" />
</form>

<?php

class Payment
{
    function getFormData()
    {
        $CryptInfo = [
            'VendorTxCode' => 'rentabag-DEFERRED-10000084-2-Test',
            'Amount' => 350,
            'Currency' => 'GBP',
            'Description' => 'Some payment test 100084',
            'SuccessURL' => 'http://rentabag.dev/test/test.php?success=1',
            'FailureURL' => 'http://rentabag.dev/test/test.php?fail=1',
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

        return ['VPSProtocol' => '3.00',
            'TxType' => 'DEFERRED',
            'Vendor' => 'rentabag',
            'Crypt' => SagepayUtil::encryptAes(SagepayUtil::arrayToQueryString($CryptInfo), '6892e5680e9a4d12'),
        ];
    }
}