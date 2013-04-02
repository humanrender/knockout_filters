//= require_tree ./lib
var Filters = (function(){
  var Filters = function(element){
    var self = this;
    element.find("[data-filter-name]").each(function(){
      var filter_type = $(this).data("filter-name");
      self[filter_type] = ko.observableArray();
    });
  }

  $.extend(Filters.prototype,{
    add_prop: function(self, event){

      var target = $(event.target), // input[radio]
          filters_group = $(event.currentTarget), // fieldset
          val = target.val(),
          collection = self[filters_group.data("filter-name")],
          index = collection.indexOf(val),
          filter_type = filters_group.data("filter-type") || "or";
      if(filter_type == "and"){
        var args = [0, collection().length];
        if(val) args.push(val);
        collection.splice.apply(collection, args);
      }else{
         if(target.is(":checked")){
           if(index == -1)
             collection.push(val);
         }else if(index != -1)
           collection.splice(index,1);
      }
      
    },
    formatted_color: function() {
      return this.color().sort().join(" | ");
    },
    filter_by: function(element){
      var filters = [].slice.call(arguments, 1),
          self = this;
      element = $(element);
      return _(filters).every(function(filter){
        var filter_type = self[filter]();
        return filter_type.length == 0 || filter_type.indexOf(element.data(filter)) != -1;
      });
    }
  });

  return Filters;
})(ko);