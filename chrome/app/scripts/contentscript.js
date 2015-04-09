'use strict';

var getLinks = function() {
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

  return links;
};

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

var buildContents = function(links) {
  var node;
  var contents = '<ul>';
  var currentDepth = 1;

  for (var i = 0; i < links.length; ++i) {
    node = links[i];

    if (node.depth > currentDepth) {
      contents += openList(node.depth - currentDepth);
    } else if (node.depth < currentDepth) {
      contents += closeList(currentDepth - node.depth);
    }

    currentDepth = node.depth;

    contents += '<li><a href="' + node.hash + '">' + node.text + '</a></li>';
  }

  while (currentDepth--) {
    contents += '</ul>';
  }

  return contents;
};

var insertContents = function(contents) {
  var fileView = false;
  var readmeTarget = document.querySelectorAll('#readme > h3')[0];
  var markdownTarget;

  if (!readmeTarget) {
    markdownTarget = document.querySelectorAll('.file-actions')[0];
  }

  if (!readmeTarget && !markdownTarget) {
    return false;
  }

  var oldLink = document.querySelectorAll('.github-markdown-contents')[0];

  if (oldLink) {
    oldLink.parentNode.removeChild(oldLink);
  }

  var link = '<span class="github-markdown-contents select-menu js-menu-container js-select-menu"><span class="github-markdown-contents-btn js-select-menu js-menu-target btn btn-sm tooltipped-s' + (markdownTarget ? '' : ' right') + '" role="button" aria-label="Show Table of Contents"><span class="octicon octicon-three-bars"></span></span><div class="select-menu-modal-holder github-markdown-contents-modal-holder js-menu-content js-navigation-container"><div id="github-markdown-contents-container" class="select-menu-modal">' + contents + '</div></div></span>';
  (readmeTarget || markdownTarget).innerHTML += link;
};

var links = getLinks();

if (links.length) {
  var contents = buildContents(links);
  insertContents(contents);
}
