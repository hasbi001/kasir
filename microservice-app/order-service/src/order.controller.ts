import { Controller, Post, Get, Put, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { ItemService } from './item.service';
import { ListOrderItemService } from './listorderitem.service';
import { ListOrderItem } from './listorderitem.entity';
import { Item } from './item.entity';

@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly itemService: ItemService,
        private readonly listOrderItemService: ListOrderItemService
    ) {}

    @Post()
    async create(@Body() body: { customerName: string; email: string , items?: { itemId: number; quantity: number }[] }) {
        // Validate the body here if necessary  
        if (!body.customerName || !body.email) {
            throw new Error('Invalid order data');
        }

        if (body.items && !Array.isArray(body.items)) {
            throw new Error('Items must be an array');  
        }
        if (body.items) {
            for (const item of body.items) {
                if (!item.itemId || item.quantity < 0) {
                    throw new Error('Invalid item data');
                }
            }
        }

        const order = new Order();
        order.customerName = body.customerName;
        order.email = body.email;
        order.status = 'pending';
        let totalPrice = 0;
        // If items are provided, calculate total price     
        if (body.items) {
            for (const item of body.items) {
                if (item.quantity > 0) {
                    throw new Error('Item quantity cannot be negative');
                }
                else {
                    const foundItem = await this.itemService.findOne(item.itemId);
                    totalPrice += item.quantity * (foundItem?.price || 0);
                }
            }
        }
        order.totalprice = totalPrice || 0;
        // Save the order
        const createdOrder = await this.orderService.create(order);
        if (!createdOrder) {
            throw new Error('Order creation failed');
        }

        // If items are provided, create ListOrderItem entries
        if (body.items) {
            for (const item of body.items) {
                const foundItem = await this.itemService.findOne(item.itemId);
                if (!foundItem) {
                    throw new Error(`Item with ID ${item.itemId} not found`);
                }
                const listOrderItem = new ListOrderItem();
                listOrderItem.orderId = createdOrder.id;
                listOrderItem.itemId = item.itemId;
                listOrderItem.quantity = item.quantity;
                listOrderItem.totalprice = item.quantity * (foundItem.price || 0); // Assuming Item entity has a price field
                await this.listOrderItemService.create(listOrderItem);
            }
        }

        const response = {
            order: createdOrder,
            items: body.items
                ? await Promise.all(
                    body.items.map(async item => {
                        const foundItem = await this.itemService.findOne(item.itemId);
                        return {
                            itemId: item.itemId,
                            quantity: item.quantity,
                            totalprice: item.quantity * (foundItem?.price || 0) // Assuming Item entity has a price field
                        };
                    })
                )
                : []
        };
        return response;
    }

    @Get()
    async findAll(): Promise<Order[]> {
        return this.orderService.findAll();
    }

    @Get(':orderId/order-items')
    async findOrderItems(@Body('orderId') orderId: number) {
        // Validate the orderId
        if (!orderId) {
            throw new Error('Order ID is required');
        }
        const order = await this.orderService.findOne(orderId);
        if (!order) {   
            throw new Error(`Order with ID ${orderId} not found`);
        }

        const items = await this.listOrderItemService.findAll(orderId);
        if (!items || items.length === 0) {
            throw new Error(`No items found for order ID ${orderId}`);
        }
        // Map the items to include item details
        for (const item of items) {
            const foundItem = await this.itemService.findOne(item.itemId);
            if (foundItem) {
                item['itemDetails'] = {
                    id: foundItem.id,
                    name: foundItem.name,
                    price: foundItem.price
                };
            } else {
                item['itemDetails'] = null; // or handle as needed
            }
        }

        const response = {
            order: order,
            items: items.map(item => ({
                itemId: item.itemId,
                quantity: item.quantity,
                totalprice: item.totalprice,
                itemDetails: item['itemDetails'] // Include item details
            }))
        };
        return response;
    }

    @Get()
    async menu(): Promise<Item[]> {
        return this.itemService.findAll();
    }

    @Put(':id')
    async update(@Body() body: { id: number; status?: string; }) {
        // Validate the body
        if (!body.id) {
            throw new Error('Order ID is required');
        }
        if (body.status && !['pending', 'completed', 'cancelled'].includes(body.status)) {
            throw new Error('Invalid status');
        }

        const order = await this.orderService.findOne(body.id);
        if (!order) {
            throw new Error(`Order with ID ${body.id} not found`);
        }

        // Update the order status if provided
        if (body.status) {
            order.status = body.status;
        }

        const updatedOrder = await this.orderService.update(body.id,order);
        return updatedOrder;
    }
}
