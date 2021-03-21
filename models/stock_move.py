from odoo import api, fields, models, tools, _

import logging
_logger = logging.getLogger(__name__)

class StockMove(models.Model):
    _inherit = "stock.move"

    @api.multi
    def write(self, vals):
        result = super(StockMove, self).write(vals)
        for record in self:
            if record.product_id.name:
                qty = 0
                stocks = self.env['stock.quant'].search([
                    ('product_id.name', '=', record.product_id.name),
                    ('location_id.location_id.name', '=', 'TKTAS')
                ])

                for stock in stocks:
                    qty += stock.qty
                
                self.send_field_updates(record.product_id.id, qty)

    @api.model
    def send_field_updates(self, product_id, qty, action=''):
        channel_name = "pos_product_available"
        data = {
            'message': "update_qty_product_available",
            'action': action,
            'product_id': product_id,
            'qty': qty
        }
        self.env['pos.config'].send_to_all_poses(channel_name, data)