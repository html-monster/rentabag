/**
 * @author Vlasakh
 * @date 08.06.17.
 */


class AdminOrderPage
{
    constructor()
    {
        $("[data-js-send-pledge-email]").click(::this.onSendEmail);
    }

    onSendEmail()
    {
        const ajaxPromise = (new AjaxSend()).send({
            formData: values,
            message: `Error while registering user, please, try again`,
            // url: ABpp.baseUrl + $form.attr('action'),
            url: $form.attr('action'), // DEBUG: remove it
            respCodeName: 'ErrorCode',
            respCodes: [
                {code: 100, message: ""},
                // {code: -101, message: "Some custom error"},
            ],
            // beforeChkResponse: (data) =>
            // {
            //     // DEBUG: emulate
            //     data = {Error: 101};
            //     // data.Param1 = "TOR-PHI-3152017"; // id
            //
            //     return data;
            // },
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
                        serverValidation({error: 'User name failed, correct it, please', FirstName: "User name failed"});
                        break;
                    default:
                        serverValidation({error: 'User registration failed, please, refresh the page and try again'});
                }
            });
    }
}