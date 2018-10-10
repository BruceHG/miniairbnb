from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
import datetime as dt

from order.models import Order
from item.models import Item
from user.models import User, Host
from order.serializers import requestsSerializers, ordersSerializers

@api_view(['POST'])
def booking(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        data = request.data
        user = User.objects.get(username = username)
        item = Item.objects.get(i_id = data['item_id'])
        checkin = datetime.strptime(data['check_in'], '%Y-%m-%d')
        checkout = datetime.strptime(data['check_out'], '%Y-%m-%d')
        previous_orders = Order.objects.filter(item = item, user = user)
        for o in previous_orders:
            previous_in = datetime.strptime(str(o.checkin), '%Y-%m-%d')
            previous_out = datetime.strptime(str(o.checkout), '%Y-%m-%d')
            if not (previous_in > checkout or previous_out < checkin):
                if not o.status == Order.Rejected:
                    raise Exception('conflict with previous order(s)')
        available = item.avaliable.split(',')
        valid_date = 0
        for i in range(0, len(available), 2):
            valid_in = datetime.strptime(available[i], '%Y-%m-%d')
            valid_out = datetime.strptime(available[i+1], '%Y-%m-%d')
            if valid_in <= checkin <= checkout <= valid_out:
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
                        user = user,
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
def requests(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        host = Host.objects.get(user=user)
        items = Item.objects.filter(owner=host)
        orders = requestsSerializers(Order.objects.filter(item__in=items, status=Order.Pending), many=True).data
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'requests',
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

@api_view(['GET'])
def orders(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        orders = ordersSerializers(Order.objects.filter(user=user), many=True).data
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'orders',
            'data': orders,
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

@api_view(['DELETE'])
def cancel(request, order_id):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        order = Order.objects.get(o_id=order_id)
        if not order.user == user:
            raise Exception('order and user do not match')
        if order.status == Order.Completed or order.status == Order.Rejected:
            raise Exception('cancel failed, completed or rejected order')
        order.delete()
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'cancellation successful',
        }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Order.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'order not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['POST'])
def reject(request, order_id):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        host = Host.objects.get(user=user)
        order = Order.objects.get(o_id=order_id)
        if not order.item.owner == host:
            raise Exception('order and host do not match')
        if order.status == Order.Completed or order.status == Order.Rejected or order.status == Order.Accepted or order.status == Order.Completed_and_rated:
            raise Exception('reject failed, accepted, completed or rejected order')
        order.status = Order.Rejected
        order.save()
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'reject successful',
        }
        
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Host.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'host not found',
        }
    except Order.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'order not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['POST'])
def rating(request, order_id):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        order = Order.objects.get(o_id=order_id)
        if not order.user == user:
            raise Exception('order and user do not match')
        if order.status != Order.Completed:
            raise Exception('uncompleted order')
        if order.rating is not None:
            raise Exception('rated order')
        data = request.data
        if int(data['rating']) < 0 or int(data['rating']) > 5:
            raise Exception('rating must between 0 - 5')
        order.rating = int(data['rating'])
        order.status = Order.Completed_and_rated
        order.save()
        
        orders = Order.objects.filter(item=order.item, rating__isnull=False)
        s = 0
        count = 0
        for o in orders:
            s += o.rating
            count += 1
        order.item.rating = round(s / count, 1)
        order.item.save()
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'rating successful',
        }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Order.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'order not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['POST'])
def approve(request, order_id):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        host = Host.objects.get(user=user)
        order = Order.objects.get(o_id=order_id)
        if not order.item.owner == host:
            raise Exception('order and host do not match')
        if order.status == Order.Completed or order.status == Order.Rejected or order.status == Order.Accepted or order.status == Order.Completed_and_rated:
            raise Exception('approve failed, accepted, completed or rejected order')
        item = order.item
        order_in = datetime.strptime(str(order.checkin), '%Y-%m-%d')
        order_out = datetime.strptime(str(order.checkout), '%Y-%m-%d')
        avaliable = item.avaliable.split(',')
        new_avaliable = []
        one_day = dt.timedelta(days = 1)
        for i in range(0, len(avaliable), 2):
            valid_in = datetime.strptime(avaliable[i], '%Y-%m-%d')
            valid_out = datetime.strptime(avaliable[i+1], '%Y-%m-%d')
            if valid_in <= order_in <= order_out <= valid_out:
                order_in = order_in - one_day
                order_out = order_out + one_day
                if not order_in < valid_in:
                    new_avaliable.append(avaliable[i])
                    new_avaliable.append(order_in.strftime('%Y-%m-%d'))
                if not order_out > valid_out:
                    new_avaliable.append(order_out.strftime('%Y-%m-%d'))
                    new_avaliable.append(avaliable[i+1])
            else:
                new_avaliable.append(avaliable[i])
                new_avaliable.append(avaliable[i+1])
        
        other_orders = Order.objects.filter(item=item)
        for o in other_orders:
            if o.status == Order.Pending:
                order_in = datetime.strptime(str(o.checkin), '%Y-%m-%d')
                order_out = datetime.strptime(str(o.checkout), '%Y-%m-%d')
                valid = 0
                for i in range(0, len(new_avaliable), 2):
                    valid_in = datetime.strptime(new_avaliable[i], '%Y-%m-%d')
                    valid_out = datetime.strptime(new_avaliable[i+1], '%Y-%m-%d')
                    if valid_in <= order_in <= order_out <= valid_out:
                        valid = 1
                if valid == 0:
                    o.status = Order.Rejected
                    o.save()
        order.status = Order.Accepted
        order.save()
        item.avaliable = ','.join(new_avaliable)
        item.save()
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'approve successful',
        }
        
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Host.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'host not found',
        }
    except Order.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'order not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
