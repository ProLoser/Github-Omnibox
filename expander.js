// TODO This isn't working
$(window).on('popstate', function(){
  console.log(arguments);
  if ($('.file-header').length && !$('.omnibox-collapse').length) {
    load();
  }
});


function load() {

  var $toggler = $('<a class="octicon-btn tooltipped tooltipped-nw omnibox-collapse" href="#expand-collapse" aria-label="Expand / Collapse"> \
    <span class="octicon octicon-unfold"></span> \
  </a>').on('click', function(event){
    event.preventDefault();
    var $data = $(this).closest('.file-header').next();
    if (event.shiftKey) {
      $('.data').not($data).hide();
      $data.show();
    } else {
      $data.slideToggle(200);
    }
  });

  $('[aria-label="View the whole file"]').after($toggler);

  var visible = true;

  $('.table-of-contents .btn-group').after('<a class="octicon-btn tooltipped tooltipped-nw right omnibox-collapse" href="#expand-collapse-all" aria-label="Expand / Collapse All"> \
    <span class="octicon octicon-unfold"></span> \
  </a>').next().on('click', function(event){
    event.preventDefault();
    $('.data').toggle(visible = !visible);
  });

}
load();
