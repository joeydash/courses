var express = require('express');
var router = express.Router();
var fs = require('fs');
var showdown  = require('showdown');
showdown.setOption('optionKey', 'value');
showdown.setFlavor('github');
    

/* GET file listing. */
router.get('/get_docs_list', function(req, res, next) {
	fs.readFile('./public/docs/docs_list.json',"utf8", function(err, data) {
    var converter = new showdown.Converter(),
	    text      = data
	res.json(JSON.parse(text));
  });
});

router.get('/:course', function(req, res, next) {
	fs.readdir("./public/docs/"+req.params.course, function(err, items) {
	    console.log("./public/docs/"+req.params.course);
	    console.log(items);
	    res.json(items);
	 	
	});
});
router.get('/:course/:name', function(req, res, next) {
	fs.readFile('./public/docs/'+req.params.course+"/"+req.params.name,"utf8", function(err, data) {
    var converter = new showdown.Converter(),
	    text      = data,
	    html      = converter.makeHtml(text);
	res.send(html);
  });
});

module.exports = router;
