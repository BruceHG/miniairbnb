import json
import os
from datetime import datetime
from datetime import timedelta
from random import randint
import re

from user.models import User, Host
from item.models import Item

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

class new_Item:
    def __init__(self, item_json=None):
        if item_json is not None:
            listing = item_json
            self.id = listing['id']
            self.user_id = listing['user_id']
            self.type = listing['type']
            self.title = listing['title']
            self.album = listing['album']
            self.address = listing['address']
            self.latitude = listing['latitude']
            self.longitude = listing['longitude']
            self.price = item_json['price']
            self.guest_num = listing['guest_num']
            self.bedroom_num = listing['bedroom_num']
            self.bed_num = listing['bed_num']
            self.bathroom_num = listing['bathroom_num']
        else:
            pass

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
    path = 'item/album/{}/{}'.format(user_id, item_id)
    result = ''
    pictures = os.listdir(path)
    for p in pictures:
        result += path + '/' + p + ','
    return result

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
        filename = request.data['filename']
        User.objects.get(username = admin, status = User.ADMIN)
        with open(filename, 'r') as file:
            item_data = json.load(file)
            for i in item_data:
                item = new_Item(i)
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
       

