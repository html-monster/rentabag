<?php
class Addweb_AdvReservation_Helper_Data extends Mage_Core_Helper_Abstract
{
    public function getProductOptionsHtml(Addweb_AdvReservation_Model_Catalog_Product_Option $product)
    {
        return $product;
    }


    public function test()
    {
        return "hello";
    }



    /**
     * Using for prepare crypt string
     * @param array $data
     * @param string $delimiter
     * @param bool $urlencoded
     * @return bool|string
     */
    static public function arrayToQueryString(array $data, $delimiter = '&', $urlencoded = false)
    {
        $queryString = '';
        $delimiterLength = strlen($delimiter);

        // Parse each value pairs and concate to query string
        foreach ($data as $name => $value)
        {
            // Apply urlencode if it is required
            if ($urlencoded)
            {
                $value = urlencode($value);
            }
            $queryString .= $name . '=' . $value . $delimiter;
        }

        // remove the last delimiter
        return substr($queryString, 0, -1 * $delimiterLength);
    }



    /**
     * Crypt string for Sage Pay
     * @param $string
     * @param $key
     * @return string
     */
    public function encryptAes($string, $key)
    {
        // AES encryption, CBC blocking with PKCS5 padding then HEX encoding.
        // Add PKCS5 padding to the text to be encypted.
        $string = $this->addPKCS5Padding($string);

        // Perform encryption with PHP's MCRYPT module.
        $crypt = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $string, MCRYPT_MODE_CBC, $key);

        // Perform hex encoding and return.
        return "@" . strtoupper(bin2hex($crypt));
    }



    /**
     * PHP's mcrypt does not have built in PKCS5 Padding, so we use this.
     * @param string $input The input string.
     * @return string The string with padding.
     */
    protected function addPKCS5Padding($input)
    {
        $blockSize = 16;
        $padd = "";

        // Pad input to an even block size boundary.
        $length = $blockSize - (strlen($input) % $blockSize);
        for ($i = 1; $i <= $length; $i++)
        {
            $padd .= chr($length);
        }

        return $input . $padd;
    }
}
