/**
 * Created by tianna on 11.06.17.
 */

class Loading
{
    /**@private*/ static loaderSelector = "#loading-mask";


    /**@public*/ static show()
    {
        $j(this.loaderSelector).fadeIn(200);
    }


    /**@public*/ static hide()
    {
        $j(this.loaderSelector).fadeOut(200);
    }
}