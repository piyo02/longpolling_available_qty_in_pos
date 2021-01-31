odoo.define("longpolling_available_qty_in_pos.pos", function(require) {
    "use strict";

    var models = require('point_of_sale.models');

    var PosModelSuper = models.PosModel;
    models.PosModel = models.PosModel.extend({
        initialize: function(){
            PosModelSuper.prototype.initialize.apply(this, arguments);
            var self = this;
            this.ready.then(function () {
                self.bus.add_channel_callback("pos_product_available", self.qty_product_available, self);
            }); 
        },
        qty_product_available: function(data){
            var self = this;
            if (data.message === 'update_qty_product_available') {
                if (data.action && data.action === 'unlink') {
                    console.log('unlink');
                } else {
                    var opened_products_list_screen = self.gui.get_current_screen() === 'products' && self.gui.screen_instances.products;
                    if (opened_products_list_screen){
                        var product = {
                            'id': data.product_id,
                            'qty_available': data.qty
                        }

                        self.refresh_qty_available(product);
                    }
                }

            }
        },
    });
});
