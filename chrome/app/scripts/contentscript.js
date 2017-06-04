'use strict';

var threeBarSvg = '<svg height="16" width="12" xmlns="http://www.w3.org/2000/svg"><path d="M11.41 9H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h10.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1z m0-4H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1h10.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1zM0.59 11h10.81c0.59 0 0.59 0.41 0.59 1s0 1-0.59 1H0.59c-0.59 0-0.59-0.41-0.59-1s0-1 0.59-1z" /></svg>';

const isRepo = () => /^\/[^/]+\/[^/]+/.test(window.location.pathname)
const getRepoPath = () => window.location.pathname.replace(/^\/[^/]+\/[^/]+/, '')
const isWikiPage = () => isRepo() && /^\/wiki(\/.*)?$/.test(getRepoPath())

var getLinks = function() {
  var header, tag, headerLevelStr, depth;
  var parent = 'article.markdown-body'

  if (isWikiPage()){
    parent = '#wiki-body .markdown-body'
  }

  var headers = document.querySelectorAll(`${parent} h1, ${parent} h2, ${parent} h3, ${parent} h4, ${parent} h5, ${parent} h6`);
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

var insertContentsWikiPage = function(contents) {
  var markdownTarget = document.querySelector('#wiki-rightbar');

  if (!markdownTarget) {
    return false;
  }

  var oldLink = document.querySelectorAll('.github-markdown-contents-wiki')[0];

  if (oldLink) {
    oldLink.parentNode.removeChild(oldLink);
  }

  var node = document.createElement('div');
  node.innerHTML = '<div class="github-markdown-contents-wiki readability-sidebar box box-small"><label>Table of Contents</label><div class=""><div id="github-markdown-contents-container" >' + contents + '</div></div></div>';
  markdownTarget.insertBefore(node.firstChild, markdownTarget.childNodes[2])

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

  var link = '<span class="github-markdown-contents select-menu js-menu-container js-select-menu"><span class="github-markdown-contents-btn js-select-menu js-menu-target btn btn-sm tooltipped-s' + (markdownTarget ? '' : ' right') + '" role="button" aria-label="Show Table of Contents">' + threeBarSvg + '</span><div class="select-menu-modal-holder github-markdown-contents-modal-holder js-menu-content js-navigation-container"><div id="github-markdown-contents-container" class="select-menu-modal">' + contents + '</div></div></span>';
  (readmeTarget || markdownTarget).innerHTML += link;
};

var links = getLinks();

if (links.length) {
  var contents = buildContents(links);

  if ( isWikiPage() ){
    insertContentsWikiPage(contents);
  }else{
    insertContents(contents);
  }
}
