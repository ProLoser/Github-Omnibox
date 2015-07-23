// TODO This isn't working
$(window).on('popstate pjax:success', load);

function load() {
  if (!$('.file-header').length || $('.omnibox-collapse').length)
    return;

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

  $('.file-actions').append($toggler);

  var visible = true;

  $toggler = $('<a class="octicon-btn tooltipped tooltipped-nw right omnibox-collapse" href="#expand-collapse-all" aria-label="Expand / Collapse All"> \
    <span class="octicon octicon-unfold"></span> \
  </a>').on('click', function(event){
    event.preventDefault();
    $('.data').toggle(visible = !visible);
  });

  $('.table-of-contents .btn-group').before($toggler);
}
load();
