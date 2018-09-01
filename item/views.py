import json
import os
from datetime import datetime
from datetime import timedelta
from random import randint
import re
from django.db.models import Q
import operator
from functools import reduce

from user.models import User, Host
from item.models import Item
from item.serializers import itemDetailSerializers, searchResultSerializers

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from item.crawler import crawl_airbnb

def add_new_user(user_id):
    users = User.objects.filter(u_id = user_id)
    for u in users:
        u.delete()
    user = User(u_id = user_id,
                username = 'user' + str(user_id),
                password = '123',
                email = str(user_id) + '@test.com',
                status = User.HOST)
    user.save()

def add_new_host(user_id):
    target = User.objects.get(u_id = user_id)
    hosts = Host.objects.filter(user = target)
    for h in hosts:
        h.delete()
    host = Host(user = target,
                phone = str(user_id) + '123456')
    host.save()
        
def add_item(target):
    user = User.objects.get(u_id = target.user_id)
    host = Host.objects.get(user = user)
    items = Item.objects.filter(i_id = target.id)
    for i in items:
        i.delete()
    if re.search('house', target.type):
        i_type = Item.House
    elif re.search('apartment', target.type):
        i_type = Item.Apartment
    else:
        i_type = Item.Flat
    item = Item(i_id = target.id,
                owner = host,
                i_type = i_type,
                title = target.title,
                album_first = 'item/crawler/album/{}/{}'.format(target.user_id, target.id) + '/0.jpg',
                album = albums(target.user_id, target.id),
                desc = 'desc test test',
                adv_desc = 'adv_desc test test',
                address = target.address,
                longitude = target.longitude,
                latitude = target.latitude,
                avaliable = avai_date(),
                price_per_day = target.price,
                guest_num = target.guest_num,
                bedroom_num = target.bedroom_num,
                bed_num = target.bed_num,
                bathroom_num = target.bathroom_num)
    item.save()
    
def albums(user_id, item_id):
    path = 'item/crawler/album/{}/{}'.format(user_id, item_id)
    result = ''
    pictures = os.listdir(path)
    for p in pictures:
        result.append(path + '/' + p)
    return ','.join(result)

def avai_date():
    ran1 = randint(0, 60)
    ran2 = randint(0, 60 - ran1)
    start = datetime.now() + timedelta(days=ran1)
    end = start + timedelta(days=ran2)
    start = start.strftime('%Y-%m-%d')
    end = end.strftime('%Y-%m-%d')
    return start + ',' + end + ','

@api_view(['PUT'])
def import_real_data(request):
    try:
        admin = request.META.get("HTTP_USERNAME")
        filename = 'item/crawler/data.json'
        User.objects.get(username = admin, status = User.ADMIN)
        with open(filename, 'r') as file:
            item_data = json.load(file)
            for i in item_data:
                item = crawl_airbnb.Item(i)
                add_new_user(item.user_id)
                add_new_host(item.user_id)
                add_item(item)
        result = {
            'code': status.HTTP_200_OK,
            'msg': filename,
        }
    
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['GET'])
def itemDetail(request, item_id):
    try:
        item = itemDetailSerializers(Item.objects.get(i_id = item_id))
        return_item = {}
        for f in item.data:
            if f != 'album' and f != 'features':
                return_item[f] = item.data[f]
        if item.data['album']:
            return_item['album'] = item.data['album'].split(',')
        else:
            return_item['album'] = []
        if item.data['features']:
            return_item['features'] = item.data['features'].split(',')
        else:
            return_item['features'] = []
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'accommodation detail',
            'data': return_item,
        }
    except Item.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'item not found',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['GET'])
def features(request):
    try:
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'features',
            'data': Item.feature_type
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])

@api_view(['POST'])
def search(request):
    try:
        data = request.data
#        args = ['keyword', 'page_size', 'page', 'check_in', 'check_out', 'guest_num', 'sortby', 'min_price',
#                'max_price', 'min_distance', 'max_distance', 'min_rating', 'max_rating', 'types', 'features']
        q_list = []
        if 'guest_num' in data:
            q_list.append(Q(guest_num = data['guest_num']))
        if 'min_price' in data:
            q_list.append(Q(price_per_day__gte = data['min_price']))
        if 'max_price' in data:
            q_list.append(Q(price_per_day__lte = data['max_price']))
#        if 'min_rating ' in data:
#            q_list.append(Q(rating__gte = data['min_rating']))
#        if 'max_rating ' in data:
#            q_list.append(Q(rating__lte = data['max_rating']))
        if 'types' in data:
            item_types = data['types'].split(',')
            q_list.append(Q(i_type__in = item_types))
        if 'features' in data:
            item_features = sorted(data['features'].split(','))
            pattern = ''
            for f in item_features:
                pattern += f + '[,\d]*'
            q_list.append(Q(features__regex = pattern))
        search_result = searchResultSerializers(Item.objects.filter(reduce(operator.and_, q_list)), many = True)
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'test',
            'data': search_result.data
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
       

