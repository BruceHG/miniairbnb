from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from order.models import Order
from item.models import Item
from user.models import User, Host
from order.serializers import ordersSerializers

@api_view(['POST'])
def booking(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        data = request.data
        item = Item.objects.get(i_id = data['item_id'])
        checkin = datetime.strptime(data['check_in'], '%Y-%m-%d')
        checkout = datetime.strptime(data['check_out'], '%Y-%m-%d')
        available = item.avaliable.split(',')
        valid_date = 0
        for i in range(0, len(available), 2):
            valid_in = datetime.strptime(available[i], '%Y-%m-%d')
            valid_out = datetime.strptime(available[i+1], '%Y-%m-%d')
            if valid_in <= checkin < checkout <= valid_out:
                valid_date = 1
        if valid_date == 0:
            raise Exception('check_in/check_out date error')
        valid_guest_num = item.guest_num
        if int(data['guest_num']) > valid_guest_num or int(data['guest_num']) <= 0:
            raise Exception('number of guests error')
        if 'comment' in data:
            comment = data['comment']
        else:
            comment = ''
        new_order = Order(
                        item = item,
                        user = User.objects.get(username = username),
                        checkin = data['check_in'],
                        checkout = data['check_out'],
                        guest_num = int(data['guest_num']),
                        price_per_day = item.price_per_day,
                        comment = comment,
                        item_ctime = item.c_time,
                        )
        new_order.save()
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'booking successfully',
            'data': {
                    'order_id': new_order.o_id,
                    },
        }
    except Item.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'item not found',
        }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['GET'])
def viewOrders(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        host = Host.objects.get(user=user)
        items = Item.objects.filter(owner=host)
        orders = ordersSerializers(Order.objects.filter(item__in=items), many=True).data
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'orders',
            'data': orders,
        }
    except Item.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'item not found',
        }
    except Host.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'host not found',
        }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
    
