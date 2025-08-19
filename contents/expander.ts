import $ from "jquery"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["*://github.com/*"]
}

function load() {
  if (!$('.file-header').length || $('.omnibox-collapse').length) {
    return;
  }

  const $toggler = $('<a class="octicon-btn tooltipped tooltipped-nw omnibox-collapse" href="#expand-collapse" aria-label="Expand / Collapse"> \
    <span class="octicon octicon-unfold"></span> \
  </a>').on('click', function(event) {
    event.preventDefault();
    const $data = $(this).closest('.file-header').next();
    if (event.shiftKey) {
      $('.data').not($data).hide();
      $data.show();
    } else {
      $data.slideToggle(200);
    }
  });

  $('.file-actions').append($toggler);

  let visible = true;

  const $allToggler = $('<a class="octicon-btn tooltipped tooltipped-nw right omnibox-collapse" href="#expand-collapse-all" aria-label="Expand / Collapse All"> \
    <span class="octicon octicon-unfold"></span> \
  </a>').on('click', function(event) {
    event.preventDefault();
    $('.data').toggle(visible = !visible);
  });

  $('.table-of-contents .btn-group').before($allToggler);
}

// Run on initial load
load();

// Run on GitHub's PJAX navigation
$(document).on('pjax:complete', load);
