## Notes
- Тестовый контроллер админки, если понадобится /admin/helloback/some/key/2c575ee9935d7fb2e1346541796fc010/ (обязательно нужен ключ для запуска иначе редиректит на dashboard)
- Кастомные стили сайта представлены двумя файлами index-custom.css и rentabag-style.css в /src/scss
- Дополнительные библиотеки подключаются в /app/design/frontend/base/default/layout/addweb/advreservation.xml


## Changed views
- app/design/frontend/rentabag/default/template/checkout/cart/item/default.phtml
- app/design/frontend/rentabag/default/template/catalog/product/view.phtml

## Changed tables
- core_config_data
- core_email_template 
- eav_attribute
- eav_attribute_label
- eav_entity_attribute
- catalog_eav_attribute
- adv_rent
- admin_role
- admin_rule
- admin_user

##Links
- Wiki (http://wiki.ebizmarts.com/sage-pay-installation)
- Run url via cron (https://stackoverflow.com/questions/11375260/cron-command-to-run-url-address-every-5-minutes)

###Plugins
- AOE Scheduler (https://www.magentocommerce.com/magento-connect/aoe-scheduler.html)
- TB Developer Toolbar (https://www.magentocommerce.com/magento-connect/tb-developer-toolbar.html)

##Cron
- sh /home/rentabag/public_html/cron.sh
- wget http://trendystash.com/rent/pledge/notify

##Admin Ajax
Session budy:
http://www.bubblecode.net/en/2012/02/08/magento-create-your-own-admin-controller-in-a-new-tab/
https://magento.stackexchange.com/questions/88045/how-to-update-admin-routers-of-custom-module-for-patch-supee-6788
https://stackoverflow.com/questions/6389081/magento-admin-routing-isnt-working
https://magento.stackexchange.com/questions/76291/trying-to-run-an-ajax-script-from-the-admin-area-in-magento
http://alanstorm.com/magento_admin_hello_world_revisited/