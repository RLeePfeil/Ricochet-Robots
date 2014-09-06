var $board;

$(function(){
	$board = $('#board');
	
	for (y=0; y<16; y++) {
		row = '<tr>';
		for (x=0; x<16; x++) {
			isDark = (y*16+x+4)%3 == 0 ? ' dark' : '';
			row += '<td class="square'+isDark+'"></td>';
		}
		row += "</tr>"
		$board.append(row);
	}
	
	onResize();
})

function onResize(e) {
	$('.square').each(function(){
		$(this).css('height', $(this).width());
	});
}