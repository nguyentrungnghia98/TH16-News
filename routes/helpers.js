const helpers = {
  ifCond: function (a, operator, b, opts) {
    var bool = false;
    switch(operator) {
       case '==':
           bool = a == b;
           break;
      case '!=':
          bool = a != b;
          break;
       case '>':
           bool = a > b;
           break;
       case '<':
           bool = a < b;
           break;
       default:
           throw "Unknown operator " + operator;
    }

    if (bool) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  },
  formatDate: function (value) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    let date = new Date(value)
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ', ' + year;
  },
  index: function(value, index){
    return value[index]?value[index].content:''
  },
  categoryId: function(value, index){
    return value[index]?value[index]._id:''
  },
  categoryName: function(value, index){
    return value[index]?value[index].name:''
  },
  json: function(value){
    return JSON.stringify(value)
  },
  math: function(lvalue, operator, rvalue, options){
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue
    }[operator];
  },
}
module.exports = helpers