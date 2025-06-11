import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Injectable()
export class AppService {
    constructor(private readonly orderService: OrderService) {}
    getHello(): string {
        return 'Hello from Kitchen Service!';
    }
    @EventPattern('order_created')
    handleOrder(data: any) {
      console.log('Processing order in KitchenService:', data);
      const order = new Order();
      order.id = data.id;
      order.status = 'processed';
      this.orderService.update(order.id, order)
        .then(updatedOrder => {
          console.log('Order processed:', updatedOrder);
        });
    }
}
