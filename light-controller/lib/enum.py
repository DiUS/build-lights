# Enumerated types
# from http://aspn.activestate.com/ASPN/Cookbook/Python/Recipe/413486

def Enum(*names):
   ##assert names, "Empty enums are not supported" # <- Don't like empty enums? Uncomment!

   class EnumClass(object):
      __slots__ = names
      def __iter__(self):        return iter(constants)
      def __len__(self):         return len(constants)
      def __getitem__(self, i):  return constants[i]
      def __repr__(self):        return 'Enum' + str(names)
      def __str__(self):         return 'enum ' + str(constants)

   class EnumValue(object):
      __slots__ = ('__value')
      def __init__(self, value): self.__value = value
      Value = property(lambda self: self.__value)
      EnumType = property(lambda self: EnumType)
      def __hash__(self):        return hash(self.__value)
      def __cmp__(self, other):
         # Unlike the original recipe, unlike types can be compared - the result is always not-equal
         return cmp(self.EnumType, other.EnumType) or cmp(self.__value, other.__value)
      def __eq__(self, other):   return self is other
      def __ne__(self, other):   return self is not other
      def __invert__(self):      return constants[maximum - self.__value]
      def __nonzero__(self):     return bool(self.__value)
      def __repr__(self):        return str(names[self.__value])

   maximum = len(names) - 1
   constants = [None] * len(names)
   for i, each in enumerate(names):
      val = EnumValue(i)
      setattr(EnumClass, each, val)
      constants[i] = val
   constants = tuple(constants)
   EnumType = EnumClass()
   return EnumType


if __name__ == '__main__':
   print '\n*** Enum Demo ***'
   print '--- Days of week ---'
   Days = Enum('Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su')
   print Days
   print Days.Mo
   print Days.Fr
   print Days.Mo < Days.Fr
   print list(Days)
   for each in Days:
      print 'Day:', each
   print '--- Yes/No ---'
   Confirmation = Enum('No', 'Yes')
   answer = Confirmation.No
   print 'Your answer is not', ~answer

   print Confirmation.No == Days.Mo
   print Confirmation.No == Confirmation.Yes
   print Confirmation.No == Confirmation.No
