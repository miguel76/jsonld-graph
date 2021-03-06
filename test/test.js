var fs = require('fs'),
    jsonld = require('jsonld'),
    jsld = require('../index');

var inputStr = fs.readFileSync(__dirname + '/aco.jsonld');
var inputJson = JSON.parse(inputStr);
var contextStr = fs.readFileSync(__dirname + '/aco.context.jsonld');
var contextJson = JSON.parse(contextStr);

// console.log(JSON.stringify(inputJson));

var show = function(node) {
  if (node['@id']) return { '@id': node['@id'] };
  if (node['@value']) return { '@value': node['@value'] };
  return node;
};

var depth = 0;

var depthFirst = jsld.commonVisits.depthFirst({
  preAction: function(node, parentInVisit) {
    depth++;
    if (depth > 5) throw 'Too much';
    console.log('Going down!');
    console.log('- Now in node:');
    console.log(show(node));
    console.log('- Coming from:');
    console.log(parentInVisit ? {
      node: show(parentInVisit.node),
      leadingProperty: parentInVisit.leadingProperty,
      leadingPropertyIsReverse: parentInVisit.leadingPropertyIsReverse
    } : undefined);
    console.log('- Depth ' + depth);
  },
  postAction: function(node, children, preActionValue) {
    depth--;
    console.log('Going up!');
    console.log('- Now in node:');
    console.log(show(node));
    console.log('- Coming from:');
    console.log(children);
    console.log('Depth ' + depth);
  }
});

// jsonld.objectify(inputJson, contextJson, null,  function(err, result) {
//   if (err) {
//     console.log(err);
//   } else if (result) {
//     console.log(result);
//     console.log(result['http://example.org/library/the-republic']);
//     depthFirst(result['http://example.org/library/the-republic']);
//   }
// });

jsld.convert(inputJson, contextJson, function(err, result) {
  if (err) {
    console.log(err);
  } else if (result) {
    console.log(result);
    // console.log(result['ex-library:the-republic']);
    // depthFirst(result['ex-library:the-republic']);
  }
});
