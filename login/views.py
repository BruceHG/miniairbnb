import json
from django.http import HttpResponse
from user.models import User
from django.db.models import Q


def __dict2reponse(result):
    return HttpResponse(json.dumps(result), status=result['code'])


def login(request):
    try:
        data = JSONParser().parse(request)
        password = data['password']
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            result = {
                'msg': 'User not found',
                'success': False,
                'code': 400
            }
            return __dict2reponse(result)

        if user.password == password:
            result = {
                'msg': 'Success login',
                'data': {'user': username},
                'success': True,
                'code': 200
            }
        else:
            result = {
                'msg': 'Wrong password',
                'success': False,
                'code': 400
            }
    except Exception as e:
        result = {
            'msg': str(e),
            'success': False,
            'code': 400
        }

    return __dict2reponse(result)


def register(request):
    result = {}
    try:
        data = json.loads(request.body)

        filterResult = User.objects.filter(
            Q(username=data['username']) | Q(email=data['email']))
        if len(filterResult) > 0:
            result = {
                'msg': 'User exists',
                'success': False,
                'code': 400
            }
        else:
            User.objects.create(username=data['username'],
                                password=data['password'],
                                firstname=data['firstname'],
                                lastname=data['lastname'],
                                birthday=data['birthday'],
                                email=data['email'])
            result = {
                'msg': 'Success register',
                'data': {'user': data['username']},
                'success': True,
                'code': 200
            }
    except Exception as e:
        result = {
            'msg': str(e),
            'success': False,
            'code': 400
        }
    return __dict2reponse(result)
