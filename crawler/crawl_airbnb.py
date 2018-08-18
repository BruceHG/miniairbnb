#!/usr/bin/python3
import json


class Item:
    def __init__(self, item_json):
        listing = item_json['listing']
        self.id = listing['id']
        self.user_id = listing['user']['id']
        self.type = listing['room_and_property_type']
        self.title = listing['name']
        self.album = listing['picture_urls']
        self.address = listing['public_address']
        self.latitude = listing['lat']
        self.longitude = listing['lng']
        self.price = item_json['pricing_quote']['rate_with_service_fee']['amount']
        self.guest_num = listing['person_capacity']
        self.bedroom_num = listing['bedrooms']
        self.bed_num = listing['beds']
        self.bathroom_num = listing['bathrooms']


def crawl():
    import requests
    url_search = 'https://www.airbnb.com.au/api/v2/explore_tabs?version=1.3.9&satori_version=1.0.4&_format=for_explore_search_web&auto_ib=false&fetch_filters=true&has_zero_guest_treatment=false&is_guided_search=true&is_new_cards_experiment=true&luxury_pre_launch=false&query_understanding_enabled=true&show_groupings=true&supports_for_you_v3=true&timezone_offset=600&metadata_only=false&is_standard_search=true&refinement_paths%5B%5D=/homes&query=NSW&key=d306zoyjsyarp7ifhu67rjxn52tv0t20&currency=AUD&locale=en-AU&section_offset={}'
    # url_detail = 'https://www.airbnb.com.au/rooms/{}'

    """Search"""
    for page in range(40):
        response = requests.get(url_search.format(page))
        r_json = response.json()
        sections = r_json['explore_tabs'][0]['sections']
        if page == 0:
            listings = sections[1]['listings']
            listings += sections[3]['listings']
        else:
            listings += sections[0]['listings']

    with open('data.json', 'w') as file:
        file.write('[')
        is_first = True
        for item_json in listings:
            item = Item(item_json)
            if is_first:
                is_first = False
            else:
                file.write(',')
            file.write(json.dumps(item.__dict__))
        file.write(']')


def check_data():
    with open('data.json') as file:
        datas = json.load(file)
    import pprint
    pprint.pprint(datas)


if __name__ == '__main__':
    crawl()
    # check_data()
