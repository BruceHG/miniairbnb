#!/usr/bin/env python
import os
import sys
from socket import gethostname, gethostbyname

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'miniAirbnb.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?") from exc
    if sys.argv[1] == 'runserver':
        print('miniAirbnb is running on:\nhttp://{}:{}'.format(
            gethostbyname(gethostname()), sys.argv[2].split(':')[1]))
    execute_from_command_line(sys.argv)
