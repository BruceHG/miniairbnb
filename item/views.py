import json
import os
import shutil
import math
from math import radians, cos, sin, asin, sqrt
from datetime import datetime
from datetime import timedelta
from random import randint
import re
import requests

from django.db.models import Q
import operator
from operator import itemgetter
from functools import reduce

from user.models import User, Host
from item.models import Item
from item.serializers import itemDetailSerializers, searchResultSerializers, availableSerializers, itemUpdateSerializers

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from item.crawler import crawl_airbnb

__CURRENT_DIR = os.path.dirname(__file__)


def super_host_id():
    super_host_name = 'host'
    users = User.objects.filter(username='host')
    return users[0].u_id


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
    item = Item(
        i_id=target.id,
        owner=host,
        i_type=i_type,
        title=target.title,
        album_first='static/album/{}/{}/0.jpg'.format(target.user_id,
                                                      target.id),
        album=albums(target.user_id, target.id),
        desc='desc test test',
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
    return start + ',' + end


@api_view(['PUT'])
def import_real_data(request):
    try:
        admin = request.META.get("HTTP_USERNAME")
        User.objects.get(username=admin, status=User.ADMIN)
        with open('{}/crawler/data.json'.format(__CURRENT_DIR), 'r') as file:
            s_hid = super_host_id()
            os.makedirs('{}/static/album/{}'.format(__CURRENT_DIR, s_hid))
            item_data = json.load(file)
            for i in item_data:
                item = crawl_airbnb.Item(i)
                previous_user_id = item.user_id
                os.system(
                    'mv {}/crawler/album/{}/{} a {}/static/album/{}'.format(
                        __CURRENT_DIR, previous_user_id, item.id,
                        __CURRENT_DIR, s_hid, item.id))
                item.user_id = s_hid
                add_item(item)
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'import crawled data successfully',
        }
        os.system('rm -rf {}/crawler/data.json {}/crawler/album'.format(
            __CURRENT_DIR, __CURRENT_DIR))

    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }
    return Response(result, status=result['code'])


@api_view(['GET'])
def itemDetail(request, item_id):
    try:
        item = itemDetailSerializers(Item.objects.get(i_id=item_id)).data
        for k in item:
            if item[k] == None and k != 'album' and k != 'features':
                item[k] = ''
        if not item['album'] == None:
            item['album'] = item['album'].split(',')
        else:
            item['album'] = []
        if not item['features'] == None:
            item['features'] = item['features'].split(',')
        else:
            item['features'] = []

        result = {
            'code': status.HTTP_200_OK,
            'msg': 'accommodation detail',
            'data': item,
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


def geocoding(address):
    api_key = "AIzaSyDoH8ScxK3bBYFT2Ccgz5xtXeAF3Vbp_WI"
    api_response = requests.get(
        'https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}'
        .format(address, api_key))
    return api_response.json()


def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r * 1000


@api_view(['Get'])
def search(request):
    try:
        data = request.query_params
        page_size = 16
        page = 0
        #        valid_address = 0
        #        args = ['keyword', 'page_size', 'page', 'check_in', 'check_out', 'guest_num', 'sortby', 'min_price',
        #                'max_price', 'min_distance', 'max_distance', 'min_rating', 'max_rating', 'types', 'features']
        if 'page_size' in data:
            if not data['page_size'] == '':
                page_size = data['page_size']
        if 'page' in data:
            if not data['page'] == '':
                page = int(data['page'])
        q_list = [Q(status=Item.Active)]
        #        if 'keyword' in data:
        #            if not data['keyword'] == '':
        #                geo_response = geocoding(data['keyword'])
        #                if geo_response['status'] == 'OK':
        #                    latitude = geo_response['results'][0]['geometry']['location']['lat']
        #                    longitude = geo_response['results'][0]['geometry']['location']['lng']
        #                    valid_address = 1
        if 'guest_num' in data:
            if not data['guest_num'] == '':
                if int(data['guest_num']) <= 4:
                    q_list.append(Q(guest_num=data['guest_num']))
                else:
                    q_list.append(Q(guest_num__gte=data['guest_num']))
        if 'min_price' in data:
            if not data['min_price'] == '':
                q_list.append(Q(price_per_day__gte=data['min_price']))
        if 'max_price' in data:
            if not data['max_price'] == '':
                q_list.append(Q(price_per_day__lte=data['max_price']))
        if 'min_rating' in data:
            if not data['min_rating'] == '':
                hosts = Host.objects.filter(
                    rating__gte=int(data['min_rating']))
            q_list.append(Q(owner__in=hosts))
        if 'max_rating' in data:
            if not data['max_rating'] == '':
                hosts = Host.objects.filter(
                    rating__lte=int(data['max_rating']))
                q_list.append(Q(owner__in=hosts))
        if 'types' in data:
            if not data['types'] == '':
                item_types = data['types'].split(',')
                q_list.append(Q(i_type__in=item_types))
        if 'features' in data:
            if not data['features'] == '':
                item_features = sorted(data['features'].split(','))
                pattern = ''
                for f in item_features:
                    pattern += f + '[,\d]*'
                q_list.append(Q(features__regex=pattern))
        all_objects = Item.objects.filter(reduce(operator.and_, q_list))
        if 'check_in' in data:
            if not data['check_in'] == '':
                filtered_objects = []
                for o in all_objects:
                    avaliable_check_in = o.avaliable.split(',')
                    date_query = datetime.strptime(data['check_in'],
                                                   '%Y-%m-%d')
                    for i in range(0, len(avaliable_check_in), 2):
                        date_in = datetime.strptime(avaliable_check_in[i],
                                                    '%Y-%m-%d')
                        date_out = datetime.strptime(avaliable_check_in[i + 1],
                                                     '%Y-%m-%d')
                        if date_in <= date_query < date_out:
                            filtered_objects.append(o)
                            break
                all_objects = filtered_objects
        if 'check_out' in data:
            if not data['check_out'] == '':
                filtered_objects = []
                for o in all_objects:
                    avaliable_check_in = o.avaliable.split(',')
                    date_query = datetime.strptime(data['check_out'],
                                                   '%Y-%m-%d')
                    for i in range(0, len(avaliable_check_in), 2):
                        date_in = datetime.strptime(avaliable_check_in[i],
                                                    '%Y-%m-%d')
                        date_out = datetime.strptime(avaliable_check_in[i + 1],
                                                     '%Y-%m-%d')
                        if date_in < date_query <= date_out:
                            filtered_objects.append(o)
                            break
                all_objects = filtered_objects
        if 'keyword' in data:
            if not data['keyword'] == '':

                title_match = []
                address_match = []
                desc_match = []
                for o in all_objects:
                    if o.title is not None and re.search(
                            data['keyword'].lower(), o.title.lower()):
                        title_match.append(o)
                    elif o.desc is not None and re.search(
                            data['keyword'].lower(), o.address.lower()):
                        address_match.append(o)
                    elif o.desc is not None and re.search(
                            data['keyword'].lower(), o.desc.lower()):
                        desc_match.append(o)


#                    else:
#                        keywords_not_match.append(o)
                all_objects = title_match + address_match + desc_match
        all_results = searchResultSerializers(all_objects, many=True).data
        #        if valid_address == 1:
        #            for r in all_results:
        #                if r['longitude'] is not None and r['latitude'] is not None:
        #                    distance = haversine(float(longitude), float(latitude), float(r['longitude']), float(r['latitude']))
        #                    r['distance'] = distance
        #                else:
        #                    r['distance'] = float('inf')
        #            if 'min_distance' in data:
        #                all_results = [r for r in all_results if r['distance'] >= float(data['min_distance'])]
        #            if 'max_distance' in data:
        #                all_results = [r for r in all_results if r['distance'] <= float(data['max_distance'])]
        #        if 'sortby' in data:
        #            if not data['sortby'] == '':
        #                order = data['sortby']
        #                if order == 'rating':
        #                    all_results = sorted(
        #                        all_results, key=itemgetter(order), reverse=True)
        #                elif order == 'price_per_day':
        #                    all_results = sorted(all_results, key=itemgetter(order))
        #                elif order == 'distance' and valid_address == 1:
        #                    all_results = sorted(all_results, key=itemgetter(order))
        #        if valid_address == 1:
        #            for r in all_results:
        #                r.pop('distance')

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


@api_view(['GET'])
def available_info(request, item_id):
    try:
        item = availableSerializers(Item.objects.get(i_id=item_id)).data
        available_format = []
        available_raw = item['available_date'].split(',')

        for i in range(0, len(available_raw), 2):
            available_format.append({
                'begin': available_raw[i],
                'end': available_raw[i + 1]
            })

        item['available_date'] = available_format
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'available detail',
            'data': item
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


def save_image(file, user_id, item_id):
    path = '{}/static/album/{}/{}/'.format(__CURRENT_DIR, user_id, item_id)
    if not os.path.exists(path):
        os.makedirs(path)
    file_name = file.split('\\')[-1]
    num_pictures = 0
    for f in os.listdir(path):
        n = int(f.split('.')[0])
        if n >= num_pictures:
            num_pictures = n + 1
    file_path = os.path.join(path,
                             str(num_pictures) + '.' + file_name.split('.')[1])
    tmp_path = os.path.join(__CURRENT_DIR, file)
    shutil.move(tmp_path, file_path)
    return 'static/album/{}/{}/{}.{}'.format(user_id, item_id,
                                             str(num_pictures),
                                             file_name.split('.')[1])


def delete_image(file, album, user_id, item_id):
    path = os.path.join(__CURRENT_DIR, file)
    if os.path.exists(path):
        os.remove(path)
        p = re.compile(file + ',*')
        album = re.sub(p, '', album)
    return album


def clear_tmp():
    path = '{}/static/album/tmp/'.format(__CURRENT_DIR)
    for f in os.listdir(path):
        os.remove(os.path.join(path, f))


@api_view(['POST'])
def update_item(request, item_id):
    try:
        username = request.META.get("HTTP_USERNAME")
        item = Item.objects.get(i_id=item_id)
        if username != item.owner.user.username:
            raise Exception('invalid user')
        data = request.data
        item_serializers = itemUpdateSerializers(item, data=data)
        if item_serializers.is_valid():
            item_serializers.save()
        else:
            raise Exception('invalid update')
        if 'album' in data:
            files = set(data['album'].split(','))
            if item.album == '':
                origin_files = set()
            else:
                origin_files = set(item.album.split(','))
            files_to_add = files - origin_files
            files_to_delete = origin_files - files
            for file in files_to_add:
                new_album = save_image(file, item.owner.user.u_id, item_id)
                if item.album == '':
                    item.album += new_album
                else:
                    item.album += ',' + new_album
            for file in files_to_delete:
                item.album = delete_image(file, item.album,
                                          item.owner.user.u_id, item_id)
            clear_tmp()
            item.album_first = item.album.split(',')[0]
            item.save()
        result = {'code': status.HTTP_200_OK, 'msg': 'update successful'}
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
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


@api_view(['POST'])
def upload_image(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        Host.objects.get(user=User.objects.get(username=username))
        files = request.FILES.getlist('image')
        path = '{}/static/album/tmp/'.format(__CURRENT_DIR)
        if not os.path.exists(path):
            os.makedirs(path)
        tmp_urls = []
        for file in files:
            file_path = os.path.join(path, file.name)
            f = open(file_path, mode='wb')
            for i in file.chunks():
                f.write(i)
            f.close()
            tmp_urls.append('static/album/tmp/' + file.name)
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'images saved',
            'data': {
                'url': tmp_urls
            }
        }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Host.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'invalid host',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }

    return Response(result, status=result['code'])


@api_view(['POST'])
def create_item(request):
    try:
        username = request.META.get("HTTP_USERNAME")
        user = User.objects.get(username=username)
        host = Host.objects.get(user=user)
        data = request.data
        valid_address = 0
        if 'address' in data:
            geo_response = geocoding(data['address'])
            if geo_response['status'] == 'OK':
                latitude = geo_response['results'][0]['geometry']['location'][
                    'lat']
                longitude = geo_response['results'][0]['geometry']['location'][
                    'lng']
                valid_address = 1
        item = Item(
            owner=host,
            title=data['title'],
            desc=data['desc'],
            i_type=data['i_type'],
            price_per_day=data['price_per_day'],
            guest_num=data['guest_num'],
            bedroom_num=data['bedroom_num'],
            bed_num=data['bed_num'],
            bathroom_num=data['bathroom_num'],
            address=data['address'],
            rules=data['rules'],
            features=data['features'],
            avaliable=data['avaliable'],
            album='')
        if valid_address:
            item.latitude = latitude
            item.longitude = longitude
        item.save()
        if 'album' in data:
            files = set(data['album'].split(','))
            if item.album == '':
                origin_files = set()
            else:
                origin_files = set(item.album.split(','))
            files_to_add = files - origin_files
            files_to_delete = origin_files - files
            for file in files_to_add:
                new_album = save_image(file, user.u_id, item.i_id)
                if item.album == '':
                    item.album += new_album
                else:
                    item.album += ',' + new_album
            for file in files_to_delete:
                item.album = delete_image(file, item.album, user.u_id,
                                          item.i_id)
            clear_tmp()
        item.album_first = item.album.split(',')[0]
        item.save()
        result = {
            'code': status.HTTP_200_OK,
            'msg': 'creation successful',
            'data': {
                'item_id': item.i_id
            }
        }
    except User.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'user not found',
        }
    except Host.DoesNotExist:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': 'invalid host',
        }
    except Exception as e:
        result = {
            'code': status.HTTP_400_BAD_REQUEST,
            'msg': str(e),
        }

    return Response(result, status=result['code'])


#@api_view(['GET'])
#def view_items(request):
#    try:
#        username = request.META.get("HTTP_USERNAME")
#        user = User.objects.get(username=username)
#        host = Host.objects.get(user=user)
#        items = Item.objects.filter(owner=host)
#        orders = ordersSerializers(Order.objects.filter(item__in=items), many=True).data
#        result = {
#            'code': status.HTTP_200_OK,
#            'msg': 'orders',
#            'data': orders,
#        }
#    except Item.DoesNotExist:
#        result = {
#            'code': status.HTTP_400_BAD_REQUEST,
#            'msg': 'item not found',
#        }
#    except Host.DoesNotExist:
#        result = {
#            'code': status.HTTP_400_BAD_REQUEST,
#            'msg': 'host not found',
#        }
#    except User.DoesNotExist:
#        result = {
#            'code': status.HTTP_400_BAD_REQUEST,
#            'msg': 'user not found',
#        }
#    except Exception as e:
#        result = {
#            'code': status.HTTP_400_BAD_REQUEST,
#            'msg': str(e),
#        }
#    return Response(result, status=result['code'])
