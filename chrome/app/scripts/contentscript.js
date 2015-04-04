'use strict';

var header, tag, headerLevelStr, depth;
var headers = document.querySelectorAll('article.markdown-body h1, article.markdown-body h2, article.markdown-body h3, article.markdown-body h4, article.markdown-body h5, article.markdown-body h6');
var links = [];

for (var i = 0; i < headers.length; ++i) {
  header = headers[i];
  tag = header.tagName;
  headerLevelStr = tag.substring(1);
  depth = Number.parseInt(headerLevelStr);

  links.push({
    text: header.innerText,
    hash: header.children[0].hash,
    depth: depth
  });
}

var openList = function(depth) {
  var html = '';

  while (depth--) {
    html += '<li><ul>';
  }

  return html;
};

var closeList = function(depth) {
  var html = '';

  while (depth--) {
    html += '</ul></li>';
  }

  return html;

};

var node;
var toc = '<ul>';
var currentDepth = 1;

for (i = 0; i < links.length; ++i) {
  node = links[i];

  if (node.depth > currentDepth) {
    toc += openList(node.depth - currentDepth);
  } else if (node.depth < currentDepth) {
    toc += closeList(currentDepth - node.depth);
  }

  currentDepth = node.depth;

  toc += '<li><a href="' + node.hash + '">' + node.text + '</a></li>';
}

while (currentDepth--) {
  toc += '</ul>';
}
var fileView = false;
var target = document.querySelectorAll('#readme > h3')[0];

if (!target) {
  target = document.querySelectorAll('.file-actions')[0];
  fileView = true;
}

if (target) {
  var oldLink = document.querySelectorAll('.github-markdown-contents')[0];

  if (oldLink) {
    console.log('removed old link');
    oldLink.parentNode.removeChild(oldLink);
  }

  var link = '<span class="github-markdown-contents select-menu js-menu-container js-select-menu"><span class="github-markdown-contents-btn js-select-menu js-menu-target btn btn-sm tooltipped-s' + (fileView ? '' : ' right') + '" role="button" aria-label="Show Table of Contents"><span class="octicon octicon-three-bars"></span></span><div class="select-menu-modal-holder github-markdown-contents-modal-holder js-menu-content js-navigation-container"><div id="github-markdown-contents-container" class="select-menu-modal"></div></div></span>';
  target.innerHTML += link;

  document.getElementById('github-markdown-contents-container').innerHTML += toc;
}
