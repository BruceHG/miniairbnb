import json
import os
import math
from datetime import datetime
from datetime import timedelta
from random import randint
import re
from django.db.models import Q
import operator
from operator import itemgetter
from functools import reduce

from user.models import User, Host
from item.models import Item
from item.serializers import itemDetailSerializers, searchResultSerializers

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from item.crawler import crawl_airbnb

__CURRENT_DIR = os.path.dirname(__file__)


def add_new_user(user_id):
    users = User.objects.filter(u_id=user_id)
    for u in users:
        u.delete()
    user = User(u_id=user_id,
                username='user' + str(user_id),
                password='123',
                email=str(user_id) + '@test.com',
                status=User.HOST)
    user.save()


def add_new_host(user_id):
    target = User.objects.get(u_id=user_id)
    hosts = Host.objects.filter(user=target)
    for h in hosts:
        h.delete()
    host = Host(user=target,
                phone=str(user_id) + '123456')
    host.save()


def add_item(target):
    user = User.objects.get(u_id=target.user_id)
    host = Host.objects.get(user=user)
    items = Item.objects.filter(i_id=target.id)
    for i in items:
        i.delete()
    if re.search('house', target.type):
        i_type = Item.House
    elif re.search('apartment', target.type):
        i_type = Item.Apartment
    else:
        i_type = Item.Flat
    item = Item(i_id=target.id,
                owner=host,
                i_type=i_type,
                title=target.title,
                album_first='static/album/{}/{}/0.jpg'.format(
                    target.user_id, target.id),
                album=albums(target.user_id, target.id),
                desc='desc test test',
                adv_desc='adv_desc test test',
                address=target.address,
                longitude=target.longitude,
                latitude=target.latitude,
                avaliable=avai_date(),
                price_per_day=target.price,
                guest_num=target.guest_num,
                bedroom_num=target.bedroom_num,
                bed_num=target.bed_num,
                bathroom_num=target.bathroom_num)
    item.save()


def albums(user_id, item_id):
    path = 'static/album/{}/{}'.format(user_id, item_id)
    result = []
    pictures = os.listdir('{}/{}'.format(__CURRENT_DIR, path))
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
        User.objects.get(username=admin, status=User.ADMIN)
        with open('{}/crawler/data.json'.format(__CURRENT_DIR), 'r') as file:
            item_data = json.load(file)
            os.system('mkdir {}/static > /dev/null 2>&1'.format(__CURRENT_DIR))
            os.system(
                'mv {}/crawler/album {}/static/'.format(__CURRENT_DIR, __CURRENT_DIR))
            for i in item_data:
                item = crawl_airbnb.Item(i)
                add_new_user(item.user_id)
                add_new_host(item.user_id)
                add_item(item)
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'import crawled data successfully',
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
        item = itemDetailSerializers(Item.objects.get(i_id=item_id))
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


@api_view(['Get'])
def search(request):
    try:
        data = request.query_params
        page_size = 16
        page = 0
#        args = ['keyword', 'page_size', 'page', 'check_in', 'check_out', 'guest_num', 'sortby', 'min_price',
#                'max_price', 'min_distance', 'max_distance', 'min_rating', 'max_rating', 'types', 'features']

        if 'page_size' in data:
            page_size = data['page_size']
        if 'page' in data:
            page = data['page']
        q_list = []
        if 'guest_num' in data:
            q_list.append(Q(guest_num=data['guest_num']))
        if 'min_price' in data:
            q_list.append(Q(price_per_day__gte=data['min_price']))
        if 'max_price' in data:
            q_list.append(Q(price_per_day__lte=data['max_price']))
        if 'min_rating' in data:
            hosts = Host.objects.filter(rating__gte=int(data['min_rating']))
            q_list.append(Q(owner__in=hosts))
        if 'max_rating' in data:
            hosts = Host.objects.filter(rating__lte=int(data['max_rating']))
            q_list.append(Q(owner__in=hosts))
        if 'types' in data:
            item_types = data['types'].split(',')
            q_list.append(Q(i_type__in=item_types))
        if 'features' in data:
            item_features = sorted(data['features'].split(','))
            pattern = ''
            for f in item_features:
                pattern += f + '[,\d]*'
            q_list.append(Q(features__regex=pattern))
        if q_list:
            all_objects = Item.objects.filter(reduce(operator.and_, q_list))
        else:
            all_objects = Item.objects.all()
        if 'check_in' in data:
            filtered_objects = []
            for o in all_objects:
                avaliable_check_in = o.avaliable.split(',')
                date_query = datetime.strptime(data['check_in'], '%Y-%m-%d')
                for i in range(len(avaliable_check_in) - 2):
                    date_in = datetime.strptime(
                        avaliable_check_in[i], '%Y-%m-%d')
                    date_out = datetime.strptime(
                        avaliable_check_in[i + 1], '%Y-%m-%d')
                    if date_in <= date_query <= date_out:
                        filtered_objects.append(o)
                        break
            all_objects = filtered_objects
        if 'check_out' in data:
            filtered_objects = []
            for o in all_objects:
                avaliable_check_in = o.avaliable.split(',')
                date_query = datetime.strptime(data['check_out'], '%Y-%m-%d')
                for i in range(len(avaliable_check_in) - 2):
                    date_in = datetime.strptime(
                        avaliable_check_in[i], '%Y-%m-%d')
                    date_out = datetime.strptime(
                        avaliable_check_in[i + 1], '%Y-%m-%d')
                    if date_in <= date_query <= date_out:
                        filtered_objects.append(o)
                        break
            all_objects = filtered_objects
        all_results = searchResultSerializers(all_objects, many=True).data
        if 'sortby' in data:
            order = data['sortby']
            if order == 'rating':
                all_results = sorted(
                    all_results, key=itemgetter(order), reverse=True)
            else:
                all_results = sorted(all_results, key=itemgetter(order))

        total_page = math.ceil(len(all_results) / page_size)
        search_result = all_results[page_size * page:page_size * (page + 1)]
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'search results',
            'data': {
                'total_page': total_page,
                'accommodations': search_result
            }
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])
