from django.test import TestCase

from django.test.utils import setup_test_environment, teardown_test_environment
from django.test import Client
setup_test_environment()
teardown_test_environment()
c = Client()
c.post('/').content
c.post('/login/', {'username': 'test', 'password': '1234'}).content
c.post('/login/', {'username': 'testqq', 'password': '123'}).content
c.post('/login/', {'username': 'test', 'password': '123'}).content
c.post('/login/logout/').content



