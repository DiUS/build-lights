"""json custom decoder"""


def decode_unicode_to_str_list(data):
    rv = []
    for item in data:
        if isinstance(item, unicode):
            item = item.encode('utf-8')
        elif isinstance(item, list):
            item = decode_unicode_to_str_list(item)
        elif isinstance(item, dict):
            item = decode_unicode_to_str_dict(item)
        rv.append(item)
    return rv

def decode_unicode_to_str_dict(data):
    rv = {}
    for key, value in data.iteritems():
        if isinstance(key, unicode):
           key = key.encode('utf-8')
        if isinstance(value, unicode):
           value = value.encode('utf-8')
        elif isinstance(value, list):
           value = decode_unicode_to_str_list(value)
        elif isinstance(value, dict):
           value = decode_unicode_to_str_dict(value)
        rv[key] = value
    return rv
