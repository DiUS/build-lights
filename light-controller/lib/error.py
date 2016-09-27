"""
exceptions classes.
"""   
import exceptions

class Generic(exceptions.Exception):
    """Base class error handlers
    """
    def __init__(self, err_msg=None):
        self.err_msg = err_msg

    def __str__(self):
        return self.err_msg

    def __repr__(self):
        return self.__class__.__name__ + '(' + self.err_msg + ')'
