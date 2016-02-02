'use strict';

describe('Service: util', function () {

  // load the service's module
  beforeEach(module('vineApp'));

  // instantiate service
  var util;
  beforeEach(inject(function (_util_) {
    util = _util_;
  }));

  //testing the trim method
  describe('trim', function () {
    it('should trim the string to given number of characters ending on a clear word.', function () {
      expect(util.trim("shravani is testing", 10)).toEqual("shravani...");
    });

    it('should trim the string to given number of characters', function () {
      expect(util.trim("shravaniii is testing", 10)).toEqual("shravaniii");
    });

    it('should return string if the character limit exceeds the string length', function () {
      expect(util.trim("shravaniiiistesting", 25)).toEqual('shravaniiiistesting');
    });

    it('should return emplty string if the string length exceeds character count and therecharacter limit exceeds the string length', function () {
      expect(util.trim("shravaniiiistesting", 5)).toEqual('shrav');
    });
  });  

  //testing the formatContent method
  describe('formatContent', function () {
    it('should format code by enclosing in ``` ``` in <code></code>', function () {
      expect(util.formatContent("```shravani is testing```", {})).toEqual("<pre><code>shravani is testing</code></pre>");
    });

    it('should format urls to make them active links', function () {
      expect(util.formatContent("http://blah.com",{})).toEqual("<a href='http://blah.com' class='git_link' >http://blah.com</a>");
    });

    it('should format strings with aprefix `@` and turn them into a live link from a mapper object', function () {
      expect(util.formatContent("@smitta: try downloading v1.6.8", {"smitta" : "smitta@123.com"})).toEqual("<a href='smitta@123.com' class='git_link' >@smitta</a>: try downloading v1.6.8");
    });  
  });

});
