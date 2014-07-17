$(document).ready(function(e){
	$('.search-panel .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("name");
		var concept = $(this).text();
		$('.search-panel span#search_concept').text(concept);
		$('.input-group #search_param').val(param);
	});
});



//////////////////////////////////////
//
// 
//
//////////////////////////////////////
function Table2Json(table) {
  var result = {};
  table.find("tr").each(function () {
    var oneRow = [];
    var varname = $(this).index();
    $("td", this).each(function (index) { if (index != 0) {oneRow.push($("input", this).val());}});
    result[varname] = oneRow;
  });
  var result_json = JSON.stringify(result);
  OpenModalBox('Table to JSON values', result_json);
}