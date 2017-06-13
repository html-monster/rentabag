/**
 * @author Vlasakh
 * @date 08.06.17.
 */


class AdminOrderPage
{
    /**@private*/ orderId = 0;


    /**@public*/ bindSendEmail()
    {
        // bind send email btn
        $j("[data-js-send-pledge-email]").click((ee) => this.onSendEmail(ee));
    }


    /**@public*/ setOrderId(inId)
    {
        this.orderId = inId;
    }


    /**@private*/ onSendEmail(ee)
    {
        const $that = ee.currentTarget;
        0||console.log( 'clicked', $that, $that.dataset['url'] );

        Loading.show();

        const ajaxPromise = (new AjaxSend()).send({
            formData: {orderId: this.orderId},
            message: `Error while registering user, please, try again`,
            // url: ABpp.baseUrl + $form.attr('action'),
            url: $that.dataset['url'], // DEBUG: remove it
            respCodeName: 'ErrorCode',
            respCodes: [
                {code: 100, message: ""},
                // {code: -101, message: "Some custom error"},
            ],
            beforeChkResponse: (data) =>
            {
                Loading.hide();

                // DEBUG: emulate
                // data = {Error: 101};
                // data.Param1 = "TOR-PHI-3152017"; // id

                return data;
            },
        });


        ajaxPromise.then( result =>
            {
                // 0||console.log( 'success', result );
                serverValidation({message: 'Registration is successful'});
            },
            result => {
                0||console.log( 'result', result );
                switch( result.code )
                {
                    case -101:
                        // serverValidation({error: 'User name failed, correct it, please', FirstName: "User name failed"});
                        break;
                    default:
                        // serverValidation({error: 'User registration failed, please, refresh the page and try again'});
                }
            });
    }
}