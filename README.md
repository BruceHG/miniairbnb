#Setup
run `setup.sh`
This script is built for Ubuntu 16.04 LTS. Make sure you have the root permission.
#Database
We use PostgresSQL instead of the default SQLite. So please read the `setting.py`.
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'miniairbnb',
        'USER': 'admin',
        'PASSWORD': '123321',
        'HOST': 'localhost',
        'PORT': ''
    }
}
```
Please **NOTICE** that, the name of database is **non** *case-sensitive*. However, in code(like `Ptython`), it is.

#Workflow
###Guest
- search
    - keyword, location, date, price

- search_result
    - grid, list, map
    - brief title, description, thumb, rating, price, location, etc

- item_detail
    - more text about things metioned in `search result`, *comment* is an optinal

- booking
    - check login status
    - show date, price, people count etc selection dialog
    - ...

- place_order
    - comfirm to place the order
    - placed order should be accepted by `Host`
    - placed order can be checked and edit

```mermaid
graph LR;
    search-->search_result;
    search_result-->|on click on item|item_detail;
    item_detail-->booking;
    booking-->place_order;
```

###Host
- publish ads
    - allow user to public and edit all the things mentioned in `item_detail`
- process orders
    - view all orders
    - accpet or decline
