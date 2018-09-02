sudo apt-get update
# check pip3
if !(which pip3) > /dev/null 2>&1
then
    sudo apt install python3-pip -y
fi
# check Django
if !(python3 -c 'import django') > /dev/null 2>&1
then
    pip3 install django
fi
# check psycopg2
if !(python3 -c 'import psycopg2') > /dev/null 2>&1
then
    pip3 install psycopg2-binary
fi
# check djangorestframework
if !(python3 -c 'import rest_framework') > /dev/null 2>&1
then
    pip3 install djangorestframework
fi
# check django-cors-headers
if !(python3 -c 'import corsheaders') > /dev/null 2>&1
then
    pip3 install django-cors-headers
fi
# check postgres
# if !(which psql) > /dev/null 2>&1
# then
#     sudo apt install postgresql -y
# fi
# sudo -u postgres psql -c "CREATE USER admin WITH PASSWORD '123321'" > /dev/null 2>&1
# sudo -u postgres psql -c "CREATE DATABASE miniairbnb WITH OWNER admin" > /dev/null 2>&1
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000